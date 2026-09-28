import { classes, type SliderSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function Slider({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<SliderSchema>) {
    const current =
        value === null || value === undefined || value === '' ? field.min : Number(value);

    return (
        <div className={classes.sliderRow}>
            <input
                id={id}
                name={field.name}
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={current}
                disabled={disabled || field.readonly}
                autoFocus={field.autofocus}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={classes.slider}
                onChange={(event) => onChange(Number(event.target.value))}
            />
            {field.showValue && (
                <output htmlFor={id} className={classes.sliderValue}>
                    {current}
                    {field.suffix ?? ''}
                </output>
            )}
        </div>
    );
}
