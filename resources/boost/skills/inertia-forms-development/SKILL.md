---
name: inertia-forms-development
description: Build Laravel forms with erag/inertia-forms. Use when creating or changing a form class in app/Forms, adding fields, layout, conditional fields, wizards, file uploads or icons, validating with #[Validate], or rendering <Form> in Vue, React or Svelte.
---

# Inertia Forms Development

## When to use this skill

Use it for any form in an app that has `erag/inertia-forms` installed: create, edit, settings, sign-up, checkout, multi-step and chat-style forms. One PHP class holds the fields, layout, validation and submit target; the frontend renders it with one `<Form>` component.

## Workflow

1. `php artisan make:form EditProfileForm` creates `app/Forms/EditProfileForm.php`.
2. Return fields (and fieldsets) from `fields()`. Set `protected ?string $actionRoute = 'profile.update';` and `protected ?string $method = 'put';` (or `->put()`) when it isn't a POST.
3. Controller: `Inertia::render('Profile/Edit', ['form' => EditProfileForm::make()->bind($user)])`.
4. Store/update: `public function update(#[Validate] EditProfileForm $form)` then save `$form->validated()`.
5. Page: `<Form :form="form" />` (Vue, `@erag/inertia-forms-vue`), `<Form form={form} />` (React, `@erag/inertia-forms-react`) or `<Form {form} />` (Svelte, `@erag/inertia-forms-svelte`).

## Fields

Every field is `Field::make('name')` plus the common methods `label()`, `help()`, `placeholder()`, `default()`, `required()`, `disabled()`, `readonly()`, `autofocus()`, `columnSpan()`, `class()`, `rules()`, `rule()`, `clearWhenHidden()`, `visibleWhen()`, `hiddenWhen()`, `authorize()`, `authorizedWhen()`, `authorizedUnless()`.

| Field | Useful methods |
| ----- | -------------- |
| `TextInput` | `email()`, `password()`, `number()`, `url()`, `tel()`, `minLength()`, `maxLength()`, `min()`, `max()`, `step()`, `prefix()`, `suffix()`, `autocomplete()` |
| `Textarea` | `rows()`, `autoResize()`, `maxLength()`, `showCharacterCount()` |
| `Hidden` | value from `default()` or the bound model |
| `Combobox` (alias `Select`) | `options()` (array, enum class or collection), `multiple()`, `searchable()`, `searchUsing()` + `selectedOptionsUsing()` for server search |
| `Radio`, `CheckboxGroup` | `options()`, `inline()`, `buttons()`, `columns()` |
| `Checkbox`, `Toggle` | `Toggle::onLabel()`, `offLabel()` |
| `DatePicker` | `withTime()`, `range()`, `months()`, `minDate()`, `maxDate()`, `firstDayOfWeek()` |
| `TimePicker` | `withSeconds()`, `minuteStep()`, `minTime()`, `maxTime()` |
| `ColorPicker` | `swatches()` |
| `Slider` | `min()`, `max()`, `step()`, `showValue()`, `suffix()` |
| `FileUpload` | `multiple()`, `image()`, `accept()`, `maxSize()`, `maxFiles()` |
| `TagsInput` | `suggestions()`, `maxTags()`, `maxTagLength()`, `reorderable()` |
| `KeyValue` | `keyLabel()`, `valueLabel()`, `addActionLabel()`, `editableKeys()`, `maxItems()` |
| `Repeater` | `fields([...])`, `itemLabel()`, `titleFrom()`, `columns()`, `minItems()`, `maxItems()` |
| `Blocks` | `blocks([Block::make('hero')->label()->icon('★')->fields([...])])` |
| `Link` | `structured()`, `withLabel()`, `withTarget()`, `requireScheme()`, `allowedSchemes()` |
| `Slug` | `from('title')`, `separator()`, `maxLength()`, `prefix()` |
| `OtpInput` | `length()`, `alphanumeric()`, `password()`, `groupSize()`, `autoSubmit()` |
| `Composer` | `attachments()`, `accept()`, `maxFiles()`, `submitOnEnter()`, `sendLabel()`, `quickReplies()` |
| `Submit` | `primary()`, `secondary()`, `danger()`, `outline()`, `ghost()`, `link()`, `small()`, `large()`, `fullWidth()`, `icon()`, `intent()`, `processingLabel()`, `disableUntilDirty()` |
| `Heading`, `Text`, `Html`, `Separator`, `Callout` | display only, never in `validated()`; `Callout::info()/success()/warning()/danger()->icon()` |

## Layout and flow

```php
class CheckoutForm extends Form
{
    protected ?string $actionRoute = 'checkout.store';

    protected bool $wizard = true;

    public function fields(): array
    {
        return [
            Fieldset::make('Contact')->icon('user')->columns(2)->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
            Fieldset::make('Delivery')->icon('truck')->fields([
                Radio::make('method')->options(['ship' => 'Ship it', 'pickup' => 'Pick up'])->buttons()->required(),
                TextInput::make('address')->required()->visibleWhen('method', 'ship')->clearWhenHidden(),
            ]),
            Submit::make('Pay now')->icon('creditCard'),
        ];
    }
}
```

- Without `$wizard`, fieldsets render one after another; `columns()` sets the grid and `columnSpan()` a field's width.
- Several `Submit` buttons with `intent('draft')` / `intent('publish')` send `intent` with the data; read it with `$form->validated('intent')`.
- Icons: over 200 names such as `user`, `rocket`, `shoppingCart` (or `shopping-cart`); register your own with `Icon::register('bolt', '<path d="…"/>')` or `config('inertia-forms.icons')`.

## Rules to follow

- Save `$form->validated()` only. Hidden and unauthorized fields are left out of it.
- `visibleWhen()` is not security. Use `authorizedWhen()` for fields some users must not submit.
- Don't duplicate rules in a FormRequest; the fields already produce them. Add extra ones with `rules()`.
- Custom fields: a PHP class extending `Field` with `component()` returning a name, and a frontend component registered with `<Form :components="{ Name: Component }" />`.

Docs: https://erag.in/laravel-inertia-forms/ (LLM-friendly index: https://erag.in/laravel-inertia-forms/llms.txt).
