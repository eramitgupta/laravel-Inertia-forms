import type { FieldOption, SelectSearch } from './types';

/**
 * Headers Laravel needs to accept a same-origin POST: the XSRF cookie it sets,
 * or the `csrf-token` meta tag when the cookie is not readable.
 */
export function csrfHeaders(): Record<string, string> {
    if (typeof document === 'undefined') return {};
    const cookie = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    if (cookie?.[1]) return { 'X-XSRF-TOKEN': decodeURIComponent(cookie[1]) };
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    return meta?.content ? { 'X-CSRF-TOKEN': meta.content } : {};
}

/**
 * Load options for a `Select::searchUsing()` field from the package endpoint.
 */
export async function fetchOptions(
    search: SelectSearch,
    term: string,
    signal?: AbortSignal,
): Promise<FieldOption[]> {
    const response = await fetch(search.url, {
        method: 'POST',
        credentials: 'same-origin',
        signal,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...csrfHeaders(),
        },
        body: JSON.stringify({ form: search.token, field: search.field, search: term }),
    });

    if (!response.ok) throw new Error(`[inertia-forms] Option search failed (${response.status}).`);

    const body = (await response.json()) as { options?: FieldOption[] };
    return Array.isArray(body.options) ? body.options : [];
}

/**
 * Wait until the user pauses typing before searching.
 */
export const SEARCH_DELAY = 250;
