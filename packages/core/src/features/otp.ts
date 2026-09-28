/**
 * Tailwind classes and icons for the otp feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const otpClasses = {
    otp: 'flex flex-wrap items-center gap-2',
    otpBox: 'size-11 rounded-lg border border-zinc-300 bg-white p-0 text-center text-lg font-semibold text-zinc-900 uppercase caret-[var(--erag-form-accent,#4f46e5)] shadow-xs tabular-nums transition focus:border-[var(--erag-form-accent,#4f46e5)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800',
    otpSeparator: 'h-0.5 w-3 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600',
} as const;

export const otpIcons = {} as const;
