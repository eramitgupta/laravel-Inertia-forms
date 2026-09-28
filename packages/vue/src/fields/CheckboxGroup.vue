<script setup lang="ts">
import { computed } from 'vue';
import { choiceListClass, classes, normalize, type ChoiceListSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<ChoiceListSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const selected = computed<unknown[]>(() =>
    Array.isArray(props.modelValue) ? props.modelValue : [],
);
const cards = computed(() => props.field.options.some((option) => option.description));

function isChecked(optionValue: unknown): boolean {
    return selected.value.some((item) => normalize(item) === normalize(optionValue));
}

function toggle(optionValue: unknown, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    emit(
        'update:modelValue',
        checked
            ? [...selected.value, optionValue]
            : selected.value.filter((item) => normalize(item) !== normalize(optionValue)),
    );
}
</script>

<template>
    <div
        v-if="field.buttons"
        role="group"
        :aria-labelledby="`${id}-label`"
        :aria-describedby="describedBy"
        :aria-invalid="error ? true : undefined"
        :class="classes.pills"
    >
        <label
            v-for="(option, index) in field.options"
            :key="String(option.value)"
            :class="classes.pill"
        >
            <input
                :id="`${id}-${index}`"
                type="checkbox"
                :name="`${field.name}[]`"
                :value="String(option.value)"
                :checked="isChecked(option.value)"
                :disabled="disabled || field.readonly || option.disabled"
                :autofocus="field.autofocus && index === 0"
                :class="classes.visuallyHidden"
                @change="toggle(option.value, $event)"
            />{{ option.label }}
        </label>
    </div>
    <div
        v-else
        role="group"
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
                type="checkbox"
                :name="`${field.name}[]`"
                :value="String(option.value)"
                :checked="isChecked(option.value)"
                :disabled="disabled || field.readonly || option.disabled"
                :autofocus="field.autofocus && index === 0"
                :class="classes.checkbox"
                @change="toggle(option.value, $event)"
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
