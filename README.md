 <div align="center">

# Laravel Inertia Forms

[![Packagist License](https://img.shields.io/badge/License-MIT-blue)](https://github.com/eramitgupta/laravel-Inertia-forms/blob/main/LICENSE)
[![Latest Stable Version](https://img.shields.io/packagist/v/erag/inertia-forms?label=Stable)](https://packagist.org/packages/erag/inertia-forms)
[![Laravel Compatibility](https://badge.laravel.cloud/badge/erag/inertia-forms)](https://packagist.org/packages/erag/inertia-forms)
[![Total Downloads](https://img.shields.io/packagist/dt/erag/inertia-forms.svg?label=Downloads)](https://packagist.org/packages/erag/inertia-forms)

[![Vue](https://img.shields.io/npm/v/@erag/inertia-forms-vue?label=Vue&color=42b883)](https://www.npmjs.com/package/@erag/inertia-forms-vue)
[![React](https://img.shields.io/npm/v/@erag/inertia-forms-react?label=React&color=61dafb)](https://www.npmjs.com/package/@erag/inertia-forms-react)
[![Svelte](https://img.shields.io/npm/v/@erag/inertia-forms-svelte?label=Svelte&color=ff3e00)](https://www.npmjs.com/package/@erag/inertia-forms-svelte)

**Build forms in Laravel using PHP and render them in Vue, React, or Svelte with a single `<Form>` component.**

Define your fields, layout, and validation rules in Laravel. The package handles rendering and validation, so you don't have to build and maintain the same form logic separately on the frontend.

Whether you're creating a simple contact form or a multi-step wizard, Laravel Inertia Forms helps you build forms with less repetitive code.

[Documentation](https://erag.in/laravel-inertia-forms/) · [Live Demo](https://erag.in/laravel-inertia-forms/demo.html) · [Demo Apps](#demo-apps) · [Sponsor](https://github.com/sponsors/eramitgupta)

</div>

---

## Why Laravel Inertia Forms?

Building forms with Laravel and a JavaScript frontend often means managing the same information in multiple places.

You define the fields in your frontend components, write validation rules in Laravel, handle errors, and keep everything in sync whenever something changes.

Laravel Inertia Forms takes a different approach.

You define your form in PHP, and the package takes care of rendering it in Vue, React, or Svelte. Your validation rules stay in Laravel, and the frontend handles displaying fields, errors, and user interactions.

This makes forms easier to build, update, and maintain, especially as your application grows.

## Features

- 🧩 **Define forms in PHP** — Keep your fields, layout, validation, and submit route together in one Laravel class.
- 📝 **22 field types** — Includes text, textarea, hidden, combobox, radio, checkbox, checkbox group, toggle, date, date range, time, color, slider, file upload, tags, key-value, repeater, blocks, link, slug, one-time code, chat composer, and submit buttons. You can also add headings, text, callouts, and separators.
- ⚡ **Vue, React, and Svelte support** — Use the same Laravel form definition with any of the three frontend frameworks.
- ✅ **Laravel validation** — Define rules directly on your fields using methods like `required()` and `email()`, and validate requests with `#[Validate]`.
- 👁️ **Conditional fields** — Show or hide fields based on other values using `visibleWhen()` and `hiddenWhen()`. Conditions also apply during validation.
- 🔐 **Field authorization** — Control which fields users can access with `authorizedWhen()`. Unauthorized fields and their validation rules are excluded.
- 🔗 **Model binding** — Use `->bind($user)` to populate forms from an existing model or array.
- 🪜 **Multi-step forms** — Build wizards with a stepper and server-side validation for each step.
- 📐 **Flexible layouts** — Organize forms using fieldsets, grid columns, legends, and icons.
- 🎯 **Multiple form actions** — Add submit buttons with different styles, sizes, icons, and `intent()` values. Use `disableUntilDirty()` when an action should only be available after changes.
- 🎨 **200+ built-in icons** — Use icons without installing a separate icon library. Only the SVG icons you use are sent to the frontend. Custom icons can be registered with `Icon::register()`.
- 🧱 **Custom fields** — Create your own PHP field types and corresponding Vue, React, or Svelte components.
- 🌗 **Accessible and customizable** — Supports labels, ARIA attributes, focus handling, dark mode, accent colors, and Tailwind CSS 4.
- 🤖 **Developer tools and AI support** — Includes Artisan commands, Laravel Boost guidelines, and a skill to help AI coding agents work with the package.

---

## Installation

First, install the Laravel package using Composer:

```bash
composer require erag/inertia-forms
```

Run the installation command:

```bash
php artisan erag:install-inertia-forms
```

Next, install the frontend package for the framework you're using.

**Vue**

```bash
npm install @erag/inertia-forms-vue
```

**React**

```bash
npm install @erag/inertia-forms-react
```

**Svelte**

```bash
npm install @erag/inertia-forms-svelte
```

You only need the frontend package for your chosen framework.

For setup instructions and usage examples, check the [official documentation](https://erag.in/laravel-inertia-forms/).

---

## How It Works

Laravel Inertia Forms connects your Laravel form definitions with frontend components.

The general workflow is simple:

1. **Define your form in Laravel.** Add the fields, validation rules, layout, and submission details in PHP.
2. **Render it on the frontend.** Use the `<Form>` component in Vue, React, or Svelte.
3. **Handle user input.** The frontend takes care of displaying the fields and handling interactions.
4. **Validate with Laravel.** Validation rules defined in your form are used when processing the request.
5. **Display validation errors.** The form can show errors returned from Laravel without manually rebuilding the validation logic.

You can also use the same form definition for editing existing records, conditional fields, and multi-step workflows.

The idea is to keep your form logic in one place while letting your frontend framework handle the user interface.

---

## Built for Different Types of Forms

Not every form is a simple collection of text inputs.

Some forms need searchable dropdowns, file uploads, repeated groups of fields, or multiple steps.

Laravel Inertia Forms supports these use cases without requiring you to write a completely separate form system.

### Conditional Fields

Use `visibleWhen()` and `hiddenWhen()` to control which fields appear based on the values entered by the user.

These conditions also affect validation, so hidden fields don't have to be handled separately.

### Multi-Step Forms

Break longer forms into smaller steps using the built-in wizard support.

Each step can be validated on the server before moving forward.

### Model Binding

When editing existing data, use `->bind($user)` to populate the form from your model.

This allows you to reuse form definitions instead of maintaining separate structures for creating and editing records.

### Custom Fields

If the built-in fields don't cover your requirements, you can create custom field types and their frontend components.

This lets you extend the package while keeping the same form-building approach.

---

## Translations

Text is translated in two places, depending on who renders it.

### Laravel: package messages

Validation messages and attribute names that the package writes itself (a required Composer, KeyValue rows, Link schemes, Slug and OTP formats, and so on) live in a language file under the `inertia-forms` namespace. Publish it and edit the copy for each locale:

```bash
php artisan vendor:publish --tag=inertia-forms-lang
```

This copies the English file to `lang/vendor/inertia-forms/en/inertia-forms.php`. Add `lang/vendor/inertia-forms/nl/inertia-forms.php` (and so on) with the keys you want to change; missing keys fall back to the package's English.

```php
// lang/vendor/inertia-forms/nl/inertia-forms.php
return [
    'fields' => [
        'composer' => [
            'required' => 'Schrijf een bericht of voeg een bestand toe.',
        ],
    ],
];
```

### Frontend: component text

Buttons, placeholders, empty states, aria labels, calendar names and the other text the components render are translated in the browser. Call `setTranslations()` once, for example in your app entry file. It merges your text over the English defaults, and calling it again (say, after the user switches language) updates every rendered form.

```ts
import { setTranslations, type TranslationValue } from '@erag/inertia-forms-react'; // or -vue / -svelte

setTranslations({
    action_cancel: 'Annuleren',
    action_delete: 'Verwijderen',
    file_upload_click_to_upload: 'Klik om te uploaden',
    option_no_results: 'Geen resultaten gevonden',
    repeater_add: ':name toevoegen',
});
```

Replacement tokens work like Laravel's: `:name` is replaced as is, `:Name` with a capital first letter and `:NAME` in upper case. A value can also be a function that receives the parameters, which is handy for number formatting or plural rules:

```ts
const wizardProgress: TranslationValue = ({ current, total }) => {
    const number = new Intl.NumberFormat('nl-NL');
    return `Stap ${number.format(Number(current))} van ${number.format(Number(total))}`;
};

setTranslations({ wizard_progress: wizardProgress });
```

`resetTranslations()` goes back to English, a key you leave out keeps its English default, and a key the package does not know shows the key itself. The full list of keys, their English defaults and parameters is in [`packages/core/TRANSLATION_KEYS.md`](packages/core/TRANSLATION_KEYS.md).

Built-in button text such as the wizard's Continue / Back, the Composer's Send, and the add buttons of Repeater, Blocks and KeyValue comes from these frontend keys unless you set your own in PHP (`addActionLabel()`, `sendLabel()`, `wizard(nextLabel: ...)`).

### Your own copy

Labels, placeholders, help text, step titles and other text you write in the form class belong to your app. Translate them with your app's own keys:

```php
TextInput::make('email')
    ->label(__('forms.contact.email'))
    ->placeholder(__('forms.contact.email_placeholder'));
```

---

## Documentation

The documentation covers installation, form definitions, validation, conditional fields, authorization, layouts, custom components, and more.

**[Read the Official Documentation →](https://erag.in/laravel-inertia-forms/)**

You can also explore the [Live Demo](https://erag.in/laravel-inertia-forms/demo.html) to see the available fields and form features in action.

---

## Demo Apps

Want to see how Laravel Inertia Forms works in a real application?

I've created separate demo applications for Vue, React, and Svelte using **Laravel 13 and Inertia 3**.

Each demo includes 15 real-world forms with CRUD operations, search, file uploads, custom fields, and Pest tests.

You can clone a demo project, explore the implementation, and see how forms are organized in an actual Laravel application.

| Framework | Repository |
|---|---|
| ⚛️ React | [Laravel Inertia Forms — React Demo](https://github.com/eramitgupta/demo-Inertia-forms-react) |
| 💚 Vue | [Laravel Inertia Forms — Vue Demo](https://github.com/eramitgupta/demo-Inertia-forms-vue) |
| 🧡 Svelte | [Laravel Inertia Forms — Svelte Demo](https://github.com/eramitgupta/demo-Inertia-forms-savlte) |

---

## Support

If Laravel Inertia Forms is useful in your project, consider giving the repository a star.

It helps other Laravel developers discover the package and supports its continued development.

⭐ **[Star Laravel Inertia Forms on GitHub](https://github.com/eramitgupta/laravel-Inertia-forms)**

---

## Sponsorship

Laravel Inertia Forms is free and open source.

I maintain the package and work on improving its features, documentation, and developer experience.

If the package saves you time or makes your development workflow easier, you can support the project through GitHub Sponsors.

**[💖 Sponsor on GitHub](https://github.com/sponsors/eramitgupta)**

Your support helps me continue maintaining and improving this project for the Laravel community.

---

## License

MIT License © [eramitgupta](https://github.com/eramitgupta)
