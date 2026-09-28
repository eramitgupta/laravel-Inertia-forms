<?php

namespace Erag\InertiaForms\Fields;

use Closure;

/**
 * A chat-style message box: it grows as you type, Enter sends the form,
 * Shift+Enter adds a line, and files can be attached. The value is
 * `['message' => '...', 'attachments' => [UploadedFile, ...]]`.
 */
class Composer extends Field
{
    protected bool $attachments = false;

    /** @var array<int, string> */
    protected array $accept = [];

    protected ?int $maxFiles = 5;

    protected ?int $maxSize = null;

    protected ?int $maxLength = null;

    protected bool $submitOnEnter = true;

    protected string $sendLabel = 'Send';

    protected int $rows = 1;

    /** @var array<int, string> */
    protected array $quickReplies = [];

    public function component(): string
    {
        return 'Composer';
    }

    /**
     * Let users attach files with the paperclip button.
     */
    public function attachments(bool $attachments = true): static
    {
        $this->attachments = $attachments;

        return $this;
    }

    /**
     * Allowed file extensions for attachments, e.g. `['pdf', 'png']`.
     *
     * @param  array<int, string>|string  $extensions
     */
    public function accept(array|string $extensions): static
    {
        $this->accept = array_values(array_map(
            fn (string $extension): string => ltrim(strtolower(trim($extension)), '.'),
            is_string($extensions) ? explode(',', $extensions) : $extensions,
        ));

        return $this->attachments();
    }

    public function maxFiles(?int $count): static
    {
        $this->maxFiles = $count;

        return $this;
    }

    /**
     * Largest attachment in kilobytes.
     */
    public function maxSize(?int $kilobytes): static
    {
        $this->maxSize = $kilobytes;

        return $this;
    }

    public function maxLength(?int $characters): static
    {
        $this->maxLength = $characters;

        return $this;
    }

    /**
     * Send with Enter (Shift+Enter for a new line). On by default.
     */
    public function submitOnEnter(bool $submitOnEnter = true): static
    {
        $this->submitOnEnter = $submitOnEnter;

        return $this;
    }

    public function sendLabel(string $label): static
    {
        $this->sendLabel = $label;

        return $this;
    }

    /**
     * Starting height in lines (it grows as you type).
     */
    public function rows(int $rows): static
    {
        $this->rows = max($rows, 1);

        return $this;
    }

    /**
     * Ready-made replies shown as chips; clicking one fills in the message.
     *
     * @param  array<int, string>  $replies
     */
    public function quickReplies(array $replies): static
    {
        $this->quickReplies = array_values(array_map('strval', $replies));

        return $this;
    }

    public function emptyValue(): mixed
    {
        return ['message' => '', 'attachments' => []];
    }

    public function formatValue(mixed $value): mixed
    {
        if (is_array($value)) {
            return ['message' => (string) ($value['message'] ?? ''), 'attachments' => []];
        }

        return ['message' => (string) ($value ?? ''), 'attachments' => []];
    }

    public function hasFiles(): bool
    {
        return $this->attachments;
    }

    public function validationRules(): array
    {
        $fileRules = array_values(array_filter([
            'file',
            $this->accept !== [] ? 'extensions:'.implode(',', $this->accept) : null,
            $this->maxSize !== null ? "max:{$this->maxSize}" : null,
        ]));

        return array_filter([
            $this->name => [
                $this->required ? 'required' : 'nullable',
                'array:message,attachments',
                $this->required ? $this->hasContent() : null,
                ...$this->rules,
            ],
            "{$this->name}.message" => array_values(array_filter([
                'nullable',
                'string',
                $this->maxLength !== null ? "max:{$this->maxLength}" : null,
            ])),
            "{$this->name}.attachments" => $this->attachments
                ? array_values(array_filter(['nullable', 'array', $this->maxFiles !== null ? "max:{$this->maxFiles}" : null]))
                : ['prohibited'],
            "{$this->name}.attachments.*" => $this->attachments ? $fileRules : null,
        ], fn (?array $rules): bool => $rules !== null && $rules !== []);
    }

    public function validationAttributes(): array
    {
        return [
            ...parent::validationAttributes(),
            "{$this->name}.message" => $this->getLabel(),
            "{$this->name}.attachments" => "{$this->getLabel()} attachments",
            "{$this->name}.attachments.*" => "{$this->getLabel()} attachment",
        ];
    }

    public function dehydrateValue(mixed $value): mixed
    {
        $value = is_array($value) ? $value : [];

        return [
            'message' => trim((string) ($value['message'] ?? '')),
            'attachments' => array_values($value['attachments'] ?? []),
        ];
    }

    protected function props(): array
    {
        return [
            'attachments' => $this->attachments,
            'accept' => $this->accept,
            'maxFiles' => $this->maxFiles,
            'maxSize' => $this->maxSize,
            'maxLength' => $this->maxLength,
            'submitOnEnter' => $this->submitOnEnter,
            'sendLabel' => $this->sendLabel,
            'rows' => $this->rows,
            'quickReplies' => $this->quickReplies,
        ];
    }

    /**
     * A required composer needs a message or at least one attachment.
     */
    protected function hasContent(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            $message = trim((string) (is_array($value) ? ($value['message'] ?? '') : ''));
            $files = is_array($value) ? array_filter((array) ($value['attachments'] ?? [])) : [];

            if ($message === '' && $files === []) {
                $fail('Write a message or attach a file.');
            }
        };
    }
}
