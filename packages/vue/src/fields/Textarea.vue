<script setup lang="ts">
import { computed, ref, watchPostEffect } from 'vue';
import { classes, cx, type TextareaSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<TextareaSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const textarea = ref<HTMLTextAreaElement | null>(null);
const text = computed(() =>
    props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue),
);

watchPostEffect(() => {
    const element = textarea.value;
    // Track the text so the height follows every change.
    void text.value;
    if (!props.field.autoResize || !element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
});

function input(event: Event) {
    emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
    <textarea
        :id="id"
        ref="textarea"
        :name="field.name"
        :rows="field.rows"
        :value="text"
        :placeholder="field.placeholder ?? undefined"
        :required="field.required"
        :disabled="disabled"
        :readonly="field.readonly"
        :autofocus="field.autofocus"
        :minlength="field.minLength ?? undefined"
        :maxlength="field.maxLength ?? undefined"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :class="
            cx(classes.input, classes.textarea, field.autoResize && 'resize-none overflow-hidden')
        "
        @input="input"
    />
    <p v-if="field.showCharacterCount" :class="classes.counter">
        {{ text.length }}{{ field.maxLength ? ` / ${field.maxLength}` : '' }}
    </p>
</template>
