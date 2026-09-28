<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
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
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import ClearButton from './ClearButton.vue';

interface EyeDropperWindow {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
}

/**
 * Color dropdown: preset swatches, hue / saturation / lightness sliders,
 * a hex field, the browser eyedropper (when supported), and copy.
 */
const props = defineProps<FieldComponentProps<ColorPickerSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const { root, panel, open, setOpen, panelClass } = usePopover();
const color = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''));
const hex = computed(() => normalizeHex(color.value));
const locked = computed(() => props.disabled || props.field.readonly);
const hsl = ref<Hsl>(hexToHsl(hex.value ?? '#000000'));
const text = ref(color.value);
const copied = ref(false);
const eyeDropper =
    typeof window !== 'undefined' ? (window as EyeDropperWindow).EyeDropper : undefined;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Keep the sliders on the chosen hue when the value is a gray (saturation 0).
 */
watch(color, () => {
    if (hex.value && hex.value !== hslToHex(hsl.value)) hsl.value = hexToHsl(hex.value);
    text.value = color.value;
});

watch(copied, (isCopied) => {
    clearTimeout(copiedTimer);
    if (isCopied) copiedTimer = setTimeout(() => (copied.value = false), 1500);
});

onBeforeUnmount(() => clearTimeout(copiedTimer));

const sliders = computed<Array<{ key: keyof Hsl; label: string; max: number; background: string }>>(
    () => [
        { key: 'h', label: 'Hue', max: 360, background: hueGradient },
        { key: 's', label: 'Saturation', max: 100, background: saturationGradient(hsl.value) },
        { key: 'l', label: 'Lightness', max: 100, background: lightnessGradient(hsl.value) },
    ],
);

function toggle() {
    if (!locked.value) setOpen(!open.value);
}

function slide(key: keyof Hsl, event: Event) {
    const next = { ...hsl.value, [key]: Number((event.target as HTMLInputElement).value) };
    hsl.value = next;
    emit('update:modelValue', hslToHex(next));
}

function pickHex(next: string) {
    const normalized = normalizeHex(next);
    if (!normalized) return;
    hsl.value = hexToHsl(normalized);
    emit('update:modelValue', normalized);
}

function pickSwatch(swatch: string) {
    pickHex(swatch);
    setOpen(false);
}

function typeHex(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    text.value = value;
    pickHex(value);
}

function hexKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    setOpen(false);
}

function pickFromScreen() {
    if (!eyeDropper) return;
    new eyeDropper()
        .open()
        .then((result) => pickHex(result.sRGBHex))
        .catch(() => undefined);
}

function copy() {
    if (!hex.value) return;
    navigator.clipboard
        ?.writeText(hex.value.toUpperCase())
        .then(() => (copied.value = true))
        .catch(() => undefined);
}
</script>

<template>
    <div ref="root" :class="classes.popoverAnchor">
        <div
            :class="classes.trigger"
            :data-open="open || undefined"
            :aria-disabled="locked || undefined"
            :aria-invalid="error ? true : undefined"
        >
            <button
                :id="id"
                type="button"
                :class="classes.triggerButton"
                aria-haspopup="dialog"
                :aria-expanded="open"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="describedBy"
                :aria-required="field.required || undefined"
                :disabled="locked"
                :autofocus="field.autofocus"
                @click="toggle"
            >
                <span
                    :class="classes.colorChip"
                    :style="{ backgroundColor: hex ?? 'transparent' }"
                    aria-hidden="true"
                />
                <span
                    :class="
                        color
                            ? `${classes.triggerValue} font-mono uppercase`
                            : classes.triggerPlaceholder
                    "
                    >{{ color || field.placeholder || 'Pick a color' }}</span
                >
            </button>
            <ClearButton
                v-if="field.clearable && color && !locked"
                :label="field.label"
                @clear="emit('update:modelValue', '')"
            />
            <Icon :name="open ? 'chevronUp' : 'chevronDown'" :class="classes.icon" />
        </div>
        <div v-if="open" ref="panel" role="dialog" :aria-label="field.label" :class="panelClass()">
            <div :class="classes.colorPanel">
                <div v-if="field.swatches.length > 0" :class="classes.swatches">
                    <button
                        v-for="swatch in field.swatches"
                        :key="swatch"
                        type="button"
                        :aria-label="swatch"
                        :aria-pressed="swatch.toLowerCase() === hex"
                        :class="classes.swatch"
                        :style="{ backgroundColor: swatch }"
                        @click="pickSwatch(swatch)"
                    />
                </div>
                <label
                    v-for="slider in sliders"
                    :key="slider.key"
                    :class="classes.colorSliderGroup"
                >
                    <span :class="classes.colorSliderLabel">{{ slider.label }}</span>
                    <input
                        type="range"
                        :min="0"
                        :max="slider.max"
                        :value="hsl[slider.key]"
                        :class="classes.colorSlider"
                        :style="{ background: slider.background }"
                        @input="slide(slider.key, $event)"
                    />
                </label>
                <div :class="classes.colorFooter">
                    <span
                        :class="classes.colorPreview"
                        :style="{ backgroundColor: hex ?? 'transparent' }"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        :value="text"
                        placeholder="#000000"
                        :maxlength="7"
                        :spellcheck="false"
                        :aria-label="`${field.label} hex code`"
                        :class="classes.colorHex"
                        @input="typeHex"
                        @blur="text = color"
                        @keydown="hexKeydown"
                    />
                    <button
                        v-if="eyeDropper"
                        type="button"
                        :class="classes.colorTool"
                        aria-label="Pick a color from the screen"
                        @click="pickFromScreen"
                    >
                        <Icon name="eyedropper" class="size-4" />
                    </button>
                    <button
                        type="button"
                        :class="classes.colorTool"
                        :aria-label="copied ? 'Copied' : 'Copy hex code'"
                        :disabled="!hex"
                        @click="copy"
                    >
                        <Icon :name="copied ? 'check' : 'copy'" class="size-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
