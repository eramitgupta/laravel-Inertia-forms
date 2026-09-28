<?php

use Erag\InertiaForms\Attributes\Validate;
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Fields\TagsInput;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\Tests\Fixtures\ContactForm;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules\In;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    Route::post('/contacts', fn () => null)->name('contacts.store');
});

it('builds rules only for visible fields', function () {
    $rules = ContactForm::make()->rules(['contact_method' => 'email']);

    expect($rules)->toHaveKeys(['name', 'email', 'contact_method', 'plan', 'terms'])
        ->not->toHaveKey('phone')
        ->and($rules['name'])->toBe(['required', 'string', 'max:50'])
        ->and($rules['email'])->toBe(['required', 'string', 'email'])
        ->and(ContactForm::make()->rules(['contact_method' => 'phone']))->toHaveKey('phone');
});

it('validates a request and returns only visible field data', function () {
    $request = Request::create('/contacts', 'POST', [
        'name' => 'Amit',
        'email' => 'amit@example.com',
        'contact_method' => 'email',
        'phone' => 'ignored while hidden',
        'plan' => 'team',
        'terms' => true,
        'is_admin' => true,
    ]);

    $validated = ContactForm::make()->validate($request);

    expect($validated)->toBe([
        'name' => 'Amit',
        'email' => 'amit@example.com',
        'contact_method' => 'email',
        'plan' => 'team',
        'terms' => true,
    ]);
});

it('uses labels in validation messages', function () {
    $request = Request::create('/contacts', 'POST', ['contact_method' => 'phone', 'plan' => 'gold']);

    try {
        ContactForm::make()->validate($request);
        $this->fail('Validation should fail.');
    } catch (ValidationException $exception) {
        expect($exception->errors())->toHaveKeys(['name', 'email', 'phone', 'plan', 'terms'])
            ->and($exception->errors()['name'][0])->toBe('The Name field is required.')
            ->and($exception->errors()['terms'][0])->toBe('The I agree field must be accepted.');
    }
});

it('generates option, array and file rules', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                Select::make('tags')->multiple()->options(['a', 'b']),
                FileUpload::make('avatar')->image()->maxSize(1024),
                FileUpload::make('documents')->multiple()->accept(['pdf'])->maxFiles(3),
                TextInput::make('age')->number()->min(18),
            ];
        }
    };

    $rules = $form->rules();

    expect($rules['tags'])->toBe(['nullable', 'array'])
        ->and($rules['tags.*'][0])->toBeInstanceOf(In::class)
        ->and($rules['avatar'])->toBe(['nullable', 'image', 'max:1024'])
        ->and($rules['documents'])->toBe(['nullable', 'array', 'max:3'])
        ->and($rules['documents.*'])->toBe(['file', 'extensions:pdf'])
        ->and($rules['age'])->toBe(['nullable', 'numeric', 'min:18'])
        ->and($form->hasFiles())->toBeTrue();
});

it('validates controller parameters with the #[Validate] attribute', function () {
    Route::post('/validate-test', fn (#[Validate] ContactForm $form) => $form->validated());

    $this->postJson('/validate-test', ['name' => 'Amit'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'terms']);

    $this->postJson('/validate-test', [
        'name' => 'Amit',
        'email' => 'amit@example.com',
        'contact_method' => 'email',
        'terms' => true,
    ])->assertOk()->assertJson(['name' => 'Amit', 'terms' => true]);
});

it('makes form classes with an artisan command', function () {
    $path = app_path('Forms/CreateUserForm.php');
    @unlink($path);

    $this->artisan('make:form', ['name' => 'CreateUserForm'])->assertSuccessful();

    expect(file_get_contents($path))
        ->toContain('namespace App\Forms;')
        ->toContain('class CreateUserForm extends Form');

    unlink($path);
});

it('requires checkboxes and toggles to be switched on', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                Checkbox::make('terms')->required(),
                Toggle::make('status')->trueValue('on')->falseValue('off')->required(),
            ];
        }
    };

    $rules = $form->rules();

    expect($rules['terms'])->toBe(['required', 'accepted'])
        ->and($rules['status'][1])->toBeInstanceOf(In::class)
        ->and((string) $rules['status'][1])->toBe('in:"on"');
});

it('rejects disabled options', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                Select::make('plan')->options([
                    ['value' => 'free', 'label' => 'Free'],
                    ['value' => 'legacy', 'label' => 'Legacy', 'disabled' => true],
                ]),
            ];
        }
    };

    expect((string) $form->rules()['plan'][1])->toBe('in:"free"');
});

it('evaluates visibility against submitted lists, not merged ones', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                CheckboxGroup::make('tags')->options(['a', 'b', 'c']),
                TextInput::make('reason')->required()->visibleWhen('tags', 'contains', 'b'),
            ];
        }
    };

    $form->bind(['tags' => ['a', 'b']]);

    expect($form->validate(Request::create('/', 'POST', ['tags' => ['c']])))->toBe(['tags' => ['c']]);
});

it('applies date limits after switching to date and time', function () {
    $field = DatePicker::make('starts_at')
        ->minDate(Carbon::parse('2026-01-01 09:30'))
        ->withTime();

    expect($field->toArray()['minDate'])->toBe('2026-01-01T09:30')
        ->and($field->validationRules()['starts_at'])->toContain('after_or_equal:2026-01-01T09:30');
});

it('validates date ranges and tags', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                DatePicker::make('stay')->range()->required(),
                TagsInput::make('tags')->maxTags(2)->maxTagLength(10),
            ];
        }
    };

    expect(fn () => $form->validate(Request::create('/', 'POST', [
        'stay' => ['start' => '2026-10-22', 'end' => '2026-10-18'],
        'tags' => ['a', 'a', 'b'],
    ])))->toThrow(ValidationException::class);

    expect($form->validate(Request::create('/', 'POST', [
        'stay' => ['start' => '2026-10-18', 'end' => '2026-10-22'],
        'tags' => ['carry-on', 'travel'],
    ])))->toBe([
        'stay' => ['start' => '2026-10-18', 'end' => '2026-10-22'],
        'tags' => ['carry-on', 'travel'],
    ]);
});
