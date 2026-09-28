<?php

namespace Erag\InertiaForms\Fields;

/**
 * Base for fields that only show something (headings, text, notices) and
 * carry no value. They span the full row and are left out of data and rules.
 */
abstract class DisplayField extends Field
{
    protected static int $sequence = 0;

    protected ?int $columnSpan = 12;

    /**
     * Display fields are made from their content; their name is generated.
     */
    public static function make(string $name = ''): static
    {
        return (new static('_display_'.++static::$sequence))->content($name);
    }

    abstract public function content(string $content): static;

    public function hasValue(): bool
    {
        return false;
    }

    public function validationRules(): array
    {
        return [];
    }
}
