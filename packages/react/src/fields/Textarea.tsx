import { useLayoutEffect, useRef } from 'react';
import { classes, cx, type TextareaSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function Textarea({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<TextareaSchema>) {
    const textarea = useRef<HTMLTextAreaElement>(null);
    const text = value === null || value === undefined ? '' : String(value);

    useLayoutEffect(() => {
        const element = textarea.current;
        if (!field.autoResize || !element) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }, [field.autoResize, text]);

    return (
        <>
            <textarea
                ref={textarea}
                id={id}
                name={field.name}
                rows={field.rows}
                value={text}
                placeholder={field.placeholder ?? undefined}
                required={field.required}
                disabled={disabled}
                readOnly={field.readonly}
                autoFocus={field.autofocus}
                minLength={field.minLength ?? undefined}
                maxLength={field.maxLength ?? undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cx(
                    classes.input,
                    classes.textarea,
                    field.autoResize && 'resize-none overflow-hidden',
                )}
                onChange={(event) => onChange(event.target.value)}
            />
            {field.showCharacterCount && (
                <p className={classes.counter}>
                    {text.length}
                    {field.maxLength ? ` / ${field.maxLength}` : ''}
                </p>
            )}
        </>
    );
}
