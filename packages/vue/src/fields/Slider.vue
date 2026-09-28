<script setup lang="ts">
import { computed } from 'vue';
import { classes, type SliderSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<SliderSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const current = computed(() =>
    props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
        ? props.field.min
        : Number(props.modelValue),
);

function input(event: Event) {
    emit('update:modelValue', Number((event.target as HTMLInputElement).value));
}
</script>

<template>
    <div :class="classes.sliderRow">
        <input
            :id="id"
            :name="field.name"
            type="range"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :value="current"
            :disabled="disabled || field.readonly"
            :autofocus="field.autofocus"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :class="classes.slider"
            @input="input"
        />
        <output v-if="field.showValue" :for="id" :class="classes.sliderValue"
            >{{ current }}{{ field.suffix ?? '' }}</output
        >
    </div>
</template>
