<script setup lang="ts">
import { separatorClass } from '../../../core/src/features/display';
import type { DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/** A horizontal line between parts of the form. */
defineProps<FieldComponentProps<DisplayFieldSchema>>();
defineEmits<FieldComponentEmits>();
</script>

<template>
    <hr :class="separatorClass(field)" />
</template>
