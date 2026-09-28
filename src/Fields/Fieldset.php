<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Concerns\HasAuthorization;
use Erag\InertiaForms\Concerns\HasVisibility;
use Erag\InertiaForms\Support\Icon;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Traits\Conditionable;
use Illuminate\Support\Traits\Macroable;
use Illuminate\Support\Traits\Tappable;
use JsonSerializable;

/**
 * Groups fields under an optional legend and lays them out in a grid.
 *
 * @implements Arrayable<string, mixed>
 */
class Fieldset implements Arrayable, JsonSerializable
{
    use Conditionable;
    use HasAuthorization;
    use HasVisibility;
    use Macroable;
    use Tappable;

    protected ?string $legend = null;

    protected ?string $description = null;

    protected int $columns = 1;

    protected ?string $id = null;

    protected ?string $class = null;

    protected ?string $icon = null;

    /** @var array<int, Field> */
    protected array $fields = [];

    final public function __construct(?string $legend = null)
    {
        $this->legend = $legend;
    }

    public static function make(?string $legend = null): static
    {
        return new static($legend);
    }

    public function legend(?string $legend): static
    {
        $this->legend = $legend;

        return $this;
    }

    /**
     * An icon name shown for this fieldset's step in a wizard, e.g. `user`.
     */
    public function icon(?string $icon): static
    {
        $this->icon = $icon;

        return $this;
    }

    public function description(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Number of grid columns on wider screens. Fields stack on mobile.
     */
    public function columns(int $columns): static
    {
        $this->columns = max(1, $columns);

        return $this;
    }

    public function id(?string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function class(?string $class): static
    {
        $this->class = $class;

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

    /**
     * @return array<int, Field>
     */
    public function getFields(): array
    {
        return array_values(array_filter(
            $this->fields,
            fn (Field $field): bool => $field->isAuthorized(),
        ));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'legend' => $this->legend,
            'description' => $this->description,
            'icon' => $this->icon,
            'iconSvg' => Icon::svg($this->icon),
            'columns' => $this->columns,
            'class' => $this->class,
            'visibility' => $this->serializeVisibility(),
            'fields' => array_map(fn (Field $field): array => $field->toArray(), $this->getFields()),
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
