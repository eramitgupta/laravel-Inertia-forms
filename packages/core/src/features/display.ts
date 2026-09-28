import type { CalloutTone, DisplayFieldSchema } from '../types';

/**
 * Tailwind classes and icons for the display feature. Merged into `classes`
 * and `icons` in classes.ts / icons.ts. Keep every class string literal.
 */
export const displayClasses = {
    /** Wrapper of every display field in the grid. */
    displayField: 'min-w-0',
    displayHeading1:
        'text-2xl font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-100',
    displayHeading2:
        'text-xl font-semibold tracking-tight text-balance text-zinc-900 dark:text-zinc-100',
    displayHeading3: 'text-lg font-semibold text-balance text-zinc-900 dark:text-zinc-100',
    displayHeading4: 'text-base font-semibold text-zinc-900 dark:text-zinc-100',
    displayText: 'text-sm leading-6 text-pretty text-zinc-600 dark:text-zinc-400',
    displayHtml:
        'text-sm leading-6 text-zinc-700 dark:text-zinc-300 [&_a]:font-medium [&_a]:text-[var(--erag-form-accent,#4f46e5)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline [&_b]:font-semibold [&_b]:text-zinc-900 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_em]:italic [&_i]:italic [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-zinc-900 [&_ul]:list-disc [&_ul]:pl-5 [&>*+*]:mt-3 dark:[&_b]:text-zinc-100 dark:[&_code]:bg-zinc-800 dark:[&_strong]:text-zinc-100',
    displaySeparator: 'border-0 border-t border-zinc-200 dark:border-zinc-800',
    displaySeparatorNone: 'my-0',
    displaySeparatorSm: 'my-1',
    displaySeparatorMd: 'my-3',
    displaySeparatorLg: 'my-6',
    callout: 'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
    calloutInfo:
        'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100',
    calloutSuccess:
        'border-green-200 bg-green-50 text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100',
    calloutWarning:
        'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
    calloutDanger:
        'border-red-200 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100',
    calloutIcon: 'mt-0.5 size-5 shrink-0',
    calloutIconInfo: 'text-blue-600 dark:text-blue-400',
    calloutIconSuccess: 'text-green-600 dark:text-green-400',
    calloutIconWarning: 'text-amber-600 dark:text-amber-400',
    calloutIconDanger: 'text-red-600 dark:text-red-400',
    calloutContent: 'grid min-w-0 flex-1 gap-1',
    calloutTitle: 'font-semibold',
    calloutBody: 'leading-6 opacity-90',
} as const;

export const displayIcons = {
    circleInfo: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01',
    circleCheck: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM8 12l3 3 5-6',
    triangleAlert:
        'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01',
    circleX: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6',
} as const;

type DisplayIconName = keyof typeof displayIcons;

const TONES: Record<CalloutTone, true> = { info: true, success: true, warning: true, danger: true };

const TONE_CLASSES: Record<
    CalloutTone,
    { box: string; icon: string; defaultIcon: DisplayIconName }
> = {
    info: {
        box: displayClasses.calloutInfo,
        icon: displayClasses.calloutIconInfo,
        defaultIcon: 'circleInfo',
    },
    success: {
        box: displayClasses.calloutSuccess,
        icon: displayClasses.calloutIconSuccess,
        defaultIcon: 'circleCheck',
    },
    warning: {
        box: displayClasses.calloutWarning,
        icon: displayClasses.calloutIconWarning,
        defaultIcon: 'triangleAlert',
    },
    danger: {
        box: displayClasses.calloutDanger,
        icon: displayClasses.calloutIconDanger,
        defaultIcon: 'circleX',
    },
};

const SEPARATOR_SPACING = {
    none: displayClasses.displaySeparatorNone,
    sm: displayClasses.displaySeparatorSm,
    md: displayClasses.displaySeparatorMd,
    lg: displayClasses.displaySeparatorLg,
} as const;

/**
 * Heading level from 1 to 4 (3 when missing), and its classes.
 */
export function headingLevel(field: DisplayFieldSchema): 1 | 2 | 3 | 4 {
    const level = Math.round(Number(field.level ?? 3)) || 3;
    return Math.min(Math.max(level, 1), 4) as 1 | 2 | 3 | 4;
}

export function headingClass(field: DisplayFieldSchema): string {
    return displayClasses[`displayHeading${headingLevel(field)}`];
}

export function separatorClass(field: DisplayFieldSchema): string {
    const spacing = SEPARATOR_SPACING[field.spacing ?? 'md'] ?? SEPARATOR_SPACING.md;
    return `${displayClasses.displaySeparator} ${spacing}`;
}

export function calloutTone(field: DisplayFieldSchema): CalloutTone {
    return field.tone && TONES[field.tone] ? field.tone : 'info';
}

/**
 * Callout classes, role and icon. Warnings and dangers are announced right away
 * (`alert`), info and success politely (`status`). A custom icon must be a
 * package icon name; unknown names fall back to the tone's icon.
 */
export function calloutParts(
    field: DisplayFieldSchema,
    iconNames: Record<string, string>,
): {
    tone: CalloutTone;
    className: string;
    iconClass: string;
    icon: string;
    /** SVG markup sent by Laravel, drawn instead of `icon`. */
    svg: string | null;
    role: 'alert' | 'status';
} {
    const tone = calloutTone(field);
    const parts = TONE_CLASSES[tone];
    const custom =
        field.icon && Object.prototype.hasOwnProperty.call(iconNames, field.icon)
            ? field.icon
            : null;
    return {
        tone,
        className: `${displayClasses.callout} ${parts.box}`,
        iconClass: `${displayClasses.calloutIcon} ${parts.icon}`,
        icon: custom ?? parts.defaultIcon,
        svg: field.iconSvg ?? null,
        role: tone === 'warning' || tone === 'danger' ? 'alert' : 'status',
    };
}
