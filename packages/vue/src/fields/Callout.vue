<script setup lang="ts">
import { computed } from 'vue';
import { calloutParts } from '../../../core/src/features/display';
import { classes, icons, type DisplayFieldSchema, type IconName } from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/** A notice inside the form, tinted by its tone (info, success, warning, danger). */
const props = defineProps<FieldComponentProps<DisplayFieldSchema>>();
defineEmits<FieldComponentEmits>();

const callout = computed(() => calloutParts(props.field, icons));
</script>

<template>
    <div :role="callout.role" :data-tone="callout.tone" :class="callout.className">
        <Icon :name="callout.icon as IconName" :svg="callout.svg" :class="callout.iconClass" />
        <div :class="classes.calloutContent">
            <p v-if="field.title" :class="classes.calloutTitle">{{ field.title }}</p>
            <p v-if="field.body" :class="classes.calloutBody">{{ field.body }}</p>
        </div>
    </div>
</template>
