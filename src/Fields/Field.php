<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Concerns\HasAuthorization;
use Erag\InertiaForms\Concerns\HasVisibility;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\Support\Label;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Traits\Conditionable;
use Illuminate\Support\Traits\Macroable;
use Illuminate\Support\Traits\Tappable;
use JsonSerializable;

/**
 * @implements Arrayable<string, mixed>
 */
abstract class Field implements Arrayable, JsonSerializable
{
    use Conditionable;
    use HasAuthorization;
    use HasVisibility;
    use Macroable;
    use Tappable;

    protected ?string $label = null;

    protected ?string $help = null;

    protected ?string $placeholder = null;

    protected mixed $default = null;

    protected bool $hasDefault = false;

    protected bool $required = false;

    protected bool $disabled = false;

    protected bool $readonly = false;

    protected bool $autofocus = false;

    protected ?int $columnSpan = null;

    protected ?string $class = null;

    protected bool $clearWhenHidden = false;

    protected bool $clearable = false;

    /** @var array<int, string|ValidationRule|\Closure> */
    protected array $rules = [];

    final public function __construct(protected string $name) {}

    public static function make(string $name): static
    {
        return new static($name);
    }

    /**
     * The frontend component that renders this field.
     */
    abstract public function component(): string;

    public function getName(): string
    {
        return $this->name;
    }

    public function label(?string $label): static
    {
        $this->label = $label;

        return $this;
    }

    /**
     * A copy of the field under another name, keeping its label. Used for
     * fields nested inside a Blocks or Repeater item.
     */
    public function withName(string $name, ?string $label = null): static
    {
        $clone = clone $this;
        $clone->label = $label ?? $this->getLabel();
        $clone->name = $name;

        return $clone;
    }

    public function getLabel(): string
    {
        return $this->label ?? Label::fromName($this->name);
    }

    public function help(?string $help): static
    {
        $this->help = $help;

        return $this;
    }

    public function placeholder(?string $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function default(mixed $value): static
    {
        $this->default = $value;
        $this->hasDefault = true;

        return $this;
    }

    public function required(bool $required = true): static
    {
        $this->required = $required;

        return $this;
    }

    public function isRequired(): bool
    {
        return $this->required;
    }

    public function disabled(bool $disabled = true): static
    {
        $this->disabled = $disabled;

        return $this;
    }

    public function readonly(bool $readonly = true): static
    {
        $this->readonly = $readonly;

        return $this;
    }

    public function autofocus(bool $autofocus = true): static
    {
        $this->autofocus = $autofocus;

        return $this;
    }

    /**
     * How many columns of the parent fieldset grid this field spans.
     */
    public function columnSpan(?int $columns): static
    {
        $this->columnSpan = $columns;

        return $this;
    }

    /**
     * Extra CSS classes for the field wrapper.
     */
    public function class(?string $class): static
    {
        $this->class = $class;

        return $this;
    }

    /**
     * Reset the value to empty when the field becomes hidden in the browser.
     */
    public function clearWhenHidden(bool $clear = true): static
    {
        $this->clearWhenHidden = $clear;

        return $this;
    }

    /**
     * Show a clear (×) button that empties the value.
     */
    public function clearable(bool $clearable = true): static
    {
        $this->clearable = $clearable;

        return $this;
    }

    /**
     * Add validation rules on top of the rules the field generates itself.
     *
     * @param  string|array<int, string|ValidationRule|\Closure>  $rules
     */
    public function rules(string|array $rules): static
    {
        $this->rules = [...$this->rules, ...(is_string($rules) ? explode('|', $rules) : $rules)];

        return $this;
    }

    public function rule(string|ValidationRule|\Closure $rule): static
    {
        $this->rules[] = $rule;

        return $this;
    }

    /**
     * Whether the field contributes a value to the form data.
     */
    public function hasValue(): bool
    {
        return true;
    }

    /**
     * The value a field starts with when no default or bound value exists.
     */
    public function emptyValue(): mixed
    {
        return '';
    }

    public function initialValue(): mixed
    {
        return $this->hasDefault ? $this->formatValue(value($this->default)) : $this->emptyValue();
    }

    /**
     * Convert a bound model value into what the browser control expects.
     */
    public function formatValue(mixed $value): mixed
    {
        if ($value instanceof \BackedEnum) {
            return $value->value;
        }

        return $value ?? $this->emptyValue();
    }

    /**
     * Rules generated from the field configuration, like `email` or `in:...`.
     *
     * @return array<int, mixed>
     */
    protected function typeRules(): array
    {
        return [];
    }

    /**
     * Validation rules keyed by attribute (supports `name.*` for arrays).
     *
     * @return array<string, array<int, mixed>>
     */
    public function validationRules(): array
    {
        return [
            $this->name => [
                $this->required ? 'required' : 'nullable',
                ...$this->typeRules(),
                ...$this->rules,
            ],
        ];
    }

    /**
     * Rules for the current form data. Fields whose rules depend on the
     * submitted values (like Blocks items) override this.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, array<int, mixed>>
     */
    public function validationRulesFor(array $data): array
    {
        return $this->validationRules();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    public function validationAttributesFor(array $data): array
    {
        return $this->validationAttributes();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    public function validationMessagesFor(array $data): array
    {
        return $this->validationMessages();
    }

    /**
     * Called by the form right before it is serialized, with the field's
     * current value. Fields that load extra data (like remote options) use it.
     */
    public function prepareForForm(Form $form, mixed $value): void {}

    /**
     * Whether the field sends files, so the form is submitted as multipart.
     */
    public function hasFiles(): bool
    {
        return false;
    }

    /**
     * Attribute names used in validation messages, keyed by rule attribute.
     *
     * @return array<string, string>
     */
    public function validationAttributes(): array
    {
        return [
            $this->name => $this->getLabel(),
            "{$this->name}.*" => $this->getLabel(),
        ];
    }

    /**
     * Custom validation messages for this field, keyed by `attribute.rule`.
     *
     * @return array<string, string>
     */
    public function validationMessages(): array
    {
        return [];
    }

    /**
     * Convert a validated value into what `$form->validated()` returns.
     */
    public function dehydrateValue(mixed $value): mixed
    {
        return $value;
    }

    /**
     * Component specific props sent to the frontend.
     *
     * @return array<string, mixed>
     */
    protected function props(): array
    {
        return [];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'component' => $this->component(),
            'name' => $this->name,
            'label' => $this->getLabel(),
            'help' => $this->help,
            'placeholder' => $this->placeholder,
            'required' => $this->required,
            'disabled' => $this->disabled,
            'readonly' => $this->readonly,
            'autofocus' => $this->autofocus,
            'columnSpan' => $this->columnSpan,
            'class' => $this->class,
            'visibility' => $this->serializeVisibility(),
            'clearWhenHidden' => $this->clearWhenHidden,
            'clearable' => $this->clearable,
            'emptyValue' => $this->emptyValue(),
            ...$this->props(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
