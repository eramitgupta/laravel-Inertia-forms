/**
 * Keep only the characters an OtpInput accepts: digits, or digits and
 * upper-cased letters when `alphanumeric`.
 */
export function cleanOtp(text: unknown, alphanumeric: boolean): string {
    const source = typeof text === 'string' || typeof text === 'number' ? String(text) : '';
    return alphanumeric
        ? source.toUpperCase().replace(/[^A-Z0-9]/g, '')
        : source.replace(/\D/g, '');
}

/**
 * Write `text` into the code starting at box `index` (never past the first
 * empty box). Returns the new code and the box to focus next.
 */
export function fillOtp(
    code: string,
    index: number,
    text: string,
    length: number,
): { code: string; focus: number } {
    const position = Math.min(Math.max(index, 0), code.length);
    const next = (code.slice(0, position) + text + code.slice(position + text.length)).slice(
        0,
        length,
    );
    return { code: next, focus: Math.min(position + text.length, length - 1) };
}

/**
 * The characters just typed into a box that already held `previous`: the
 * browser appends or prepends the new key to the old one.
 */
export function typedOtp(raw: string, previous: string, alphanumeric: boolean): string {
    const typed = cleanOtp(raw, alphanumeric);
    if (typed.length < 2 || !previous) return typed;
    if (typed.startsWith(previous)) return typed.slice(previous.length);
    if (typed.endsWith(previous)) return typed.slice(0, -previous.length);
    return typed;
}

/**
 * Remove the character in box `index` and close the gap.
 */
export function removeOtp(code: string, index: number): string {
    return index < 0 || index >= code.length ? code : code.slice(0, index) + code.slice(index + 1);
}

/**
 * Where to draw group separators: after these box indexes.
 */
export function otpSeparatorAfter(
    index: number,
    length: number,
    groupSize: number | null,
): boolean {
    return Boolean(
        groupSize && groupSize > 0 && index < length - 1 && (index + 1) % groupSize === 0,
    );
}
