/**
 * Tailwind classes and icons for the composer feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const composerClasses = {
    composer: 'grid min-w-0 gap-2',
    composerReplies: 'flex flex-wrap gap-2',
    composerReply:
        'rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-xs transition hover:border-[var(--erag-form-accent,#4f46e5)] hover:text-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
    /** One bordered box: the message, attachment cards, a divider and the footer row. */
    composerBox:
        'flex min-w-0 flex-col rounded-xl border border-zinc-300 bg-white shadow-xs transition focus-within:border-[var(--erag-form-accent,#4f46e5)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] has-aria-invalid:border-red-500 data-disabled:bg-zinc-50 data-dragging:border-[var(--erag-form-accent,#4f46e5)] data-dragging:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_5%,transparent)] dark:border-zinc-700 dark:bg-zinc-900 dark:data-disabled:bg-zinc-800',
    composerInput:
        'block max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent px-4 pt-3 pb-2 text-sm/6 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500',
    composerFiles: 'flex flex-wrap gap-2 px-3 pb-3',
    composerFile:
        'flex w-60 max-w-full min-w-0 items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 pr-2 dark:border-zinc-700 dark:bg-zinc-800/60',
    composerFileIcon:
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_12%,transparent)] text-[var(--erag-form-accent,#4f46e5)]',
    composerFileGlyph: 'size-4.5',
    composerFileText: 'grid min-w-0 flex-1 leading-tight',
    composerFileName: 'truncate text-sm font-medium text-zinc-800 dark:text-zinc-100',
    composerFileSize: 'text-xs text-zinc-500 tabular-nums dark:text-zinc-400',
    composerFileRemove:
        'inline-flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
    composerRemoveIcon: 'size-3.5',
    composerFooter:
        'flex items-center gap-2 border-t border-zinc-200 px-2 py-2 dark:border-zinc-700',
    composerAttach:
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    composerAttachIcon: 'size-5',
    composerActions: 'ml-auto flex items-center gap-3',
    composerCounter: 'text-xs text-zinc-400 tabular-nums',
    composerSend:
        'inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--erag-form-accent,#4f46e5)] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-zinc-900',
    composerSendIcon: 'size-4',
    composerHint: 'text-xs text-zinc-500 dark:text-zinc-400',
    composerKbd:
        'rounded border border-zinc-200 bg-zinc-50 px-1 py-px font-sans text-[0.6875rem] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
} as const;

/** Hand-drawn 24×24 stroke paths. */
export const composerIcons = {
    composerPaperclip:
        'M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.3-8.3a3.3 3.3 0 0 1 4.7 4.7l-8.3 8.3a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6',
    composerFile:
        'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8ZM14 3v5h5M9 13h6M9 17h4',
    composerSend: 'M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5Z',
} as const;
