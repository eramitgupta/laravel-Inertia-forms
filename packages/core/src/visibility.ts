import { getPath } from './paths';
import type { VisibilityCondition } from './types';

/**
 * Mirrors `Erag\InertiaForms\Support\Condition` so the browser and the
 * server agree on which fields are visible.
 */
export function normalize(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export function isEmptyValue(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
    );
}

export function isTruthyValue(value: unknown): boolean {
    if (Array.isArray(value)) return value.length > 0;
    return ![null, undefined, '', false, 0, '0', 'false'].includes(value as never);
}

function isNumeric(value: unknown): boolean {
    if (typeof value === 'number') return Number.isFinite(value);
    return typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value));
}

function compare(
    actual: unknown,
    expected: unknown,
    check: (a: number, b: number) => boolean,
): boolean {
    return isNumeric(actual) && isNumeric(expected) && check(Number(actual), Number(expected));
}

function inList(actual: unknown, list: unknown): boolean {
    const candidates = (Array.isArray(list) ? list : [list]).map(normalize);
    return candidates.includes(normalize(actual));
}

function contains(actual: unknown, needle: unknown): boolean {
    if (Array.isArray(actual)) return actual.map(normalize).includes(normalize(needle));
    return (
        typeof actual === 'string' && normalize(needle) !== '' && actual.includes(normalize(needle))
    );
}

function evaluate(condition: VisibilityCondition, actual: unknown): boolean {
    const expected = condition.value;
    switch (condition.operator) {
        case '=':
            return normalize(actual) === normalize(expected);
        case '!=':
            return normalize(actual) !== normalize(expected);
        case '>':
            return compare(actual, expected, (a, b) => a > b);
        case '>=':
            return compare(actual, expected, (a, b) => a >= b);
        case '<':
            return compare(actual, expected, (a, b) => a < b);
        case '<=':
            return compare(actual, expected, (a, b) => a <= b);
        case 'in':
            return inList(actual, expected);
        case 'not_in':
            return !inList(actual, expected);
        case 'contains':
            return contains(actual, expected);
        case 'empty':
            return isEmptyValue(actual);
        case 'not_empty':
            return !isEmptyValue(actual);
        case 'truthy':
            return isTruthyValue(actual);
        case 'falsy':
            return !isTruthyValue(actual);
        default:
            return true;
    }
}

export function conditionPasses(
    condition: VisibilityCondition,
    data: Record<string, unknown>,
): boolean {
    return evaluate(condition, getPath(data, condition.field)) !== condition.negate;
}

/**
 * All conditions must pass. No conditions means always visible.
 */
export function isVisible(
    conditions: VisibilityCondition[] | null | undefined,
    data: Record<string, unknown>,
): boolean {
    return (conditions ?? []).every((condition) => conditionPasses(condition, data));
}
