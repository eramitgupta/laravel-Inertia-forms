import type { ReactNode } from 'react';
import { classes, columnSpanClass, cx, type FieldSchema } from '../../core/src';

interface FieldWrapperProps {
    field: FieldSchema;
    id: string;
    columns: number;
    error?: string | undefined;
    /** `label` for single inputs, `group` for radio/checkbox lists, `none` when the control labels itself. */
    labelMode: 'label' | 'group' | 'none';
    children: ReactNode;
}

export function describedBy(field: FieldSchema, id: string, error?: string): string | undefined {
    const ids = [field.help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
}

export function FieldWrapper({
    field,
    id,
    columns,
    error,
    labelMode,
    children,
}: FieldWrapperProps) {
    const label = (
        <>
            {field.label}
            {field.required && (
                <span className={classes.required} aria-hidden="true">
                    *
                </span>
            )}
        </>
    );

    return (
        <div
            className={cx(classes.field, columnSpanClass(field.columnSpan, columns), field.class)}
            data-field={field.name}
        >
            {labelMode === 'label' && (
                <label htmlFor={id} className={classes.label}>
                    {label}
                </label>
            )}
            {labelMode === 'group' && (
                <span id={`${id}-label`} className={classes.label}>
                    {label}
                </span>
            )}
            {children}
            {field.help && (
                <p id={`${id}-help`} className={classes.help}>
                    {field.help}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className={classes.error} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
