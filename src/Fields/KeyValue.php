<?php

namespace Erag\InertiaForms\Fields;

use Closure;

/**
 * Editable key / value rows, like metadata or HTTP headers. Rows can be added,
 * removed and reordered. The browser edits a list of `['key' => ..., 'value' => ...]`
 * rows; `$form->validated()` returns a plain `['key' => 'value']` array.
 */
class KeyValue extends Field
{
    protected string $keyLabel = 'Key';

    protected string $valueLabel = 'Value';

    protected ?string $keyPlaceholder = null;

    protected ?string $valuePlaceholder = null;

    protected ?string $addActionLabel = null;

    protected bool $reorderable = true;

    protected bool $addable = true;

    protected bool $deletable = true;

    protected bool $editableKeys = true;

    protected ?int $maxItems = null;

    protected ?int $maxKeyLength = 255;

    protected ?int $maxValueLength = null;

    public function component(): string
    {
        return 'KeyValue';
    }

    /**
     * Column headings for the key and value inputs.
     */
    public function keyLabel(string $label): static
    {
        $this->keyLabel = $label;

        return $this;
    }

    public function valueLabel(string $label): static
    {
        $this->valueLabel = $label;

        return $this;
    }

    public function keyPlaceholder(?string $placeholder): static
    {
        $this->keyPlaceholder = $placeholder;

        return $this;
    }

    public function valuePlaceholder(?string $placeholder): static
    {
        $this->valuePlaceholder = $placeholder;

        return $this;
    }

    /**
     * Text of the button that adds a row. Defaults to "Add row".
     */
    public function addActionLabel(?string $label): static
    {
        $this->addActionLabel = $label;

        return $this;
    }

    /**
     * Allow reordering rows with the drag handle and the up / down buttons.
     */
    public function reorderable(bool $reorderable = true): static
    {
        $this->reorderable = $reorderable;

        return $this;
    }

    public function addable(bool $addable = true): static
    {
        $this->addable = $addable;

        return $this;
    }

    public function deletable(bool $deletable = true): static
    {
        $this->deletable = $deletable;

        return $this;
    }

    /**
     * Let users change the keys. Turn off to only edit the values of preset keys.
     */
    public function editableKeys(bool $editable = true): static
    {
        $this->editableKeys = $editable;

        return $this;
    }

    public function maxItems(?int $count): static
    {
        $this->maxItems = $count;

        return $this;
    }

    public function maxKeyLength(?int $characters): static
    {
        $this->maxKeyLength = $characters;

        return $this;
    }

    public function maxValueLength(?int $characters): static
    {
        $this->maxValueLength = $characters;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return [];
    }

    /**
     * Accepts `['key' => 'value']` arrays (e.g. a JSON column) or a list of rows.
     *
     * @return array<int, array{key: string, value: string}>
     */
    public function formatValue(mixed $value): mixed
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        $items = collect(is_iterable($value) ? $value : [])->all();

        if (array_is_list($items) && collect($items)->every(fn (mixed $row): bool => is_array($row) && array_key_exists('key', $row))) {
            return array_map(fn (array $row): array => [
                'key' => (string) ($row['key'] ?? ''),
                'value' => (string) ($row['value'] ?? ''),
            ], $items);
        }

        return collect($items)
            ->map(fn (mixed $item, int|string $key): array => [
                'key' => (string) $key,
                'value' => is_scalar($item) || $item === null ? (string) $item : (string) json_encode($item),
            ])
            ->values()
            ->all();
    }

    /**
     * Rows without a key are dropped; the rest become `['key' => 'value']`.
     *
     * @return array<string, string|null>
     */
    public function dehydrateValue(mixed $value): mixed
    {
        return collect(is_array($value) ? $value : [])
            ->filter(fn (mixed $row): bool => is_array($row) && filled($row['key'] ?? null))
            ->mapWithKeys(fn (array $row): array => [(string) $row['key'] => $row['value'] ?? null])
            ->all();
    }

    public function validationRules(): array
    {
        return [
            $this->name => array_values(array_filter([
                $this->required ? 'required' : 'nullable',
                'array',
                $this->maxItems !== null ? "max:{$this->maxItems}" : null,
                $this->required ? $this->hasAtLeastOneKey() : null,
                ...$this->rules,
            ])),
            "{$this->name}.*" => ['array:key,value'],
            "{$this->name}.*.key" => array_values(array_filter([
                'nullable',
                'string',
                "required_with:{$this->name}.*.value",
                'distinct:ignore_case',
                $this->maxKeyLength !== null ? "max:{$this->maxKeyLength}" : null,
            ])),
            "{$this->name}.*.value" => array_values(array_filter([
                'nullable',
                'string',
                $this->maxValueLength !== null ? "max:{$this->maxValueLength}" : null,
            ])),
        ];
    }

    public function validationAttributes(): array
    {
        $label = $this->getLabel();

        return [
            $this->name => $label,
            "{$this->name}.*" => $label,
            "{$this->name}.*.key" => "{$label} ".strtolower($this->keyLabel).' (row :position)',
            "{$this->name}.*.value" => "{$label} ".strtolower($this->valueLabel).' (row :position)',
        ];
    }

    public function validationMessages(): array
    {
        return [
            "{$this->name}.*.key.required_with" => 'The :attribute field is required when a value is filled in.',
            "{$this->name}.*.key.distinct" => 'The :attribute is used more than once.',
        ];
    }

    protected function props(): array
    {
        return [
            'keyLabel' => $this->keyLabel,
            'valueLabel' => $this->valueLabel,
            'keyPlaceholder' => $this->keyPlaceholder,
            'valuePlaceholder' => $this->valuePlaceholder,
            'addActionLabel' => $this->addActionLabel ?? 'Add row',
            'reorderable' => $this->reorderable,
            'addable' => $this->addable,
            'deletable' => $this->deletable,
            'editableKeys' => $this->editableKeys,
            'maxItems' => $this->maxItems,
        ];
    }

    /**
     * A required field needs at least one row with a key, not just empty rows.
     */
    protected function hasAtLeastOneKey(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            $hasKey = collect(is_array($value) ? $value : [])
                ->contains(fn (mixed $row): bool => is_array($row) && filled($row['key'] ?? null));

            if (! $hasKey) {
                $fail('The :attribute field needs at least one entry.');
            }
        };
    }
}
