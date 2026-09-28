<?php

namespace Erag\InertiaForms\Fields;

/**
 * Repeating groups of the same fields, like links, contacts or line items.
 * The value is a plain list of rows: `[['label' => ..., 'url' => ...], ...]`.
 * Items can be added, removed, reordered and collapsed like Blocks items.
 */
class Repeater extends Blocks
{
    protected Block $item;

    public function component(): string
    {
        return 'Repeater';
    }

    /**
     * The fields of each item.
     *
     * @param  array<int, Field>  $fields
     */
    public function fields(array $fields): static
    {
        $this->item()->fields($fields);

        return $this;
    }

    /**
     * Name used in item titles ("Link 2") and messages. Defaults to "Item".
     */
    public function itemLabel(string $label): static
    {
        $this->item()->label($label);

        return $this;
    }

    /**
     * Use this field's value as the item title once it is filled in.
     */
    public function titleFrom(?string $field): static
    {
        $this->item()->titleFrom($field);

        return $this;
    }

    /**
     * Number of grid columns for each item's fields (1 to 6).
     */
    public function columns(int $columns): static
    {
        $this->item()->columns($columns);

        return $this;
    }

    /**
     * @param  array<int, Block>  $blocks
     */
    public function blocks(array $blocks): static
    {
        $this->item = $blocks[0] ?? Block::make('item');
        $this->blocks = [$this->item];

        return $this;
    }

    public function getBlocks(): array
    {
        return [$this->item()];
    }

    public function getBlock(mixed $name): ?Block
    {
        return $this->item();
    }

    protected function item(): Block
    {
        if (! isset($this->item)) {
            $this->item = Block::make('item')->label('Item');
            $this->blocks = [$this->item];
        }

        return $this->item;
    }

    protected function itemRules(): array
    {
        return [
            "{$this->name}.*" => ['array'],
        ];
    }

    protected function blockOf(mixed $item): ?Block
    {
        return is_array($item) ? $this->item() : null;
    }

    protected function dataOf(mixed $item): array
    {
        return is_array($item) ? $item : [];
    }

    protected function wrap(Block $block, array $data): array
    {
        return $data;
    }

    protected function dataPrefix(): string
    {
        return '';
    }

    protected function props(): array
    {
        return [
            ...parent::props(),
            'blocks' => [$this->item()->toArray()],
            'addActionLabel' => $this->addActionLabel ?? 'Add '.strtolower($this->item()->getLabel()),
        ];
    }
}
