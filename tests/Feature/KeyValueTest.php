<?php

use Erag\InertiaForms\Fields\KeyValue;
use Erag\InertiaForms\Form;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

function keyValueForm(KeyValue $field, array $bound = []): Form
{
    $form = new class extends Form
    {
        public static KeyValue $field;

        protected ?string $actionUrl = '/invoices';

        public function fields(): array
        {
            return [self::$field];
        }
    };

    $form::$field = $field;

    return $bound === [] ? $form::make() : $form::make()->bind($bound);
}

function keyValueErrors(Form $form, array $input): array
{
    try {
        $form->validate(Request::create('/invoices', 'POST', $input));
    } catch (ValidationException $exception) {
        return $exception->errors();
    }

    return [];
}

it('serializes its options with sensible defaults', function () {
    $field = KeyValue::make('metadata')->label('Invoice metadata')->toArray();

    expect($field)->toMatchArray([
        'component' => 'KeyValue',
        'keyLabel' => 'Key',
        'valueLabel' => 'Value',
        'addActionLabel' => 'Add row',
        'reorderable' => true,
        'addable' => true,
        'deletable' => true,
        'editableKeys' => true,
        'maxItems' => null,
    ]);

    expect(KeyValue::make('headers')->keyLabel('Header')->addActionLabel('Add header')->reorderable(false)->toArray())
        ->toMatchArray(['keyLabel' => 'Header', 'addActionLabel' => 'Add header', 'reorderable' => false]);
});

it('turns associative arrays, JSON and row lists into rows for the browser', function () {
    $field = KeyValue::make('metadata');

    $rows = [['key' => 'region', 'value' => 'EMEA'], ['key' => 'cost_center', 'value' => 'OPS-204']];

    expect($field->formatValue(['region' => 'EMEA', 'cost_center' => 'OPS-204']))->toBe($rows)
        ->and($field->formatValue('{"region":"EMEA","cost_center":"OPS-204"}'))->toBe($rows)
        ->and($field->formatValue($rows))->toBe($rows)
        ->and($field->formatValue(null))->toBe([])
        ->and($field->formatValue(['seats' => 5, 'tags' => ['a']]))->toBe([
            ['key' => 'seats', 'value' => '5'],
            ['key' => 'tags', 'value' => '["a"]'],
        ])
        ->and(keyValueForm($field->default(['region' => 'EMEA']))->data()['metadata'])
        ->toBe([['key' => 'region', 'value' => 'EMEA']]);
});

it('returns a key value array from validated and drops empty rows', function () {
    $validated = keyValueForm(KeyValue::make('metadata'))->validate(Request::create('/invoices', 'POST', [
        'metadata' => [
            ['key' => 'region', 'value' => 'EMEA'],
            ['key' => '', 'value' => ''],
            ['key' => 'cost_center', 'value' => 'OPS-204'],
        ],
    ]));

    expect($validated)->toBe(['metadata' => ['region' => 'EMEA', 'cost_center' => 'OPS-204']]);
});

it('requires a key for every value and unique keys', function () {
    $errors = keyValueErrors(keyValueForm(KeyValue::make('metadata')->label('Invoice metadata')), [
        'metadata' => [
            ['key' => 'region', 'value' => 'EMEA'],
            ['key' => 'Region', 'value' => 'APAC'],
            ['key' => '', 'value' => 'orphan value'],
        ],
    ]);

    expect($errors)->toHaveKeys(['metadata.0.key', 'metadata.1.key', 'metadata.2.key'])
        ->and($errors['metadata.2.key'][0])->toBe('The Invoice metadata key (row 3) field is required when a value is filled in.')
        ->and($errors['metadata.1.key'][0])->toBe('The Invoice metadata key (row 2) is used more than once.');
});

it('needs at least one real entry when required and respects max items', function () {
    $required = keyValueForm(KeyValue::make('metadata')->label('Invoice metadata')->required());

    expect(keyValueErrors($required, ['metadata' => [['key' => '', 'value' => '']]])['metadata'][0])
        ->toBe('The Invoice metadata field needs at least one entry.')
        ->and(keyValueErrors($required, ['metadata' => []]))->toHaveKey('metadata');

    $limited = keyValueForm(KeyValue::make('metadata')->maxItems(1));

    expect(keyValueErrors($limited, ['metadata' => [
        ['key' => 'a', 'value' => '1'],
        ['key' => 'b', 'value' => '2'],
    ]]))->toHaveKey('metadata');
});

it('rejects rows with unexpected shape', function () {
    expect(keyValueErrors(keyValueForm(KeyValue::make('metadata')), [
        'metadata' => [['key' => 'a', 'value' => '1', 'extra' => 'x']],
    ]))->toHaveKey('metadata.0');
});
