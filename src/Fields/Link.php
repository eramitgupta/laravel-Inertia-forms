<?php

namespace Erag\InertiaForms\Fields;

use Closure;
use Illuminate\Validation\Rule;

/**
 * A URL. By default the value is a string. With `withLabel()` / `withTarget()`
 * (or `structured()`) it becomes `['url' => ..., 'label' => ..., 'target' => ...]`.
 */
class Link extends Field
{
    public const array TARGETS = ['_self', '_blank'];

    protected bool $structured = false;

    protected bool $withLabel = false;

    protected bool $withTarget = false;

    protected bool $requireScheme = false;

    /** @var array<int, string> */
    protected array $allowedSchemes = ['http', 'https'];

    protected ?string $labelPlaceholder = null;

    public function component(): string
    {
        return 'Link';
    }

    /**
     * Store an array with a `url` key instead of a plain string.
     */
    public function structured(bool $structured = true): static
    {
        $this->structured = $structured;

        return $this;
    }

    /**
     * Only a URL, stored as a string (the default).
     */
    public function plain(): static
    {
        $this->structured = false;
        $this->withLabel = false;
        $this->withTarget = false;

        return $this;
    }

    /**
     * Add a text box for the link text. Turns on structured mode.
     */
    public function withLabel(bool $withLabel = true, ?string $placeholder = null): static
    {
        $this->withLabel = $withLabel;
        $this->labelPlaceholder = $placeholder ?? $this->labelPlaceholder;

        return $this->structured($this->structured || $withLabel);
    }

    /**
     * Add a "Same tab / New tab" choice. Turns on structured mode.
     */
    public function withTarget(bool $withTarget = true): static
    {
        $this->withTarget = $withTarget;

        return $this->structured($this->structured || $withTarget);
    }

    /**
     * Reject URLs typed without a scheme, like `example.test/docs`.
     */
    public function requireScheme(bool $require = true): static
    {
        $this->requireScheme = $require;

        return $this;
    }

    /**
     * Schemes a URL may use. Defaults to http and https.
     *
     * @param  array<int, string>|string  $schemes
     */
    public function allowedSchemes(array|string ...$schemes): static
    {
        $list = collect($schemes)->flatten()
            ->map(fn (string $scheme): string => strtolower(trim(rtrim(trim($scheme), ':/'))))
            ->filter()
            ->unique()
            ->values()
            ->all();

        $this->allowedSchemes = $list === [] ? ['http', 'https'] : $list;

        return $this;
    }

    public function isStructured(): bool
    {
        return $this->structured;
    }

    public function emptyValue(): mixed
    {
        return $this->structured ? $this->structure('', '', '') : '';
    }

    public function formatValue(mixed $value): mixed
    {
        if (! $this->structured) {
            return is_array($value) ? (string) ($value['url'] ?? '') : (string) ($value ?? '');
        }

        if (! is_array($value)) {
            return $this->structure((string) ($value ?? ''), '', '');
        }

        return $this->structure(
            (string) ($value['url'] ?? ''),
            (string) ($value['label'] ?? ''),
            (string) ($value['target'] ?? ''),
        );
    }

    public function validationRules(): array
    {
        $presence = $this->required ? 'required' : 'nullable';

        if (! $this->structured) {
            return [
                $this->name => [$presence, 'string', 'max:2048', $this->urlRule(), ...$this->rules],
            ];
        }

        $keys = implode(',', array_keys($this->structure('', '', '')));

        return array_filter([
            $this->name => [$presence, "array:{$keys}", ...$this->rules],
            "{$this->name}.url" => [$presence, 'string', 'max:2048', $this->urlRule()],
            "{$this->name}.label" => $this->withLabel ? ['nullable', 'string', 'max:255'] : null,
            "{$this->name}.target" => $this->withTarget ? ['nullable', Rule::in(self::TARGETS)] : null,
        ]);
    }

    public function validationAttributes(): array
    {
        return [
            ...parent::validationAttributes(),
            "{$this->name}.url" => $this->getLabel(),
            "{$this->name}.label" => "{$this->getLabel()} text",
            "{$this->name}.target" => "{$this->getLabel()} target",
        ];
    }

    protected function props(): array
    {
        return [
            'structured' => $this->structured,
            'withLabel' => $this->withLabel,
            'withTarget' => $this->withTarget,
            'requireScheme' => $this->requireScheme,
            'allowedSchemes' => $this->allowedSchemes,
            'labelPlaceholder' => $this->labelPlaceholder,
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function structure(string $url, string $label, string $target): array
    {
        return array_filter([
            'url' => $url,
            'label' => $this->withLabel ? $label : null,
            'target' => $this->withTarget ? $target : null,
        ], fn (?string $value): bool => $value !== null);
    }

    protected function urlRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            $url = trim((string) $value);

            if ($url === '') {
                return;
            }

            $hasScheme = (bool) preg_match('/^[a-z][a-z0-9+.-]*:/i', $url);

            if (! $hasScheme && $this->requireScheme) {
                $fail('The :attribute must start with '.$this->allowedSchemes[0].'://.');

                return;
            }

            $candidate = $hasScheme ? $url : 'https://'.ltrim($url, '/');
            $scheme = strtolower((string) parse_url($candidate, PHP_URL_SCHEME));

            if ($hasScheme && ! in_array($scheme, $this->allowedSchemes, true)) {
                $fail('The :attribute must use '.implode(' or ', $this->allowedSchemes).'.');

                return;
            }

            $host = parse_url($candidate, PHP_URL_HOST);
            $opaque = ! in_array($scheme, ['http', 'https'], true);

            if (! $opaque && (filter_var($candidate, FILTER_VALIDATE_URL) === false || ! is_string($host) || ! str_contains($host, '.'))) {
                $fail('The :attribute must be a valid URL.');
            }
        };
    }
}
