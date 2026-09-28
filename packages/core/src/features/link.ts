/**
 * Tailwind classes and icons for the link feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const linkClasses = {
    link: 'grid gap-2',
    linkIcon: 'flex items-center pl-3 text-zinc-400 dark:text-zinc-500',
    linkOptions: 'flex flex-wrap items-stretch gap-2',
    linkText: 'min-w-0 flex-1 basis-48',
    linkHint: 'text-xs text-amber-600 dark:text-amber-400',
} as const;

export const linkIcons = {
    /** Two chain links joined by a bar. */
    linkChain: 'M10 16.5H7.5a4.5 4.5 0 0 1 0-9H10M14 7.5h2.5a4.5 4.5 0 0 1 0 9H14M8.5 12h7',
} as const;
