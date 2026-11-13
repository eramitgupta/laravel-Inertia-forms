---
name: inertia-forms-translations
description: Translate and localize forms built with erag/inertia-forms. Use when asked to translate, localize or add i18n to forms, add a language or locale (Dutch, Hindi, German, French, Spanish...), switch language at runtime, call setTranslations / useTranslate, publish the inertia-forms lang file, or fix English text left in a translated form.
---

# Inertia Forms Translations

## When to use this skill

Use it whenever form text must appear in another language. Text comes from three places; translate each in its own place:

| Text | Where | How |
| ---- | ----- | --- |
| Your copy: labels, placeholders, help, options, legends, Submit text | Form class (PHP) | `__('app.key')` in `fields()` |
| Package messages: Composer/KeyValue/Link/OTP/Slug errors, attribute names, default Repeater item name | `lang/vendor/inertia-forms/{locale}/inertia-forms.php` | publish, then edit |
| Component text: buttons, placeholders, empty states, aria labels, file sizes, calendar names | Browser | `setTranslations({...})` |

Laravel's own messages (`required`, `email`) still come from the app's `lang/{locale}/validation.php` (`php artisan lang:publish`).

## Workflow

1. **Package messages.** `php artisan vendor:publish --tag=inertia-forms-lang`, then create `lang/vendor/inertia-forms/nl/inertia-forms.php` with only the keys to change (all under `fields`: `blocks`, `repeater`, `combobox`, `composer`, `key_value`, `link`, `otp`, `slug`). Missing keys fall back to English. `:attribute` is filled by the validator; `:label`, `:field`, `:block`, `:position`, `:column`, `:scheme`, `:schemes`, `:length` by the package.
2. **App copy.** Wrap every string in the form class in `__()`. `fields()` runs per request, after locale middleware. If locale middleware is not in the `web` group, add it to `inertia-forms.search.middleware` and `inertia-forms.wizard.middleware` so step checks and remote search answer in the right language.
3. **Component text.** Call `setTranslations()` in the app entry before `createInertiaApp()`: `resources/js/app.ts` (Vue, Svelte) or `resources/js/app.tsx` (React). Import from `@erag/inertia-forms-vue`, `-react` or `-svelte`; the API is identical.
4. **Runtime switch.** Share `'locale' => app()->getLocale()` in `HandleInertiaRequests::share()`, keep one file per locale in `resources/js/lang/inertia-forms/{code}.ts`, and apply it on start and on both `router.on('success')` and `router.on('navigate')` (a language switch that redirects back to the same URL only fires `success`). Always start from the defaults so keys of the previous language don't linger.
Recommended: for the rest of the Inertia app (page headings, menus, messages outside forms) use **Laravel Lang Sync Inertia** (`erag/laravel-lang-sync-inertia` + `@erag/lang-sync-inertia`). Put the component keys in `lang/{locale}/forms-ui.php`, call `syncLangFiles(['forms-ui', 'app'])` in `HandleInertiaRequests::share()`, and pass `page.props.lang['forms-ui']` to `setTranslations()` on start (read the first page from `script[data-page="app"]`) and on `router.on('success')` + `router.on('navigate')`. Pages use `vueLang()` / `reactLang()` / `svelteLang()` and `__('app.key')`. Docs: https://erag.in/laravel-lang-sync-inertia/

5. **One-off label.** Set it in PHP (wins over the frontend key): `wizard(nextLabel: __('...'), backLabel: __('...'))` in the constructor, `addActionLabel()` (Repeater, Blocks, KeyValue), `keyLabel()` / `valueLabel()`, `sendLabel()`. Not set means PHP sends `null` and the frontend key is used.

```ts
// resources/js/lib/form-locale.ts
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-vue';

const locales = import.meta.glob<Translations>('../lang/inertia-forms/*.ts', { eager: true, import: 'default' });
let active: string | undefined;

export function applyFormLocale(locale: unknown): void {
    const code = String(locale || 'en').toLowerCase().replace(/[-_].*$/, '');
    if (code === active) return;
    active = code;
    setTranslations({ ...defaultTranslations, ...locales[`../lang/inertia-forms/${code}.ts`] });
}

// resources/js/app.ts
applyFormLocale(document.documentElement.lang);
router.on('success', (event) => applyFormLocale(event.detail.page.props.locale));
router.on('navigate', (event) => applyFormLocale(event.detail.page.props.locale));
```

## Rules of the frontend store

- `setTranslations()` merges over the current text and updates every rendered form live. `resetTranslations()` goes back to English; `getTranslations()` returns a copy of the current map; `defaultTranslations` is the English source.
- Missing key: English default, then the key name. Non-string, non-function values are ignored.
- Tokens follow Laravel: `:name` as is, `:Name` first letter upper, `:NAME` upper. Reorder or drop tokens freely; unknown tokens stay literal.
- A value can be `(params) => string` (`TranslationValue`) for plurals and `Intl.NumberFormat`. Numbers arrive as numbers (`count`, `number`, `current`, `total`, `max`, `day`, `year`); `file_size_mb` gets text like `2.5`. Tokens in a function's result are not replaced; a throwing function logs a warning and shows English.
- Slot keys render elements: `file_upload_drop_prompt` (`:action` = link with `file_upload_click_to_upload`), `composer_hint` (`:enter` / `:newline` = `<kbd>` with `composer_key_*`). Keep each slot once, lower case; word order is free.
- Calendar names come from keys, not `Intl`: `calendar_month_*`, `calendar_month_short_*`, `calendar_weekday_*`, `calendar_weekday_short_*`. The first weekday is PHP `DatePicker::firstDayOfWeek(1)`, per field.
- Locale files: `export default {...} satisfies Translations` (typos error), or `satisfies Record<TranslationKey, TranslationValue>` to require every key.

## Key groups (130 keys)

Prefixes: `action_`, `form_`, `option_` (Combobox), `file_upload_`, `file_size_`, `date_`, `calendar_`, `time_`, `color_`, `tags_`, `key_value_`, `collection_` (Repeater/Blocks/KeyValue), `blocks_`, `repeater_`, `link_`, `slug_`, `otp_`, `composer_`, `wizard_`. Reserved for custom components: `action_add`, `action_cancel`, `action_close`, `action_copy`, `action_delete`, `action_done`.

| Key | Default |
| --- | ------- |
| `form_submit` | Submit |
| `form_character_count` | :count / :max |
| `option_placeholder` / `option_search` | Select an option / Search… |
| `option_no_results` | No results |
| `file_upload_drop_prompt` / `file_upload_click_to_upload` | :action or drag and drop / Click to upload |
| `date_placeholder` / `date_today` | Select a date / Today |
| `date_display` | :month :day, :year |
| `calendar_month_year` | :month :year |
| `action_clear` / `action_remove` | Clear / Remove |
| `repeater_add` | Add :name (`:name` = item label, lower-cased) |
| `blocks_add` / `key_value_add` | Add block / Add row |
| `composer_send` | Send |
| `wizard_next` / `wizard_back` | Continue / Back |
| `wizard_progress` | Step :current of :total |

Full list with where each key shows and its params: `defaultTranslations` in the frontend package, or https://erag.in/laravel-inertia-forms/translations/keys.html (a 130-key Dutch starter file is at https://erag.in/laravel-inertia-forms/translations/dutch-starter.html).

## Custom field components

Use `const t = useTranslate()` and call `t('key', params)` during render (Vue: template or `computed`; Svelte: markup or `$derived`; React: in each component). Outside components use `translate()` (not reactive) or `subscribeTranslations(listener)`.

## Common mistakes

- **Hardcoded English in a custom field.** Use `useTranslate()` and the package keys, so it switches with the rest of the form.
- **Worrying that `setTranslations()` ran after mount.** That is fine: forms update live. Call it before `createInertiaApp()` only to avoid a flash of English.
- **Translating labels, help or options on the frontend.** They come from PHP; use `__()` in the form class.
- **Expecting `addActionLabel` / `sendLabel` / wizard labels to have PHP defaults.** They are `null` unless set; the text comes from `repeater_add`, `blocks_add`, `key_value_add`, `composer_send`, `wizard_next`, `wizard_back`.
- **Switching with `setTranslations(de)` alone.** Keys `de` lacks keep the previous language; spread `defaultTranslations` first.
- **Editing the package's `lang/en` file in `vendor/`.** Publish and edit `lang/vendor/inertia-forms/` instead.
