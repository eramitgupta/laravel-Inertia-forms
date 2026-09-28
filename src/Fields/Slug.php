<?php

namespace Erag\InertiaForms\Fields;

/**
 * A URL-safe slug, filled in live from another field (e.g. the title) until
 * the user edits it by hand.
 */
class Slug extends Field
{
    protected ?string $from = null;

    protected string $separator = '-';

    protected bool $lowercase = true;

    protected ?int $maxLength = 255;

    protected ?string $prefix = null;

    public function component(): string
    {
        return 'Slug';
    }

    /**
     * The field the slug is generated from, e.g. `title`.
     */
    public function from(?string $field): static
    {
        $this->from = $field;

        return $this;
    }

    public function separator(string $separator): static
    {
        $this->separator = $separator === '_' ? '_' : '-';

        return $this;
    }

    /**
     * Keep upper-case letters instead of lower-casing the slug.
     */
    public function keepCase(bool $keep = true): static
    {
        $this->lowercase = ! $keep;

        return $this;
    }

    public function maxLength(?int $length): static
    {
        $this->maxLength = $length;

        return $this;
    }

    /**
     * Text shown in front of the input, e.g. `example.com/blog/`.
     */
    public function prefix(?string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    protected function typeRules(): array
    {
        $letters = $this->lowercase ? 'a-z' : 'A-Za-z';
        $separator = preg_quote($this->separator, '/');

        return array_values(array_filter([
            'string',
            $this->maxLength !== null ? "max:{$this->maxLength}" : null,
            "regex:/^[{$letters}0-9]+(?:{$separator}[{$letters}0-9]+)*$/",
        ]));
    }

    public function validationMessages(): array
    {
        return [
            "{$this->name}.regex" => 'The :attribute may only contain '.($this->lowercase ? 'lower-case ' : '').'letters, numbers and single '.($this->separator === '-' ? 'dashes' : 'underscores').'.',
        ];
    }

    protected function props(): array
    {
        return [
            'from' => $this->from,
            'separator' => $this->separator,
            'lowercase' => $this->lowercase,
            'maxLength' => $this->maxLength,
            'prefix' => $this->prefix,
        ];
    }
}
