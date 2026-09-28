<?php

namespace Erag\InertiaForms\Fields;

class Slider extends Field
{
    protected int|float $min = 0;

    protected int|float $max = 100;

    protected int|float $step = 1;

    protected bool $showValue = true;

    protected ?string $suffix = null;

    public function component(): string
    {
        return 'Slider';
    }

    public function min(int|float $min): static
    {
        $this->min = $min;

        return $this;
    }

    public function max(int|float $max): static
    {
        $this->max = $max;

        return $this;
    }

    public function step(int|float $step): static
    {
        $this->step = $step;

        return $this;
    }

    public function showValue(bool $show = true): static
    {
        $this->showValue = $show;

        return $this;
    }

    /**
     * Unit shown after the current value, like `%` or `px`.
     */
    public function suffix(?string $suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return $this->min;
    }

    protected function typeRules(): array
    {
        return ['numeric', "min:{$this->min}", "max:{$this->max}"];
    }

    protected function props(): array
    {
        return [
            'min' => $this->min,
            'max' => $this->max,
            'step' => $this->step,
            'showValue' => $this->showValue,
            'suffix' => $this->suffix,
        ];
    }
}
