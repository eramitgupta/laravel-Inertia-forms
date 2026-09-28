/**
 * Date helpers for the calendar popover. Dates travel as `YYYY-MM-DD` strings
 * (and `YYYY-MM-DDTHH:MM` with time) so they compare correctly as text.
 */
export interface CalendarDay {
    iso: string;
    day: number;
    inMonth: boolean;
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

export function toIsoDate(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayIso(): string {
    return toIsoDate(new Date());
}

/**
 * Parse the date part of `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM` as a local date.
 */
export function parseIsoDate(value: string | null | undefined): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
}

export function datePart(value: string | null | undefined): string {
    return (value ?? '').slice(0, 10);
}

export function timePart(value: string | null | undefined): string {
    return (value ?? '').slice(11, 16);
}

/**
 * First day of the month that `value` falls in, or of today.
 */
export function monthStart(value?: string | null): Date {
    const date = parseIsoDate(value) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, count: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

/**
 * Six weeks of days for a month grid, starting on `firstDayOfWeek`.
 */
export function monthGrid(month: Date, firstDayOfWeek = 0): CalendarDay[] {
    const offset = (month.getDay() - firstDayOfWeek + 7) % 7;
    const start = new Date(month.getFullYear(), month.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
        return {
            iso: toIsoDate(date),
            day: date.getDate(),
            inMonth: date.getMonth() === month.getMonth(),
        };
    });
}

export function weekdayLabels(firstDayOfWeek = 0, locale?: string): string[] {
    const sunday = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(2024, 0, sunday.getDate() + ((firstDayOfWeek + index) % 7));
        return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date).slice(0, 2);
    });
}

export function monthLabel(month: Date, locale?: string): string {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
}

/**
 * Human text for an input value, like `Oct 4, 2026` or `Oct 4, 2026, 09:15`.
 */
export function formatDisplayDate(value: string | null | undefined, locale?: string): string {
    const date = parseIsoDate(value);
    if (!date) return '';
    const text = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
    const time = timePart(value);
    return time ? `${text}, ${time}` : text;
}

export function isOutsideLimits(iso: string, min?: string | null, max?: string | null): boolean {
    return Boolean((min && iso < datePart(min)) || (max && iso > datePart(max)));
}

/**
 * Next range after clicking `iso`: starts a new range, or completes it
 * (swapping when the second click is earlier than the first).
 */
export function nextRange(
    current: { start: string; end: string },
    iso: string,
): { start: string; end: string } {
    if (!current.start || current.end) return { start: iso, end: '' };
    return iso < current.start
        ? { start: iso, end: current.start }
        : { start: current.start, end: iso };
}
