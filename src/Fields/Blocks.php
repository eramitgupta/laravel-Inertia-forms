<?php

namespace Erag\InertiaForms\Fields;

use Closure;
use Illuminate\Validation\Rule;

/**
 * A list of content blocks (a page builder inside the form). Each block has a type (a Block) with its own fields,
 * and blocks can be added, removed, reordered and collapsed. The value is a list
 * of `['type' => 'section', 'data' => [...]]` items.
 */
class Blocks extends Field
{
    /** @var array<int, Block> */
    protected array $blocks = [];

    protected ?string $addActionLabel = null;

    protected bool $reorderable = true;

    protected bool $addable = true;

    protected bool $deletable = true;

    protected bool $collapsible = true;

    protected bool $collapsed = false;

    protected ?int $minItems = null;

    protected ?int $maxItems = null;

    public function component(): string
    {
        return 'Blocks';
    }

    /**
     * @param  array<int, Block>  $blocks
     */
    public function blocks(array $blocks): static
    {
        $this->blocks = array_values($blocks);

        return $this;
    }

    /**
     * Text of the add button. Defaults to "Add block".
     */
    public function addActionLabel(?string $label): static
    {
        $this->addActionLabel = $label;

        return $this;
    }

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
     * Let users collapse blocks to their header. On by default.
     */
    public function collapsible(bool $collapsible = true): static
    {
        $this->collapsible = $collapsible;

        return $this;
    }

    /**
     * Start existing blocks collapsed.
     */
    public function collapsed(bool $collapsed = true): static
    {
        $this->collapsed = $collapsed;

        return $this;
    }

    public function minItems(?int $count): static
    {
        $this->minItems = $count;

        return $this;
    }

    public function maxItems(?int $count): static
    {
        $this->maxItems = $count;

        return $this;
    }

    /**
     * @return array<int, Block>
     */
    public function getBlocks(): array
    {
        return $this->blocks;
    }

    public function getBlock(mixed $name): ?Block
    {
        foreach ($this->blocks as $block) {
            if ($block->getName() === $name) {
                return $block;
            }
        }

        return null;
    }

    public function emptyValue(): mixed
    {
        return [];
    }

    /**
     * Fill each block's missing fields with their starting values.
     *
     * @return array<int, array{type: string, data: array<string, mixed>}>
     */
    public function formatValue(mixed $value): mixed
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        $items = [];

        foreach (collect(is_iterable($value) ? $value : [])->values() as $item) {
            $block = $this->blockOf($item);

            if ($block === null) {
                continue;
            }

            $data = $this->dataOf($item);
            $formatted = [];

            foreach ($block->valueFields() as $field) {
                data_set($formatted, $field->getName(), data_get($data, $field->getName()) !== null
                    ? $field->formatValue(data_get($data, $field->getName()))
                    : $field->initialValue());
            }

            $items[] = $this->wrap($block, $formatted);
        }

        return $items;
    }

    public function hasFiles(): bool
    {
        foreach ($this->blocks as $block) {
            foreach ($block->valueFields() as $field) {
                if ($field->hasFiles()) {
                    return true;
                }
            }
        }

        return false;
    }

    public function validationRules(): array
    {
        return $this->validationRulesFor([]);
    }

    public function validationRulesFor(array $data): array
    {
        $rules = [
            $this->name => array_values(array_filter([
                $this->required ? 'required' : 'nullable',
                'array',
                $this->minItems !== null ? "min:{$this->minItems}" : null,
                $this->maxItems !== null ? "max:{$this->maxItems}" : null,
                ...$this->rules,
            ])),
            ...$this->itemRules(),
        ];

        $this->eachNestedField($data, function (Field $field, array $blockData) use (&$rules): void {
            $rules = [...$rules, ...$field->validationRulesFor($blockData)];
        });

        return $rules;
    }

    public function validationAttributesFor(array $data): array
    {
        $attributes = [
            ...parent::validationAttributes(),
            "{$this->name}.*.type" => "{$this->getLabel()} block type",
        ];

        $this->eachNestedField($data, function (Field $field, array $blockData) use (&$attributes): void {
            $attributes = [...$attributes, ...$field->validationAttributesFor($blockData)];
        });

        return $attributes;
    }

    public function validationMessagesFor(array $data): array
    {
        $messages = [];

        $this->eachNestedField($data, function (Field $field, array $blockData) use (&$messages): void {
            $messages = [...$messages, ...$field->validationMessagesFor($blockData)];
        });

        return $messages;
    }

    /**
     * Keep only each block's known, visible fields, dehydrated by those fields.
     *
     * @return array<int, array{type: string, data: array<string, mixed>}>
     */
    public function dehydrateValue(mixed $value): mixed
    {
        $items = [];

        foreach (collect(is_array($value) ? $value : [])->values() as $item) {
            $block = $this->blockOf($item);

            if ($block === null) {
                continue;
            }

            $data = $this->dataOf($item);
            $clean = [];

            foreach ($block->valueFields() as $field) {
                if ($field->isVisibleFor($data) && data_get($data, $field->getName()) !== null) {
                    data_set($clean, $field->getName(), $field->dehydrateValue(data_get($data, $field->getName())));
                } elseif ($field->isVisibleFor($data) && array_key_exists($field->getName(), $data)) {
                    data_set($clean, $field->getName(), null);
                }
            }

            $items[] = $this->wrap($block, $clean);
        }

        return $items;
    }

    /**
     * Rules for the shape of each item.
     *
     * @return array<string, array<int, mixed>>
     */
    protected function itemRules(): array
    {
        return [
            "{$this->name}.*" => ['array:type,data'],
            "{$this->name}.*.type" => ['required', 'string', Rule::in(array_map(fn (Block $block): string => $block->getName(), $this->blocks))],
            "{$this->name}.*.data" => ['nullable', 'array'],
        ];
    }

    /**
     * The block type of a submitted or bound item.
     */
    protected function blockOf(mixed $item): ?Block
    {
        return is_array($item) ? $this->getBlock($item['type'] ?? null) : null;
    }

    /**
     * The field values of an item.
     *
     * @return array<string, mixed>
     */
    protected function dataOf(mixed $item): array
    {
        return is_array($item) && is_array($item['data'] ?? null) ? $item['data'] : [];
    }

    /**
     * Build an item from its block and field values.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function wrap(Block $block, array $data): array
    {
        return ['type' => $block->getName(), 'data' => $data];
    }

    /**
     * Path between the item index and a field name (`data.` for blocks).
     */
    protected function dataPrefix(): string
    {
        return 'data.';
    }

    protected function props(): array
    {
        return [
            'blocks' => array_map(fn (Block $block): array => $block->toArray(), $this->blocks),
            'addActionLabel' => $this->addActionLabel ?? 'Add block',
            'reorderable' => $this->reorderable,
            'addable' => $this->addable,
            'deletable' => $this->deletable,
            'collapsible' => $this->collapsible,
            'collapsed' => $this->collapsed,
            'minItems' => $this->minItems,
            'maxItems' => $this->maxItems,
        ];
    }

    /**
     * Run a callback for every visible field of every submitted block, renamed to
     * its full path (e.g. `body.1.data.heading`) and labelled with its block.
     *
     * @param  array<string, mixed>  $data
     * @param  Closure(Field, array<string, mixed>): void  $callback
     */
    protected function eachNestedField(array $data, Closure $callback): void
    {
        $items = data_get($data, $this->name);

        if (! is_array($items)) {
            return;
        }

        foreach ($items as $index => $item) {
            $block = $this->blockOf($item);

            if ($block === null) {
                continue;
            }

            $blockData = $this->dataOf($item);
            $position = is_int($index) ? $index + 1 : $index;

            foreach ($block->valueFields() as $field) {
                if (! $field->isVisibleFor($blockData)) {
                    continue;
                }

                $callback(
                    $field->withName(
                        "{$this->name}.{$index}.{$this->dataPrefix()}{$field->getName()}",
                        "{$field->getLabel()} ({$block->getLabel()} {$position})",
                    ),
                    $blockData,
                );
            }
        }
    }
}
