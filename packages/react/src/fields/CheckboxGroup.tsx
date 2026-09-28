import { choiceListClass, classes, normalize, type ChoiceListSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

export function CheckboxGroup({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<ChoiceListSchema>) {
    const selected = Array.isArray(value) ? value : [];
    const isChecked = (optionValue: unknown) =>
        selected.some((item) => normalize(item) === normalize(optionValue));
    const cards = field.options.some((option) => option.description);

    if (field.buttons) {
        return (
            <div
                role="group"
                aria-labelledby={`${id}-label`}
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                className={classes.pills}
            >
                {field.options.map((option, index) => (
                    <label key={String(option.value)} className={classes.pill}>
                        <input
                            id={`${id}-${index}`}
                            type="checkbox"
                            name={`${field.name}[]`}
                            value={String(option.value)}
                            checked={isChecked(option.value)}
                            disabled={disabled || field.readonly || option.disabled}
                            autoFocus={field.autofocus && index === 0}
                            className={classes.visuallyHidden}
                            onChange={(event) => toggle(option.value, event.target.checked)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        );
    }

    function toggle(optionValue: unknown, checked: boolean) {
        onChange(
            checked
                ? [...selected, optionValue]
                : selected.filter((item) => normalize(item) !== normalize(optionValue)),
        );
    }

    return (
        <div
            role="group"
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={choiceListClass(field.inline, field.columns)}
        >
            {field.options.map((option, index) => {
                const optionId = `${id}-${index}`;
                return (
                    <label
                        key={String(option.value)}
                        htmlFor={optionId}
                        className={cards ? classes.choiceCard : classes.choice}
                    >
                        <input
                            id={optionId}
                            type="checkbox"
                            name={`${field.name}[]`}
                            value={String(option.value)}
                            checked={isChecked(option.value)}
                            disabled={disabled || field.readonly || option.disabled}
                            autoFocus={field.autofocus && index === 0}
                            className={classes.checkbox}
                            onChange={(event) => toggle(option.value, event.target.checked)}
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
