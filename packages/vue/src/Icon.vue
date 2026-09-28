<script setup lang="ts">
import { icons, type IconName } from '../../core/src';

/**
 * Stroke icon from the shared core set, or SVG markup sent by Laravel for
 * other icons. Pass sizing and color with `class`.
 */
defineProps<{ name?: IconName | null; svg?: string | null }>();
</script>

<template>
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        <g v-if="svg" v-html="svg" />
        <path v-else-if="name" :d="icons[name]" />
    </svg>
</template>
