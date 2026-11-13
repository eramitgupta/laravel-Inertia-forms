import {
    classes,
    linkParts,
    linkSchemeHint,
    linkValue,
    type LinkParts,
    type LinkSchema,
} from '../../../core/src';
import { useTranslate } from '../i18n';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

const TARGETS = [
    { value: '_self', label: 'link_same_tab' },
    { value: '_blank', label: 'link_new_tab' },
] as const;

/**
 * A URL with a link icon. `structured` fields add an optional link text box
 * and a "Same tab / New tab" choice and store `{ url, label?, target? }`.
 */
export function Link({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<LinkSchema>) {
    const t = useTranslate();
    const parts = linkParts(value);
    const hint = linkSchemeHint(field, parts.url);
    const hintId = `${id}-hint`;
    const locked = disabled || field.readonly;
    const urlDescribedBy = [describedBy, hint ? hintId : null].filter(Boolean).join(' ');

    function update(changes: Partial<LinkParts>) {
        onChange(linkValue(field, { ...parts, ...changes }));
    }

    return (
        <div className={classes.link}>
            <div className={classes.inputGroup}>
                <span className={classes.linkIcon}>
                    <Icon name="linkChain" className="size-4" />
                </span>
                <input
                    id={id}
                    name={field.structured ? `${field.name}[url]` : field.name}
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    value={parts.url}
                    placeholder={field.placeholder ?? t('link_url_placeholder')}
                    required={field.required}
                    disabled={disabled}
                    readOnly={field.readonly}
                    autoFocus={field.autofocus}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={urlDescribedBy || undefined}
                    className={classes.inputGroupInput}
                    onChange={(event) => update({ url: event.target.value })}
                    onBlur={(event) => {
                        const trimmed = event.target.value.trim();
                        if (trimmed !== parts.url) update({ url: trimmed });
                    }}
                />
            </div>
            {field.structured && (field.withLabel || field.withTarget) && (
                <div className={classes.linkOptions}>
                    {field.withLabel && (
                        <div className={classes.linkText}>
                            <input
                                id={`${id}-text`}
                                name={`${field.name}[label]`}
                                type="text"
                                value={parts.label}
                                placeholder={field.labelPlaceholder ?? t('link_text_placeholder')}
                                disabled={disabled}
                                readOnly={field.readonly}
                                aria-label={t('link_text_label', { label: field.label })}
                                aria-invalid={error ? true : undefined}
                                className={classes.input}
                                onChange={(event) => update({ label: event.target.value })}
                            />
                        </div>
                    )}
                    {field.withTarget && (
                        <div
                            role="radiogroup"
                            aria-label={t('link_target_label', { label: field.label })}
                            className={classes.segmented}
                        >
                            {TARGETS.map((target) => (
                                <label key={target.value} className={classes.segment}>
                                    <input
                                        id={`${id}-target${target.value}`}
                                        type="radio"
                                        name={`${field.name}[target]`}
                                        value={target.value}
                                        checked={
                                            target.value === '_blank'
                                                ? parts.target === '_blank'
                                                : parts.target !== '_blank'
                                        }
                                        disabled={locked}
                                        className={classes.visuallyHidden}
                                        onChange={() => update({ target: target.value })}
                                    />
                                    {t(target.label)}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {hint && (
                <p id={hintId} className={classes.linkHint}>
                    {hint}
                </p>
            )}
        </div>
    );
}
