<script setup lang="ts">
import { computed } from 'vue';
import { headingClass, headingLevel } from '../../../core/src/features/display';
import type { DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/** A heading inside the form: a real `h1`–`h4` element. */
const props = defineProps<FieldComponentProps<DisplayFieldSchema>>();
defineEmits<FieldComponentEmits>();

const tag = computed(() => `h${headingLevel(props.field)}`);
</script>

<template>
    <component :is="tag" :class="headingClass(field)">{{ field.text }}</component>
</template>
