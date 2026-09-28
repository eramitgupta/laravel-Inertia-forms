<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Fields\Concerns\HasOptions;

class CheckboxGroup extends Field
{
    use HasOptions;

    protected bool $inline = false;

    protected ?int $columns = null;

    protected bool $buttons = false;

    public function component(): string
    {
        return 'CheckboxGroup';
    }

    public function inline(bool $inline = true): static
    {
        $this->inline = $inline;

        return $this;
    }

    /**
     * Render the options as a row of toggle buttons instead of inputs.
     */
    public function buttons(bool $buttons = true): static
    {
        $this->buttons = $buttons;

        return $this;
    }

    public function columns(?int $columns): static
    {
        $this->columns = $columns;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return [];
    }

    public function formatValue(mixed $value): mixed
    {
        return array_map(
            fn (mixed $item): mixed => $item instanceof \BackedEnum ? $item->value : $item,
            array_values(collect($value)->all()),
        );
    }

    public function validationRules(): array
    {
        return [
            $this->name => [$this->required ? 'required' : 'nullable', 'array', ...$this->rules],
            "{$this->name}.*" => [$this->inOptionsRule()],
        ];
    }

    protected function props(): array
    {
        return [
            'options' => $this->getOptions(),
            'inline' => $this->inline,
            'columns' => $this->columns,
            'buttons' => $this->buttons,
        ];
    }
}
