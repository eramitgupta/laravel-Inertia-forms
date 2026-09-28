import { useEffect, useState } from 'react';
import {
    classes,
    hexToHsl,
    hslToHex,
    hueGradient,
    lightnessGradient,
    normalizeHex,
    saturationGradient,
    type ColorPickerSchema,
    type Hsl,
} from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import { ClearButton } from './ClearButton';

interface EyeDropperWindow {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
}

/**
 * Color dropdown: preset swatches, hue / saturation / lightness sliders,
 * a hex field, the browser eyedropper (when supported), and copy.
 */
export function ColorPicker({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<ColorPickerSchema>) {
    const { root, panel, open, setOpen, panelClass } = usePopover();
    const color = typeof value === 'string' ? value : '';
    const hex = normalizeHex(color);
    const locked = disabled || field.readonly;
    const [hsl, setHsl] = useState<Hsl>(() => hexToHsl(hex ?? '#000000'));
    const [text, setText] = useState(color);
    const [copied, setCopied] = useState(false);
    const eyeDropper =
        typeof window !== 'undefined' ? (window as EyeDropperWindow).EyeDropper : undefined;

    useEffect(() => {
        // Keep the sliders on the chosen hue when the value is a gray (saturation 0).
        if (hex && hex !== hslToHex(hsl)) setHsl(hexToHsl(hex));
        setText(color);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    function slide(next: Hsl) {
        setHsl(next);
        onChange(hslToHex(next));
    }

    function pickHex(next: string) {
        const normalized = normalizeHex(next);
        if (!normalized) return;
        setHsl(hexToHsl(normalized));
        onChange(normalized);
    }

    const sliders: Array<{ key: keyof Hsl; label: string; max: number; background: string }> = [
        { key: 'h', label: 'Hue', max: 360, background: hueGradient },
        { key: 's', label: 'Saturation', max: 100, background: saturationGradient(hsl) },
        { key: 'l', label: 'Lightness', max: 100, background: lightnessGradient(hsl) },
    ];

    return (
        <div ref={root} className={classes.popoverAnchor}>
            <div
                className={classes.trigger}
                data-open={open || undefined}
                aria-disabled={locked || undefined}
                aria-invalid={error ? true : undefined}
            >
                <button
                    id={id}
                    type="button"
                    className={classes.triggerButton}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    aria-required={field.required || undefined}
                    disabled={locked}
                    autoFocus={field.autofocus}
                    onClick={() => !locked && setOpen(!open)}
                >
                    <span
                        className={classes.colorChip}
                        style={{ backgroundColor: hex ?? 'transparent' }}
                        aria-hidden="true"
                    />
                    <span
                        className={
                            color
                                ? `${classes.triggerValue} font-mono uppercase`
                                : classes.triggerPlaceholder
                        }
                    >
                        {color || field.placeholder || 'Pick a color'}
                    </span>
                </button>
                {field.clearable && color && !locked && (
                    <ClearButton label={field.label} onClear={() => onChange('')} />
                )}
                <Icon name={open ? 'chevronUp' : 'chevronDown'} className={classes.icon} />
            </div>
            {open && (
                <div ref={panel} role="dialog" aria-label={field.label} className={panelClass()}>
                    <div className={classes.colorPanel}>
                        {field.swatches.length > 0 && (
                            <div className={classes.swatches}>
                                {field.swatches.map((swatch) => (
                                    <button
                                        key={swatch}
                                        type="button"
                                        aria-label={swatch}
                                        aria-pressed={swatch.toLowerCase() === hex}
                                        className={classes.swatch}
                                        style={{ backgroundColor: swatch }}
                                        onClick={() => {
                                            pickHex(swatch);
                                            setOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        {sliders.map((slider) => (
                            <label key={slider.key} className={classes.colorSliderGroup}>
                                <span className={classes.colorSliderLabel}>{slider.label}</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={slider.max}
                                    value={hsl[slider.key]}
                                    className={classes.colorSlider}
                                    style={{ background: slider.background }}
                                    onChange={(event) =>
                                        slide({ ...hsl, [slider.key]: Number(event.target.value) })
                                    }
                                />
                            </label>
                        ))}
                        <div className={classes.colorFooter}>
                            <span
                                className={classes.colorPreview}
                                style={{ backgroundColor: hex ?? 'transparent' }}
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                value={text}
                                placeholder="#000000"
                                maxLength={7}
                                spellCheck={false}
                                aria-label={`${field.label} hex code`}
                                className={classes.colorHex}
                                onChange={(event) => {
                                    setText(event.target.value);
                                    pickHex(event.target.value);
                                }}
                                onBlur={() => setText(color)}
                                onKeyDown={(event) => {
                                    if (event.key !== 'Enter') return;
                                    event.preventDefault();
                                    setOpen(false);
                                }}
                            />
                            {eyeDropper && (
                                <button
                                    type="button"
                                    className={classes.colorTool}
                                    aria-label="Pick a color from the screen"
                                    onClick={() => {
                                        new eyeDropper()
                                            .open()
                                            .then((result) => pickHex(result.sRGBHex))
                                            .catch(() => undefined);
                                    }}
                                >
                                    <Icon name="eyedropper" className="size-4" />
                                </button>
                            )}
                            <button
                                type="button"
                                className={classes.colorTool}
                                aria-label={copied ? 'Copied' : 'Copy hex code'}
                                disabled={!hex}
                                onClick={() => {
                                    if (!hex) return;
                                    navigator.clipboard
                                        ?.writeText(hex.toUpperCase())
                                        .then(() => setCopied(true))
                                        .catch(() => undefined);
                                }}
                            >
                                <Icon name={copied ? 'check' : 'copy'} className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
