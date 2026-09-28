## Inertia Forms (erag/inertia-forms)

Forms are defined in one PHP class and rendered by one `<Form>` component in Vue, React or Svelte. Never hand-write inputs, form state, or error handling for a form that can be a form class.

- Create a form with `php artisan make:form CreateUserForm` (in `app/Forms`). Fields go in `fields()`; set the submit target with `protected ?string $actionRoute = 'users.store';` (or `route()` / `url()`).
- Pass it to the page with `CreateUserForm::make()` (edit forms: `EditUserForm::make()->bind($user)`), render it with `<Form :form="form" />` (Vue), `<Form form={form} />` (React) or `<Form {form} />` (Svelte).
- Validate with the `#[Validate]` attribute on the controller parameter and save only `$form->validated()`, never `$request->all()`.
- Rules come from the fields (`required()`, `email()`, `maxLength()`, options, file types); add more with `rules([...])`.
- `visibleWhen()` / `hiddenWhen()` only change the UI and skip hidden fields in validation. Use `authorizedWhen()` / `authorize()` for fields a user must never see or submit.
- Icons: `icon('rocket')` on `Submit`, `Fieldset` (wizard steps) and `Callout`. Over 200 names are built in; add more with `Icon::register()` or `config('inertia-forms.icons')`.

@verbatim
<code-snippet name="A form class and its controller" lang="php">
class CreateUserForm extends Form
{
    protected ?string $actionRoute = 'users.store';

    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            Combobox::make('role')->options(Role::class),
            TextInput::make('company')->visibleWhen('role', 'client'),
            Submit::make('Create user')->icon('userPlus'),
        ];
    }
}

public function store(#[Validate] CreateUserForm $form): RedirectResponse
{
    User::create($form->validated());

    return to_route('users.index');
}
</code-snippet>
@endverbatim

Use the `inertia-forms-development` skill for the full field list, layout, wizards, uploads and custom fields. Full docs: https://erag.in/laravel-inertia-forms/llms.txt
