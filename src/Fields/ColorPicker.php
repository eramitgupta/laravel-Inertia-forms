<?php

namespace Erag\InertiaForms\Fields;

class ColorPicker extends Field
{
    /** @var array<int, string> */
    protected array $swatches = [];

    public function component(): string
    {
        return 'ColorPicker';
    }

    /**
     * Preset colors shown as quick picks.
     *
     * @param  array<int, string>  $colors
     */
    public function swatches(array $colors): static
    {
        $this->swatches = array_values($colors);

        return $this;
    }

    protected function typeRules(): array
    {
        return ['regex:/^#[0-9a-fA-F]{6}$/'];
    }

    protected function props(): array
    {
        return ['swatches' => $this->swatches];
    }
}
