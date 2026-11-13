<?php

use Erag\InertiaForms\Fields\Block;
use Erag\InertiaForms\Fields\Blocks;
use Erag\InertiaForms\Fields\Composer;
use Erag\InertiaForms\Fields\KeyValue;
use Erag\InertiaForms\Fields\OtpInput;
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\InertiaFormsServiceProvider;
use Erag\InertiaForms\Tests\Fixtures\OnboardingForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;

/**
 * @param  array<int, mixed>  $fields
 * @param  array<string, mixed>  $input
 * @return array<string, array<int, string>>
 */
function translatedErrors(array $fields, array $input): array
{
    $form = new class([]) extends Form
    {
        protected ?string $actionUrl = '/x';

        /**
         * @param  array<int, mixed>  $items
         */
        public function __construct(protected array $items) {}

        public function fields(): array
        {
            return $this->items;
        }
    };

    try {
        $form::make($fields)->validate(Request::create('/x', 'POST', $input));

        return [];
    } catch (ValidationException $exception) {
        return $exception->errors();
    }
}

afterEach(function () {
    File::deleteDirectory(lang_path('vendor/inertia-forms'));
});

it('loads the package messages under the inertia-forms namespace', function () {
    expect(__('inertia-forms::inertia-forms.fields.composer.required'))->toBe('Write a message or attach a file.')
        ->and(__('inertia-forms::inertia-forms.fields.key_value.key'))->toBe('Key');
});

it('publishes the language files with the inertia-forms-lang tag', function () {
    $paths = ServiceProvider::pathsToPublish(InertiaFormsServiceProvider::class, 'inertia-forms-lang');

    expect($paths)->toHaveCount(1)
        ->and(realpath((string) array_key_first($paths)))->toBe(realpath(__DIR__.'/../../lang'))
        ->and(array_values($paths)[0])->toBe(lang_path('vendor/inertia-forms'))
        ->and(file_exists(__DIR__.'/../../lang/en/inertia-forms.php'))->toBeTrue();
});

it('uses translations added for the current locale', function () {
    app('translator')->addLines([
        'inertia-forms.fields.composer.required' => 'Schreib eine Nachricht oder hänge eine Datei an.',
        'inertia-forms.fields.key_value.key' => 'Schlüssel',
        'inertia-forms.fields.key_value.cell_attribute' => ':label – :column (Zeile :position)',
        'inertia-forms.fields.key_value.key_required_with' => 'Das Feld :attribute ist erforderlich, wenn ein Wert ausgefüllt ist.',
    ], 'de', 'inertia-forms');
    app()->setLocale('de');

    $composer = translatedErrors([Composer::make('reply')->required()], ['reply' => ['message' => '']]);
    $keyValue = translatedErrors(
        [KeyValue::make('metadata')->label('Metadaten')],
        ['metadata' => [['key' => '', 'value' => 'x']]],
    );

    expect($composer['reply'][0])->toBe('Schreib eine Nachricht oder hänge eine Datei an.')
        ->and($keyValue['metadata.0.key'][0])->toBe('Das Feld Metadaten – schlüssel (Zeile 1) ist erforderlich, wenn ein Wert ausgefüllt ist.');
});

it('uses a published translation file over the package one', function () {
    File::ensureDirectoryExists(lang_path('vendor/inertia-forms/nl'));
    File::put(lang_path('vendor/inertia-forms/nl/inertia-forms.php'), <<<'PHP'
        <?php

        return [
            'fields' => [
                'otp' => [
                    'size' => 'De :attribute moet :length tekens lang zijn.',
                ],
            ],
        ];
        PHP);
    app()->setLocale('nl');

    $errors = translatedErrors([TextInput::make('name'), OtpInput::make('code')->label('Code')], ['code' => '12']);

    expect($errors['code'])->toContain('De Code moet 6 tekens lang zijn.')
        // Keys the published file leaves out still come from the package.
        ->and(__('inertia-forms::inertia-forms.fields.otp.numeric'))->toBe('The :attribute may only contain numbers.');
});

it('sends null for built-in UI text so the frontend can translate it', function () {
    expect(Blocks::make('body')->blocks([Block::make('section')])->toArray()['addActionLabel'])->toBeNull()
        ->and(Repeater::make('links')->itemLabel('Link')->toArray()['addActionLabel'])->toBeNull()
        ->and(KeyValue::make('meta')->toArray())->toMatchArray(['keyLabel' => null, 'valueLabel' => null, 'addActionLabel' => null])
        ->and(Composer::make('reply')->toArray()['sendLabel'])->toBeNull()
        ->and(OnboardingForm::make()->toArray()['wizard'])->toMatchArray(['nextLabel' => null, 'backLabel' => null]);
});

it('keeps labels the developer sets', function () {
    expect(Blocks::make('body')->addActionLabel('Add section')->toArray()['addActionLabel'])->toBe('Add section')
        ->and(Repeater::make('links')->addActionLabel('New link')->toArray()['addActionLabel'])->toBe('New link')
        ->and(KeyValue::make('meta')->keyLabel('Header')->valueLabel('Content')->toArray())
        ->toMatchArray(['keyLabel' => 'Header', 'valueLabel' => 'Content'])
        ->and(Composer::make('reply')->sendLabel('Reply')->toArray()['sendLabel'])->toBe('Reply')
        ->and(OnboardingForm::make()->wizard(true, 'Next', 'Previous')->toArray()['wizard'])
        ->toMatchArray(['nextLabel' => 'Next', 'backLabel' => 'Previous']);
});

it('names fields without a label from the app validation attributes', function () {
    app('translator')->addLines([
        'validation.attributes.email' => 'ईमेल',
        'validation.attributes.first_name' => 'पहला नाम',
    ], 'hi');
    app()->setLocale('hi');

    $email = TextInput::make('email')->email()->required();
    $nested = TextInput::make('billing.first_name')->required();

    expect($email->toArray()['label'])->toBe('ईमेल')
        ->and($nested->toArray()['label'])->toBe('पहला नाम')
        ->and(TextInput::make('email')->label('E-mail address')->toArray()['label'])->toBe('E-mail address')
        ->and(TextInput::make('phone')->toArray()['label'])->toBe('Phone')
        ->and(translatedErrors([$email], ['email' => ''])['email'][0])->toContain('ईमेल');
});

it('keeps the readable name when no attribute translation exists', function () {
    expect(TextInput::make('full_name')->toArray()['label'])->toBe('Full name')
        ->and(TextInput::make('billing.first_name')->toArray()['label'])->toBe('First name');
});
