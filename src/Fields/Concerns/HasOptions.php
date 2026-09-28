<?php

namespace Erag\InertiaForms\Fields\Concerns;

use Erag\InertiaForms\Support\Options;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Validation\Rule;

trait HasOptions
{
    protected mixed $options = [];

    /**
     * @param  array<mixed>|Arrayable<array-key, mixed>|class-string<\UnitEnum>|\Closure  $options
     */
    public function options(mixed $options): static
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return array<int, array{value: mixed, label: string, description: ?string, disabled: bool}>
     */
    public function getOptions(): array
    {
        return Options::normalize(value($this->options));
    }

    /**
     * @return array<int, mixed>
     */
    protected function optionValues(): array
    {
        $enabled = array_filter($this->getOptions(), fn (array $option): bool => ! $option['disabled']);

        return array_values(array_column($enabled, 'value'));
    }

    protected function inOptionsRule(): mixed
    {
        return Rule::in($this->optionValues());
    }
}
