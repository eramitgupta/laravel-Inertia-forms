<?php

use Erag\InertiaForms\Fields\Block;
use Erag\InertiaForms\Fields\Blocks;
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\KeyValue;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

function outlineBlocks(): Blocks
{
    return Blocks::make('body')->label('Body outline')->addActionLabel('Add content block')->blocks([
        Block::make('section')->description('Heading with notes')->titleFrom('heading')->fields([
            TextInput::make('heading')->required()->maxLength(80),
            Textarea::make('summary'),
        ]),
        Block::make('quote')->label('Quote')->description('Pull quote')->icon('Q')->fields([
            Textarea::make('text')->required(),
            Radio::make('source')->options(['person' => 'Person', 'book' => 'Book'])->default('person'),
            TextInput::make('author')->required()->visibleWhen('source', 'person'),
            KeyValue::make('meta'),
        ]),
    ]);
}

function blocksForm(Blocks $field, array $bound = []): Form
{
    $form = new class extends Form
    {
        public static Blocks $field;

        protected ?string $actionUrl = '/posts';

        public function fields(): array
        {
            return [self::$field];
        }
    };

    $form::$field = $field;

    return $bound === [] ? $form::make() : $form::make()->bind($bound);
}

function blocksErrors(Form $form, array $input): array
{
    try {
        $form->validate(Request::create('/posts', 'POST', $input));
    } catch (ValidationException $exception) {
        return $exception->errors();
    }

    return [];
}

it('serializes blocks with their fields, icons and defaults', function () {
    $field = outlineBlocks()->toArray();

    expect($field)->toMatchArray([
        'component' => 'Blocks',
        'addActionLabel' => 'Add content block',
        'reorderable' => true,
        'collapsible' => true,
        'collapsed' => false,
    ])
        ->and($field['blocks'][0])->toMatchArray([
            'name' => 'section',
            'label' => 'Section',
            'description' => 'Heading with notes',
            'icon' => 'S',
            'titleFrom' => 'heading',
            'defaults' => ['heading' => '', 'summary' => ''],
        ])
        ->and($field['blocks'][0]['fields'][0]['name'])->toBe('heading')
        ->and($field['blocks'][1]['icon'])->toBe('Q')
        ->and($field['blocks'][1]['defaults'])->toBe(['text' => '', 'source' => 'person', 'author' => '', 'meta' => []]);
});

it('formats bound blocks and drops unknown block types', function () {
    $form = blocksForm(outlineBlocks(), ['body' => [
        ['type' => 'section', 'data' => ['heading' => 'Intro']],
        ['type' => 'video', 'data' => ['url' => 'x']],
        ['type' => 'quote', 'data' => ['text' => 'Hi', 'meta' => ['lang' => 'en']]],
    ]]);

    expect($form->data()['body'])->toBe([
        ['type' => 'section', 'data' => ['heading' => 'Intro', 'summary' => '']],
        ['type' => 'quote', 'data' => [
            'text' => 'Hi',
            'source' => 'person',
            'author' => '',
            'meta' => [['key' => 'lang', 'value' => 'en']],
        ]],
    ]);
});

it('validates each block with its own fields and names the block in messages', function () {
    $errors = blocksErrors(blocksForm(outlineBlocks()), ['body' => [
        ['type' => 'section', 'data' => ['heading' => 'Intro']],
        ['type' => 'section', 'data' => ['heading' => '']],
        ['type' => 'quote', 'data' => ['text' => '', 'source' => 'person', 'author' => '']],
        ['type' => 'video', 'data' => []],
    ]]);

    expect($errors)->toHaveKeys(['body.1.data.heading', 'body.2.data.text', 'body.2.data.author', 'body.3.type'])
        ->not->toHaveKey('body.0.data.heading')
        ->and($errors['body.1.data.heading'][0])->toBe('The Heading (Section 2) field is required.')
        ->and($errors['body.2.data.author'][0])->toBe('The Author (Quote 3) field is required.');
});

it('skips hidden block fields and returns clean blocks from validated', function () {
    $validated = blocksForm(outlineBlocks())->validate(Request::create('/posts', 'POST', ['body' => [
        ['type' => 'quote', 'data' => [
            'text' => 'Forms in PHP',
            'source' => 'book',
            'author' => '',
            'meta' => [['key' => 'page', 'value' => '12'], ['key' => '', 'value' => '']],
            'injected' => 'dropped',
        ]],
        ['type' => 'section', 'data' => ['heading' => 'Intro', 'summary' => null]],
    ]]));

    expect($validated['body'])->toBe([
        ['type' => 'quote', 'data' => ['text' => 'Forms in PHP', 'source' => 'book', 'meta' => ['page' => '12']]],
        ['type' => 'section', 'data' => ['heading' => 'Intro', 'summary' => null]],
    ]);
});

it('checks item counts and required', function () {
    $builder = outlineBlocks()->required()->minItems(2)->maxItems(3);

    expect(blocksErrors(blocksForm($builder), ['body' => []]))->toHaveKey('body')
        ->and(blocksErrors(blocksForm($builder), ['body' => [
            ['type' => 'section', 'data' => ['heading' => 'One']],
        ]]))->toHaveKey('body')
        ->and(blocksErrors(blocksForm($builder), ['body' => [
            ['type' => 'section', 'data' => ['heading' => 'One']],
            ['type' => 'section', 'data' => ['heading' => 'Two']],
        ]]))->toBe([]);
});

it('submits as multipart when a block has a file upload', function () {
    expect(blocksForm(outlineBlocks())->hasFiles())->toBeFalse()
        ->and(blocksForm(Blocks::make('gallery')->blocks([
            Block::make('image')->fields([FileUpload::make('file')->image()]),
        ]))->hasFiles())->toBeTrue();
});

it('validates uploaded files inside blocks', function () {
    $form = blocksForm(Blocks::make('gallery')->blocks([
        Block::make('image')->fields([FileUpload::make('file')->image()->required(), TextInput::make('caption')]),
    ]));

    $file = UploadedFile::fake()->image('cover.png');
    $request = Request::create('/posts', 'POST', ['gallery' => [['type' => 'image', 'data' => ['caption' => 'Cover']]]], [], [
        'gallery' => [['data' => ['file' => $file]]],
    ]);

    $validated = $form->validate($request);

    expect($validated['gallery'][0]['data']['file'])->toBeInstanceOf(UploadedFile::class)
        ->and($validated['gallery'][0]['data']['caption'])->toBe('Cover')
        ->and(blocksErrors($form, ['gallery' => [['type' => 'image', 'data' => ['caption' => 'x']]]]))
        ->toHaveKey('gallery.0.data.file');
});
