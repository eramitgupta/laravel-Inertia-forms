import { useEffect, useRef } from 'react';
import { classes, cx, preventNumberWheel, type TextInputSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';
import { ClearButton } from './ClearButton';

export function TextInput({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<TextInputSchema>) {
    const text = value === null || value === undefined ? '' : String(value);
    const showClear = field.clearable && text !== '' && !disabled && !field.readonly;
    const grouped = Boolean(field.prefix || field.suffix || field.clearable);
    const inputRef = useRef<HTMLInputElement>(null);

    // React's own wheel handlers are passive, so they can't stop the value from changing.
    useEffect(() => {
        const element = inputRef.current;
        if (!element) return;
        element.addEventListener('wheel', preventNumberWheel, { passive: false });
        return () => element.removeEventListener('wheel', preventNumberWheel);
    }, [grouped]);
    const input = (
        <input
            ref={inputRef}
            id={id}
            name={field.name}
            type={field.type}
            value={value === null || value === undefined ? '' : String(value)}
            placeholder={field.placeholder ?? undefined}
            required={field.required}
            disabled={disabled}
            readOnly={field.readonly}
            autoFocus={field.autofocus}
            autoComplete={field.autocomplete ?? undefined}
            minLength={field.minLength ?? undefined}
            maxLength={field.maxLength ?? undefined}
            min={field.min ?? undefined}
            max={field.max ?? undefined}
            step={field.step ?? undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={grouped ? classes.inputGroupInput : classes.input}
            onChange={(event) => onChange(event.target.value)}
        />
    );

    if (!grouped) return input;

    return (
        <div className={cx(classes.inputGroup)}>
            {field.prefix && <span className={classes.addon}>{field.prefix}</span>}
            {input}
            {showClear && (
                <span className={classes.addonEnd}>
                    <ClearButton label={field.label} onClear={() => onChange('')} />
                </span>
            )}
            {field.suffix && <span className={classes.addon}>{field.suffix}</span>}
        </div>
    );
}
