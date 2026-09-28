/**
 * Color helpers for the ColorPicker sliders. Values travel as lowercase
 * `#rrggbb`; the sliders work in HSL (hue 0–360, saturation and lightness 0–100).
 */
export interface Hsl {
    h: number;
    s: number;
    l: number;
}

/**
 * `#abc`, `abc`, `#AABBCC` → `#aabbcc`, or null when the text is not a hex color.
 */
export function normalizeHex(value: string | null | undefined): string | null {
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((value ?? '').trim());
    if (!match) return null;
    const digits = match[1]!.toLowerCase();
    return digits.length === 3
        ? `#${[...digits].map((digit) => digit + digit).join('')}`
        : `#${digits}`;
}

export function hexToHsl(hex: string): Hsl {
    const normalized = normalizeHex(hex) ?? '#000000';
    const [r, g, b] = [1, 3, 5].map(
        (index) => parseInt(normalized.slice(index, index + 2), 16) / 255,
    ) as [number, number, number];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let saturation = 0;

    if (delta !== 0) {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));
        if (max === r) hue = ((g - b) / delta) % 6;
        else if (max === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue = (hue * 60 + 360) % 360;
    }

    return { h: Math.round(hue), s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

export function hslToHex({ h, s, l }: Hsl): string {
    const saturation = Math.min(Math.max(s, 0), 100) / 100;
    const lightness = Math.min(Math.max(l, 0), 100) / 100;
    const amount = saturation * Math.min(lightness, 1 - lightness);
    const channel = (offset: number) => {
        const k = (offset + h / 30) % 12;
        const value = lightness - amount * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(value * 255)
            .toString(16)
            .padStart(2, '0');
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`;
}

export const hueGradient =
    'linear-gradient(to right, #ff0000, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000)';

export function saturationGradient({ h, l }: Hsl): string {
    return `linear-gradient(to right, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`;
}

export function lightnessGradient({ h, s }: Hsl): string {
    return `linear-gradient(to right, hsl(${h} ${s}% 0%), hsl(${h} ${s}% 50%), hsl(${h} ${s}% 100%))`;
}
