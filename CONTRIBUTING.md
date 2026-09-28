# Contributing

Thanks for helping improve Inertia Forms.

## Setup

```bash
git clone https://github.com/erag-labs/laravel-Inertia-forms.git
cd laravel-Inertia-forms
composer install
npm install
```

## Layout

- `src/`, `config/`, `stubs/`, `tests/` — the Laravel package (`erag/inertia-forms`).
- `packages/core` — shared TypeScript: schema types, the visibility engine, and Tailwind classes. It is bundled into each frontend package, not published on its own.
- `packages/vue`, `packages/react`, `packages/svelte` — the frontend renderers.

## Rules

- A field must behave the same in PHP and in all three frontends. When you change visibility logic, update `src/Support/Condition.php`, `packages/core/src/visibility.ts`, and both test tables.
- Use the class strings from `packages/core/src/classes.ts` in every framework so the UI stays identical.
- Add tests for behavior changes (`vendor/bin/pest`, `npm test`).

## Checks

```bash
vendor/bin/pint && vendor/bin/pest
npm run format && npm run typecheck && npm test && npm run build
```
