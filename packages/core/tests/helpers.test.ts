import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    addTags,
    mergeComponents,
    fetchOptions,
    fieldError,
    blockDefaults,
    blockTitle,
    blockItems,
    keyValueRows,
    hexToHsl,
    hslToHex,
    normalizeHex,
    formatDisplayDate,
    isOutsideLimits,
    isTimeOutsideLimits,
    minuteOptions,
    monthGrid,
    moveItem,
    nextRange,
    nowTime,
    parseIsoDate,
    parseTime,
} from '../src';

afterEach(() => {
    vi.useRealTimers();
});

describe('calendar', () => {
    it('parses dates and datetimes as local dates', () => {
        expect(parseIsoDate('2026-09-04')?.getDate()).toBe(4);
        expect(parseIsoDate('2026-09-04T09:15')?.getMonth()).toBe(8);
        expect(parseIsoDate('not a date')).toBeNull();
        expect(parseIsoDate(null)).toBeNull();
    });

    it('builds a six week grid starting on the chosen weekday', () => {
        const september = new Date(2026, 8, 1);
        const sundayGrid = monthGrid(september);
        const mondayGrid = monthGrid(september, 1);

        expect(sundayGrid).toHaveLength(42);
        expect(sundayGrid[0]).toEqual({ iso: '2026-08-30', day: 30, inMonth: false });
        expect(sundayGrid[2]).toEqual({ iso: '2026-09-01', day: 1, inMonth: true });
        expect(mondayGrid[0]!.iso).toBe('2026-08-31');
    });

    it('formats display text with an optional time', () => {
        expect(formatDisplayDate('2026-10-04', 'en-US')).toBe('Oct 4, 2026');
        expect(formatDisplayDate('2026-10-04T09:15', 'en-US')).toBe('Oct 4, 2026, 09:15');
        expect(formatDisplayDate('', 'en-US')).toBe('');
    });

    it('checks min and max limits', () => {
        expect(isOutsideLimits('2026-01-01', '2026-01-02')).toBe(true);
        expect(isOutsideLimits('2026-01-03', null, '2026-01-02T10:00')).toBe(true);
        expect(isOutsideLimits('2026-01-02', '2026-01-02', '2026-01-02')).toBe(false);
    });

    it('starts, completes and swaps ranges', () => {
        expect(nextRange({ start: '', end: '' }, '2026-09-10')).toEqual({
            start: '2026-09-10',
            end: '',
        });
        expect(nextRange({ start: '2026-09-10', end: '' }, '2026-09-12')).toEqual({
            start: '2026-09-10',
            end: '2026-09-12',
        });
        expect(nextRange({ start: '2026-09-10', end: '' }, '2026-09-01')).toEqual({
            start: '2026-09-01',
            end: '2026-09-10',
        });
        expect(nextRange({ start: '2026-09-01', end: '2026-09-10' }, '2026-09-20')).toEqual({
            start: '2026-09-20',
            end: '',
        });
    });
});

describe('time', () => {
    it('parses times with optional seconds', () => {
        expect(parseTime('09:15')).toEqual({ hour: '09', minute: '15', second: '00' });
        expect(parseTime('09:15:30')?.second).toBe('30');
        expect(parseTime('9am')).toBeNull();
    });

    it('builds minute options from the step', () => {
        expect(minuteOptions(15)).toEqual(['00', '15', '30', '45']);
        expect(minuteOptions(0)).toHaveLength(60);
    });

    it('snaps the current time down to a valid minute option', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 27, 14, 58, 7));

        expect(nowTime(false, 15)).toBe('14:45');
        expect(nowTime(true)).toBe('14:58:07');
    });

    it('checks min and max limits', () => {
        expect(isTimeOutsideLimits('08:00', '09:00')).toBe(true);
        expect(isTimeOutsideLimits('18:30', null, '18:00')).toBe(true);
        expect(isTimeOutsideLimits('12:00', '09:00', '18:00')).toBe(false);
    });
});

describe('tags', () => {
    it('normalizes key value rows', () => {
        expect(keyValueRows([{ key: 'region', value: 'EMEA' }, { key: 5 }, null])).toEqual([
            { key: 'region', value: 'EMEA' },
            { key: '5', value: '' },
            { key: '', value: '' },
        ]);
        expect(keyValueRows('nope')).toEqual([]);
    });

    it('splits pasted text and skips blanks and duplicates', () => {
        expect(addTags(['vue'], 'react, vue,\nsvelte, ')).toEqual(['vue', 'react', 'svelte']);
    });

    it('returns the same array when nothing is added', () => {
        const tags = ['vue'];
        expect(addTags(tags, 'vue, ')).toBe(tags);
    });

    it('respects max tags and max tag length', () => {
        expect(addTags(['a'], 'b,c,d', { maxTags: 3 })).toEqual(['a', 'b', 'c']);
        expect(addTags([], 'short,too-long-tag', { maxTagLength: 5 })).toEqual(['short']);
    });

    it('moves items and ignores invalid indexes', () => {
        expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
        expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
        const items = ['a', 'b'];
        expect(moveItem(items, 0, 5)).toBe(items);
    });
});

describe('color', () => {
    it('normalizes hex codes', () => {
        expect(normalizeHex('#ABC')).toBe('#aabbcc');
        expect(normalizeHex('7C3AED')).toBe('#7c3aed');
        expect(normalizeHex('#7c3ae')).toBeNull();
        expect(normalizeHex('red')).toBeNull();
    });

    it('converts between hex and hsl', () => {
        expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
        expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 });
        expect(hslToHex({ h: 120, s: 100, l: 25 })).toBe('#008000');
        expect(hslToHex({ h: 0, s: 0, l: 50 })).toBe('#808080');
    });

    it('round-trips colors within rounding', () => {
        for (const hex of ['#7c3aed', '#4f46e5', '#0ea5e9', '#f59e0b']) {
            const back = hslToHex(hexToHsl(hex));
            const diff = [1, 3, 5].map((index) =>
                Math.abs(
                    parseInt(back.slice(index, index + 2), 16) -
                        parseInt(hex.slice(index, index + 2), 16),
                ),
            );
            expect(Math.max(...diff)).toBeLessThanOrEqual(3);
        }
    });
});

describe('builder', () => {
    it('shows only its own error, not the nested ones', () => {
        const errors = { 'body.1.data.heading': 'Heading is required.' };
        expect(fieldError(errors, 'body', 'Blocks')).toBeUndefined();
        expect(fieldError(errors, 'body', 'KeyValue')).toBe('Heading is required.');
        expect(fieldError({ body: 'Too many blocks.' }, 'body', 'Blocks')).toBe('Too many blocks.');
    });

    const block = {
        name: 'section',
        label: 'Section',
        description: null,
        icon: 'S',
        columns: 1,
        titleFrom: 'heading',
        fields: [],
        defaults: { heading: '', tags: [] as string[] },
    };

    it('normalizes items and drops junk', () => {
        expect(
            blockItems([
                { type: 'section', data: { heading: 'Hi' } },
                { type: 'quote' },
                null,
                'x',
            ]),
        ).toEqual([
            { type: 'section', data: { heading: 'Hi' } },
            { type: 'quote', data: {} },
        ]);
        expect(blockItems({})).toEqual([]);
    });

    it('titles blocks from a field or their position', () => {
        expect(blockTitle(block, { type: 'section', data: { heading: '  Intro ' } }, 0)).toBe(
            'Intro',
        );
        expect(blockTitle(block, { type: 'section', data: { heading: '' } }, 1)).toBe('Section 2');
    });

    it('copies defaults so blocks never share arrays', () => {
        const first = blockDefaults(block);
        (first.tags as string[]).push('changed');
        expect(blockDefaults(block)).toEqual({ heading: '', tags: [] });
    });
});

describe('remote options', () => {
    const search = { url: '/_inertia-forms/search', token: 'encrypted', field: 'author_id' };

    it('posts the token, field and search text and returns the options', async () => {
        const fetchMock = vi.fn(
            async () =>
                new Response(JSON.stringify({ options: [{ value: 3, label: 'Morgan Vale' }] }), {
                    status: 200,
                }),
        );
        vi.stubGlobal('fetch', fetchMock);

        await expect(fetchOptions(search, 'mor')).resolves.toEqual([
            { value: 3, label: 'Morgan Vale' },
        ]);

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe('/_inertia-forms/search');
        expect(init.method).toBe('POST');
        expect(JSON.parse(init.body as string)).toEqual({
            form: 'encrypted',
            field: 'author_id',
            search: 'mor',
        });
        vi.unstubAllGlobals();
    });

    it('throws on a failed request', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => new Response('', { status: 403 })),
        );
        await expect(fetchOptions(search, '')).rejects.toThrow('Option search failed (403)');
        vi.unstubAllGlobals();
    });
});

describe('component registry', () => {
    it('lets Select and Blocks overrides cover their aliases', () => {
        const merged = mergeComponents(
            { Select: 'a', Combobox: 'a', Blocks: 'b', Repeater: 'b' },
            { Select: 'x', Blocks: 'y' },
        );
        expect(merged).toMatchObject({ Select: 'x', Combobox: 'x', Blocks: 'y', Repeater: 'y' });
        expect(mergeComponents({ Combobox: 'a' }, { Select: 'x', Combobox: 'z' }).Combobox).toBe(
            'z',
        );
    });
});
