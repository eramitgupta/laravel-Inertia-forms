/**
 * Tailwind classes and icons for the submit feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const submitClasses = {
    /** Consecutive submit buttons of a fieldset share one row. */
    submitGroup: 'col-span-full flex flex-wrap items-center gap-3',
    /** Added to the row of a full-width button so it takes the whole line. */
    submitRowFull: 'w-full basis-full',
    submitButton:
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-zinc-900',
    submitPrimary:
        'border border-transparent bg-[var(--erag-form-accent,#4f46e5)] text-white shadow-xs hover:brightness-110 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] disabled:hover:brightness-100',
    submitSecondary:
        'border border-zinc-300 bg-white text-zinc-800 shadow-xs hover:bg-zinc-50 focus-visible:ring-zinc-400 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900',
    submitDanger:
        'border border-transparent bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500 disabled:hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:hover:bg-red-500',
    submitOutline:
        'border border-[var(--erag-form-accent,#4f46e5)] bg-transparent text-[var(--erag-form-accent,#4f46e5)] hover:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_8%,transparent)] focus-visible:ring-[var(--erag-form-accent,#4f46e5)] disabled:hover:bg-transparent',
    submitGhost:
        'border border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-400 disabled:hover:bg-transparent dark:text-zinc-200 dark:hover:bg-zinc-800',
    submitLink:
        'rounded-sm text-[var(--erag-form-accent,#4f46e5)] underline-offset-4 hover:underline focus-visible:ring-[var(--erag-form-accent,#4f46e5)] disabled:hover:no-underline',
    submitSm: 'px-3 py-1.5 text-xs',
    submitMd: 'px-4 py-2 text-sm',
    submitLg: 'px-5 py-2.5 text-base',
    /** Sizes for the `link` variant, which has no padding. */
    submitLinkSm: 'text-xs',
    submitLinkMd: 'text-sm',
    submitLinkLg: 'text-base',
    submitFull: 'w-full',
    submitIcon: 'size-4 shrink-0',
    submitIconLg: 'size-5 shrink-0',
    /** Uses the text color, so it shows on every variant. */
    submitSpinner:
        'size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent',
} as const;

export const submitIcons = {
    send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
    arrowRight: 'M5 12h14M13 6l6 6-6 6',
    arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
    save: 'M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 3v5h8V3M7 21v-7h10v7',
} as const;
