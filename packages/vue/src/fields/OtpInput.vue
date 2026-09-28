<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
    classes,
    cleanOtp,
    fillOtp,
    otpSeparatorAfter,
    removeOtp,
    typedOtp,
    type OtpInputSchema,
} from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/**
 * A one-time code, one box per character. Typing moves to the next box,
 * Backspace goes back, paste and browser autofill fill several boxes at once.
 */
const props = defineProps<FieldComponentProps<OtpInputSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const length = computed(() => props.field.length);
const code = computed(() =>
    cleanOtp(props.modelValue, props.field.alphanumeric).slice(0, length.value),
);
const locked = computed(() => props.disabled || props.field.readonly);
const noun = computed(() => (props.field.alphanumeric ? 'Character' : 'Digit'));
const boxes = ref<HTMLInputElement[]>([]);
let submitWhenComplete = false;
/** The code as last typed, so focus handlers see it before the parent updates. */
let pending: string | null = null;

watch(code, async (next) => {
    if (!submitWhenComplete || next.length < length.value) return;
    submitWhenComplete = false;
    await nextTick();
    boxes.value[0]?.form?.requestSubmit?.();
});

function focusBox(index: number) {
    const box = boxes.value[Math.min(Math.max(index, 0), length.value - 1)];
    box?.focus();
    box?.select();
}

function update(next: string) {
    if (next === code.value) return;
    submitWhenComplete =
        props.field.autoSubmit && code.value.length < length.value && next.length === length.value;
    pending = next;
    emit('update:modelValue', next);
    void nextTick(() => (pending = null));
}

function fill(index: number, text: string) {
    const next = fillOtp(code.value, index, text, length.value);
    update(next.code);
    focusBox(next.focus);
}

function input(index: number, event: Event) {
    const box = event.target as HTMLInputElement;
    const raw = box.value;
    box.value = code.value[index] ?? '';
    if (locked.value) return;
    const typed = typedOtp(raw, code.value[index] ?? '', props.field.alphanumeric);
    if (typed) fill(index, typed);
    else if (raw === '') update(removeOtp(code.value, index));
}

function keydown(index: number, event: KeyboardEvent) {
    if (locked.value) return;
    if (event.key === 'Backspace') {
        event.preventDefault();
        const position = code.value[index] ? index : index - 1;
        if (position < 0) return;
        update(removeOtp(code.value, position));
        focusBox(position);
    } else if (event.key === 'Delete') {
        event.preventDefault();
        update(removeOtp(code.value, index));
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusBox(Math.min(index + 1, code.value.length));
    } else if (event.key === 'Home') {
        event.preventDefault();
        focusBox(0);
    } else if (event.key === 'End') {
        event.preventDefault();
        focusBox(code.value.length);
    }
}

function paste(index: number, event: ClipboardEvent) {
    event.preventDefault();
    if (locked.value) return;
    const pasted = cleanOtp(event.clipboardData?.getData('text') ?? '', props.field.alphanumeric);
    if (pasted) fill(index, pasted);
}

function focus(index: number) {
    const current = pending ?? code.value;
    if (index > current.length) focusBox(current.length);
}
</script>

<template>
    <div
        role="group"
        :aria-label="field.label"
        :aria-describedby="describedBy"
        :class="classes.otp"
    >
        <template v-for="index in length" :key="index">
            <input
                :ref="
                    (element) => {
                        if (element) boxes[index - 1] = element as HTMLInputElement;
                    }
                "
                :id="index === 1 ? id : `${id}-${index - 1}`"
                :type="field.masked ? 'password' : 'text'"
                :inputmode="field.alphanumeric ? 'text' : 'numeric'"
                :autocomplete="index === 1 ? 'one-time-code' : 'off'"
                :autocapitalize="field.alphanumeric ? 'characters' : 'off'"
                :spellcheck="false"
                :value="code[index - 1] ?? ''"
                :required="field.required && index === 1"
                :disabled="disabled"
                :readonly="field.readonly"
                :autofocus="field.autofocus && index === 1"
                :aria-label="`${noun} ${index} of ${length}`"
                :aria-invalid="error ? true : undefined"
                :class="classes.otpBox"
                @focus="focus(index - 1)"
                @input="input(index - 1, $event)"
                @keydown="keydown(index - 1, $event)"
                @paste="paste(index - 1, $event)"
            />
            <span
                v-if="otpSeparatorAfter(index - 1, length, field.groupSize)"
                aria-hidden="true"
                :class="classes.otpSeparator"
            />
        </template>
    </div>
</template>
