<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Fields\Concerns\HasBooleanValues;

class Toggle extends Field
{
    use HasBooleanValues;

    protected ?string $onLabel = null;

    protected ?string $offLabel = null;

    public function component(): string
    {
        return 'Toggle';
    }

    /**
     * Text shown next to the switch while it is on.
     */
    public function onLabel(?string $label): static
    {
        $this->onLabel = $label;

        return $this;
    }

    /**
     * Text shown next to the switch while it is off.
     */
    public function offLabel(?string $label): static
    {
        $this->offLabel = $label;

        return $this;
    }

    protected function props(): array
    {
        return [
            ...$this->booleanProps(),
            'onLabel' => $this->onLabel,
            'offLabel' => $this->offLabel,
        ];
    }
}
