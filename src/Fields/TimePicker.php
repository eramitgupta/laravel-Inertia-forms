<?php

namespace Erag\InertiaForms\Fields;

use DateTimeInterface;

class TimePicker extends Field
{
    protected bool $withSeconds = false;

    protected ?string $minTime = null;

    protected ?string $maxTime = null;

    protected int $minuteStep = 5;

    public function component(): string
    {
        return 'TimePicker';
    }

    public function withSeconds(bool $withSeconds = true): static
    {
        $this->withSeconds = $withSeconds;

        return $this;
    }

    /**
     * Minutes between the choices in the picker, like 15 for :00, :15, :30, :45.
     */
    public function minuteStep(int $minutes): static
    {
        $this->minuteStep = max(1, min(30, $minutes));

        return $this;
    }

    public function minTime(?string $time): static
    {
        $this->minTime = $time;

        return $this;
    }

    public function maxTime(?string $time): static
    {
        $this->maxTime = $time;

        return $this;
    }

    public function formatValue(mixed $value): mixed
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format($this->withSeconds ? 'H:i:s' : 'H:i');
        }

        return $value ?? $this->emptyValue();
    }

    protected function typeRules(): array
    {
        return array_values(array_filter([
            $this->withSeconds ? 'date_format:H:i:s' : 'date_format:H:i',
            $this->minTime !== null ? "after_or_equal:{$this->minTime}" : null,
            $this->maxTime !== null ? "before_or_equal:{$this->maxTime}" : null,
        ]));
    }

    protected function props(): array
    {
        return [
            'withSeconds' => $this->withSeconds,
            'minTime' => $this->minTime,
            'maxTime' => $this->maxTime,
            'minuteStep' => $this->minuteStep,
        ];
    }
}
