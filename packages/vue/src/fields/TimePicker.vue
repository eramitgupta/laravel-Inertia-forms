<script setup lang="ts">
import { computed } from 'vue';
import { classes, nowTime, type TimePickerSchema } from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import ClearButton from './ClearButton.vue';
import TimeColumns, { type TimePart } from './TimeColumns.vue';

/**
 * Time popover with scrollable hour and minute columns (`minuteStep()`).
 * Closes once every column has been picked, or when the last column is picked
 * for a time that was already set.
 */
const props = defineProps<FieldComponentProps<TimePickerSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const { root, panel, open, setOpen, panelClass } = usePopover();
const locked = computed(() => props.disabled || props.field.readonly);
const time = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''));

let picked = new Set<TimePart>();
let hadTime = false;

function toggle() {
    if (locked.value) return;
    picked = new Set();
    hadTime = Boolean(time.value);
    setOpen(!open.value);
}

function change(value: string) {
    emit('update:modelValue', value);
}

function pick(next: string, part: TimePart) {
    change(next);
    picked.add(part);
    const last: TimePart = props.field.withSeconds ? 'second' : 'minute';
    const columns: TimePart[] = props.field.withSeconds
        ? ['hour', 'minute', 'second']
        : ['hour', 'minute'];
    if (columns.every((column) => picked.has(column)) || (part === last && hadTime)) {
        setOpen(false);
    }
}

function changeAndClose(value: string) {
    change(value);
    setOpen(false);
}
</script>

<template>
    <div ref="root" :class="classes.popoverAnchor">
        <div
            :class="classes.trigger"
            :data-open="open || undefined"
            :aria-disabled="locked || undefined"
            :aria-invalid="error ? true : undefined"
        >
            <button
                :id="id"
                type="button"
                :class="classes.triggerButton"
                aria-haspopup="dialog"
                :aria-expanded="open"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="describedBy"
                :aria-required="field.required || undefined"
                :disabled="locked"
                :autofocus="field.autofocus"
                @click="toggle"
            >
                <span :class="time ? classes.triggerValue : classes.triggerPlaceholder">{{
                    time || field.placeholder || (field.withSeconds ? '--:--:--' : '--:--')
                }}</span>
            </button>
            <ClearButton
                v-if="field.clearable && time && !locked"
                :label="field.label"
                @clear="change('')"
            />
            <Icon name="clock" :class="classes.icon" />
        </div>
        <div v-if="open" ref="panel" role="dialog" :aria-label="field.label" :class="panelClass()">
            <TimeColumns
                :id="id"
                :value="time"
                :with-seconds="field.withSeconds"
                :minute-step="field.minuteStep"
                :min-time="field.minTime"
                :max-time="field.maxTime"
                @change="pick"
            />
            <div :class="classes.popoverFooter">
                <button
                    type="button"
                    :class="classes.popoverAction"
                    @click="changeAndClose(nowTime(field.withSeconds, field.minuteStep))"
                >
                    Now
                </button>
                <button type="button" :class="classes.popoverAction" @click="changeAndClose('')">
                    Clear
                </button>
            </div>
        </div>
    </div>
</template>
