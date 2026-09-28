<script setup lang="ts">
import { computed } from 'vue';
import { classes, cx, preventNumberWheel, type TextInputSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import ClearButton from './ClearButton.vue';

const props = defineProps<FieldComponentProps<TextInputSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const text = computed(() =>
    props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue),
);
const showClear = computed(
    () => props.field.clearable && text.value !== '' && !props.disabled && !props.field.readonly,
);
const grouped = computed(() =>
    Boolean(props.field.prefix || props.field.suffix || props.field.clearable),
);

function input(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <div v-if="grouped" :class="cx(classes.inputGroup)">
        <span v-if="field.prefix" :class="classes.addon">{{ field.prefix }}</span>
        <input
            :id="id"
            :name="field.name"
            :type="field.type"
            :value="text"
            :placeholder="field.placeholder ?? undefined"
            :required="field.required"
            :disabled="disabled"
            :readonly="field.readonly"
            :autofocus="field.autofocus"
            :autocomplete="field.autocomplete ?? undefined"
            :minlength="field.minLength ?? undefined"
            :maxlength="field.maxLength ?? undefined"
            :min="field.min ?? undefined"
            :max="field.max ?? undefined"
            :step="field.step ?? undefined"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :class="classes.inputGroupInput"
            @input="input"
            @wheel="preventNumberWheel"
        />
        <span v-if="showClear" :class="classes.addonEnd">
            <ClearButton :label="field.label" @clear="emit('update:modelValue', '')" />
        </span>
        <span v-if="field.suffix" :class="classes.addon">{{ field.suffix }}</span>
    </div>
    <input
        v-else
        :id="id"
        :name="field.name"
        :type="field.type"
        :value="text"
        :placeholder="field.placeholder ?? undefined"
        :required="field.required"
        :disabled="disabled"
        :readonly="field.readonly"
        :autofocus="field.autofocus"
        :autocomplete="field.autocomplete ?? undefined"
        :minlength="field.minLength ?? undefined"
        :maxlength="field.maxLength ?? undefined"
        :min="field.min ?? undefined"
        :max="field.max ?? undefined"
        :step="field.step ?? undefined"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :class="classes.input"
        @input="input"
        @wheel="preventNumberWheel"
    />
</template>
