<?php

namespace Erag\InertiaForms\Fields;

/**
 * Free-text tags. Users type a value and press Enter or comma to add it,
 * and can drag tags to reorder them. The value is a list of strings.
 */
class TagsInput extends Field
{
    /** @var array<int, string> */
    protected array $suggestions = [];

    protected ?int $maxTags = null;

    protected ?int $maxTagLength = null;

    protected bool $reorderable = true;

    public function component(): string
    {
        return 'TagsInput';
    }

    /**
     * Values offered while typing.
     *
     * @param  array<int, string>  $suggestions
     */
    public function suggestions(array $suggestions): static
    {
        $this->suggestions = array_values(array_map('strval', $suggestions));

        return $this;
    }

    public function maxTags(?int $count): static
    {
        $this->maxTags = $count;

        return $this;
    }

    public function maxTagLength(?int $characters): static
    {
        $this->maxTagLength = $characters;

        return $this;
    }

    /**
     * Allow dragging tags to change their order.
     */
    public function reorderable(bool $reorderable = true): static
    {
        $this->reorderable = $reorderable;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return [];
    }

    public function formatValue(mixed $value): mixed
    {
        if (is_string($value)) {
            $value = array_filter(array_map('trim', explode(',', $value)), fn (string $tag): bool => $tag !== '');
        }

        return array_values(array_map('strval', collect($value)->all()));
    }

    public function validationRules(): array
    {
        return [
            $this->name => array_values(array_filter([
                $this->required ? 'required' : 'nullable',
                'array',
                $this->maxTags !== null ? "max:{$this->maxTags}" : null,
                ...$this->rules,
            ])),
            "{$this->name}.*" => array_values(array_filter([
                'string',
                'distinct',
                $this->maxTagLength !== null ? "max:{$this->maxTagLength}" : null,
            ])),
        ];
    }

    protected function props(): array
    {
        return [
            'suggestions' => $this->suggestions,
            'maxTags' => $this->maxTags,
            'maxTagLength' => $this->maxTagLength,
            'reorderable' => $this->reorderable,
        ];
    }
}
