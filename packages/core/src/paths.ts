/**
 * Read a dotted path like `address.city` from nested data.
 */
export function getPath(data: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((current, segment) => {
        if (current === null || typeof current !== 'object') return undefined;
        return (current as Record<string, unknown>)[segment];
    }, data);
}

/**
 * Return a copy of `data` with the dotted `path` set to `value`.
 */
export function setPath<T extends Record<string, unknown>>(
    data: T,
    path: string,
    value: unknown,
): T {
    const [head, ...rest] = path.split('.');
    if (head === undefined) return data;
    const copy: Record<string, unknown> = Array.isArray(data)
        ? ([...(data as unknown[])] as never)
        : { ...data };
    if (rest.length === 0) {
        copy[head] = value;
        return copy as T;
    }
    const child = copy[head];
    copy[head] = setPath(
        child !== null && typeof child === 'object' ? (child as Record<string, unknown>) : {},
        rest.join('.'),
        value,
    );
    return copy as T;
}
