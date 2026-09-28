import { describe, expect, it } from 'vitest';
import { slugify, slugSource } from '../src';

const serverRule = (separator: '-' | '_' = '-', lowercase = true) =>
    new RegExp(
        `^[${lowercase ? 'a-z' : 'A-Za-z'}0-9]+(?:${separator}[${lowercase ? 'a-z' : 'A-Za-z'}0-9]+)*$`,
    );

describe('slugify', () => {
    it('lower-cases and joins words with single separators', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('  Hello,   World!!  ')).toBe('hello-world');
        expect(slugify('--a__b--')).toBe('a-b');
        expect(slugify('Top 10 tips for 2026')).toBe('top-10-tips-for-2026');
    });

    it('strips diacritics and transliterates common letters', () => {
        expect(slugify('Crème Brûlée à la carte')).toBe('creme-brulee-a-la-carte');
        expect(slugify('Straße Øresund Łódź')).toBe('strasse-oresund-lodz');
        expect(slugify('ｆｕｌｌｗｉｄｔｈ')).toBe('fullwidth');
        expect(slugify('İstanbul')).toBe('istanbul');
    });

    it('drops apostrophes instead of splitting words', () => {
        expect(slugify("Don't stop — it’s fine")).toBe('dont-stop-its-fine');
    });

    it('uses the underscore separator and keeps case when asked', () => {
        expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
        expect(slugify('Hello-World Again', { separator: '_', lowercase: false })).toBe(
            'Hello_World_Again',
        );
    });

    it('cuts to maxLength without a trailing separator', () => {
        expect(slugify('hello world again', { maxLength: 6 })).toBe('hello');
        expect(slugify('hello world again', { maxLength: 11 })).toBe('hello-world');
        expect(slugify('hello world', { maxLength: null })).toBe('hello-world');
        expect(slugify('hello world', { maxLength: 0 })).toBe('hello-world');
    });

    it('returns an empty string for text without letters or digits', () => {
        expect(slugify('')).toBe('');
        expect(slugify('!!! ---')).toBe('');
        expect(slugify('日本語')).toBe('');
        expect(slugify(null)).toBe('');
        expect(slugify({})).toBe('');
        expect(slugify(42)).toBe('42');
    });

    it('always produces values the server regex accepts', () => {
        const samples = [
            'Hello World',
            ' ¿Qué tal? ',
            'a -_- b',
            'Ünïcödé   ÇÅSE',
            'x'.repeat(300),
            'end with dash -',
            '___',
            'A1 B2 C3',
        ];
        for (const separator of ['-', '_'] as const) {
            for (const lowercase of [true, false]) {
                for (const text of samples) {
                    const slug = slugify(text, { separator, lowercase, maxLength: 12 });
                    if (slug !== '') expect(slug).toMatch(serverRule(separator, lowercase));
                    expect(slug.length).toBeLessThanOrEqual(12);
                }
            }
        }
    });
});

describe('slugSource', () => {
    const data = {
        title: 'Root title',
        body: [{ type: 'post', data: { heading: 'Block heading' } }],
        count: 3,
    };

    it('reads the source field from the root', () => {
        expect(slugSource(data, 'slug', 'title')).toBe('Root title');
        expect(slugSource(data, 'slug', 'count')).toBe('3');
    });

    it('prefers a sibling of a nested slug, then falls back to the root', () => {
        expect(slugSource(data, 'body.0.data.slug', 'heading')).toBe('Block heading');
        expect(slugSource(data, 'body.0.data.slug', 'title')).toBe('Root title');
    });

    it('returns an empty string for missing or non-text sources', () => {
        expect(slugSource(data, 'slug', null)).toBe('');
        expect(slugSource(data, 'slug', 'missing')).toBe('');
        expect(slugSource(data, 'slug', 'body')).toBe('');
    });
});
