<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
    classes,
    cx,
    fetchOptions,
    normalize,
    SEARCH_DELAY,
    selectedOptions,
    type FieldOption,
    type SelectSchema,
} from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import ClearButton from './ClearButton.vue';

/**
 * Custom dropdown for `Select`: single or multiple, optional search
 * (`searchable()`), server-side search (`searchUsing()`), option descriptions,
 * and a clear button (`clearable()`).
 */
const props = defineProps<FieldComponentProps<SelectSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const { root, panel, open, setOpen, panelClass } = usePopover();
const control = ref<HTMLInputElement | HTMLButtonElement | null>(null);
const query = ref('');
const active = ref(0);
const locked = computed(() => props.disabled || props.field.readonly);
const listId = computed(() => `${props.id}-listbox`);
const selectedValues = computed(() => {
    const value = props.modelValue;
    if (props.field.multiple) return (Array.isArray(value) ? value : []).map(normalize);
    return value === null || value === undefined || value === '' ? [] : [normalize(value)];
});
const remote = computed(() => props.field.search ?? null);
const results = ref<FieldOption[] | null>(null);
const loading = ref(false);
// Every option seen so far, so selected values keep their label between searches.
const known = new Map<string, FieldOption>();
const selected = computed(() => {
    for (const option of props.field.options) known.set(normalize(option.value), option);
    // Re-read when new results arrive, since they may add labels to `known`.
    void results.value;
    return selectedOptions(
        remote.value ? [...known.values()] : props.field.options,
        selectedValues.value,
    );
});
const filtered = computed(() => {
    if (remote.value) return results.value ?? [];
    const search = query.value.trim().toLocaleLowerCase();
    if (!props.field.searchable || !search) return props.field.options;
    return props.field.options.filter((option) =>
        [option.label, option.description ?? ''].some((text) =>
            text.toLocaleLowerCase().includes(search),
        ),
    );
});

watch(
    [open, query, () => remote.value?.url, () => remote.value?.token, () => remote.value?.field],
    (_current, _previous, onCleanup) => {
        const search = remote.value;
        if (!search || !open.value) return;
        const controller = new AbortController();
        loading.value = true;
        const timer = setTimeout(() => {
            fetchOptions(search, query.value.trim(), controller.signal)
                .then((options) => {
                    for (const option of options) known.set(normalize(option.value), option);
                    results.value = options;
                    active.value = 0;
                    loading.value = false;
                })
                .catch((reason: unknown) => {
                    if (controller.signal.aborted) return;
                    console.warn(reason);
                    results.value = [];
                    loading.value = false;
                });
        }, SEARCH_DELAY);
        onCleanup(() => {
            clearTimeout(timer);
            controller.abort();
        });
    },
    { immediate: true },
);

const placeholder = computed(
    () => props.field.placeholder ?? (props.field.searchable ? 'Search…' : 'Select an option'),
);
const singleLabel = computed(() => (!props.field.multiple ? (selected.value[0]?.label ?? '') : ''));

const shared = computed(() => ({
    id: props.id,
    role: 'combobox',
    'aria-expanded': open.value,
    'aria-controls': listId.value,
    'aria-haspopup': 'listbox' as const,
    'aria-activedescendant':
        open.value && filtered.value[active.value]
            ? `${props.id}-option-${active.value}`
            : undefined,
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': props.describedBy,
    'aria-required': props.field.required || undefined,
    disabled: locked.value,
    autofocus: props.field.autofocus,
}));

function isSelected(option: FieldOption): boolean {
    return selectedValues.value.includes(normalize(option.value));
}

function show() {
    if (locked.value) return;
    const selectedIndex = filtered.value.findIndex(isSelected);
    active.value = Math.max(selectedIndex, 0);
    setOpen(true);
}

function close() {
    setOpen(false);
    query.value = '';
}

function choose(option: FieldOption) {
    if (option.disabled) return;
    if (props.field.multiple) {
        const exists = isSelected(option);
        emit(
            'update:modelValue',
            exists
                ? selected.value
                      .filter((item) => normalize(item.value) !== normalize(option.value))
                      .map((item) => item.value)
                : [...selected.value.map((item) => item.value), option.value],
        );
        query.value = '';
        return;
    }
    emit('update:modelValue', option.value);
    close();
    control.value?.focus();
}

function clear() {
    emit('update:modelValue', props.field.multiple ? [] : null);
    query.value = '';
    control.value?.focus();
}

function move(offset: number) {
    const count = filtered.value.length;
    if (!count) return;
    active.value = (active.value + offset + count) % count;
}

function keydown(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
            event.preventDefault();
            if (!open.value) show();
            else move(event.key === 'ArrowDown' ? 1 : -1);
            break;
        case 'Home':
        case 'End':
            if (!open.value) return;
            event.preventDefault();
            active.value = event.key === 'Home' ? 0 : Math.max(filtered.value.length - 1, 0);
            break;
        case 'Enter':
        case ' ':
            if (event.key === ' ' && props.field.searchable) return;
            event.preventDefault();
            if (!open.value) show();
            else if (filtered.value[active.value]) choose(filtered.value[active.value]!);
            break;
        case 'Escape':
            if (open.value) {
                event.preventDefault();
                close();
            }
            break;
        case 'Tab':
            close();
            break;
        case 'Backspace':
            if (props.field.multiple && query.value === '' && selected.value.length) {
                emit(
                    'update:modelValue',
                    selected.value.slice(0, -1).map((item) => item.value),
                );
            } else if (
                !props.field.multiple &&
                props.field.clearable &&
                query.value === '' &&
                selected.value.length
            ) {
                emit('update:modelValue', null);
            }
            break;
    }
}

function triggerClick() {
    if (locked.value) return;
    control.value?.focus();
    if (open.value && !props.field.searchable) close();
    else show();
}

function buttonClick() {
    if (open.value) close();
    else show();
}

function input(event: Event) {
    query.value = (event.target as HTMLInputElement).value;
    active.value = 0;
    setOpen(true);
}
</script>

<template>
    <div ref="root" :class="classes.popoverAnchor">
        <div
            :class="classes.trigger"
            :data-open="open || undefined"
            :aria-disabled="locked || undefined"
            :aria-invalid="error ? true : undefined"
            @click="triggerClick"
        >
            <span
                v-if="field.multiple && selected.length > 0"
                :class="cx(classes.chips, 'flex-none')"
            >
                <span
                    v-for="option in selected"
                    :key="normalize(option.value)"
                    :class="classes.chip"
                    >{{ option.label
                    }}<button
                        v-if="!locked"
                        type="button"
                        :class="classes.chipRemove"
                        :aria-label="`Remove ${option.label}`"
                        @click.stop="choose(option)"
                    >
                        <Icon name="x" class="size-3" /></button
                ></span>
            </span>
            <span
                v-if="!field.multiple && field.searchable && selected[0]"
                :class="cx(classes.chips, 'flex-none')"
            >
                <span :class="classes.chip">{{ selected[0].label }}</span>
            </span>
            <input
                v-if="field.searchable"
                v-bind="shared"
                ref="control"
                type="text"
                autocomplete="off"
                aria-autocomplete="list"
                :value="query"
                :placeholder="selected.length ? '' : placeholder"
                :class="classes.triggerSearch"
                @keydown="keydown"
                @input="input"
            />
            <button
                v-else
                v-bind="shared"
                ref="control"
                type="button"
                :class="classes.triggerButton"
                @keydown="keydown"
                @click.stop="buttonClick"
            >
                <span v-if="selected.length === 0" :class="classes.triggerPlaceholder">{{
                    placeholder
                }}</span>
                <span v-else-if="field.multiple" class="sr-only">{{
                    `${selected.length} selected`
                }}</span>
                <span v-else :class="classes.triggerValue">{{ singleLabel }}</span>
            </button>
            <ClearButton
                v-if="field.clearable && selected.length > 0 && !locked"
                :label="field.label"
                @clear="clear"
            />
            <Icon :name="open ? 'chevronUp' : 'chevronDown'" :class="classes.icon" />
        </div>
        <div
            v-if="open"
            :id="listId"
            ref="panel"
            role="listbox"
            :aria-label="field.label"
            :aria-multiselectable="field.multiple || undefined"
            :class="panelClass(classes.comboboxList)"
        >
            <div v-if="filtered.length === 0" :class="classes.comboboxEmpty">
                {{ loading ? 'Searching…' : 'No results' }}
            </div>
            <div
                v-for="(option, index) in filtered"
                :id="`${id}-option-${index}`"
                :key="normalize(option.value)"
                role="option"
                :aria-selected="isSelected(option)"
                :aria-disabled="option.disabled || undefined"
                :data-active="index === active || undefined"
                :class="classes.comboboxOption"
                @pointerenter="active = index"
                @pointerdown.prevent="choose(option)"
            >
                <span :class="classes.optionText">
                    <span :class="classes.optionLabel">{{ option.label }}</span>
                    <span v-if="option.description" :class="classes.optionDescription">{{
                        option.description
                    }}</span>
                </span>
                <Icon v-if="isSelected(option)" name="check" :class="classes.optionCheck" />
            </div>
        </div>
    </div>
</template>
