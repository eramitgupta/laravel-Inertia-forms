<?php

namespace Erag\InertiaForms\Fields;

use Closure;
use Erag\InertiaForms\Fields\Concerns\HasOptions;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\Support\Options;

/**
 * A dropdown of options: single or multiple, with local search
 * (`searchable()`) or server-side search (`searchUsing()`).
 */
class Combobox extends Field
{
    use HasOptions;

    protected bool $multiple = false;

    protected bool $searchable = false;

    protected ?Closure $searchUsing = null;

    protected ?Closure $selectedOptionsUsing = null;

    /** @var array{url: string, token: string, field: string}|null */
    protected ?array $search = null;

    protected mixed $currentValue = null;

    public function component(): string
    {
        return 'Combobox';
    }

    public function multiple(bool $multiple = true): static
    {
        $this->multiple = $multiple;

        return $this;
    }

    /**
     * Add a search box that filters the options as the user types.
     */
    public function searchable(bool $searchable = true): static
    {
        $this->searchable = $searchable;

        return $this;
    }

    /**
     * Load options from the server as the user types, e.g. from the database.
     * The callback receives the search text and returns options in any format
     * `options()` accepts. It also makes the select searchable.
     *
     * @param  Closure(string): mixed  $callback
     */
    public function searchUsing(Closure $callback): static
    {
        $this->searchUsing = $callback;
        $this->searchable = true;

        return $this;
    }

    /**
     * Return the options for the given values, so selected values show their
     * label and submitted values are checked against real records.
     *
     * @param  Closure(array<int, mixed>): mixed  $callback
     */
    public function selectedOptionsUsing(Closure $callback): static
    {
        $this->selectedOptionsUsing = $callback;

        return $this;
    }

    public function isRemote(): bool
    {
        return $this->searchUsing !== null;
    }

    /**
     * @return array<int, array{value: mixed, label: string, description: ?string, disabled: bool}>
     */
    public function getSearchResults(string $search): array
    {
        return $this->searchUsing ? Options::normalize(($this->searchUsing)($search)) : [];
    }

    /**
     * @param  array<int, mixed>  $values
     * @return array<int, array{value: mixed, label: string, description: ?string, disabled: bool}>
     */
    public function getSelectedOptions(array $values): array
    {
        $values = array_values(array_filter($values, fn (mixed $value): bool => $value !== null && $value !== ''));

        if ($values === []) {
            return [];
        }

        if ($this->selectedOptionsUsing) {
            return Options::normalize(($this->selectedOptionsUsing)($values));
        }

        $wanted = array_map('strval', $values);

        return array_values(array_filter(
            $this->getOptions(),
            fn (array $option): bool => in_array((string) $option['value'], $wanted, true),
        ));
    }

    public function prepareForForm(Form $form, mixed $value): void
    {
        $this->currentValue = $value;

        if ($this->isRemote()) {
            $this->search = [
                'url' => route('inertia-forms.search'),
                'token' => $form->formToken(),
                'field' => $this->name,
            ];
        }
    }

    public function emptyValue(): mixed
    {
        return $this->multiple ? [] : null;
    }

    public function formatValue(mixed $value): mixed
    {
        if ($this->multiple) {
            return array_map(
                fn (mixed $item): mixed => $item instanceof \BackedEnum ? $item->value : $item,
                array_values(collect($value)->all()),
            );
        }

        return parent::formatValue($value);
    }

    public function validationRules(): array
    {
        $valueRules = array_values(array_filter([$this->valueRule()]));

        if (! $this->multiple) {
            return [
                $this->name => [$this->required ? 'required' : 'nullable', ...$valueRules, ...$this->rules],
            ];
        }

        return [
            $this->name => [$this->required ? 'required' : 'nullable', 'array', ...$this->rules],
            "{$this->name}.*" => $valueRules,
        ];
    }

    protected function props(): array
    {
        $options = $this->isRemote()
            ? $this->getSelectedOptions($this->multiple ? collect($this->currentValue)->all() : [$this->currentValue])
            : $this->getOptions();

        return [
            'options' => $options,
            'multiple' => $this->multiple,
            'searchable' => $this->searchable,
            'search' => $this->search,
        ];
    }

    /**
     * Local options use `Rule::in`. Remote options are checked with
     * `selectedOptionsUsing()`; without it, add your own rule (e.g. `exists`).
     */
    protected function valueRule(): mixed
    {
        if (! $this->isRemote()) {
            return $this->inOptionsRule();
        }

        if (! $this->selectedOptionsUsing) {
            return null;
        }

        return function (string $attribute, mixed $value, Closure $fail): void {
            $known = array_map(fn (array $option): string => (string) $option['value'], $this->getSelectedOptions([$value]));

            if (! in_array((string) $value, $known, true)) {
                $fail('The selected :attribute is invalid.');
            }
        };
    }
}
