import {
    choiceListClass,
    classes,
    type ChoiceListSchema,
    type FieldOption,
} from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function Radio({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<ChoiceListSchema>) {
    const cards = field.options.some((option) => option.description);

    if (field.buttons) {
        return (
            <div
                role="radiogroup"
                aria-labelledby={`${id}-label`}
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                className={classes.segmented}
            >
                {field.options.map((option: FieldOption, index) => (
                    <label key={String(option.value)} className={classes.segment}>
                        <input
                            id={`${id}-${index}`}
                            type="radio"
                            name={field.name}
                            value={String(option.value)}
                            checked={String(value) === String(option.value) && value !== null}
                            disabled={disabled || field.readonly || option.disabled}
                            autoFocus={field.autofocus && index === 0}
                            className={classes.visuallyHidden}
                            onChange={() => onChange(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        );
    }

    return (
        <div
            role="radiogroup"
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={choiceListClass(field.inline, field.columns)}
        >
            {field.options.map((option: FieldOption, index) => {
                const optionId = `${id}-${index}`;
                return (
                    <label
                        key={String(option.value)}
                        htmlFor={optionId}
                        className={cards ? classes.choiceCard : classes.choice}
                    >
                        <input
                            id={optionId}
                            type="radio"
                            name={field.name}
                            value={String(option.value)}
                            checked={String(value) === String(option.value) && value !== null}
                            required={field.required}
                            disabled={disabled || field.readonly || option.disabled}
                            autoFocus={field.autofocus && index === 0}
                            className={classes.radio}
                            onChange={() => onChange(option.value)}
                        />
                        <span className={classes.choiceText}>
                            <span className={classes.choiceLabel}>{option.label}</span>
                            {option.description && (
                                <span className={classes.choiceDescription}>
                                    {option.description}
                                </span>
                            )}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}
