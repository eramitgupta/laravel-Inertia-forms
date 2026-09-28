# @erag/inertia-forms-react

React renderer for [erag/inertia-forms](https://github.com/eramitgupta/laravel-Inertia-forms). Define the form in a Laravel class, render it with one component.

```bash
composer require erag/inertia-forms
npm install @erag/inertia-forms-react
```

Let Tailwind CSS 4 scan the package (`resources/css/app.css`):

```css
@source "../../node_modules/@erag/inertia-forms-react/dist";
```

```tsx
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function CreateUser({ form }: { form: FormSchema }) {
    return (
        <Form
            form={form}
            accent="#059669"
            onSuccess={() => console.log('Saved')}
        />
    );
}
```

Requires React 19, `@inertiajs/react` 3, and Tailwind CSS 4.

Every field (select, date range, time, color, tags, file upload and more) is built in with Tailwind CSS, with no other UI library. Set the theme color with the `accent` prop or `Form::accent()` in PHP.

Documentation: **https://erag.in/laravel-inertia-forms/**

## Credits

Created and maintained by [Er Amit Gupta](https://github.com/eramitgupta) at [Erag Labs](https://github.com/erag-labs). MIT License © ERAG.
