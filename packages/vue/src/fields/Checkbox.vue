<script setup lang="ts">
import { classes, type BooleanFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<BooleanFieldSchema>>();
const emit = defineEmits<FieldComponentEmits>();

function change(event: Event) {
    emit(
        'update:modelValue',
        (event.target as HTMLInputElement).checked ? props.field.trueValue : props.field.falseValue,
    );
}
</script>

<template>
    <label :for="id" :class="classes.choice">
        <input
            :id="id"
            :name="field.name"
            type="checkbox"
            :checked="modelValue === field.trueValue"
            :required="field.required"
            :disabled="disabled || field.readonly"
            :autofocus="field.autofocus"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :class="classes.checkbox"
            @change="change"
        />
        <span :class="classes.choiceText">
            <span :class="classes.choiceLabel"
                >{{ field.label
                }}<span v-if="field.required" :class="classes.required" aria-hidden="true"
                    >*</span
                ></span
            >
        </span>
    </label>
</template>
