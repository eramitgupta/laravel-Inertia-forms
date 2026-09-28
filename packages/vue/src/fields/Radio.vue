<script setup lang="ts">
import { computed } from 'vue';
import { choiceListClass, classes, type ChoiceListSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<ChoiceListSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const cards = computed(() => props.field.options.some((option) => option.description));

function isChecked(optionValue: unknown): boolean {
    return String(props.modelValue) === String(optionValue) && props.modelValue !== null;
}
</script>

<template>
    <div
        v-if="field.buttons"
        role="radiogroup"
        :aria-labelledby="`${id}-label`"
        :aria-describedby="describedBy"
        :aria-invalid="error ? true : undefined"
        :class="classes.segmented"
    >
        <label
            v-for="(option, index) in field.options"
            :key="String(option.value)"
            :class="classes.segment"
        >
            <input
                :id="`${id}-${index}`"
                type="radio"
                :name="field.name"
                :value="String(option.value)"
                :checked="isChecked(option.value)"
                :disabled="disabled || field.readonly || option.disabled"
                :autofocus="field.autofocus && index === 0"
                :class="classes.visuallyHidden"
                @change="emit('update:modelValue', option.value)"
            />{{ option.label }}
        </label>
    </div>
    <div
        v-else
        role="radiogroup"
        :aria-labelledby="`${id}-label`"
        :aria-describedby="describedBy"
        :aria-invalid="error ? true : undefined"
        :class="choiceListClass(field.inline, field.columns)"
    >
        <label
            v-for="(option, index) in field.options"
            :key="String(option.value)"
            :for="`${id}-${index}`"
            :class="cards ? classes.choiceCard : classes.choice"
        >
            <input
                :id="`${id}-${index}`"
                type="radio"
                :name="field.name"
                :value="String(option.value)"
                :checked="isChecked(option.value)"
                :required="field.required"
                :disabled="disabled || field.readonly || option.disabled"
                :autofocus="field.autofocus && index === 0"
                :class="classes.radio"
                @change="emit('update:modelValue', option.value)"
            />
            <span :class="classes.choiceText">
                <span :class="classes.choiceLabel">{{ option.label }}</span>
                <span v-if="option.description" :class="classes.choiceDescription">{{
                    option.description
                }}</span>
            </span>
        </label>
    </div>
</template>
