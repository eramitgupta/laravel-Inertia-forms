import { describe, expect, it } from 'vitest';
import { fieldError, getPath, isVisible, setPath, submissionTarget, visibleFields } from '../src';
import type { FormSchema, VisibilityCondition, VisibilityOperator } from '../src';

const condition = (
    operator: VisibilityOperator,
    value: unknown,
    negate = false,
): VisibilityCondition => ({
    field: 'field',
    operator,
    value,
    negate,
});

// Same table as tests/Feature/VisibilityTest.php so PHP and TypeScript agree.
const cases: Array<[VisibilityOperator, unknown, unknown, boolean]> = [
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
];

describe('visibility', () => {
    it.each(cases)('%s %j against %j is %s', (operator, expected, actual, result) => {
        expect(isVisible([condition(operator, expected)], { field: actual })).toBe(result);
    });

    it('negates conditions and reads nested paths', () => {
        const hidden: VisibilityCondition = {
            field: 'address.country',
            operator: '=',
            value: 'IN',
            negate: true,
        };
        expect(isVisible([hidden], { address: { country: 'IN' } })).toBe(false);
        expect(isVisible([hidden], { address: { country: 'US' } })).toBe(true);
    });

    it('treats missing conditions as visible', () => {
        expect(isVisible(null, {})).toBe(true);
    });
});

describe('form helpers', () => {
    const schema = {
        action: '/contacts',
        method: 'put',
        hasFiles: true,
        data: {},
        scrollToFirstError: true,
        resetOnSuccess: false,
        class: null,
        fieldsets: [
            {
                id: null,
                legend: null,
                description: null,
                columns: 1,
                class: null,
                visibility: [{ field: 'type', operator: '=', value: 'business', negate: false }],
                fields: [{ name: 'vat', component: 'TextInput', visibility: null }],
            },
            {
                id: null,
                legend: null,
                description: null,
                columns: 1,
                class: null,
                visibility: null,
                fields: [{ name: 'name', component: 'TextInput', visibility: null }],
            },
        ],
    } as unknown as FormSchema;

    it('filters fields by fieldset and field visibility', () => {
        expect(visibleFields(schema, { type: 'personal' }).map((field) => field.name)).toEqual([
            'name',
        ]);
        expect(visibleFields(schema, { type: 'business' }).map((field) => field.name)).toEqual([
            'vat',
            'name',
        ]);
    });

    it('spoofs the method for multipart updates', () => {
        expect(submissionTarget(schema)).toEqual({ method: 'post', spoof: 'put' });
        expect(submissionTarget({ ...schema, hasFiles: false })).toEqual({
            method: 'put',
            spoof: null,
        });
    });

    it('reads and writes nested paths immutably', () => {
        const data = { address: { city: 'Delhi' } };
        const next = setPath(data, 'address.city', 'Pune');
        expect(getPath(next, 'address.city')).toBe('Pune');
        expect(data.address.city).toBe('Delhi');
    });

    it('finds nested field errors', () => {
        expect(fieldError({ 'tags.1': 'Invalid tag.' }, 'tags')).toBe('Invalid tag.');
        expect(fieldError({ name: 'Required.' }, 'name')).toBe('Required.');
    });
});

describe('file upload hint', () => {
    it('describes extensions, size and count', async () => {
        const { fileUploadHint } = await import('../src');
        expect(
            fileUploadHint({
                accept: '.pdf,.docx',
                image: false,
                maxSize: 2048,
                multiple: true,
                maxFiles: 3,
            }),
        ).toBe('PDF, DOCX · up to 2.0 MB · max 3 files');
        expect(
            fileUploadHint({
                accept: 'image/*',
                image: true,
                maxSize: null,
                multiple: false,
                maxFiles: null,
            }),
        ).toBe('Images');
    });
});

describe('error keys', () => {
    it('includes item errors for array fields', async () => {
        const { errorKeysFor } = await import('../src');
        expect(errorKeysFor({ tags: 'x', 'tags.0': 'y', tagline: 'z' }, 'tags')).toEqual([
            'tags',
            'tags.0',
        ]);
    });
});
