# Inertia Forms

Define your Laravel forms in PHP. Render them in **Vue**, **React**, or **Svelte** with one component.

```php
class CreateUserForm extends Form
{
    protected ?string $actionRoute = 'users.store';

    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            Select::make('role')->options(Role::class),
            Submit::make('Create user'),
        ];
    }
}
```

```php
// Controller
return Inertia::render('Users/Create', ['form' => CreateUserForm::make()]);

public function store(#[Validate] CreateUserForm $form)
{
    User::create($form->validated());

    return to_route('users.index');
}
```

```vue
<!-- Vue -->
<Form :form="form" />
```

```tsx
// React
<Form form={form} />
```

```svelte
<!-- Svelte -->
<Form {form} />
```

Labels, inputs, validation rules, error messages, conditional fields, file uploads, and the submit request are all wired up for you.

## Packages

| Package | Install |
| --- | --- |
| Laravel | `composer require erag/inertia-forms` |
| Vue 3.5+ | `npm install @erag/inertia-forms-vue` |
| React 19 | `npm install @erag/inertia-forms-react` |
| Svelte 5 | `npm install @erag/inertia-forms-svelte` |

After `composer require`, run the installer. It publishes the config and the form stub, and prints the frontend steps:

```bash
php artisan erag:install-inertia-forms
```

Requires Laravel 13, Inertia 3, PHP 8.3+, and Tailwind CSS 4. Tell Tailwind to scan the package you installed:

```css
/* resources/css/app.css */
@source "../../node_modules/@erag/inertia-forms-vue/dist";
```

## Features

- **Forms in PHP** — one class holds fields, layout, validation, and the submit route.
- **14 fields** — text, textarea, hidden, select (native or searchable, single or multiple), radio, checkbox, checkbox group, toggle, date, time, color, slider, file upload, submit.
- **Validation from the fields** — `required()`, `email()`, `maxLength()`, options, file types, and more become Laravel rules. Validate with `#[Validate]`.
- **Conditional fields** — `visibleWhen('contact_method', 'phone')` works in the browser and in validation.
- **Authorization** — `authorizedWhen()` removes fields (and their rules) for users who should not see them.
- **Model binding** — `->bind($user)` fills the form from a model or array.
- **Fieldsets and grid layout** — group fields, add legends, and use columns.
- **Custom fields** — add your own PHP field and register its component in the frontend.
- **Accessible and themeable** — labels, `aria-*`, focus handling, dark mode, Tailwind classes.
- **200+ icons, no icon library** — `Submit::make('Launch')->icon('rocket')`. Icons are sent as SVG only when used, and you can register your own.

## Documentation

**[https://erag.in/laravel-inertia-forms/](https://erag.in/laravel-inertia-forms/)**

## Development

```bash
composer install && vendor/bin/pest     # PHP package
npm install && npm run build            # frontend packages
npm test                                # shared visibility engine tests
```

## Credits

- **[Er Amit Gupta](https://github.com/eramitgupta)** — creator and maintainer
- **[All contributors](https://github.com/erag-labs/laravel-Inertia-forms/graphs/contributors)**

## Support

- Report bugs and request features in [GitHub issues](https://github.com/erag-labs/laravel-Inertia-forms/issues).
- Report security issues privately, as described in [SECURITY.md](SECURITY.md).
- If the package saves you time, [sponsor the project](https://github.com/sponsors/eramitgupta) or give it a ⭐ on GitHub.

## License

MIT © ERAG. See [LICENSE](LICENSE).
