<?php

namespace Erag\InertiaForms\Tests\Fixtures;

use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class OnboardingForm extends Form
{
    protected ?string $actionUrl = '/onboarding';

    protected bool $wizard = true;

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->description('Create your login')->icon('user')->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
            Fieldset::make('Profile')->icon('briefcase')->fields([
                TextInput::make('company')->required(),
                FileUpload::make('logo')->image()->required(),
            ]),
            Fieldset::make('About you')->visibleWhen('company', 'not_empty')->fields([
                Textarea::make('bio')->maxLength(20),
            ]),
            Submit::make('Finish'),
        ];
    }
}
