<?php

use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Fields\TagsInput;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\TimePicker;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\Tests\Fixtures\ContactForm;
use Erag\InertiaForms\Tests\Fixtures\Plan;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::post('/contacts', fn () => null)->name('contacts.store');
    Route::put('/contacts/{contact}', fn () => null)->name('contacts.update');
});

it('serializes the action, method, fieldsets and data', function () {
    $form = ContactForm::make()->toArray();

    expect($form['action'])->toBe(url('/contacts'))
        ->and($form['method'])->toBe('post')
        ->and($form['hasFiles'])->toBeFalse()
        ->and($form['fieldsets'])->toHaveCount(3)
        ->and($form['fieldsets'][0]['legend'])->toBeNull()
        ->and(array_column($form['fieldsets'][0]['fields'], 'name'))->toBe(['name', 'email'])
        ->and($form['fieldsets'][1]['legend'])->toBe('Preferences')
        ->and($form['fieldsets'][1]['columns'])->toBe(2)
        ->and($form['fieldsets'][2]['fields'][0]['component'])->toBe('Submit')
        ->and($form['data'])->toBe([
            'name' => '',
            'email' => '',
            'contact_method' => 'email',
            'phone' => '',
            'plan' => null,
            'terms' => false,
        ]);
});

it('removes unauthorized fields everywhere', function () {
    $form = ContactForm::make();

    expect($form->data())->not->toHaveKey('salary')
        ->and($form->rules())->not->toHaveKey('salary')
        ->and($form->getField('salary'))->toBeNull();
});

it('generates labels from field names', function () {
    expect(TextInput::make('first_name')->getLabel())->toBe('First name')
        ->and(TextInput::make('billing.postal_code')->getLabel())->toBe('Postal code')
        ->and(TextInput::make('email')->label('Work email')->getLabel())->toBe('Work email');
});

it('normalizes options from arrays, lists and enums', function () {
    $options = Select::make('plan')->options(Plan::class)->getOptions();

    expect($options[0])->toBe(['value' => 'free', 'label' => 'Free plan', 'description' => null, 'disabled' => false])
        ->and(Select::make('size')->options(['S', 'M'])->getOptions()[1]['value'])->toBe('M')
        ->and(Select::make('role')->options([['value' => 1, 'label' => 'Admin', 'disabled' => true]])->getOptions()[0])
        ->toBe(['value' => 1, 'label' => 'Admin', 'description' => null, 'disabled' => true]);
});

it('reads the HTTP method from a named route', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [TextInput::make('name')];
        }
    };

    $form->route('contacts.update', ['contact' => 5]);

    expect($form->getAction())->toBe(url('/contacts/5'))
        ->and($form->getMethod())->toBe('put')
        ->and($form->url('/api/contacts')->patch()->getMethod())->toBe('patch');
});

it('binds values from arrays and models', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                TextInput::make('name'),
                TextInput::make('address.city'),
                DatePicker::make('starts_at'),
                Toggle::make('active'),
                CheckboxGroup::make('tags')->options(['a', 'b']),
            ];
        }
    };

    $data = $form->bind([
        'name' => 'Amit',
        'address' => ['city' => 'Delhi'],
        'starts_at' => Carbon::parse('2026-09-27 10:30:00'),
        'active' => 1,
        'tags' => collect(['b']),
    ])->data();

    expect($data)->toBe([
        'name' => 'Amit',
        'address' => ['city' => 'Delhi'],
        'starts_at' => '2026-09-27',
        'active' => true,
        'tags' => ['b'],
    ]);

    $model = new class extends Model
    {
        protected $guarded = [];
    };
    $model->forceFill(['name' => 'Model name', 'active' => false]);

    expect($form->bind($model)->data()['name'])->toBe('Model name')
        ->and($form->data()['active'])->toBeFalse();
});

it('returns an empty structure for unauthorized forms', function () {
    $form = ContactForm::make()->authorize(false)->toArray();

    expect($form['fieldsets'])->toBe([])
        ->and($form['action'])->toBeNull();

    config()->set('inertia-forms.throw_on_unauthorized', true);

    ContactForm::make()->authorize(false)->toArray();
})->throws(AuthorizationException::class);

it('serializes fieldset visibility and field props', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                Fieldset::make('Company')->visibleWhen('type', 'business')->fields([
                    TextInput::make('vat')->prefix('EU')->maxLength(12)->columnSpan(2),
                ]),
            ];
        }
    };

    $fieldset = $form->toArray()['fieldsets'][0];

    expect($fieldset['visibility'][0]->jsonSerialize())->toBe(['field' => 'type', 'operator' => '=', 'value' => 'business', 'negate' => false])
        ->and($fieldset['fields'][0])->toMatchArray(['prefix' => 'EU', 'maxLength' => 12, 'columnSpan' => 2, 'type' => 'text']);
});

it('serializes the new display options', function () {
    $form = new class extends Form
    {
        protected ?string $accent = '#e11d48';

        public function fields(): array
        {
            return [
                TextInput::make('name')->clearable(),
                Radio::make('status')->options(['draft', 'live'])->buttons(),
                TimePicker::make('at')->minuteStep(15),
                DatePicker::make('stay')->range()->firstDayOfWeek(1),
                TagsInput::make('tags')->suggestions(['a', 'b'])->maxTags(5),
            ];
        }
    };

    $array = $form->toArray();
    $fields = $array['fieldsets'][0]['fields'];

    expect($array['accent'])->toBe('#e11d48')
        ->and($fields[0]['clearable'])->toBeTrue()
        ->and($fields[1]['buttons'])->toBeTrue()
        ->and($fields[2]['minuteStep'])->toBe(15)
        ->and($fields[3])->toMatchArray(['range' => true, 'months' => 2, 'firstDayOfWeek' => 1])
        ->and($fields[4])->toMatchArray(['component' => 'TagsInput', 'suggestions' => ['a', 'b'], 'maxTags' => 5])
        ->and($array['data'])->toMatchArray(['stay' => ['start' => '', 'end' => ''], 'tags' => []]);
});

it('binds date ranges and tag strings', function () {
    $form = new class extends Form
    {
        public function fields(): array
        {
            return [
                DatePicker::make('stay')->range(),
                TagsInput::make('tags'),
            ];
        }
    };

    expect($form->bind([
        'stay' => [Carbon::parse('2026-10-18'), '2026-10-22'],
        'tags' => 'carry-on, water-resistant',
    ])->data())->toBe([
        'stay' => ['start' => '2026-10-18', 'end' => '2026-10-22'],
        'tags' => ['carry-on', 'water-resistant'],
    ]);
});
