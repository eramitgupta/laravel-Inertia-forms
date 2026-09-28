<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import {
    classes,
    cx,
    submitButtonClass,
    submitIconClass,
    submitIconName,
    type SubmitSize,
    type SubmitVariant,
} from '../../../core/src';
import Icon from '../Icon.vue';
import { useFormContext } from '../context';
import { submitterKey } from '../submitter';

/**
 * Extra classes passed as `class` fall through onto the row wrapper.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        processingLabel?: string | null;
        processing: boolean;
        disabled?: boolean;
        variant?: SubmitVariant;
        size?: SubmitSize;
        /** Stretch the button across its row. */
        fullWidth?: boolean;
        /** A package icon name shown next to the label. */
        icon?: string | null;
        iconPosition?: 'left' | 'right';
        /** SVG markup for an icon the package doesn't draw itself; used instead of `icon`. */
        iconSvg?: string | null;
        /** Sent with the form as `key=value` when this button submits it. */
        intent?: { key: string; value: string } | null;
        /** Stay disabled until the surrounding `<Form>` has unsaved changes. */
        disableUntilDirty?: boolean;
    }>(),
    {
        variant: 'primary',
        size: 'md',
        fullWidth: false,
        iconPosition: 'left',
        disableUntilDirty: false,
    },
);

const button = ref<HTMLButtonElement | null>(null);
const submitter = inject(submitterKey, null);
/** Only the button that submitted the form shows the processing state. */
const busy = computed(
    () => props.processing && (!submitter?.value || submitter.value === button.value),
);
const form = useFormContext();
/** Outside a `<Form>` there is no dirty state, so the option has no effect. */
const clean = computed(() => props.disableUntilDirty && form !== null && !form.isDirty);
const svg = computed(() => (busy.value ? null : (props.iconSvg ?? null)));
const iconName = computed(() => (busy.value || svg.value ? null : submitIconName(props.icon)));
</script>

<template>
    <div :class="cx(classes.submitRow, fullWidth && classes.submitRowFull)">
        <button
            ref="button"
            type="submit"
            :name="intent?.key"
            :value="intent?.value"
            :class="submitButtonClass(variant, size, fullWidth)"
            :disabled="processing || disabled || clean"
            :aria-busy="busy || undefined"
        >
            <span v-if="busy" :class="classes.submitSpinner" aria-hidden="true" /><Icon
                v-if="(iconName || svg) && iconPosition !== 'right'"
                :name="iconName"
                :svg="svg"
                :class="submitIconClass(size)"
            />{{ busy && processingLabel ? processingLabel : label
            }}<Icon
                v-if="(iconName || svg) && iconPosition === 'right'"
                :name="iconName"
                :svg="svg"
                :class="submitIconClass(size)"
            />
        </button>
    </div>
</template>
