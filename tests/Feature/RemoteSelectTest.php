<?php

use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Form;
use Erag\InertiaForms\Tests\Fixtures\AuthorForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    AuthorForm::$allowed = true;
});

it('serializes the search endpoint and only the selected option', function () {
    $schema = AuthorForm::make()->bind(['author_id' => 3])->toArray();
    $field = $schema['fieldsets'][0]['fields'][0];

    expect($field['searchable'])->toBeTrue()
        ->and($field['search']['url'])->toBe(route('inertia-forms.search'))
        ->and($field['search']['field'])->toBe('author_id')
        ->and(Crypt::decryptString($field['search']['token']))->toBe(AuthorForm::class)
        ->and($field['options'])->toBe([
            ['value' => 3, 'label' => 'Morgan Vale', 'description' => 'morgan@example.test', 'disabled' => false],
        ])
        ->and(AuthorForm::make()->toArray()['fieldsets'][0]['fields'][0]['options'])->toBe([]);
});

it('keeps local selects unchanged', function () {
    expect(Select::make('plan')->options(['a' => 'A'])->toArray())
        ->toMatchArray(['search' => null, 'options' => [['value' => 'a', 'label' => 'A', 'description' => null, 'disabled' => false]]]);
});

it('returns matching options from the search endpoint', function () {
    $token = AuthorForm::make()->formToken();

    $this->postJson(route('inertia-forms.search'), ['form' => $token, 'field' => 'author_id', 'search' => 'mor'])
        ->assertOk()
        ->assertExactJson(['options' => [
            ['value' => 3, 'label' => 'Morgan Vale', 'description' => 'morgan@example.test', 'disabled' => false],
        ]]);

    $this->postJson(route('inertia-forms.search'), ['form' => $token, 'field' => 'author_id'])
        ->assertOk()
        ->assertJsonCount(3, 'options');
});

it('rejects tampered tokens, non-form classes, unknown fields and unauthorized forms', function () {
    $token = AuthorForm::make()->formToken();

    $this->postJson(route('inertia-forms.search'), ['form' => 'tampered', 'field' => 'author_id'])->assertNotFound();
    $this->postJson(route('inertia-forms.search'), ['form' => Crypt::encryptString(stdClass::class), 'field' => 'author_id'])->assertNotFound();
    $this->postJson(route('inertia-forms.search'), ['form' => $token, 'field' => 'missing'])->assertNotFound();
    $this->postJson(route('inertia-forms.search'), ['form' => $token])->assertUnprocessable();

    AuthorForm::$allowed = false;

    $this->postJson(route('inertia-forms.search'), ['form' => $token, 'field' => 'author_id'])->assertForbidden();
});

it('validates submitted values against the real records', function () {
    $validate = fn (array $input) => AuthorForm::make()->validate(Request::create('/articles', 'POST', $input));

    expect($validate(['author_id' => '2']))->toMatchArray(['author_id' => '2']);

    try {
        $validate(['author_id' => 99]);
        $this->fail('Expected a validation error.');
    } catch (ValidationException $exception) {
        expect($exception->errors()['author_id'][0])->toBe('The selected Author is invalid.');
    }
});

it('skips the options rule for remote selects without selectedOptionsUsing', function () {
    $form = new class extends Form
    {
        protected ?string $actionUrl = '/x';

        public function fields(): array
        {
            return [Select::make('tag')->searchUsing(fn (): array => [])->rule('integer')];
        }
    };

    expect($form::make()->rules())->toBe(['tag' => ['nullable', 'integer']]);
});
