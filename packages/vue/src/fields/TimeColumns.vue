<script lang="ts">
import type { TimeParts } from '../../../core/src';

export type TimePart = keyof TimeParts;
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
    classes,
    formatTime,
    hourOptions,
    isTimeOutsideLimits,
    minuteOptions,
    parseTime,
    secondOptions,
} from '../../../core/src';

type Part = TimePart;

/**
 * Scrollable hour / minute (/ second) lists used by TimePicker and DatePicker::withTime().
 */
const props = defineProps<{
    id: string;
    value: string;
    withSeconds: boolean;
    minuteStep: number;
    minTime?: string | null;
    maxTime?: string | null;
}>();

/**
 * `change` receives the new time and the column that was picked.
 */
const emit = defineEmits<{ change: [time: string, part: TimePart] }>();

const root = ref<HTMLDivElement | null>(null);
const parts = computed(() => parseTime(props.value));
const columns = computed<Array<{ part: Part; title: string; options: string[] }>>(() => [
    { part: 'hour', title: 'Hour', options: hourOptions() },
    { part: 'minute', title: 'Min', options: minuteOptions(props.minuteStep) },
    ...(props.withSeconds
        ? [{ part: 'second' as const, title: 'Sec', options: secondOptions() }]
        : []),
]);

/**
 * Center the selection only when the columns first appear.
 */
onMounted(() => {
    root.value?.querySelectorAll<HTMLElement>('[aria-selected="true"]').forEach((option) => {
        const list = option.parentElement;
        if (list)
            list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2;
    });
});

function candidate(part: Part, option: string): string {
    return formatTime(
        { hour: '00', minute: '00', second: '00', ...parts.value, [part]: option },
        props.withSeconds,
    );
}

function isDisabled(part: Part, option: string): boolean {
    return part === 'hour'
        ? false
        : isTimeOutsideLimits(candidate(part, option), props.minTime, props.maxTime);
}

function pick(part: Part, option: string) {
    emit('change', candidate(part, option), part);
}
</script>

<template>
    <div ref="root" :class="classes.timeColumns">
        <div v-for="column in columns" :key="column.part" :class="classes.timeColumn">
            <span :id="`${id}-${column.part}-title`" :class="classes.timeColumnTitle">{{
                column.title
            }}</span>
            <div
                role="listbox"
                :aria-labelledby="`${id}-${column.part}-title`"
                :class="classes.timeList"
            >
                <button
                    v-for="option in column.options"
                    :key="option"
                    type="button"
                    role="option"
                    :aria-selected="parts?.[column.part] === option"
                    :disabled="isDisabled(column.part, option)"
                    :class="classes.timeOption"
                    @click="pick(column.part, option)"
                >
                    {{ option }}
                </button>
            </div>
        </div>
    </div>
</template>
