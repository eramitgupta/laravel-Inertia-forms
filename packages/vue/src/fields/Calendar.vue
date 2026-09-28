<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
    addMonths,
    classes,
    isOutsideLimits,
    monthGrid,
    monthLabel,
    monthStart,
    parseIsoDate,
    todayIso,
    toIsoDate,
    weekdayLabels,
    type CalendarDay,
} from '../../../core/src';
import Icon from '../Icon.vue';

/**
 * Month grid(s) with navigation. Days are buttons; arrow keys move between them.
 */
const props = defineProps<{
    /** First visible month. */
    view: Date;
    months: number;
    firstDayOfWeek: number;
    minDate?: string | null;
    maxDate?: string | null;
    isSelected: (iso: string) => boolean;
    isInRange: (iso: string) => boolean;
}>();

const emit = defineEmits<{
    view: [month: Date];
    select: [iso: string];
    hover: [iso: string | null];
}>();

function shift(iso: string, days: number): string {
    const date = parseIsoDate(iso)!;
    return toIsoDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

const root = ref<HTMLDivElement | null>(null);
const focusIso = ref<string | null>(null);
const today = todayIso();
const visible = computed(() =>
    Array.from({ length: props.months }, (_, index) => addMonths(props.view, index)),
);
const weekdays = computed(() => weekdayLabels(props.firstDayOfWeek));
const visibleDays = computed(() =>
    visible.value.flatMap((month) =>
        monthGrid(month, props.firstDayOfWeek)
            .filter((day) => day.inMonth)
            .map((day) => day.iso),
    ),
);
const tabIso = computed(() =>
    focusIso.value && visibleDays.value.includes(focusIso.value)
        ? focusIso.value
        : (visibleDays.value.find((iso) => props.isSelected(iso)) ??
          (visibleDays.value.includes(today) ? today : visibleDays.value[0])),
);

watch(
    [focusIso, () => props.view],
    ([iso]) => {
        if (!iso) return;
        root.value
            ?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]:not([data-outside])`)
            ?.focus();
    },
    { flush: 'post' },
);

function isDaySelected(day: CalendarDay): boolean {
    return day.inMonth && props.isSelected(day.iso);
}

function keydown(event: KeyboardEvent) {
    const iso = (event.target as HTMLElement).dataset.iso;
    const offsets: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
    };
    if (!iso) return;
    let target: string | null = null;
    if (event.key in offsets) target = shift(iso, offsets[event.key]!);
    if (event.key === 'PageUp' || event.key === 'PageDown') {
        const date = parseIsoDate(iso)!;
        target = toIsoDate(
            new Date(
                date.getFullYear(),
                date.getMonth() + (event.key === 'PageUp' ? -1 : 1),
                date.getDate(),
            ),
        );
    }
    if (!target) return;
    event.preventDefault();
    const first = props.view;
    const last = addMonths(props.view, props.months - 1);
    const month = monthStart(target);
    if (month < first) emit('view', month);
    if (month > last) emit('view', addMonths(month, -(props.months - 1)));
    focusIso.value = target;
}
</script>

<template>
    <div
        ref="root"
        :class="classes.calendar"
        @keydown="keydown"
        @pointerleave="emit('hover', null)"
    >
        <div :class="classes.calendarHeader">
            <span class="flex gap-1">
                <button
                    type="button"
                    :class="classes.calendarNav"
                    aria-label="Previous year"
                    @click="emit('view', addMonths(view, -12))"
                >
                    <Icon name="chevronsLeft" class="size-4" />
                </button>
                <button
                    type="button"
                    :class="classes.calendarNav"
                    aria-label="Previous month"
                    @click="emit('view', addMonths(view, -1))"
                >
                    <Icon name="chevronLeft" class="size-4" />
                </button>
            </span>
            <span v-if="months === 1" :class="classes.calendarTitle" aria-live="polite">{{
                monthLabel(view)
            }}</span>
            <span class="flex gap-1">
                <button
                    type="button"
                    :class="classes.calendarNav"
                    aria-label="Next month"
                    @click="emit('view', addMonths(view, 1))"
                >
                    <Icon name="chevronRight" class="size-4" />
                </button>
                <button
                    type="button"
                    :class="classes.calendarNav"
                    aria-label="Next year"
                    @click="emit('view', addMonths(view, 12))"
                >
                    <Icon name="chevronsRight" class="size-4" />
                </button>
            </span>
        </div>
        <div :class="classes.calendarMonths">
            <div
                v-for="month in visible"
                :key="month.toISOString()"
                role="grid"
                :aria-label="monthLabel(month)"
            >
                <p v-if="months > 1" :class="classes.calendarMonthTitle">{{ monthLabel(month) }}</p>
                <div :class="classes.calendarGrid">
                    <span
                        v-for="(weekday, index) in weekdays"
                        :key="index"
                        :class="classes.calendarWeekday"
                        aria-hidden="true"
                        >{{ weekday }}</span
                    >
                    <button
                        v-for="day in monthGrid(month, firstDayOfWeek)"
                        :key="day.iso"
                        type="button"
                        :data-iso="day.iso"
                        :data-outside="!day.inMonth || undefined"
                        :data-today="(day.inMonth && day.iso === today) || undefined"
                        :data-selected="isDaySelected(day) || undefined"
                        :data-in-range="
                            (day.inMonth && !isDaySelected(day) && isInRange(day.iso)) || undefined
                        "
                        :aria-pressed="isDaySelected(day)"
                        :aria-label="parseIsoDate(day.iso)!.toDateString()"
                        :tabindex="day.inMonth && day.iso === tabIso ? 0 : -1"
                        :disabled="isOutsideLimits(day.iso, minDate, maxDate)"
                        :class="classes.calendarDay"
                        @pointerenter="emit('hover', day.iso)"
                        @click="emit('select', day.iso)"
                    >
                        {{ day.day }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
