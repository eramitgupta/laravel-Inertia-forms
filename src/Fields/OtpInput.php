<?php

namespace Erag\InertiaForms\Fields;

/**
 * A one-time code, one box per character, with paste and browser autofill.
 */
class OtpInput extends Field
{
    protected int $length = 6;

    protected bool $alphanumeric = false;

    protected bool $masked = false;

    protected ?int $groupSize = null;

    protected bool $autoSubmit = false;

    public function component(): string
    {
        return 'OtpInput';
    }

    /**
     * Number of characters (2 to 12).
     */
    public function length(int $length): static
    {
        $this->length = min(max($length, 2), 12);

        return $this;
    }

    /**
     * Allow letters as well as digits. Letters are upper-cased.
     */
    public function alphanumeric(bool $alphanumeric = true): static
    {
        $this->alphanumeric = $alphanumeric;

        return $this;
    }

    /**
     * Hide the characters like a password.
     */
    public function password(bool $masked = true): static
    {
        $this->masked = $masked;

        return $this;
    }

    /**
     * Split the boxes into groups, e.g. `groupSize(3)` shows `123 – 456`.
     */
    public function groupSize(?int $size): static
    {
        $this->groupSize = $size !== null && $size > 0 ? $size : null;

        return $this;
    }

    /**
     * Submit the form as soon as every box is filled in.
     */
    public function autoSubmit(bool $autoSubmit = true): static
    {
        $this->autoSubmit = $autoSubmit;

        return $this;
    }

    public function formatValue(mixed $value): mixed
    {
        return strtoupper((string) ($value ?? ''));
    }

    protected function typeRules(): array
    {
        return [
            'string',
            "size:{$this->length}",
            $this->alphanumeric ? 'regex:/^[A-Za-z0-9]+$/' : 'regex:/^[0-9]+$/',
        ];
    }

    public function validationMessages(): array
    {
        return [
            "{$this->name}.size" => "The :attribute must be {$this->length} characters.",
            "{$this->name}.regex" => $this->alphanumeric
                ? 'The :attribute may only contain letters and numbers.'
                : 'The :attribute may only contain numbers.',
        ];
    }

    public function dehydrateValue(mixed $value): mixed
    {
        return $value === null ? null : strtoupper((string) $value);
    }

    protected function props(): array
    {
        return [
            'length' => $this->length,
            'alphanumeric' => $this->alphanumeric,
            'masked' => $this->masked,
            'groupSize' => $this->groupSize,
            'autoSubmit' => $this->autoSubmit,
        ];
    }
}
