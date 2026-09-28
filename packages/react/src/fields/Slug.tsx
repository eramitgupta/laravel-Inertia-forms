import { useEffect, useState } from 'react';
import { classes, slugify, slugSource, type SlugSchema } from '../../../core/src';
import { useFormContext } from '../context';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

/**
 * A URL-safe slug that follows the `from` field until it is edited by hand.
 * Clearing it follows the source again; the button regenerates it on demand.
 */
export function Slug({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<SlugSchema>) {
    const form = useFormContext();
    const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    const options = {
        separator: field.separator,
        lowercase: field.lowercase,
        maxLength: field.maxLength,
    };
    const follows = Boolean(form && field.from);
    const generated = follows
        ? slugify(slugSource(form?.data, field.name, field.from), options)
        : '';
    const [manual, setManual] = useState(() => follows && text !== '' && text !== generated);
    const syncing = follows && !manual && !disabled;

    useEffect(() => {
        if (syncing && text !== generated) onChange(generated);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only follow the source value
    }, [syncing, generated, text]);

    return (
        <div className={classes.inputGroup}>
            {field.prefix && <span className={classes.slugPrefix}>{field.prefix}</span>}
            <input
                id={id}
                name={field.name}
                type="text"
                value={text}
                placeholder={field.placeholder ?? undefined}
                required={field.required}
                disabled={disabled}
                readOnly={field.readonly}
                autoFocus={field.autofocus}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={field.maxLength ?? undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={classes.inputGroupInput}
                onChange={(event) => {
                    setManual(follows && event.target.value !== '');
                    onChange(event.target.value);
                }}
                onBlur={(event) => {
                    const slug = slugify(event.target.value, options);
                    setManual(follows && slug !== '' && slug !== generated);
                    if (slug !== event.target.value) onChange(slug);
                }}
            />
            {follows && manual && generated !== '' && !disabled && !field.readonly && (
                <span className={classes.addonEnd}>
                    <button
                        type="button"
                        className={classes.iconButton}
                        aria-label={`Regenerate ${field.label}`}
                        title={`Regenerate ${field.label}`}
                        onClick={() => {
                            setManual(false);
                            if (text !== generated) onChange(generated);
                        }}
                    >
                        <Icon name="slugRegenerate" className="size-4" />
                    </button>
                </span>
            )}
        </div>
    );
}
