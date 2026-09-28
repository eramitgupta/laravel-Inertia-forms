<?php

namespace Erag\InertiaForms\Fields;

/**
 * A horizontal line between parts of a form.
 */
class Separator extends DisplayField
{
    public const array SPACINGS = ['none', 'sm', 'md', 'lg'];

    protected string $spacing = 'md';

    public function component(): string
    {
        return 'Separator';
    }

    public function content(string $content): static
    {
        return $this;
    }

    /**
     * Space above and below the line: none, sm, md or lg.
     */
    public function spacing(string $spacing): static
    {
        $this->spacing = in_array($spacing, self::SPACINGS, true) ? $spacing : 'md';

        return $this;
    }

    protected function props(): array
    {
        return ['spacing' => $this->spacing];
    }
}
