<?php

namespace Erag\InertiaForms\Fields;

/**
 * A paragraph of plain text. The text is escaped, so it is safe for any value.
 */
class Text extends DisplayField
{
    protected string $text = '';

    public function component(): string
    {
        return 'Text';
    }

    public function content(string $content): static
    {
        $this->text = $content;

        return $this;
    }

    public function text(string $text): static
    {
        return $this->content($text);
    }

    protected function props(): array
    {
        return ['text' => $this->text];
    }
}
