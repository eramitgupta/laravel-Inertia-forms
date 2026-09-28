<?php

use Erag\InertiaForms\Fields\Callout;
use Erag\InertiaForms\Fields\Composer;
use Erag\InertiaForms\Fields\Heading;
use Erag\InertiaForms\Fields\Html;
use Erag\InertiaForms\Fields\Link;
use Erag\InertiaForms\Fields\OtpInput;
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\Separator;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Text;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

/**
 * @param  array<int, mixed>  $fields
 */
function fieldsForm(array $fields): Form
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

    return $form::make($fields);
}

/**
 * @param  array<string, mixed>  $input
 * @param  array<string, mixed>  $files
 * @return array{0: array<string, mixed>|null, 1: array<string, array<int, string>>}
 */
function submitFields(Form $form, array $input, array $files = []): array
{
    try {
        return [$form->validate(Request::create('/x', 'POST', $input, [], $files)), []];
    } catch (ValidationException $exception) {
        return [null, $exception->errors()];
    }
}

it('repeats a group of fields as plain rows', function () {
    $repeater = Repeater::make('links')->itemLabel('Link')->titleFrom('label')->columns(2)->minItems(1)->fields([
        TextInput::make('label')->required(),
        TextInput::make('url')->url(),
    ]);

    $schema = $repeater->toArray();

    expect($schema)->toMatchArray(['component' => 'Repeater', 'addActionLabel' => 'Add link'])
        ->and($schema['blocks'])->toHaveCount(1)
        ->and($schema['blocks'][0])->toMatchArray(['label' => 'Link', 'titleFrom' => 'label', 'columns' => 2]);

    $form = fieldsForm([$repeater->default([['label' => 'Docs']])]);

    expect($form->data()['links'])->toBe([['label' => 'Docs', 'url' => '']]);

    [$validated] = submitFields($form, ['links' => [['label' => 'Docs', 'url' => 'https://erag.in', 'extra' => 'x']]]);
    [, $errors] = submitFields($form, ['links' => [['label' => 'Docs'], ['label' => '']]]);

    expect($validated)->toBe(['links' => [['label' => 'Docs', 'url' => 'https://erag.in']]])
        ->and($errors['links.1.label'][0])->toBe('The Label (Link 2) field is required.')
        ->and(submitFields($form, ['links' => []])[1])->toHaveKey('links');
});

it('serializes submit variants and validates intents', function () {
    $publish = Submit::make('Publish')->danger()->large()->fullWidth()->icon('send', 'right')->intent('publish');

    expect($publish->toArray())->toMatchArray([
        'variant' => 'danger',
        'size' => 'lg',
        'fullWidth' => true,
        'icon' => 'send',
        'iconPosition' => 'right',
        'intent' => ['key' => 'intent', 'value' => 'publish'],
    ])
        ->and(fn () => Submit::make('x')->variant('huge'))->toThrow(InvalidArgumentException::class);

    $form = fieldsForm([
        TextInput::make('title'),
        Submit::make('Save draft')->secondary()->intent('draft'),
        $publish,
    ]);

    expect(submitFields($form, ['title' => 'Hi', 'intent' => 'publish'])[0])->toBe(['title' => 'Hi', 'intent' => 'publish'])
        ->and(submitFields($form, ['title' => 'Hi', 'intent' => 'delete'])[1])->toHaveKey('intent');
});

it('serializes the disable until dirty option', function () {
    expect(Submit::make('Save changes')->toArray()['disableUntilDirty'])->toBeFalse()
        ->and(Submit::make('Save changes')->disableUntilDirty()->toArray()['disableUntilDirty'])->toBeTrue();
});

it('renders display helpers without data or rules', function () {
    $form = fieldsForm([
        Heading::make('Billing details')->level(2),
        Text::make('Use the legal entity name.'),
        Html::make('<strong>Trusted</strong> copy'),
        Separator::make()->spacing('lg'),
        Callout::make('Review required', 'Confirm the billing contact.')->warning(),
        TextInput::make('company')->required(),
    ]);

    $fields = $form->toArray()['fieldsets'][0]['fields'];

    expect(array_column($fields, 'component'))->toBe(['Heading', 'Text', 'Html', 'Separator', 'Callout', 'TextInput'])
        ->and($fields[0])->toMatchArray(['text' => 'Billing details', 'level' => 2, 'columnSpan' => 12])
        ->and($fields[3]['spacing'])->toBe('lg')
        ->and($fields[4])->toMatchArray(['title' => 'Review required', 'body' => 'Confirm the billing contact.', 'tone' => 'warning'])
        ->and(count(array_unique(array_column($fields, 'name'))))->toBe(6)
        ->and($form->data())->toBe(['company' => ''])
        ->and(array_keys($form->rules()))->toBe(['company']);
});

it('validates plain and structured links', function () {
    $plain = fieldsForm([Link::make('url')]);

    expect(submitFields($plain, ['url' => 'example.test/docs'])[0])->toBe(['url' => 'example.test/docs'])
        ->and(submitFields($plain, ['url' => 'javascript:alert(1)'])[1]['url'][0])->toBe('The Url must use http or https.')
        ->and(submitFields($plain, ['url' => 'not a url'])[1])->toHaveKey('url');

    $secure = fieldsForm([Link::make('url')->requireScheme()->allowedSchemes('https')]);

    expect(submitFields($secure, ['url' => 'example.test'])[1]['url'][0])->toBe('The Url must start with https://.')
        ->and(submitFields($secure, ['url' => 'http://example.test'])[1])->toHaveKey('url')
        ->and(submitFields($secure, ['url' => 'https://example.test'])[1])->toBe([]);

    $cta = Link::make('cta')->withLabel()->withTarget()->required();

    expect($cta->emptyValue())->toBe(['url' => '', 'label' => '', 'target' => ''])
        ->and($cta->formatValue('https://erag.in'))->toBe(['url' => 'https://erag.in', 'label' => '', 'target' => '']);

    $structured = fieldsForm([$cta]);

    expect(submitFields($structured, ['cta' => ['url' => 'https://erag.in', 'label' => 'Docs', 'target' => '_blank']])[0])
        ->toBe(['cta' => ['url' => 'https://erag.in', 'label' => 'Docs', 'target' => '_blank']])
        ->and(submitFields($structured, ['cta' => ['url' => '', 'target' => '_parent']])[1])->toHaveKeys(['cta.url', 'cta.target']);
});

it('checks slug format', function () {
    $slug = Slug::make('slug')->from('title')->prefix('erag.in/blog/');

    expect($slug->toArray())->toMatchArray(['from' => 'title', 'separator' => '-', 'lowercase' => true, 'prefix' => 'erag.in/blog/']);

    $form = fieldsForm([$slug]);

    expect(submitFields($form, ['slug' => 'hello-world-2'])[1])->toBe([])
        ->and(submitFields($form, ['slug' => 'Hello World'])[1]['slug'][0])
        ->toBe('The Slug may only contain lower-case letters, numbers and single dashes.')
        ->and(submitFields($form, ['slug' => 'a--b'])[1])->toHaveKey('slug');
});

it('checks one-time codes', function () {
    $numeric = fieldsForm([OtpInput::make('code')->length(6)->required()]);
    $alpha = fieldsForm([OtpInput::make('code')->length(4)->alphanumeric()->password()->groupSize(2)->autoSubmit()]);

    expect(submitFields($numeric, ['code' => '123456'])[0])->toBe(['code' => '123456'])
        ->and(submitFields($numeric, ['code' => '12345'])[1]['code'][0])->toBe('The Code must be 6 characters.')
        ->and(submitFields($numeric, ['code' => '12a456'])[1]['code'][0])->toBe('The Code may only contain numbers.')
        ->and(submitFields($alpha, ['code' => 'ab12'])[0])->toBe(['code' => 'AB12'])
        ->and(OtpInput::make('code')->password()->groupSize(3)->autoSubmit()->toArray())
        ->toMatchArray(['masked' => true, 'groupSize' => 3, 'autoSubmit' => true, 'length' => 6]);
});

it('takes a message and attachments in the composer', function () {
    $composer = Composer::make('reply')->required()->accept(['pdf', 'png'])->maxFiles(2)->maxSize(1024)->quickReplies(['Thanks!']);
    $form = fieldsForm([$composer]);

    expect($form->hasFiles())->toBeTrue()
        ->and($form->data()['reply'])->toBe(['message' => '', 'attachments' => []])
        ->and($composer->toArray())->toMatchArray(['attachments' => true, 'submitOnEnter' => true, 'sendLabel' => 'Send', 'quickReplies' => ['Thanks!']]);

    [$validated] = submitFields($form, ['reply' => ['message' => '  Hello  ']]);
    [$withFile] = submitFields($form, ['reply' => ['message' => '']], ['reply' => ['attachments' => [UploadedFile::fake()->create('brief.pdf', 10)]]]);

    expect($validated['reply'])->toBe(['message' => 'Hello', 'attachments' => []])
        ->and($withFile['reply']['attachments'][0])->toBeInstanceOf(UploadedFile::class)
        ->and(submitFields($form, ['reply' => ['message' => '']])[1]['reply'][0])->toBe('Write a message or attach a file.')
        ->and(submitFields($form, ['reply' => ['message' => '']], ['reply' => ['attachments' => [UploadedFile::fake()->create('run.exe', 10)]]])[1])
        ->toHaveKey('reply.attachments.0');

    expect(submitFields(fieldsForm([Composer::make('note')]), ['note' => ['message' => 'x']], ['note' => ['attachments' => [UploadedFile::fake()->create('a.pdf')]]])[1])
        ->toHaveKey('note.attachments');
});
