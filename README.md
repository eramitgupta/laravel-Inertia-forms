<div align="center">

# Laravel Inertia Forms

**Define Laravel forms in PHP. Render them in Vue, React, or Svelte with one `<Form>` component.**

Write the fields, layout, and validation once in a Laravel class. The same class draws the form in the browser and validates the request on the server, so you never repeat labels, rules, or error handling again.

[Documentation](https://erag.in/laravel-inertia-forms/) · [Live Demo](https://erag.in/laravel-inertia-forms/demo.html) · [Sponsor](https://github.com/sponsors/eramitgupta)

</div>

## Features

- 🧩 **Forms in PHP** — one class holds the fields, layout, validation, and submit route.
- 📝 **22 fields** — text, textarea, hidden, combobox (searchable, multiple, server search), radio, checkbox, checkbox group, toggle, date and date range, time, color, slider, file upload, tags, key-value, repeater, blocks, link, slug, one-time code, chat composer, and submit buttons, plus headings, text, callouts and separators.
- ⚡ **Vue, React and Svelte** — the same PHP class renders in all three, built on one shared core with no runtime dependencies.
- ✅ **Validation from the fields** — `required()`, `email()`, options, file types, and more become Laravel rules. Validate with `#[Validate]`.
- 👁️ **Conditional fields** — `visibleWhen()` and `hiddenWhen()` work in the browser and in validation.
- 🔐 **Authorization** — `authorizedWhen()` removes fields, and their rules, for users who should not see them.
- 🔗 **Model binding** — `->bind($user)` fills an edit form from a model or array.
- 🪜 **Wizards** — multi-step forms with a stepper, each step checked on the server.
- 📐 **Fieldsets and grid layout** — group fields, add legends and icons, and use columns.
- 🎯 **Several actions** — submit buttons with variants, sizes, icons and `intent()`, plus `disableUntilDirty()` for unsaved changes.
- 🎨 **200+ icons, no icon library** — `icon('rocket')`, sent as SVG only when used. Register your own with `Icon::register()`.
- 🧱 **Custom fields** — add your own PHP field and its Vue, React or Svelte component.
- 🌗 **Accessible and themeable** — labels, `aria-*`, focus handling, dark mode, accent colors, Tailwind CSS 4.
- 🤖 **Artisan and AI ready** — `erag:install-inertia-forms`, `make:form`, and Laravel Boost guidelines with a skill for AI agents.

## Documentation

**[https://erag.in/laravel-inertia-forms/](https://erag.in/laravel-inertia-forms/)**

## Support

- 🐞 **Bugs and ideas** — open a [GitHub issue](https://github.com/erag-labs/laravel-Inertia-forms/issues).
- 🔒 **Security issues** — report them privately, as described in [SECURITY.md](SECURITY.md).
- ⭐ **Like it?** — [star the repository](https://github.com/erag-labs/laravel-Inertia-forms) so more Laravel developers find it.

## Sponsorship

Laravel Inertia Forms is free and open source. If it saves you time, please consider sponsoring its development:

**[💖 Sponsor Amit Gupta on GitHub](https://github.com/sponsors/eramitgupta)**

Sponsors keep the package maintained, documented, and growing.
