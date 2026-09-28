<script module lang="ts">
    interface EyeDropperWindow {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    }
</script>

<script lang="ts">
    import { untrack } from 'svelte';
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
    } from '../core';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';
    import ClearButton from './ClearButton.svelte';

    /**
     * Color dropdown: preset swatches, hue / saturation / lightness sliders,
     * a hex field, the browser eyedropper (when supported), and copy.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<ColorPickerSchema> = $props();

    const popover = createPopover();
    const color = $derived(typeof value === 'string' ? value : '');
    const hex = $derived(normalizeHex(color));
    const locked = $derived(disabled || field.readonly);
    let hsl = $state<Hsl>(untrack(() => hexToHsl(hex ?? '#000000')));
    let text = $state(untrack(() => color));
    let copied = $state(false);
    const eyeDropper =
        typeof window !== 'undefined' ? (window as EyeDropperWindow).EyeDropper : undefined;

    $effect.pre(() => {
        const current = color;
        const next = hex;
        untrack(() => {
            // Keep the sliders on the chosen hue when the value is a gray (saturation 0).
            if (next && next !== hslToHex(hsl)) hsl = hexToHsl(next);
            text = current;
        });
    });

    $effect(() => {
        if (!copied) return;
        const timer = setTimeout(() => (copied = false), 1500);
        return () => clearTimeout(timer);
    });

    const sliders = $derived<
        Array<{ key: keyof Hsl; label: string; max: number; background: string }>
    >([
        { key: 'h', label: 'Hue', max: 360, background: hueGradient },
        { key: 's', label: 'Saturation', max: 100, background: saturationGradient(hsl) },
        { key: 'l', label: 'Lightness', max: 100, background: lightnessGradient(hsl) },
    ]);

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function slide(next: Hsl) {
        hsl = next;
        update(hslToHex(next));
    }

    function pickHex(next: string) {
        const normalized = normalizeHex(next);
        if (!normalized) return;
        hsl = hexToHsl(normalized);
        update(normalized);
    }

    function pickFromScreen() {
        if (!eyeDropper) return;
        new eyeDropper()
            .open()
            .then((result) => pickHex(result.sRGBHex))
            .catch(() => undefined);
    }

    function copy() {
        if (!hex) return;
        navigator.clipboard
            ?.writeText(hex.toUpperCase())
            .then(() => (copied = true))
            .catch(() => undefined);
    }
</script>

<div bind:this={popover.root} class={classes.popoverAnchor}>
    <div
        class={classes.trigger}
        data-open={popover.open || undefined}
        aria-disabled={locked || undefined}
        aria-invalid={error ? true : undefined}
    >
        <!-- svelte-ignore a11y_autofocus, a11y_role_supports_aria_props_implicit -->
        <button
            {id}
            type="button"
            class={classes.triggerButton}
            aria-haspopup="dialog"
            aria-expanded={popover.open}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={field.required || undefined}
            disabled={locked}
            autofocus={field.autofocus}
            onclick={() => !locked && popover.setOpen(!popover.open)}
        >
            <span
                class={classes.colorChip}
                style:background-color={hex ?? 'transparent'}
                aria-hidden="true"
            ></span>
            <span
                class={color
                    ? `${classes.triggerValue} font-mono uppercase`
                    : classes.triggerPlaceholder}
                >{color || field.placeholder || 'Pick a color'}</span
            >
        </button>
        {#if field.clearable && color && !locked}
            <ClearButton label={field.label} onClear={() => update('')} />
        {/if}
        <Icon name={popover.open ? 'chevronUp' : 'chevronDown'} class={classes.icon} />
    </div>
    {#if popover.open}
        <div
            bind:this={popover.panel}
            role="dialog"
            aria-label={field.label}
            class={popover.panelClass()}
        >
            <div class={classes.colorPanel}>
                {#if field.swatches.length > 0}
                    <div class={classes.swatches}>
                        {#each field.swatches as swatch (swatch)}
                            <button
                                type="button"
                                aria-label={swatch}
                                aria-pressed={swatch.toLowerCase() === hex}
                                class={classes.swatch}
                                style:background-color={swatch}
                                onclick={() => {
                                    pickHex(swatch);
                                    popover.setOpen(false);
                                }}
                            ></button>
                        {/each}
                    </div>
                {/if}
                {#each sliders as slider (slider.key)}
                    <label class={classes.colorSliderGroup}>
                        <span class={classes.colorSliderLabel}>{slider.label}</span>
                        <input
                            type="range"
                            min={0}
                            max={slider.max}
                            value={hsl[slider.key]}
                            class={classes.colorSlider}
                            style:background={slider.background}
                            oninput={(event) =>
                                slide({ ...hsl, [slider.key]: Number(event.currentTarget.value) })}
                        />
                    </label>
                {/each}
                <div class={classes.colorFooter}>
                    <span
                        class={classes.colorPreview}
                        style:background-color={hex ?? 'transparent'}
                        aria-hidden="true"
                    ></span>
                    <input
                        type="text"
                        value={text}
                        placeholder="#000000"
                        maxlength={7}
                        spellcheck={false}
                        aria-label={`${field.label} hex code`}
                        class={classes.colorHex}
                        oninput={(event) => {
                            text = event.currentTarget.value;
                            pickHex(event.currentTarget.value);
                        }}
                        onblur={() => (text = color)}
                        onkeydown={(event) => {
                            if (event.key !== 'Enter') return;
                            event.preventDefault();
                            popover.setOpen(false);
                        }}
                    />
                    {#if eyeDropper}
                        <button
                            type="button"
                            class={classes.colorTool}
                            aria-label="Pick a color from the screen"
                            onclick={pickFromScreen}
                        >
                            <Icon name="eyedropper" class="size-4" />
                        </button>
                    {/if}
                    <button
                        type="button"
                        class={classes.colorTool}
                        aria-label={copied ? 'Copied' : 'Copy hex code'}
                        disabled={!hex}
                        onclick={copy}
                    >
                        <Icon name={copied ? 'check' : 'copy'} class="size-4" />
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
