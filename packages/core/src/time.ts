export interface TimeParts {
    hour: string;
    minute: string;
    second: string;
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

export function parseTime(value: string | null | undefined): TimeParts | null {
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?/.exec(value ?? '');
    return match ? { hour: match[1]!, minute: match[2]!, second: match[3] ?? '00' } : null;
}

export function formatTime(parts: TimeParts, withSeconds: boolean): string {
    return withSeconds
        ? `${parts.hour}:${parts.minute}:${parts.second}`
        : `${parts.hour}:${parts.minute}`;
}

export function hourOptions(): string[] {
    return Array.from({ length: 24 }, (_, hour) => pad(hour));
}

export function minuteOptions(step = 5): string[] {
    const size = Math.min(Math.max(Math.round(step), 1), 30);
    return Array.from({ length: Math.ceil(60 / size) }, (_, index) => pad(index * size));
}

export function secondOptions(): string[] {
    return Array.from({ length: 60 }, (_, second) => pad(second));
}

export function nowTime(withSeconds: boolean, step = 1): string {
    const now = new Date();
    const size = Math.min(Math.max(Math.round(step), 1), 30);
    const minute = Math.floor(now.getMinutes() / size) * size;
    return formatTime(
        { hour: pad(now.getHours()), minute: pad(minute), second: pad(now.getSeconds()) },
        withSeconds,
    );
}

export function isTimeOutsideLimits(
    value: string,
    min?: string | null,
    max?: string | null,
): boolean {
    return Boolean((min && value < min) || (max && value > max));
}
