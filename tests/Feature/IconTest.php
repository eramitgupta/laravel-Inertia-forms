<?php

use Erag\InertiaForms\Fields\Callout;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Support\Icon;

afterEach(fn () => Icon::flushRegistered());

it('sends set icons as svg and leaves built-in icons to the frontend', function () {
    expect(Icon::svg('rocket'))->toStartWith('<path d="M')
        ->and(Icon::svg('user'))->toBeNull()
        ->and(Icon::svg('does-not-exist'))->toBeNull()
        ->and(Icon::svg(null))->toBeNull()
        ->and(Icon::exists('user'))->toBeTrue()
        ->and(Icon::exists('rocket'))->toBeTrue()
        ->and(Icon::exists('does-not-exist'))->toBeFalse();
});

it('accepts kebab, snake and pascal case names', function () {
    expect(Icon::svg('shopping-cart'))->toBe(Icon::svg('shoppingCart'))
        ->and(Icon::svg('shopping_cart'))->toBe(Icon::svg('shoppingCart'))
        ->and(Icon::svg('ShoppingCart'))->not->toBeNull()
        ->and(Icon::exists('map-pin'))->toBeTrue();
});

it('ships more than 200 icons without overlapping the built-in ones', function () {
    $set = array_merge(...array_values(json_decode(file_get_contents(__DIR__.'/../../resources/icons/icons.json'), true)));

    expect(array_intersect(array_keys($set), Icon::BUILT_IN))->toBe([])
        ->and(count(Icon::names()))->toBeGreaterThan(200);
});

it('keeps the built-in list in sync with the frontend icons', function () {
    $sources = file_get_contents(__DIR__.'/../../packages/core/src/icons.ts');

    foreach (glob(__DIR__.'/../../packages/core/src/features/*.ts') as $file) {
        $sources .= file_get_contents($file);
    }

    foreach (Icon::BUILT_IN as $name) {
        expect($sources)->toMatch("/^\\s+{$name}\\s*:/m");
    }
});

it('registers icons from code and config, replacing package icons', function () {
    Icon::register('bolt', '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>');
    Icon::register('dot', 'M12 12h.01');
    Icon::register('box', '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18"/></svg>');
    Icon::register('user', '<circle cx="12" cy="12" r="4"/>');
    config(['inertia-forms.icons' => ['brand-mark' => '<path d="M4 4h16"/>']]);

    expect(Icon::svg('bolt'))->toBe('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>')
        ->and(Icon::svg('dot'))->toBe('<path d="M12 12h.01"/>')
        ->and(Icon::svg('box'))->toBe('<rect x="3" y="3" width="18" height="18"/>')
        ->and(Icon::svg('user'))->toBe('<circle cx="12" cy="12" r="4"/>')
        ->and(Icon::svg('brandMark'))->toBe('<path d="M4 4h16"/>')
        ->and(Icon::names())->toContain('bolt', 'brandMark');
});

it('rejects icons with scripts or event handlers', function (string $svg) {
    Icon::register('bad', $svg);
})->with([
    '<script>alert(1)</script>',
    '<path d="M0 0" onload="alert(1)"/>',
    '<use href="https://example.com/icons.svg#x"/>',
])->throws(InvalidArgumentException::class);

it('adds the svg to submit buttons, fieldsets and callouts', function () {
    expect(Submit::make('Launch')->icon('rocket')->toArray()['iconSvg'])->toStartWith('<path')
        ->and(Submit::make('Invite')->icon('user')->toArray()['iconSvg'])->toBeNull()
        ->and(Fieldset::make('Shipping')->icon('truck')->fields([TextInput::make('city')])->toArray()['iconSvg'])->toStartWith('<path')
        ->and(Callout::make('Heads up')->icon('bell')->toArray()['iconSvg'])->toStartWith('<path')
        ->and(Callout::make('Heads up')->toArray()['iconSvg'])->toBeNull();
});
