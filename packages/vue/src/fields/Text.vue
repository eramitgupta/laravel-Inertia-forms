<script setup lang="ts">
import { classes, type DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/** A paragraph of plain (escaped) text inside the form. */
defineProps<FieldComponentProps<DisplayFieldSchema>>();
defineEmits<FieldComponentEmits>();
</script>

<template>
    <p :class="classes.displayText">{{ field.text }}</p>
</template>
