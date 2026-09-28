<?php

namespace Erag\InertiaForms;

use Erag\InertiaForms\Concerns\HasAuthorization;
use Erag\InertiaForms\Fields\Field;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Traits\Conditionable;
use Illuminate\Support\Traits\Tappable;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use JsonSerializable;
use LogicException;

/**
 * @implements Arrayable<string, mixed>
 */
abstract class Form implements Arrayable, JsonSerializable
{
    use Conditionable;
    use HasAuthorization;
    use Tappable;

    /**
     * Named route the form submits to. The HTTP method is read from the route.
     */
    protected ?string $actionRoute = null;

    /** @var array<string, mixed> */
    protected array $actionRouteParameters = [];

    /**
     * Raw URL the form submits to, used when no named route is set.
     */
    protected ?string $actionUrl = null;

    /**
     * Explicit HTTP method. Ignored for named routes, which declare their own.
     */
    protected ?string $method = null;

    /**
     * Scroll to the first invalid field after a failed submission.
     */
    protected bool $scrollToFirstError = true;

    /**
     * Reset the form data after a successful submission.
     */
    protected bool $resetOnSuccess = false;

    protected ?string $class = null;

    /**
     * Accent color for buttons, focus rings, and selected states, like `#e11d48`.
     */
    protected ?string $accent = null;

    /**
     * Show one fieldset at a time as a step, with Back / Continue buttons.
     */
    protected bool $wizard = false;

    protected string $wizardNextLabel = 'Continue';

    protected string $wizardBackLabel = 'Back';

    /** @var Model|array<string, mixed>|null */
    protected Model|array|null $model = null;

    /** @var array<string, mixed> */
    protected array $validated = [];

    /** @var array<int, Field|Fieldset>|null */
    private ?array $resolvedFields = null;

    /**
     * The fields (and fieldsets) that make up the form.
     *
     * @return array<int, Field|Fieldset>
     */
    abstract public function fields(): array;

    public static function make(mixed ...$arguments): static
    {
        return new static(...$arguments);
    }

    /**
     * Submit to a named route with parameters.
     *
     * @param  array<string, mixed>|mixed  $parameters
     */
    public function route(string $name, mixed $parameters = []): static
    {
        $this->actionRoute = $name;
        $this->actionRouteParameters = Arr::wrap($parameters);

        return $this;
    }

    public function url(string $url): static
    {
        $this->actionRoute = null;
        $this->actionUrl = $url;

        return $this;
    }

    public function method(string $method): static
    {
        $this->method = strtolower($method);

        return $this;
    }

    public function post(): static
    {
        return $this->method('post');
    }

    public function put(): static
    {
        return $this->method('put');
    }

    public function patch(): static
    {
        return $this->method('patch');
    }

    public function delete(): static
    {
        return $this->method('delete');
    }

    /**
     * Fill the initial values from a model or array.
     *
     * @param  Model|array<string, mixed>  $model
     */
    public function bind(Model|array $model): static
    {
        $this->model = $model;
        $this->resolvedFields = null;

        return $this;
    }

    public function getModel(): Model|array|null
    {
        return $this->model;
    }

    public function getAction(): ?string
    {
        if ($this->actionRoute !== null) {
            return route($this->actionRoute, $this->actionRouteParameters);
        }

        return $this->actionUrl;
    }

    public function getMethod(): string
    {
        if ($this->actionRoute !== null) {
            $route = app('router')->getRoutes()->getByName($this->actionRoute);
            $method = collect($route?->methods() ?? [])->first(fn (string $method): bool => $method !== 'HEAD');

            if ($method !== null) {
                return strtolower($method);
            }
        }

        return $this->method ?? 'post';
    }

    /**
     * Authorized top-level fields and fieldsets.
     *
     * @return array<int, Field|Fieldset>
     */
    public function getFields(): array
    {
        return $this->resolvedFields ??= array_values(array_filter(
            $this->fields(),
            function (mixed $item): bool {
                if (! $item instanceof Field && ! $item instanceof Fieldset) {
                    throw new LogicException(static::class.'::fields() must only return fields and fieldsets.');
                }

                return $item->isAuthorized();
            },
        ));
    }

    /**
     * Group loose fields into anonymous fieldsets so the frontend always
     * renders a list of fieldsets.
     *
     * @return array<int, Fieldset>
     */
    public function getFieldsets(): array
    {
        $fieldsets = [];
        $loose = [];

        foreach ($this->getFields() as $item) {
            if ($item instanceof Field) {
                $loose[] = $item;

                continue;
            }

            if ($loose !== []) {
                $fieldsets[] = Fieldset::make()->fields($loose);
                $loose = [];
            }

            $fieldsets[] = $item;
        }

        if ($loose !== []) {
            $fieldsets[] = Fieldset::make()->fields($loose);
        }

        return $fieldsets;
    }

    /**
     * Every authorized field that carries a value, with the fieldset it lives in.
     *
     * @return array<int, array{field: Field, fieldset: Fieldset}>
     */
    protected function valueFields(): array
    {
        $entries = [];

        foreach ($this->getFieldsets() as $fieldset) {
            foreach ($fieldset->getFields() as $field) {
                if ($field->hasValue()) {
                    $entries[] = ['field' => $field, 'fieldset' => $fieldset];
                }
            }
        }

        return $entries;
    }

    public function getField(string $name): ?Field
    {
        foreach ($this->valueFields() as $entry) {
            if ($entry['field']->getName() === $name) {
                return $entry['field'];
            }
        }

        return null;
    }

    /**
     * Initial form values from the bound model, defaults, or empty values.
     *
     * @return array<string, mixed>
     */
    public function data(): array
    {
        $data = [];

        foreach ($this->valueFields() as ['field' => $field]) {
            $name = $field->getName();
            $value = $this->hasBoundValue($name)
                ? $field->formatValue(data_get($this->model, $name))
                : $field->initialValue();

            data_set($data, $name, $value);
        }

        return $data;
    }

    protected function hasBoundValue(string $name): bool
    {
        if ($this->model === null) {
            return false;
        }

        if (is_array($this->model)) {
            return Arr::has($this->model, $name);
        }

        return data_get($this->model, $name) !== null
            || array_key_exists(explode('.', $name)[0], $this->model->getAttributes());
    }

    /**
     * Validation rules for the fields visible with the given data.
     *
     * @param  array<string, mixed>|null  $data
     * @return array<string, array<int, mixed>>
     */
    public function rules(?array $data = null): array
    {
        $data ??= $this->data();
        $rules = [];

        foreach ($this->valueFields() as ['field' => $field, 'fieldset' => $fieldset]) {
            if ($fieldset->isVisibleFor($data) && $field->isVisibleFor($data)) {
                $rules = [...$rules, ...$field->validationRulesFor($data)];
            }
        }

        return [...$rules, ...$this->intentRules()];
    }

    /**
     * Submit buttons with `intent()` send their value; accept only those values.
     *
     * @return array<string, array<int, mixed>>
     */
    protected function intentRules(): array
    {
        $intents = [];

        foreach ($this->getFieldsets() as $fieldset) {
            foreach ($fieldset->getFields() as $field) {
                if ($field instanceof Submit && ($intent = $field->getIntent()) !== null) {
                    $intents[$intent['key']][] = $intent['value'];
                }
            }
        }

        return array_map(fn (array $values): array => ['nullable', 'string', Rule::in(array_values(array_unique($values)))], $intents);
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [];
    }

    /**
     * Custom attribute names. Field labels are used by default.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [];
    }

    /**
     * Field messages, overridden by the form's own `messages()`.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    protected function validationMessages(array $data = []): array
    {
        $messages = [];

        foreach ($this->valueFields() as ['field' => $field]) {
            $messages = [...$messages, ...$field->validationMessagesFor($data)];
        }

        return [...$messages, ...$this->messages()];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    protected function validationAttributes(array $data = []): array
    {
        $attributes = [];

        foreach ($this->valueFields() as ['field' => $field]) {
            $attributes = [...$attributes, ...$field->validationAttributesFor($data)];
        }

        return [...$attributes, ...$this->attributes()];
    }

    /**
     * Validate the request against the visible fields and return the validated data.
     *
     * @return array<string, mixed>
     *
     * @throws ValidationException
     * @throws AuthorizationException
     */
    public function validate(?Request $request = null): array
    {
        if (! $this->isAuthorized()) {
            throw new AuthorizationException;
        }

        $request ??= request();
        $input = $request->all();
        $state = [...$this->data(), ...$input];

        $validated = Validator::make(
            $input,
            $this->rules($state),
            $this->validationMessages($state),
            $this->validationAttributes($state),
        )->validate();

        foreach ($this->valueFields() as ['field' => $field]) {
            if (Arr::has($validated, $field->getName())) {
                Arr::set($validated, $field->getName(), $field->dehydrateValue(Arr::get($validated, $field->getName())));
            }
        }

        return $this->validated = $validated;
    }

    /**
     * Data from the last successful `validate()` call.
     */
    public function validated(?string $key = null, mixed $default = null): mixed
    {
        return $key === null ? $this->validated : data_get($this->validated, $key, $default);
    }

    /**
     * Encrypted class name that lets the package endpoints (option search,
     * wizard step validation) rebuild this form.
     */
    public function formToken(): string
    {
        return Crypt::encryptString(static::class);
    }

    public function hasFiles(): bool
    {
        foreach ($this->valueFields() as ['field' => $field]) {
            if ($field->hasFiles()) {
                return true;
            }
        }

        return false;
    }

    public function scrollToFirstError(bool $scroll = true): static
    {
        $this->scrollToFirstError = $scroll;

        return $this;
    }

    public function resetOnSuccess(bool $reset = true): static
    {
        $this->resetOnSuccess = $reset;

        return $this;
    }

    /**
     * Turn the form into a multi-step wizard: every fieldset becomes a step.
     * Continue checks the current step's fields on the server before moving on.
     */
    public function wizard(bool $wizard = true, ?string $nextLabel = null, ?string $backLabel = null): static
    {
        $this->wizard = $wizard;
        $this->wizardNextLabel = $nextLabel ?? $this->wizardNextLabel;
        $this->wizardBackLabel = $backLabel ?? $this->wizardBackLabel;

        return $this;
    }

    public function isWizard(): bool
    {
        return $this->wizard;
    }

    /**
     * The fieldsets shown as wizard steps for the given data: visible fieldsets
     * with at least one field that isn't a Submit button.
     *
     * @param  array<string, mixed>  $data
     * @return array<int, Fieldset>
     */
    public function wizardSteps(array $data): array
    {
        return array_values(array_filter(
            $this->getFieldsets(),
            fn (Fieldset $fieldset): bool => $fieldset->isVisibleFor($data)
                && collect($fieldset->getFields())->contains(fn (Field $field): bool => ! $field instanceof Submit),
        ));
    }

    /**
     * Validate only the fields of one wizard step. File fields are skipped
     * here and checked when the whole form is submitted.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     * @throws AuthorizationException
     */
    public function validateStep(int $step, array $data): void
    {
        if (! $this->isAuthorized()) {
            throw new AuthorizationException;
        }

        $fieldset = $this->wizardSteps($data)[$step] ?? null;

        if ($fieldset === null) {
            return;
        }

        $state = [...$this->data(), ...$data];
        $rules = [];

        foreach ($fieldset->getFields() as $field) {
            if ($field->hasValue() && ! $field->hasFiles() && $field->isVisibleFor($state)) {
                $rules = [...$rules, ...$field->validationRulesFor($state)];
            }
        }

        Validator::make($data, $rules, $this->validationMessages($state), $this->validationAttributes($state))->validate();
    }

    public function accent(?string $color): static
    {
        $this->accent = $color;

        return $this;
    }

    public function class(?string $class): static
    {
        $this->class = $class;

        return $this;
    }

    /**
     * @return array<string, mixed>
     *
     * @throws AuthorizationException
     */
    public function toArray(): array
    {
        if (! $this->isAuthorized()) {
            if (config('inertia-forms.throw_on_unauthorized', false)) {
                throw new AuthorizationException;
            }

            return [
                'action' => null,
                'method' => 'post',
                'fieldsets' => [],
                'data' => [],
                'hasFiles' => false,
                'scrollToFirstError' => false,
                'resetOnSuccess' => false,
                'class' => null,
                'accent' => null,
                'wizard' => null,
            ];
        }

        $data = $this->data();

        foreach ($this->valueFields() as ['field' => $field]) {
            $field->prepareForForm($this, data_get($data, $field->getName()));
        }

        return [
            'action' => $this->getAction(),
            'method' => $this->getMethod(),
            'fieldsets' => array_map(fn (Fieldset $fieldset): array => $fieldset->toArray(), $this->getFieldsets()),
            'data' => $data,
            'hasFiles' => $this->hasFiles(),
            'scrollToFirstError' => $this->scrollToFirstError,
            'resetOnSuccess' => $this->resetOnSuccess,
            'class' => $this->class,
            'accent' => $this->accent,
            'wizard' => $this->wizard ? [
                'nextLabel' => $this->wizardNextLabel,
                'backLabel' => $this->wizardBackLabel,
                'validateUrl' => route('inertia-forms.validate-step'),
                'token' => $this->formToken(),
            ] : null,
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
