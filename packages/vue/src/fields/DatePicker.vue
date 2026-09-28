<script lang="ts">
import type { DateRangeValue } from '../../../core/src';

function toRange(value: unknown): DateRangeValue {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const range = value as Partial<DateRangeValue>;
        return { start: range.start ?? '', end: range.end ?? '' };
    }
    return { start: '', end: '' };
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    classes,
    datePart,
    formatDisplayDate,
    monthStart,
    nextRange,
    timePart,
    todayIso,
    type DatePickerSchema,
} from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import Calendar from './Calendar.vue';
import ClearButton from './ClearButton.vue';
import TimeColumns, { type TimePart } from './TimeColumns.vue';

/**
 * Calendar popover for a single date, a date and time (`withTime()`),
 * or a start–end range (`range()`).
 */
const props = defineProps<FieldComponentProps<DatePickerSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const { root, panel, open, setOpen, panelClass } = usePopover();
const view = ref(
    monthStart(props.field.range ? toRange(props.modelValue).start : (props.modelValue as string)),
);
const hover = ref<string | null>(null);
const locked = computed(() => props.disabled || props.field.readonly);
const single = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''));
const range = computed(() => toRange(props.modelValue));
const hasValue = computed(() =>
    props.field.range ? Boolean(range.value.start || range.value.end) : Boolean(single.value),
);
const display = computed(() =>
    props.field.range
        ? range.value.start
            ? `${formatDisplayDate(range.value.start)} – ${range.value.end ? formatDisplayDate(range.value.end) : '…'}`
            : ''
        : formatDisplayDate(single.value),
);
const placeholder = computed(
    () => props.field.placeholder ?? (props.field.range ? 'Select dates' : 'Select a date'),
);

function toggle() {
    if (locked.value) return;
    if (!open.value) view.value = monthStart(props.field.range ? range.value.start : single.value);
    setOpen(!open.value);
}

function select(iso: string) {
    if (props.field.range) {
        const next = nextRange(range.value, iso);
        emit('update:modelValue', next);
        if (next.end) setOpen(false);
        return;
    }
    if (props.field.withTime) {
        emit('update:modelValue', `${iso}T${timePart(single.value) || '09:00'}`);
        return;
    }
    emit('update:modelValue', iso);
    setOpen(false);
}

function isSelected(iso: string): boolean {
    return props.field.range
        ? iso === range.value.start || iso === range.value.end
        : iso === datePart(single.value);
}

function isInRange(iso: string): boolean {
    if (!props.field.range || !range.value.start) return false;
    const start = range.value.start;
    const end = range.value.end || (hover.value && hover.value > start ? hover.value : '');
    return Boolean(end) && iso > start && iso < end;
}

function clear() {
    emit('update:modelValue', props.field.range ? { start: '', end: '' } : '');
}

function setHover(iso: string | null) {
    if (props.field.range) hover.value = iso;
}

function changeTime(time: string, part: TimePart) {
    emit('update:modelValue', `${datePart(single.value) || todayIso()}T${time}`);
    if (part === 'minute' && datePart(single.value)) setOpen(false);
}

function today() {
    view.value = monthStart(todayIso());
    if (!props.field.range) select(todayIso());
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
                <span :class="display ? classes.triggerValue : classes.triggerPlaceholder">{{
                    display || placeholder
                }}</span>
            </button>
            <ClearButton
                v-if="field.clearable && hasValue && !locked"
                :label="field.label"
                @clear="clear"
            />
            <Icon name="calendar" :class="classes.icon" />
        </div>
        <div v-if="open" ref="panel" role="dialog" :aria-label="field.label" :class="panelClass()">
            <div class="flex flex-col gap-3 sm:flex-row">
                <Calendar
                    :view="view"
                    :months="field.months"
                    :first-day-of-week="field.firstDayOfWeek"
                    :min-date="field.minDate"
                    :max-date="field.maxDate"
                    :is-selected="isSelected"
                    :is-in-range="isInRange"
                    @view="view = $event"
                    @select="select"
                    @hover="setHover"
                />
                <TimeColumns
                    v-if="field.withTime"
                    :id="`${id}-time`"
                    :value="timePart(single)"
                    :with-seconds="false"
                    :minute-step="5"
                    @change="changeTime"
                />
            </div>
            <div :class="classes.popoverFooter">
                <button type="button" :class="classes.popoverAction" @click="today">Today</button>
                <button type="button" :class="classes.popoverAction" @click="clear">Clear</button>
            </div>
        </div>
    </div>
</template>
