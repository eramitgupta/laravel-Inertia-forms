<script setup lang="ts">
import { classes } from '../../../core/src';
import Icon from '../Icon.vue';

defineProps<{ label: string }>();
const emit = defineEmits<{ clear: [] }>();
</script>

<template>
    <button
        type="button"
        :class="classes.iconButton"
        :aria-label="`Clear ${label}`"
        @click.stop="emit('clear')"
    >
        <Icon name="x" class="size-4" />
    </button>
</template>
