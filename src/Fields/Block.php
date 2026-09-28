<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Support\Label;
use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

/**
 * One kind of block a Blocks field can hold, like "Section" or "Quote",
 * with its own fields.
 *
 * @implements Arrayable<string, mixed>
 */
class Block implements Arrayable, JsonSerializable
{
    protected ?string $label = null;

    protected ?string $description = null;

    protected ?string $icon = null;

    protected int $columns = 1;

    protected ?string $titleFrom = null;

    /** @var array<int, Field> */
    protected array $fields = [];

    final public function __construct(protected string $name) {}

    public static function make(string $name): static
    {
        return new static($name);
    }

    public function label(?string $label): static
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Short text shown under the block name in the add menu and the block header.
     */
    public function description(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * One or two characters shown in the add menu. Defaults to the first letter of the label.
     */
    public function icon(?string $icon): static
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Number of grid columns for the block's fields (1 to 6).
     */
    public function columns(int $columns): static
    {
        $this->columns = min(max($columns, 1), 6);

        return $this;
    }

    /**
     * Use this field's value as the block title (e.g. the heading), when it is filled in.
     */
    public function titleFrom(?string $field): static
    {
        $this->titleFrom = $field;

        return $this;
    }

    /**
     * @param  array<int, Field>  $fields
     */
    public function fields(array $fields): static
    {
        $this->fields = array_values($fields);

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getLabel(): string
    {
        return $this->label ?? Label::fromName($this->name);
    }

    /**
     * @return array<int, Field>
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * Fields that carry a value (skips Submit and other display-only fields).
     *
     * @return array<int, Field>
     */
    public function valueFields(): array
    {
        return array_values(array_filter($this->fields, fn (Field $field): bool => $field->hasValue()));
    }

    /**
     * Values a new block starts with.
     *
     * @return array<string, mixed>
     */
    public function defaults(): array
    {
        $defaults = [];

        foreach ($this->valueFields() as $field) {
            data_set($defaults, $field->getName(), $field->initialValue());
        }

        return $defaults;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'label' => $this->getLabel(),
            'description' => $this->description,
            'icon' => $this->icon ?? mb_strtoupper(mb_substr($this->getLabel(), 0, 1)),
            'columns' => $this->columns,
            'titleFrom' => $this->titleFrom,
            'fields' => array_map(fn (Field $field): array => $field->toArray(), $this->fields),
            'defaults' => $this->defaults(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
