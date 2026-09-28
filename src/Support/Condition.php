<?php

namespace Erag\InertiaForms\Support;

use InvalidArgumentException;
use JsonSerializable;

/**
 * A single visibility rule that compares one form value against a target.
 */
final class Condition implements JsonSerializable
{
    /**
     * Operators that compare against nothing, so `visibleWhen('bio', 'not_empty')` works.
     */
    public const array VALUELESS_OPERATORS = ['empty', 'not_empty', 'truthy', 'falsy'];

    public const array OPERATORS = [
        '=', '!=', '>', '>=', '<', '<=',
        'in', 'not_in', 'contains',
        'empty', 'not_empty', 'truthy', 'falsy',
    ];

    public function __construct(
        public readonly string $field,
        public readonly string $operator,
        public readonly mixed $value = null,
        public readonly bool $negate = false,
    ) {
        if (! in_array($operator, self::OPERATORS, true)) {
            throw new InvalidArgumentException("Unsupported visibility operator [{$operator}].");
        }
    }

    /**
     * Build a condition from the flexible `visibleWhen()` argument list.
     *
     * @param  array<int, mixed>  $arguments
     */
    public static function fromArguments(string $field, array $arguments, bool $negate = false): self
    {
        if (count($arguments) === 1) {
            $value = $arguments[0];

            if (in_array($value, self::VALUELESS_OPERATORS, true)) {
                return new self($field, $value, null, $negate);
            }

            return new self($field, is_array($value) ? 'in' : '=', $value, $negate);
        }

        return new self($field, (string) $arguments[0], $arguments[1] ?? null, $negate);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function passes(array $data): bool
    {
        return $this->evaluate(data_get($data, $this->field)) !== $this->negate;
    }

    private function evaluate(mixed $actual): bool
    {
        return match ($this->operator) {
            '=' => self::equals($actual, $this->value),
            '!=' => ! self::equals($actual, $this->value),
            '>' => self::compare($actual, $this->value, fn (float $a, float $b): bool => $a > $b),
            '>=' => self::compare($actual, $this->value, fn (float $a, float $b): bool => $a >= $b),
            '<' => self::compare($actual, $this->value, fn (float $a, float $b): bool => $a < $b),
            '<=' => self::compare($actual, $this->value, fn (float $a, float $b): bool => $a <= $b),
            'in' => self::inList($actual, $this->value),
            'not_in' => ! self::inList($actual, $this->value),
            'contains' => self::contains($actual, $this->value),
            'empty' => self::isEmpty($actual),
            'not_empty' => ! self::isEmpty($actual),
            'truthy' => self::isTruthy($actual),
            'falsy' => ! self::isTruthy($actual),
        };
    }

    public static function normalize(mixed $value): string
    {
        return match (true) {
            $value === null => '',
            is_bool($value) => $value ? 'true' : 'false',
            $value instanceof \BackedEnum => (string) $value->value,
            is_array($value) => (string) json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            default => (string) $value,
        };
    }

    public static function equals(mixed $actual, mixed $expected): bool
    {
        return self::normalize($actual) === self::normalize($expected);
    }

    private static function compare(mixed $actual, mixed $expected, callable $comparison): bool
    {
        if (! is_numeric($actual) || ! is_numeric($expected)) {
            return false;
        }

        return $comparison((float) $actual, (float) $expected);
    }

    private static function inList(mixed $actual, mixed $list): bool
    {
        $candidates = array_map(self::normalize(...), (array) $list);

        return in_array(self::normalize($actual), $candidates, true);
    }

    private static function contains(mixed $actual, mixed $needle): bool
    {
        if (is_array($actual)) {
            return in_array(self::normalize($needle), array_map(self::normalize(...), $actual), true);
        }

        return is_string($actual) && self::normalize($needle) !== ''
            && str_contains($actual, self::normalize($needle));
    }

    public static function isEmpty(mixed $value): bool
    {
        return $value === null || $value === '' || $value === [];
    }

    public static function isTruthy(mixed $value): bool
    {
        return ! in_array($value, [null, '', false, 0, 0.0, '0', 'false', []], true);
    }

    /**
     * @return array{field: string, operator: string, value: mixed, negate: bool}
     */
    public function jsonSerialize(): array
    {
        return [
            'field' => $this->field,
            'operator' => $this->operator,
            'value' => $this->value instanceof \BackedEnum ? $this->value->value : $this->value,
            'negate' => $this->negate,
        ];
    }
}
