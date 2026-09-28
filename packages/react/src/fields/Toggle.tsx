import { classes, cx, type BooleanFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function Toggle({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<BooleanFieldSchema>) {
    const checked = value === field.trueValue;
    const stateLabel = checked ? field.onLabel : field.offLabel;

    return (
        <div className={classes.toggleRow}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                disabled={disabled || field.readonly}
                autoFocus={field.autofocus}
                className={classes.toggleTrack}
                onClick={() => onChange(checked ? field.falseValue : field.trueValue)}
            >
                <span
                    aria-hidden="true"
                    className={cx(classes.toggleThumb, checked && classes.toggleThumbOn)}
                />
            </button>
            {stateLabel && (
                <span className={classes.toggleText} aria-hidden="true">
                    {stateLabel}
                </span>
            )}
        </div>
    );
}
