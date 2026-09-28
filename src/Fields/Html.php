<?php

namespace Erag\InertiaForms\Fields;

/**
 * Raw HTML written by you, e.g. a sentence with a link.
 *
 * The HTML is rendered as-is. Never pass user input or untrusted content.
 */
class Html extends DisplayField
{
    protected string $html = '';

    public function component(): string
    {
        return 'Html';
    }

    public function content(string $content): static
    {
        $this->html = $content;

        return $this;
    }

    public function html(string $html): static
    {
        return $this->content($html);
    }

    protected function props(): array
    {
        return ['html' => $this->html];
    }
}
