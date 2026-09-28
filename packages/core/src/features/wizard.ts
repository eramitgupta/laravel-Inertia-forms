/**
 * Tailwind classes and icons for the wizard feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const wizardClasses = {
    wizardNav: 'w-full',
    /** Narrow screens: only the current step. */
    wizardCompact: 'grid gap-2 sm:hidden',
    wizardCompactCount:
        'text-xs font-semibold tracking-wide text-[var(--erag-form-accent,#4f46e5)] uppercase',
    wizardCompactTitle: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    wizardCompactTrack: 'h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
    wizardCompactBar:
        'block h-full rounded-full bg-[var(--erag-form-accent,#4f46e5)] transition-[width] duration-300',
    /** Wider screens: every step with connectors. */
    wizardList: 'hidden items-center gap-3 sm:flex',
    wizardItem: 'flex min-w-0 flex-1 items-center gap-3 last:flex-none',
    wizardStepButton:
        'group flex min-w-0 cursor-pointer items-center gap-3 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-offset-4 focus-visible:outline-none dark:focus-visible:ring-offset-zinc-900',
    wizardStepStatic: 'flex min-w-0 items-center gap-3',
    wizardCircle:
        'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums transition-colors',
    wizardCircleComplete:
        'border-[var(--erag-form-accent,#4f46e5)] bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_10%,transparent)] text-[var(--erag-form-accent,#4f46e5)] group-hover:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_18%,transparent)]',
    wizardCircleCurrent:
        'border-[var(--erag-form-accent,#4f46e5)] bg-[var(--erag-form-accent,#4f46e5)] text-white ring-4 ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_18%,transparent)]',
    wizardCircleUpcoming:
        'border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400',
    wizardCircleIcon: 'size-4',
    wizardStepText: 'grid min-w-0 gap-0.5',
    wizardStepTitle: 'truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    wizardStepTitleUpcoming: 'truncate text-sm font-semibold text-zinc-500 dark:text-zinc-400',
    wizardStepDescription: 'truncate text-xs text-zinc-500 dark:text-zinc-400',
    wizardConnector: 'h-0.5 min-w-4 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700',
    wizardConnectorComplete:
        'h-0.5 min-w-4 flex-1 rounded-full bg-[var(--erag-form-accent,#4f46e5)]',
    /** Back on the left, Continue or the submit buttons on the right. */
    wizardFooter:
        'flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800',
    wizardActions: 'flex flex-1 flex-wrap items-center justify-end gap-3',
} as const;

export const wizardIcons = {
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    briefcase:
        'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM3 13h18',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4',
    mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM3 7l9 6 9-6',
    lock: 'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM8 11V7a4 4 0 1 1 8 0v4',
    mapPin: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    creditCard:
        'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM2 10h20M6 15h4',
    sliders: 'M4 6h9M17 6h3M15 4v4M4 12h3M11 12h9M9 10v4M4 18h11M19 18h1M17 16v4',
    fileText:
        'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h6',
    home: 'M3 11 12 3l9 8M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5',
    flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
} as const;
