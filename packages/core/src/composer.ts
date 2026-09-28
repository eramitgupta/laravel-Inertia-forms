import type { ComposerValue } from './types';

/**
 * A Composer value in its full shape, whatever was stored: a plain string
 * becomes the message and non-File attachments are dropped.
 */
export function composerValue(value: unknown): ComposerValue {
    if (typeof value === 'string') return { message: value, attachments: [] };
    if (!value || typeof value !== 'object') return { message: '', attachments: [] };
    const { message, attachments } = value as Partial<Record<keyof ComposerValue, unknown>>;
    return {
        message: typeof message === 'string' ? message : '',
        attachments: Array.isArray(attachments)
            ? attachments.filter(
                  (item): item is File => typeof File !== 'undefined' && item instanceof File,
              )
            : [],
    };
}

/** The file input `accept` attribute for extensions like `['pdf', 'png']`: `.pdf,.png`. */
export function composerAccept(extensions: readonly string[]): string | undefined {
    return extensions.length ? extensions.map((extension) => `.${extension}`).join(',') : undefined;
}

/** Whether the file name ends in one of the extensions (any file when there are none). */
export function acceptsFileName(name: string, extensions: readonly string[]): boolean {
    if (!extensions.length) return true;
    const dot = name.lastIndexOf('.');
    const extension = dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
    return extensions.some((item) => item.toLowerCase() === extension);
}

/**
 * Attachments after picking or dropping files: files with other extensions
 * are skipped and the list stops at `maxFiles`.
 */
export function addComposerAttachments<TFile extends { name: string }>(
    current: readonly TFile[],
    picked: readonly TFile[],
    field: { accept: readonly string[]; maxFiles: number | null },
): TFile[] {
    const next = [...current, ...picked.filter((file) => acceptsFileName(file.name, field.accept))];
    return field.maxFiles !== null ? next.slice(0, Math.max(field.maxFiles, 0)) : next;
}

/** Whether another file can be attached. */
export function composerHasRoom(field: { maxFiles: number | null }, count: number): boolean {
    return field.maxFiles === null || count < field.maxFiles;
}

/** Whether a drag carries files (not text being dragged into the textarea). */
export function dragHasFiles(transfer: { types?: ArrayLike<string> | null } | null): boolean {
    return Array.from(transfer?.types ?? []).includes('Files');
}
