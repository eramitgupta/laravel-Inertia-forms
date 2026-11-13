<?php

/*
|--------------------------------------------------------------------------
| Inertia Forms messages
|--------------------------------------------------------------------------
|
| Validation messages and attribute names that the package itself writes.
| Publish this file with `php artisan vendor:publish --tag=inertia-forms-lang`
| and edit the copy in `lang/vendor/inertia-forms/{locale}/inertia-forms.php`.
|
| Text the browser components show (buttons, placeholders, empty states)
| is translated in JavaScript with `setTranslations()`.
|
*/

return [

    'fields' => [

        'blocks' => [
            'type_attribute' => ':label block type',
            'item_field_attribute' => ':field (:block :position)',
        ],

        'repeater' => [
            'item' => 'Item',
        ],

        'combobox' => [
            'invalid' => 'The selected :attribute is invalid.',
        ],

        'composer' => [
            'required' => 'Write a message or attach a file.',
            'attachments_attribute' => ':label attachments',
            'attachment_attribute' => ':label attachment',
        ],

        'key_value' => [
            'key' => 'Key',
            'value' => 'Value',
            'cell_attribute' => ':label :column (row :position)',
            'required' => 'The :attribute field needs at least one entry.',
            'key_required_with' => 'The :attribute field is required when a value is filled in.',
            'key_distinct' => 'The :attribute is used more than once.',
        ],

        'link' => [
            'scheme_required' => 'The :attribute must start with :scheme.',
            'scheme_not_allowed' => 'The :attribute must use :schemes.',
            'scheme_separator' => ' or ',
            'invalid' => 'The :attribute must be a valid URL.',
            'label_attribute' => ':label text',
            'target_attribute' => ':label target',
        ],

        'otp' => [
            'size' => 'The :attribute must be :length characters.',
            'alphanumeric' => 'The :attribute may only contain letters and numbers.',
            'numeric' => 'The :attribute may only contain numbers.',
        ],

        'slug' => [
            'format_lowercase_dashes' => 'The :attribute may only contain lower-case letters, numbers and single dashes.',
            'format_lowercase_underscores' => 'The :attribute may only contain lower-case letters, numbers and single underscores.',
            'format_dashes' => 'The :attribute may only contain letters, numbers and single dashes.',
            'format_underscores' => 'The :attribute may only contain letters, numbers and single underscores.',
        ],

    ],

];
