<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    classes,
    cx,
    keyValueRows,
    moveItem,
    type KeyValueRow,
    type KeyValueSchema,
} from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/**
 * Editable key / value rows: add, remove, drag the handle or use the arrow
 * buttons to reorder. The value is a list of `{ key, value }` rows.
 */
const props = defineProps<FieldComponentProps<KeyValueSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const table = ref<HTMLDivElement | null>(null);
const dragIndex = ref<number | null>(null);
const rows = computed(() => keyValueRows(props.modelValue));
const locked = computed(() => props.disabled || props.field.readonly);
const full = computed(
    () => props.field.maxItems !== null && rows.value.length >= props.field.maxItems,
);
const grid = computed(() => (props.field.reorderable ? classes.kvGrid : classes.kvGridPlain));

function update(next: KeyValueRow[]) {
    emit('update:modelValue', next);
}

function focusRow(index: number, selector: string) {
    requestAnimationFrame(() => {
        table.value?.querySelectorAll<HTMLElement>(`[data-row="${index}"] ${selector}`)[0]?.focus();
    });
}

function edit(index: number, part: keyof KeyValueRow, event: Event) {
    const text = (event.target as HTMLInputElement).value;
    update(rows.value.map((row, current) => (current === index ? { ...row, [part]: text } : row)));
}

function add() {
    const index = rows.value.length;
    update([...rows.value, { key: '', value: '' }]);
    focusRow(index, props.field.editableKeys ? 'input' : 'input[data-part="value"]');
}

function remove(index: number) {
    update(rows.value.filter((_, current) => current !== index));
}

function move(index: number, offset: number) {
    const target = index + offset;
    const count = rows.value.length;
    update(moveItem(rows.value, index, target));
    const direction = offset < 0 ? 'up' : 'down';
    const edge = offset < 0 ? target === 0 : target === count - 1;
    focusRow(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
}

function dragstart(event: DragEvent, index: number) {
    dragIndex.value = index;
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    const rowElement = (event.currentTarget as HTMLElement).closest('[data-row]');
    if (rowElement) event.dataTransfer.setDragImage(rowElement, 16, 16);
}

function dragover(event: DragEvent, index: number) {
    if (dragIndex.value === null) return;
    event.preventDefault();
    if (dragIndex.value !== index) {
        update(moveItem(rows.value, dragIndex.value, index));
        dragIndex.value = index;
    }
}
</script>

<template>
    <div>
        <div
            :id="id"
            ref="table"
            role="group"
            :aria-labelledby="`${id}-label`"
            :aria-describedby="describedBy"
            :class="classes.kvTable"
            :data-invalid="error ? true : undefined"
        >
            <div :class="cx(grid, classes.kvHeader)" aria-hidden="true">
                <span v-if="field.reorderable" class="w-[5.5rem]" />
                <span>{{ field.keyLabel }}</span>
                <span>{{ field.valueLabel }}</span>
                <span class="w-7" />
            </div>
            <div v-if="rows.length === 0" :class="classes.kvEmpty">No entries yet.</div>
            <div
                v-for="(row, index) in rows"
                :key="index"
                :data-row="index"
                :data-dragging="dragIndex === index || undefined"
                :class="cx(grid, classes.kvRow)"
                @dragover="dragover($event, index)"
                @drop.prevent
            >
                <div v-if="field.reorderable" :class="classes.kvControls">
                    <span
                        :class="classes.kvHandle"
                        :draggable="!locked"
                        aria-hidden="true"
                        @dragstart="dragstart($event, index)"
                        @dragend="dragIndex = null"
                    >
                        <Icon name="grip" class="size-4" />
                    </span>
                    <button
                        type="button"
                        data-move="up"
                        :class="classes.kvButton"
                        :aria-label="`Move row ${index + 1} up`"
                        :disabled="locked || index === 0"
                        @click="move(index, -1)"
                    >
                        <Icon name="chevronUp" class="size-4" />
                    </button>
                    <button
                        type="button"
                        data-move="down"
                        :class="classes.kvButton"
                        :aria-label="`Move row ${index + 1} down`"
                        :disabled="locked || index === rows.length - 1"
                        @click="move(index, 1)"
                    >
                        <Icon name="chevronDown" class="size-4" />
                    </button>
                </div>
                <input
                    type="text"
                    data-part="key"
                    :value="row.key"
                    :placeholder="field.keyPlaceholder ?? undefined"
                    :aria-label="`${field.keyLabel} ${index + 1}`"
                    :aria-invalid="error ? true : undefined"
                    :disabled="disabled"
                    :readonly="field.readonly || !field.editableKeys"
                    :class="classes.input"
                    @input="edit(index, 'key', $event)"
                />
                <input
                    type="text"
                    data-part="value"
                    :value="row.value"
                    :placeholder="field.valuePlaceholder ?? undefined"
                    :aria-label="`${field.valueLabel} ${index + 1}`"
                    :aria-invalid="error ? true : undefined"
                    :disabled="disabled"
                    :readonly="field.readonly"
                    :class="classes.input"
                    @input="edit(index, 'value', $event)"
                />
                <button
                    v-if="field.deletable"
                    type="button"
                    :class="classes.kvRemove"
                    :aria-label="`Remove row ${index + 1}`"
                    :disabled="locked"
                    @click="remove(index)"
                >
                    <Icon name="x" class="size-4" />
                </button>
                <span v-else class="w-7" />
            </div>
        </div>
        <button
            v-if="field.addable"
            type="button"
            :class="classes.kvAdd"
            :disabled="locked || full"
            @click="add"
        >
            <Icon name="plus" class="size-4" />{{ field.addActionLabel }}
        </button>
    </div>
</template>
