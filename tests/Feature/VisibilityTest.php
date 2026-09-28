<?php

use Erag\InertiaForms\Support\Condition;

it('evaluates operators', function (string $operator, mixed $expected, mixed $actual, bool $result) {
    expect((new Condition('field', $operator, $expected))->passes(['field' => $actual]))->toBe($result);
})->with([
    ['=', 'phone', 'phone', true],
    ['=', 1, '1', true],
    ['=', true, true, true],
    ['=', 'phone', 'email', false],
    ['!=', 'phone', 'email', true],
    ['>', 18, '21', true],
    ['>', 18, 'abc', false],
    ['>=', 18, 18, true],
    ['<', 5, 3, true],
    ['<=', 5, 6, false],
    ['in', ['IN', 'US'], 'US', true],
    ['not_in', ['IN', 'US'], 'GB', true],
    ['contains', 'vip', ['vip', 'new'], true],
    ['contains', 'ell', 'hello', true],
    ['empty', null, '', true],
    ['empty', null, [], true],
    ['not_empty', null, 'x', true],
    ['truthy', null, 'yes', true],
    ['truthy', null, '0', false],
    ['falsy', null, false, true],
]);

it('builds conditions from shorthand arguments', function () {
    expect(Condition::fromArguments('country', [['IN', 'US']])->operator)->toBe('in')
        ->and(Condition::fromArguments('age', ['>=', 18])->operator)->toBe('>=')
        ->and(Condition::fromArguments('type', ['business'])->operator)->toBe('=');
});

it('supports negated conditions and nested paths', function () {
    $condition = Condition::fromArguments('address.country', ['IN'], negate: true);

    expect($condition->passes(['address' => ['country' => 'IN']]))->toBeFalse()
        ->and($condition->passes(['address' => ['country' => 'US']]))->toBeTrue();
});

it('rejects unknown operators', function () {
    new Condition('field', 'like', 'x');
})->throws(InvalidArgumentException::class);

it('treats valueless operators passed alone as operators', function () {
    $condition = Condition::fromArguments('bio', ['not_empty']);

    expect($condition->operator)->toBe('not_empty')
        ->and($condition->passes(['bio' => 'Hello']))->toBeTrue()
        ->and($condition->passes(['bio' => '']))->toBeFalse()
        ->and(Condition::fromArguments('bio', ['falsy'])->passes(['bio' => 0.0]))->toBeTrue();
});
