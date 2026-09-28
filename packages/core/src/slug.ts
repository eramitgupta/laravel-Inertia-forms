import { getPath } from './paths';

export interface SlugOptions {
    separator?: '-' | '_' | undefined;
    lowercase?: boolean | undefined;
    maxLength?: number | null | undefined;
}

/** Letters that NFKD does not split into a base letter and a mark. */
const TRANSLITERATIONS: Record<string, string> = {
    ß: 'ss',
    ẞ: 'SS',
    æ: 'ae',
    Æ: 'AE',
    œ: 'oe',
    Œ: 'OE',
    ø: 'o',
    Ø: 'O',
    đ: 'd',
    Đ: 'D',
    ð: 'd',
    Ð: 'D',
    ł: 'l',
    Ł: 'L',
    þ: 'th',
    Þ: 'TH',
    ı: 'i',
};

/**
 * Turn any text into a URL-safe slug that the Slug field's server rule accepts:
 * ASCII letters and digits joined by single separators, e.g. `Crème Brûlée!` → `creme-brulee`.
 */
export function slugify(text: unknown, options: SlugOptions = {}): string {
    const separator = options.separator === '_' ? '_' : '-';
    const lowercase = options.lowercase ?? true;
    const source = typeof text === 'string' || typeof text === 'number' ? String(text) : '';

    let slug = source
        .replace(/[^\u0000-\u007f]/g, (letter) => TRANSLITERATIONS[letter] ?? letter)
        .normalize('NFKD')
        .replace(/\p{M}/gu, '')
        .replace(/['’]/g, '');

    if (lowercase) slug = slug.toLowerCase();

    slug = slug
        .replace(lowercase ? /[^a-z0-9]+/g : /[^A-Za-z0-9]+/g, separator)
        .replace(/^[-_]+|[-_]+$/g, '');

    if (options.maxLength && options.maxLength > 0 && slug.length > options.maxLength) {
        slug = slug.slice(0, options.maxLength).replace(/[-_]+$/, '');
    }

    return slug;
}

/**
 * The text a Slug follows. `from` is looked up next to the slug first, so a
 * Slug inside a Builder block follows the block's own field, then from the root.
 */
export function slugSource(data: unknown, name: string, from: string | null): string {
    if (!from) return '';
    const dot = name.lastIndexOf('.');
    const sibling = dot === -1 ? undefined : getPath(data, `${name.slice(0, dot)}.${from}`);
    const value = sibling === undefined ? getPath(data, from) : sibling;
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}
