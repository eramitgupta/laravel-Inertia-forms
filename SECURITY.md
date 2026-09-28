# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.x (latest release) | ✅ Security fixes |
| Older releases | ❌ Please upgrade |

Security fixes ship in a new release of the latest version. Keep Laravel, Inertia, your frontend framework and this package up to date.

This policy covers every package in this repository: `erag/inertia-forms` (Packagist) and `@erag/inertia-forms-vue`, `@erag/inertia-forms-react` and `@erag/inertia-forms-svelte` (npm).

## Reporting a vulnerability

**Please do not report security issues in public issues, discussions or pull requests.**

1. Go to the repository's [Security tab](https://github.com/eramitgupta/laravel-Inertia-forms/security).
2. Choose **Report a vulnerability** to open a private report that only the maintainers can see.
3. Include:
   - the affected package and version, plus your Laravel, PHP and frontend versions
   - the type of issue and its possible impact
   - steps to reproduce, or a small proof of concept
   - any fix or workaround you know of

Leave out real credentials, tokens and personal data.

### What happens next

- We aim to acknowledge your report within **48 hours**.
- We confirm the issue, work on a fix, and keep you updated in the private report.
- When the fix is released, we publish a security advisory and credit you, unless you prefer to stay anonymous.

Please give us time to release a fix before you disclose the issue publicly.

## Using the package safely

### Always validate on the server

- Hidden, disabled and read-only states in the browser are for the user interface only. Validate every request with `#[Validate]` or `$form->validate()`.
- Save only `$form->validated()`, never `$request->all()`. Unknown fields, hidden fields and fields the user is not authorized to see are left out of it.

### Visibility is not permission

- `visibleWhen()` and `hiddenWhen()` only show or hide fields. Use `authorize()` or `authorizedWhen()` for fields, fieldsets or forms a user must never see or submit; their rules are removed too.

### Package endpoints

The package registers two small endpoints. Both only accept your own form classes (the class name is encrypted in the page), return `404` for anything else, and run the form's authorization checks.

| Endpoint | Used by | Config key |
| --- | --- | --- |
| `POST _inertia-forms/search` | `Combobox::searchUsing()` (server search) | `inertia-forms.search.middleware` |
| `POST _inertia-forms/validate-step` | Wizard forms (step checks) | `inertia-forms.wizard.middleware` |

- Both use the `web` and `throttle:60,1` middleware by default. Add `auth`, or your own middleware, when the options or the form are private.
- In `searchUsing()`, return only the columns you want to show, and limit the query.
- The step check validates the data only; it never saves anything.

### Raw HTML and SVG

- `Html::make()` renders its content as raw HTML. Only pass markup you wrote yourself, **never user input**, or you open your app to cross-site scripting (XSS). Use `Text::make()`, `Heading::make()` or `Callout::make()` for text; they escape it.
- Icons registered with `Icon::register()` or `config('inertia-forms.icons')` are rendered as SVG markup. The package rejects scripts, event handlers and external references, but register only icons you trust, never icons from user input.

### File uploads

- Treat uploaded files as untrusted. Keep the type (`accept()`, `image()`) and size (`maxSize()`) rules on the field.
- Store uploads outside the public web root unless they are meant to be public, and never trust the original file name.
