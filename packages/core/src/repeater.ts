import { blockItems } from './tags';
import type { BlockItem, BlocksSchema } from './types';

/**
 * Whether a Blocks-shaped field is a Repeater (one item type, plain rows).
 */
export function isRepeater(field: Pick<BlocksSchema, 'component'>): boolean {
    return field.component === 'Repeater';
}

/**
 * Normalize a Repeater value (a plain list of row objects) into block items,
 * so the Blocks component can edit it the same way.
 */
export function repeaterItems(value: unknown, type: string): BlockItem[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter(
            (row): row is Record<string, unknown> =>
                Boolean(row) && typeof row === 'object' && !Array.isArray(row),
        )
        .map((row) => ({ type, data: row }));
}

/**
 * The plain rows a Repeater stores, from block items.
 */
export function repeaterRows(items: BlockItem[]): Record<string, unknown>[] {
    return items.map((item) => item.data);
}

/**
 * Items of a Blocks or Repeater field, as block items.
 */
export function builderItems(field: BlocksSchema, value: unknown): BlockItem[] {
    return isRepeater(field)
        ? repeaterItems(value, field.blocks[0]?.name ?? 'item')
        : blockItems(value);
}

/**
 * The stored value of a Blocks (`{type, data}` items) or Repeater (plain rows) field.
 */
export function builderValue(field: BlocksSchema, items: BlockItem[]): unknown[] {
    return isRepeater(field) ? repeaterRows(items) : items;
}

/**
 * Name of a field inside an item: `links.0.url` for a Repeater, `body.0.data.url` for Blocks.
 */
export function builderFieldName(field: BlocksSchema, index: number, name: string): string {
    return isRepeater(field)
        ? `${field.name}.${index}.${name}`
        : `${field.name}.${index}.data.${name}`;
}
