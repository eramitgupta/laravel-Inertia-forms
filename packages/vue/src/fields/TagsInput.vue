<script setup lang="ts">
import { computed, ref } from 'vue';
import { addTags, classes, cx, moveItem, type TagsInputSchema } from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';

/**
 * Free-text tags: Enter or comma adds, Backspace removes the last tag,
 * drag the handle to reorder, and matching suggestions appear while typing.
 */
const props = defineProps<FieldComponentProps<TagsInputSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const { root, panel, open, setOpen, panelClass } = usePopover();
const input = ref<HTMLInputElement | null>(null);
const text = ref('');
const dragIndex = ref<number | null>(null);
const active = ref(-1);
const tags = computed(() =>
    Array.isArray(props.modelValue) ? (props.modelValue as string[]) : [],
);
const locked = computed(() => props.disabled || props.field.readonly);
const full = computed(() =>
    Boolean(props.field.maxTags && tags.value.length >= props.field.maxTags),
);
const suggestions = computed(() => {
    const search = text.value.trim().toLocaleLowerCase();
    return props.field.suggestions.filter(
        (suggestion) =>
            !tags.value.includes(suggestion) &&
            (!search || suggestion.toLocaleLowerCase().includes(search)),
    );
});
const listId = computed(() => `${props.id}-suggestions`);

function commit(raw: string) {
    const next = addTags(tags.value, raw, props.field);
    if (next !== tags.value) emit('update:modelValue', next);
    text.value = '';
    active.value = -1;
}

function keydown(event: KeyboardEvent) {
    const count = suggestions.value.length;
    const showing = open.value && count > 0;
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && count) {
        event.preventDefault();
        setOpen(true);
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        const current = active.value;
        active.value = (current + offset + count + (current < 0 && offset < 0 ? 1 : 0)) % count;
        return;
    }
    if (event.key === 'Enter' || event.key === ',' || (event.key === 'Tab' && text.value.trim())) {
        const suggestion =
            showing && active.value >= 0 ? suggestions.value[active.value] : undefined;
        if (!suggestion && !text.value.trim()) return;
        event.preventDefault();
        commit(suggestion ?? text.value);
        return;
    }
    if (event.key === 'Backspace' && !text.value && tags.value.length) {
        emit('update:modelValue', tags.value.slice(0, -1));
    } else if (event.key === 'Escape') {
        active.value = -1;
        setOpen(false);
    }
}

function typed(event: Event) {
    text.value = (event.target as HTMLInputElement).value;
    active.value = -1;
    setOpen(true);
}

function paste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/[,\n]/.test(pasted)) return;
    event.preventDefault();
    commit(text.value + pasted);
}

function blur() {
    if (text.value.trim()) commit(text.value);
}

function remove(tag: string) {
    emit(
        'update:modelValue',
        tags.value.filter((item) => item !== tag),
    );
}

function dragstart(event: DragEvent, index: number) {
    dragIndex.value = index;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function dragover(event: DragEvent, index: number) {
    if (dragIndex.value === null) return;
    event.preventDefault();
    if (dragIndex.value !== index) {
        emit('update:modelValue', moveItem(tags.value, dragIndex.value, index));
        dragIndex.value = index;
    }
}
</script>

<template>
    <div ref="root" :class="classes.popoverAnchor">
        <div
            :class="cx(classes.trigger, 'flex-wrap')"
            :data-open="open || undefined"
            :aria-disabled="locked || undefined"
            :aria-invalid="error ? true : undefined"
            @click="input?.focus()"
        >
            <div
                role="list"
                v-if="tags.length > 0"
                :class="cx(classes.chips, 'flex-none')"
                :aria-label="`${field.label} tags`"
            >
                <div
                    role="listitem"
                    v-for="(tag, index) in tags"
                    :key="tag"
                    :class="classes.chip"
                    :data-dragging="dragIndex === index || undefined"
                    :draggable="field.reorderable && !locked"
                    @dragstart="dragstart($event, index)"
                    @dragover="dragover($event, index)"
                    @dragend="dragIndex = null"
                >
                    <Icon
                        v-if="field.reorderable && !locked"
                        name="grip"
                        :class="cx(classes.chipHandle, 'size-3.5')"
                    />
                    <span class="truncate">{{ tag }}</span>
                    <button
                        v-if="!locked"
                        type="button"
                        :class="classes.chipRemove"
                        :aria-label="`Remove ${tag}`"
                        @click.stop="remove(tag)"
                    >
                        <Icon name="x" class="size-3" />
                    </button>
                </div>
            </div>
            <input
                v-if="!full"
                :id="id"
                ref="input"
                type="text"
                role="combobox"
                autocomplete="off"
                aria-autocomplete="list"
                :aria-expanded="open && suggestions.length > 0"
                :aria-controls="listId"
                :aria-activedescendant="
                    open && suggestions[active] ? `${id}-suggestion-${active}` : undefined
                "
                :aria-invalid="error ? true : undefined"
                :aria-describedby="describedBy"
                :value="text"
                :maxlength="field.maxTagLength ?? undefined"
                :placeholder="tags.length ? '' : (field.placeholder ?? 'Type and press Enter')"
                :disabled="locked"
                :autofocus="field.autofocus"
                :class="classes.triggerSearch"
                @focus="setOpen(true)"
                @input="typed"
                @keydown="keydown"
                @paste="paste"
                @blur="blur"
            />
        </div>
        <div
            v-if="open && suggestions.length > 0 && !locked && !full"
            :id="listId"
            ref="panel"
            role="listbox"
            :aria-label="`${field.label} suggestions`"
            :class="panelClass(classes.comboboxList)"
        >
            <div
                v-for="(suggestion, index) in suggestions"
                :id="`${id}-suggestion-${index}`"
                :key="suggestion"
                role="option"
                :aria-selected="false"
                :data-active="index === active || undefined"
                :class="classes.comboboxOption"
                @pointerenter="active = index"
                @pointerdown.prevent="commit(suggestion)"
            >
                <span :class="classes.optionLabel">{{ suggestion }}</span>
            </div>
        </div>
    </div>
</template>
