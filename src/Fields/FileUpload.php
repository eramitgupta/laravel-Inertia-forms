<?php

namespace Erag\InertiaForms\Fields;

class FileUpload extends Field
{
    protected bool $multiple = false;

    protected bool $image = false;

    /** @var array<int, string> */
    protected array $accept = [];

    protected ?int $maxSize = null;

    protected ?int $maxFiles = null;

    public function hasFiles(): bool
    {
        return true;
    }

    public function component(): string
    {
        return 'FileUpload';
    }

    public function multiple(bool $multiple = true): static
    {
        $this->multiple = $multiple;

        return $this;
    }

    /**
     * Accept only images and show previews.
     */
    public function image(bool $image = true): static
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Allowed file extensions, like `['pdf', 'docx']`.
     *
     * @param  array<int, string>|string  $extensions
     */
    public function accept(array|string $extensions): static
    {
        $this->accept = array_values(array_map(
            fn (string $extension): string => ltrim($extension, '.'),
            (array) $extensions,
        ));

        return $this;
    }

    /**
     * Maximum size per file in kilobytes.
     */
    public function maxSize(?int $kilobytes): static
    {
        $this->maxSize = $kilobytes;

        return $this;
    }

    public function maxFiles(?int $count): static
    {
        $this->maxFiles = $count;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return $this->multiple ? [] : null;
    }

    public function formatValue(mixed $value): mixed
    {
        return $this->emptyValue();
    }

    /**
     * @return array<int, string>
     */
    protected function fileRules(): array
    {
        return array_values(array_filter([
            $this->image ? 'image' : 'file',
            $this->accept !== [] ? 'extensions:'.implode(',', $this->accept) : null,
            $this->maxSize !== null ? "max:{$this->maxSize}" : null,
        ]));
    }

    public function validationRules(): array
    {
        $presence = $this->required ? 'required' : 'nullable';

        if (! $this->multiple) {
            return [$this->name => [$presence, ...$this->fileRules(), ...$this->rules]];
        }

        return [
            $this->name => array_values(array_filter([
                $presence,
                'array',
                $this->maxFiles !== null ? "max:{$this->maxFiles}" : null,
                ...$this->rules,
            ])),
            "{$this->name}.*" => $this->fileRules(),
        ];
    }

    protected function props(): array
    {
        $accept = $this->accept !== []
            ? implode(',', array_map(fn (string $extension): string => ".{$extension}", $this->accept))
            : ($this->image ? 'image/*' : null);

        return [
            'multiple' => $this->multiple,
            'image' => $this->image,
            'accept' => $accept,
            'maxSize' => $this->maxSize,
            'maxFiles' => $this->maxFiles,
        ];
    }
}
