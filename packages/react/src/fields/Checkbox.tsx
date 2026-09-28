import { classes, type BooleanFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function Checkbox({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<BooleanFieldSchema>) {
    return (
        <label htmlFor={id} className={classes.choice}>
            <input
                id={id}
                name={field.name}
                type="checkbox"
                checked={value === field.trueValue}
                required={field.required}
                disabled={disabled || field.readonly}
                autoFocus={field.autofocus}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={classes.checkbox}
                onChange={(event) =>
                    onChange(event.target.checked ? field.trueValue : field.falseValue)
                }
            />
            <span className={classes.choiceText}>
                <span className={classes.choiceLabel}>
                    {field.label}
                    {field.required && (
                        <span className={classes.required} aria-hidden="true">
                            *
                        </span>
                    )}
                </span>
            </span>
        </label>
    );
}
