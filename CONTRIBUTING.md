# Contributing

Thanks for helping improve Laravel Inertia Forms. Bug fixes, new fields, docs and ideas are all welcome.

For a large change, or one that changes the public API, please [open an issue](https://github.com/erag-labs/laravel-Inertia-forms/issues) first so we can agree on the approach before you write the code.

## Requirements

- PHP 8.3+ and Composer
- Node.js 22+ and npm (CI uses Node 24)

## 1. Fork and clone

Fork [erag-labs/laravel-Inertia-forms](https://github.com/erag-labs/laravel-Inertia-forms) on GitHub, then clone your fork:

```bash
git clone https://github.com/<your-username>/laravel-Inertia-forms.git
cd laravel-Inertia-forms
git remote add upstream https://github.com/erag-labs/laravel-Inertia-forms.git
```

## 2. Install

```bash
composer install
npm install
```

`npm install` installs every frontend package at once (the repository uses npm workspaces).

## 3. Check that everything passes

Run the full suite once before you change anything, so you know the starting point is green:

```bash
vendor/bin/pest
npm test
npm run build
```

## 4. Create a branch

Always branch from an up-to-date `main`:

```bash
git checkout main
git pull upstream main
git checkout -b fix/combobox-keyboard
```

Use a short, descriptive name such as `fix/...`, `feature/...` or `docs/...`.

## 5. Make your change

### Where things live

| Path | What it is |
| --- | --- |
| `src/`, `config/`, `stubs/`, `resources/` | The Laravel package (`erag/inertia-forms`): form classes, fields, rules, commands, icons |
| `tests/` | Pest tests for the Laravel package |
| `packages/core` | Shared TypeScript: schema types, visibility engine, dates, icons and every Tailwind class. Bundled into each frontend package, never published on its own |
| `packages/vue`, `packages/react`, `packages/svelte` | The three frontend renderers |
| `packages/core/tests` | Vitest tests for the shared core |

### Rules

- **Same behavior everywhere.** A field must work the same in PHP and in the Vue, React and Svelte packages. If you change one renderer, change the other two.
- **Shared logic goes in core.** Put logic and Tailwind class strings in `packages/core/src` and use them from each framework, so the three stay identical.
- **Visibility changes touch both sides.** Update `src/Support/Condition.php` and `packages/core/src/visibility.ts`, plus the test tables for both.
- **Validation comes from the fields.** A new field option that limits input also needs a matching Laravel rule.
- **Test what changes.** Add or update a Pest test for PHP behavior and a Vitest test for core logic.

### Watch mode

Rebuild a frontend package on every save while you work:

```bash
npm run dev -w packages/vue
```

Swap `vue` for `react` or `svelte`.

## 6. Try it in a Laravel app (optional)

To test your change in a real app, point the app at your local copy.

In the app's `composer.json`, add a path repository and require the package:

```json
"repositories": [
    { "type": "path", "url": "../laravel-Inertia-forms" }
]
```

```bash
composer require erag/inertia-forms:@dev
```

Build the frontend packages, then install the one for your framework from the local folder:

```bash
npm install ../laravel-Inertia-forms/packages/vue
```

Remember to rebuild (or keep `npm run dev` running) so the app picks up your changes.

## 7. Run the checks

Format the code, then run every check. These are the same checks CI runs on your pull request:

```bash
vendor/bin/pint
vendor/bin/pest
```

```bash
npm run format
npm run typecheck
npm test
npm run build
```

## 8. Commit and push

Write short, imperative commit messages that say what changed, for example `Fix keyboard navigation in Combobox`.

```bash
git add .
git commit -m "Fix keyboard navigation in Combobox"
git push origin fix/combobox-keyboard
```

## 9. Open a pull request

Open a pull request against `main` on [erag-labs/laravel-Inertia-forms](https://github.com/erag-labs/laravel-Inertia-forms/pulls) and fill in the template:

- what the change does and why
- the type of change (bug fix, feature, breaking change, docs)
- the checklist: Pint, Pest, format, typecheck, tests and build all pass, and the change behaves the same in Vue, React and Svelte

Link the issue it fixes, for example `Fixes #12`. Keep one change per pull request; small pull requests are reviewed faster.

## Documentation

The docs at [erag.in/laravel-inertia-forms](https://erag.in/laravel-inertia-forms/) live in the [eramitgupta/erag](https://github.com/eramitgupta/erag) repository, in the `laravel-inertia-forms` folder. If your change adds or changes a public method, prop or event, please update them too:

```bash
git clone https://github.com/eramitgupta/erag.git
cd erag
git clone https://github.com/erag-labs/laravel-Inertia-forms.git inertia-forms-library
composer install --working-dir=inertia-forms-library
cd laravel-inertia-forms
npm install
npm run dev
```

The docs render the live examples from the package in `inertia-forms-library`. After you change an example in `examples/` or a demo form in `demo/`, export them again:

```bash
php examples/export.php ../inertia-forms-library
```

```bash
php demo/export.php ../inertia-forms-library
```

## Reporting bugs

Open a [GitHub issue](https://github.com/erag-labs/laravel-Inertia-forms/issues) with:

- the smallest form class that shows the problem
- your frontend (Vue, React or Svelte) and the package versions
- what you expected and what happened

## Security

Please do not report security issues in public issues. Report them privately from the repository's [Security tab](https://github.com/erag-labs/laravel-Inertia-forms/security), as described in [SECURITY.md](SECURITY.md).

## Code of conduct

Be kind and respectful. See the [Code of Conduct](.github/CODE_OF_CONDUCT.md).
