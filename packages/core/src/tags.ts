import type { BlockSchema, BlockItem, KeyValueRow } from './types';

/**
 * Split typed or pasted text into new tags, skipping blanks and duplicates.
 * Returns `current` itself when nothing was added.
 */
export function addTags(
    current: string[],
    text: string,
    options: { maxTags?: number | null; maxTagLength?: number | null } = {},
): string[] {
    const next = [...current];
    for (const raw of text.split(/[,\n]/)) {
        const tag = raw.trim();
        if (!tag || next.includes(tag)) continue;
        if (options.maxTagLength && tag.length > options.maxTagLength) continue;
        if (options.maxTags && next.length >= options.maxTags) break;
        next.push(tag);
    }
    return next.length === current.length ? current : next;
}

/**
 * Normalize a KeyValue value into editable rows.
 */
export function keyValueRows(value: unknown): KeyValueRow[] {
    if (!Array.isArray(value)) return [];
    return value.map((row) => ({
        key: String((row as Partial<KeyValueRow> | null)?.key ?? ''),
        value: String((row as Partial<KeyValueRow> | null)?.value ?? ''),
    }));
}

/**
 * Normalize a Blocks value into blocks with a type and a data object.
 */
export function blockItems(value: unknown): BlockItem[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is Partial<BlockItem> => Boolean(item) && typeof item === 'object')
        .map((item) => ({
            type: String(item.type ?? ''),
            data:
                item.data && typeof item.data === 'object' && !Array.isArray(item.data)
                    ? (item.data as Record<string, unknown>)
                    : {},
        }));
}

/**
 * Header title of a block: its `titleFrom()` field when filled in, else "Label N".
 */
export function blockTitle(block: BlockSchema, item: BlockItem, index: number): string {
    const fromField = block.titleFrom ? item.data[block.titleFrom] : null;
    return typeof fromField === 'string' && fromField.trim() !== ''
        ? fromField.trim()
        : `${block.label} ${index + 1}`;
}

/**
 * A fresh copy of a block's starting values.
 */
export function blockDefaults(block: BlockSchema): Record<string, unknown> {
    return JSON.parse(JSON.stringify(block.defaults ?? {})) as Record<string, unknown>;
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length)
        return items;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item as T);
    return next;
}
