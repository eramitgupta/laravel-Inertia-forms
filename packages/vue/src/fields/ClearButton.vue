<script setup lang="ts">
import { classes } from '../../../core/src';
import { useTranslate } from '../i18n';
import Icon from '../Icon.vue';

defineProps<{ label: string }>();
const emit = defineEmits<{ clear: [] }>();
const t = useTranslate();
</script>

<template>
    <button
        type="button"
        :class="classes.iconButton"
        :aria-label="t('action_clear_field', { label })"
        @click.stop="emit('clear')"
    >
        <Icon name="x" class="size-4" />
    </button>
</template>
