<?php

namespace Erag\InertiaForms\Fields;

class Textarea extends Field
{
    protected int $rows = 3;

    protected bool $autoResize = false;

    protected ?int $minLength = null;

    protected ?int $maxLength = null;

    protected bool $showCharacterCount = false;

    public function component(): string
    {
        return 'Textarea';
    }

    public function rows(int $rows): static
    {
        $this->rows = $rows;

        return $this;
    }

    public function autoResize(bool $autoResize = true): static
    {
        $this->autoResize = $autoResize;

        return $this;
    }

    public function minLength(?int $length): static
    {
        $this->minLength = $length;

        return $this;
    }

    public function maxLength(?int $length): static
    {
        $this->maxLength = $length;

        return $this;
    }

    public function showCharacterCount(bool $show = true): static
    {
        $this->showCharacterCount = $show;

        return $this;
    }

    protected function typeRules(): array
    {
        return array_values(array_filter([
            'string',
            $this->minLength !== null ? "min:{$this->minLength}" : null,
            $this->maxLength !== null ? "max:{$this->maxLength}" : null,
        ]));
    }

    protected function props(): array
    {
        return [
            'rows' => $this->rows,
            'autoResize' => $this->autoResize,
            'minLength' => $this->minLength,
            'maxLength' => $this->maxLength,
            'showCharacterCount' => $this->showCharacterCount,
        ];
    }
}
