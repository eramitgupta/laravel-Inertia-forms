import type { LinkSchema, LinkValue } from './types';

export interface LinkParts {
    url: string;
    label: string;
    target: '' | '_self' | '_blank';
}

/**
 * Read a Link value (a URL string or `{ url, label, target }`) into its parts.
 */
export function linkParts(value: unknown): LinkParts {
    if (value !== null && typeof value === 'object') {
        const link = value as Partial<Record<keyof LinkValue, unknown>>;
        const target = link.target === '_self' || link.target === '_blank' ? link.target : '';
        return {
            url: typeof link.url === 'string' ? link.url : '',
            label: typeof link.label === 'string' ? link.label : '',
            target,
        };
    }
    return { url: typeof value === 'string' ? value : '', label: '', target: '' };
}

/**
 * The value a Link field stores: the URL string, or in structured mode an
 * object with `url` plus only the keys the field enables.
 */
export function linkValue(
    field: Pick<LinkSchema, 'structured' | 'withLabel' | 'withTarget'>,
    parts: LinkParts,
): string | LinkValue {
    if (!field.structured) return parts.url;
    const value: LinkValue = { url: parts.url };
    if (field.withLabel) value.label = parts.label;
    if (field.withTarget) value.target = parts.target;
    return value;
}

/**
 * Whether the URL starts with a scheme like `https:` or `mailto:`.
 */
export function hasUrlScheme(url: string): boolean {
    return /^[a-z][a-z0-9+.-]*:/i.test(url.trim());
}

/**
 * A short hint when a scheme is required but missing, e.g. `Start with https://`.
 */
export function linkSchemeHint(
    field: Pick<LinkSchema, 'requireScheme' | 'allowedSchemes'>,
    url: string,
): string | null {
    if (!field.requireScheme || url.trim() === '' || hasUrlScheme(url)) return null;
    const scheme = field.allowedSchemes[0] ?? 'https';
    return `Start with ${scheme}${/^(https?|ftps?|wss?)$/.test(scheme) ? '://' : ':'}`;
}
