<script lang="ts">
import type { FieldSchema } from '../../core/src';

export function describedBy(field: FieldSchema, id: string, error?: string): string | undefined {
    const ids = [field.help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
}
</script>

<script setup lang="ts">
import { classes, columnSpanClass, cx } from '../../core/src';

defineProps<{
    field: FieldSchema;
    id: string;
    columns: number;
    error?: string | undefined;
    /** `label` for single inputs, `group` for radio/checkbox lists, `none` when the control labels itself. */
    labelMode: 'label' | 'group' | 'none';
}>();
</script>

<template>
    <div
        :class="cx(classes.field, columnSpanClass(field.columnSpan, columns), field.class)"
        :data-field="field.name"
    >
        <label v-if="labelMode === 'label'" :for="id" :class="classes.label"
            >{{ field.label
            }}<span v-if="field.required" :class="classes.required" aria-hidden="true"
                >*</span
            ></label
        >
        <span v-if="labelMode === 'group'" :id="`${id}-label`" :class="classes.label"
            >{{ field.label
            }}<span v-if="field.required" :class="classes.required" aria-hidden="true"
                >*</span
            ></span
        >
        <slot />
        <p v-if="field.help" :id="`${id}-help`" :class="classes.help">
            {{ field.help }}
        </p>
        <p v-if="error" :id="`${id}-error`" :class="classes.error" role="alert">
            {{ error }}
        </p>
    </div>
</template>
