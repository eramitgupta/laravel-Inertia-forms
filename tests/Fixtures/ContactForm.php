<?php

namespace Erag\InertiaForms\Tests\Fixtures;

use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class ContactForm extends Form
{
    protected ?string $actionRoute = 'contacts.store';

    public function fields(): array
    {
        return [
            TextInput::make('name')->required()->maxLength(50),
            TextInput::make('email')->email()->required(),
            Fieldset::make('Preferences')->columns(2)->fields([
                Select::make('contact_method')->options(['email' => 'Email', 'phone' => 'Phone'])->default('email'),
                TextInput::make('phone')->required()->visibleWhen('contact_method', 'phone'),
                Select::make('plan')->options(Plan::class),
                Checkbox::make('terms')->label('I agree')->rule('accepted'),
            ]),
            TextInput::make('salary')->number()->authorizedWhen(fn (): bool => false),
            Submit::make('Send'),
        ];
    }
}
