<?php

namespace Erag\InertiaForms\Fields\Concerns;

use Illuminate\Validation\Rule;

trait HasBooleanValues
{
    protected mixed $trueValue = true;

    protected mixed $falseValue = false;

    /**
     * The value stored when the control is on.
     */
    public function trueValue(mixed $value): static
    {
        $this->trueValue = $value;

        return $this;
    }

    /**
     * The value stored when the control is off.
     */
    public function falseValue(mixed $value): static
    {
        $this->falseValue = $value;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return $this->falseValue;
    }

    public function formatValue(mixed $value): mixed
    {
        if ($value instanceof \BackedEnum) {
            $value = $value->value;
        }

        if ($value === $this->trueValue || $value === $this->falseValue) {
            return $value;
        }

        return $value ? $this->trueValue : $this->falseValue;
    }

    /**
     * A required checkbox or toggle must be switched on.
     *
     * @return array<string, array<int, mixed>>
     */
    public function validationRules(): array
    {
        if (! $this->required) {
            return parent::validationRules();
        }

        return [
            $this->name => [
                'required',
                $this->usesBooleanValues() ? 'accepted' : Rule::in([$this->trueValue]),
                ...$this->rules,
            ],
        ];
    }

    protected function usesBooleanValues(): bool
    {
        return $this->trueValue === true && $this->falseValue === false;
    }

    protected function typeRules(): array
    {
        return $this->usesBooleanValues()
            ? ['boolean']
            : [Rule::in(array_values(array_filter([$this->trueValue, $this->falseValue], fn (mixed $value): bool => $value !== null)))];
    }

    /**
     * @return array<string, mixed>
     */
    protected function booleanProps(): array
    {
        return ['trueValue' => $this->trueValue, 'falseValue' => $this->falseValue];
    }
}
