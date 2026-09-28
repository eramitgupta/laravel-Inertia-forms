/**
 * Tailwind classes and icons for the slug feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const slugClasses = {
    slugPrefix:
        'block max-w-[55%] shrink-0 truncate bg-zinc-50 px-3 py-2 text-sm leading-5 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
} as const;

export const slugIcons = {
    /** Two arrows chasing each other round a circle. */
    slugRegenerate: 'M4 12a8 8 0 0 1 14.9-4M19 3v5h-5M20 12a8 8 0 0 1-14.9 4M5 21v-5h5',
} as const;
