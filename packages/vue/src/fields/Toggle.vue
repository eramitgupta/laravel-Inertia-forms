<script setup lang="ts">
import { computed } from 'vue';
import { classes, cx, type BooleanFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<BooleanFieldSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const checked = computed(() => props.modelValue === props.field.trueValue);
const stateLabel = computed(() => (checked.value ? props.field.onLabel : props.field.offLabel));

function toggle() {
    emit('update:modelValue', checked.value ? props.field.falseValue : props.field.trueValue);
}
</script>

<template>
    <div :class="classes.toggleRow">
        <button
            :id="id"
            type="button"
            role="switch"
            :aria-checked="checked"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :disabled="disabled || field.readonly"
            :autofocus="field.autofocus"
            :class="classes.toggleTrack"
            @click="toggle"
        >
            <span
                aria-hidden="true"
                :class="cx(classes.toggleThumb, checked && classes.toggleThumbOn)"
            />
        </button>
        <span v-if="stateLabel" :class="classes.toggleText" aria-hidden="true">{{
            stateLabel
        }}</span>
    </div>
</template>
