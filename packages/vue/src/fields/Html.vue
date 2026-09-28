<script setup lang="ts">
import { classes, type DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/** Trusted HTML from the server, rendered as is. Never pass user input to `Html::make()`. */
defineProps<FieldComponentProps<DisplayFieldSchema>>();
defineEmits<FieldComponentEmits>();
</script>

<template>
    <div :class="classes.displayHtml" v-html="field.html ?? ''" />
</template>
