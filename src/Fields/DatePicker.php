<?php

namespace Erag\InertiaForms\Fields;

use DateTimeInterface;

class DatePicker extends Field
{
    protected bool $withTime = false;

    protected bool $range = false;

    protected int $months = 1;

    protected int $firstDayOfWeek = 0;

    protected DateTimeInterface|string|null $minDate = null;

    protected DateTimeInterface|string|null $maxDate = null;

    public function component(): string
    {
        return 'DatePicker';
    }

    /**
     * Pick a date and a time.
     */
    public function withTime(bool $withTime = true): static
    {
        $this->withTime = $withTime;

        return $this;
    }

    /**
     * Pick a start and end date. The value is `['start' => ..., 'end' => ...]`.
     */
    public function range(bool $range = true): static
    {
        $this->range = $range;

        if ($range && $this->months === 1) {
            $this->months = 2;
        }

        return $this;
    }

    /**
     * How many months the calendar shows side by side (1 or 2).
     */
    public function months(int $months): static
    {
        $this->months = max(1, min(2, $months));

        return $this;
    }

    /**
     * First day of the week in the calendar: 0 for Sunday, 1 for Monday.
     */
    public function firstDayOfWeek(int $day): static
    {
        $this->firstDayOfWeek = max(0, min(6, $day));

        return $this;
    }

    public function minDate(DateTimeInterface|string|null $date): static
    {
        $this->minDate = $date;

        return $this;
    }

    public function maxDate(DateTimeInterface|string|null $date): static
    {
        $this->maxDate = $date;

        return $this;
    }

    public function isRange(): bool
    {
        return $this->range;
    }

    public function emptyValue(): mixed
    {
        return $this->range ? ['start' => '', 'end' => ''] : '';
    }

    public function formatValue(mixed $value): mixed
    {
        if (! $this->range) {
            return $this->toInputValue($value) ?? $this->emptyValue();
        }

        if (! is_array($value)) {
            return $this->emptyValue();
        }

        $start = $value['start'] ?? $value[0] ?? null;
        $end = $value['end'] ?? $value[1] ?? null;

        return [
            'start' => $this->toInputValue($start) ?? '',
            'end' => $this->toInputValue($end) ?? '',
        ];
    }

    protected function inputFormat(): string
    {
        return $this->withTime && ! $this->range ? 'Y-m-d\TH:i' : 'Y-m-d';
    }

    protected function toInputValue(mixed $value): ?string
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format($this->inputFormat());
        }

        return $value === null || $value === '' ? null : (string) $value;
    }

    /**
     * @return array<int, string>
     */
    protected function limitRules(): array
    {
        $min = $this->toInputValue($this->minDate);
        $max = $this->toInputValue($this->maxDate);

        return array_values(array_filter([
            'date',
            $min !== null ? "after_or_equal:{$min}" : null,
            $max !== null ? "before_or_equal:{$max}" : null,
        ]));
    }

    protected function typeRules(): array
    {
        return $this->limitRules();
    }

    public function validationRules(): array
    {
        if (! $this->range) {
            return parent::validationRules();
        }

        $presence = $this->required ? 'required' : 'nullable';

        return [
            $this->name => [$presence, 'array', ...$this->rules],
            "{$this->name}.start" => [$presence, ...$this->limitRules()],
            "{$this->name}.end" => [
                $this->required ? 'required' : "required_with:{$this->name}.start",
                'nullable',
                ...$this->limitRules(),
                "after_or_equal:{$this->name}.start",
            ],
        ];
    }

    protected function props(): array
    {
        return [
            'withTime' => $this->withTime && ! $this->range,
            'range' => $this->range,
            'months' => $this->months,
            'firstDayOfWeek' => $this->firstDayOfWeek,
            'minDate' => $this->toInputValue($this->minDate),
            'maxDate' => $this->toInputValue($this->maxDate),
        ];
    }
}
