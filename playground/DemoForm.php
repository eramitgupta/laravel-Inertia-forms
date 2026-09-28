<?php

use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\ColorPicker;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\Hidden;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Fields\Slider;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TagsInput;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\TimePicker;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

/**
 * Exercises every v1 field. Used to generate playground/schema.json.
 */
class DemoForm extends Form
{
    protected ?string $actionUrl = '/demo';

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->description('Basic details for the new user.')->columns(2)->fields([
                TextInput::make('name')->required()->placeholder('Jane Doe')->clearable()->autofocus(),
                TextInput::make('email')->email()->required()->placeholder('jane@example.com'),
                TextInput::make('website')->url()->prefix('https://')->columnSpan(2),
                TextInput::make('budget')->number()->min(0)->suffix('USD'),
                Select::make('role')->options([
                    ['value' => 'admin', 'label' => 'Admin', 'description' => 'Full access to every project'],
                    ['value' => 'editor', 'label' => 'Editor', 'description' => 'Can edit content'],
                    ['value' => 'viewer', 'label' => 'Viewer', 'description' => 'Read-only access'],
                ])->required()->clearable(),
            ]),
            Fieldset::make('Contact')->fields([
                Radio::make('contact_method')->options([
                    ['value' => 'email', 'label' => 'Email', 'description' => 'We reply within a day.'],
                    ['value' => 'phone', 'label' => 'Phone', 'description' => 'Business hours only.'],
                ])->default('email')->columns(2),
                TextInput::make('phone')->tel()->required()->visibleWhen('contact_method', 'phone')->clearWhenHidden(),
                Select::make('skills')->multiple()->searchable()->options(['Laravel', 'Vue', 'React', 'Svelte', 'Tailwind']),
                Select::make('country')->searchable()->clearable()->options(['IN' => 'India', 'US' => 'United States', 'GB' => 'United Kingdom']),
                Radio::make('status')->options(['draft' => 'Draft', 'review' => 'Review', 'live' => 'Live'])->buttons()->default('review'),
                TagsInput::make('search_terms')->suggestions(['carry-on', 'water-resistant', 'laptop', 'travel'])->maxTags(6),
            ]),
            Fieldset::make('Preferences')->columns(2)->fields([
                CheckboxGroup::make('topics')->options(['news' => 'Product news', 'tips' => 'Tips', 'events' => 'Events'])->buttons()->columnSpan(2),
                DatePicker::make('kickoff')->label('Kickoff window')->range()->columnSpan(2),
                Toggle::make('notifications')->label('Email notifications')->onLabel('On')->offLabel('Off')->default(true),
                Slider::make('volume')->min(0)->max(100)->step(5)->suffix('%')->default(40),
                DatePicker::make('starts_on')->label('Start date')->clearable(),
                TimePicker::make('call_time')->minuteStep(15)->clearable(),
                ColorPicker::make('brand_color')->swatches(['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#e11d48', '#9333ea', '#0f766e'])->default('#4f46e5')->clearable(),
                FileUpload::make('avatar')->image()->maxSize(2048),
            ]),
            Textarea::make('bio')->rows(3)->autoResize()->maxLength(200)->showCharacterCount()->help('Shown on your public profile.'),
            Checkbox::make('terms')->label('I agree to the terms')->rule('accepted'),
            Hidden::make('source')->default('playground'),
            Submit::make('Create user')->processingLabel('Creating…'),
        ];
    }
}
