<script lang="ts">
let nextUid = 0;
const newUid = () => ++nextUid;

const FOCUSABLE =
    'input:not([type=hidden]), textarea, select, button[role=combobox], button[aria-haspopup]';
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
    blockDefaults,
    blockTitle,
    builderFieldName,
    builderItems,
    builderValue,
    classes,
    cx,
    getPath,
    gridClass,
    isRepeater,
    isVisible,
    moveItem,
    setPath,
    type BlockSchema,
    type BlockItem,
    type BlocksSchema,
    type FieldSchema,
} from '../../../core/src';
import { useFormContext } from '../context';
import FieldRenderer, { builtInComponents } from '../FieldRenderer.vue';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';

/**
 * A list of collapsible content blocks (and Repeater items). Each block type has its own fields,
 * rendered with the same components as the rest of the form.
 */
const props = defineProps<FieldComponentProps<BlocksSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const form = useFormContext();
const root = ref<HTMLDivElement | null>(null);
const {
    root: menuRoot,
    panel: menuPanel,
    open: menuOpen,
    setOpen: setMenuOpen,
    panelClass,
} = usePopover();
const activeItem = ref(0);
const dragIndex = ref<number | null>(null);

const repeater = computed(() => isRepeater(props.field));
const items = computed(() => builderItems(props.field, props.modelValue));
const locked = computed(() => props.disabled || props.field.readonly);
const errors = computed(() => form?.errors ?? {});

/**
 * Stable keys per block, kept in step with add / remove / move.
 */
let uids: number[] = [];
const keys = computed(() => {
    if (uids.length !== items.value.length) {
        uids = items.value.map((_, index) => uids[index] ?? newUid());
    }
    return uids;
});
const collapsed = ref<Set<number>>(new Set(props.field.collapsed ? keys.value : []));

const full = computed(
    () => props.field.maxItems !== null && items.value.length >= props.field.maxItems,
);
/**
 * A Repeater has a single item type, so its add button never opens a menu.
 */
const hasMenu = computed(() => !repeater.value && props.field.blocks.length > 1);
const allCollapsed = computed(
    () => items.value.length > 0 && keys.value.every((uid) => collapsed.value.has(uid)),
);

function blockFor(item: BlockItem): BlockSchema | undefined {
    return props.field.blocks.find((block) => block.name === item.type);
}

function hasErrors(index: number): boolean {
    return Object.keys(errors.value).some((key) => key.startsWith(`${props.field.name}.${index}.`));
}

const cards = computed(() =>
    items.value.flatMap((item, index) => {
        const block = blockFor(item);
        if (!block) return [];
        const uid = keys.value[index]!;
        return [
            {
                item,
                index,
                uid,
                block,
                isCollapsed: props.field.collapsible && collapsed.value.has(uid),
                bodyId: `${props.id}-block-${uid}`,
                fields: block.fields.filter(
                    (inner) =>
                        inner.component !== 'Submit' && isVisible(inner.visibility, item.data),
                ),
            },
        ];
    }),
);

/**
 * Open blocks that have validation errors so the messages can be seen.
 */
const errorKey = computed(() =>
    items.value.map((_, index) => (hasErrors(index) ? index : '')).join(','),
);

function expandInvalid() {
    const invalid = keys.value.filter((_, index) => hasErrors(index));
    if (invalid.some((uid) => collapsed.value.has(uid))) {
        collapsed.value = new Set([...collapsed.value].filter((uid) => !invalid.includes(uid)));
    }
}

onMounted(expandInvalid);
watch(errorKey, expandInvalid);

function update(next: BlockItem[], nextUids: number[]) {
    uids = nextUids;
    emit('update:modelValue', builderValue(props.field, next));
}

function focusIn(index: number, selector: string) {
    requestAnimationFrame(() => {
        root.value?.querySelector<HTMLElement>(`[data-block="${index}"] ${selector}`)?.focus();
    });
}

function add(block: BlockSchema) {
    setMenuOpen(false);
    const index = items.value.length;
    update(
        [...items.value, { type: block.name, data: blockDefaults(block) }],
        [...keys.value, newUid()],
    );
    focusIn(index, `[data-block-body] :is(${FOCUSABLE})`);
}

function remove(index: number) {
    update(
        items.value.filter((_, current) => current !== index),
        keys.value.filter((_, current) => current !== index),
    );
}

function move(index: number, offset: number) {
    const target = index + offset;
    const count = items.value.length;
    update(moveItem(items.value, index, target), moveItem(keys.value, index, target));
    const edge = offset < 0 ? target === 0 : target === count - 1;
    const direction = offset < 0 ? 'up' : 'down';
    focusIn(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
}

function toggle(uid: number) {
    const next = new Set(collapsed.value);
    if (next.has(uid)) next.delete(uid);
    else next.add(uid);
    collapsed.value = next;
}

function toggleAll() {
    collapsed.value = allCollapsed.value ? new Set() : new Set(keys.value);
}

function openMenu() {
    if (!hasMenu.value) {
        if (props.field.blocks[0]) add(props.field.blocks[0]);
        return;
    }
    activeItem.value = 0;
    setMenuOpen(!menuOpen.value);
    requestAnimationFrame(() =>
        root.value?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
    );
}

function menuKeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const count = props.field.blocks.length;
    const next = (activeItem.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
    activeItem.value = next;
    root.value?.querySelectorAll<HTMLElement>('[role="menuitem"]')[next]?.focus();
}

function dragstart(event: DragEvent, index: number) {
    dragIndex.value = index;
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    const card = (event.currentTarget as HTMLElement).closest('[data-block]');
    if (card) event.dataTransfer.setDragImage(card, 16, 16);
}

function dragover(event: DragEvent, index: number) {
    if (dragIndex.value === null) return;
    event.preventDefault();
    if (dragIndex.value !== index) {
        update(
            moveItem(items.value, dragIndex.value, index),
            moveItem(keys.value, dragIndex.value, index),
        );
        dragIndex.value = index;
    }
}

/**
 * Nested fields read and write the field value through a form-shaped scope.
 */
const scope = computed(() => setPath({}, props.field.name, builderValue(props.field, items.value)));

function nestedField(inner: FieldSchema, index: number): FieldSchema {
    return {
        ...inner,
        name: builderFieldName(props.field, index, inner.name),
        disabled: inner.disabled || Boolean(props.disabled),
        readonly: inner.readonly || props.field.readonly,
    };
}

function setNested(name: string, next: unknown) {
    if (form) {
        form.setValue(name, next);
        return;
    }
    emit('update:modelValue', getPath(setPath(scope.value, name, next), props.field.name));
}
</script>

<template>
    <div
        :id="id"
        ref="root"
        role="group"
        :aria-labelledby="`${id}-label`"
        :aria-describedby="describedBy"
        :class="classes.builder"
        :data-invalid="error ? true : undefined"
    >
        <button
            v-if="field.collapsible && items.length > 0"
            type="button"
            :class="classes.builderCollapseAll"
            @click="toggleAll"
        >
            {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
        </button>

        <div v-if="items.length === 0" :class="classes.builderEmpty">
            {{ repeater ? 'No items yet.' : 'No blocks yet.' }}
        </div>

        <div
            v-for="card in cards"
            :key="card.uid"
            :data-block="card.index"
            :data-dragging="dragIndex === card.index || undefined"
            :data-invalid="hasErrors(card.index) || undefined"
            :class="classes.block"
            @dragover="dragover($event, card.index)"
            @drop.prevent
        >
            <div :class="cx(classes.blockHeader, !card.isCollapsed && classes.blockHeaderOpen)">
                <span
                    v-if="field.reorderable"
                    :class="classes.kvHandle"
                    :draggable="!locked"
                    aria-hidden="true"
                    @dragstart="dragstart($event, card.index)"
                    @dragend="dragIndex = null"
                >
                    <Icon name="grip" class="size-4" />
                </span>
                <button
                    type="button"
                    :class="classes.blockToggle"
                    :aria-expanded="field.collapsible ? !card.isCollapsed : undefined"
                    :aria-controls="field.collapsible ? card.bodyId : undefined"
                    :disabled="!field.collapsible"
                    @click="toggle(card.uid)"
                >
                    <span
                        v-if="field.collapsible"
                        :class="classes.blockChevron"
                        :data-collapsed="card.isCollapsed || undefined"
                    >
                        <Icon name="chevronDown" class="size-4" />
                    </span>
                    <span :class="classes.blockHeading">
                        <span :class="classes.blockTitleRow">
                            <span :class="classes.blockTitle">
                                {{ blockTitle(card.block, card.item, card.index) }}
                            </span>
                            <span v-if="!repeater" :class="classes.blockBadge">{{
                                card.block.label
                            }}</span>
                        </span>
                        <span v-if="card.block.description" :class="classes.blockDescription">
                            {{ card.block.description }}
                        </span>
                    </span>
                </button>
                <div :class="classes.blockActions">
                    <template v-if="field.reorderable">
                        <button
                            type="button"
                            data-move="up"
                            :class="classes.kvButton"
                            :aria-label="`Move ${card.block.label} ${card.index + 1} up`"
                            :disabled="locked || card.index === 0"
                            @click="move(card.index, -1)"
                        >
                            <Icon name="chevronUp" class="size-4" />
                        </button>
                        <button
                            type="button"
                            data-move="down"
                            :class="classes.kvButton"
                            :aria-label="`Move ${card.block.label} ${card.index + 1} down`"
                            :disabled="locked || card.index === items.length - 1"
                            @click="move(card.index, 1)"
                        >
                            <Icon name="chevronDown" class="size-4" />
                        </button>
                    </template>
                    <button
                        v-if="field.deletable"
                        type="button"
                        :class="classes.kvRemove"
                        :aria-label="`Delete ${card.block.label} ${card.index + 1}`"
                        :disabled="
                            locked || (field.minItems !== null && items.length <= field.minItems)
                        "
                        @click="remove(card.index)"
                    >
                        <Icon name="trash" class="size-4" />
                    </button>
                </div>
            </div>
            <div
                v-if="!card.isCollapsed"
                :id="card.bodyId"
                :data-block-body="true"
                :class="classes.blockBody"
            >
                <div :class="gridClass(card.block.columns)">
                    <FieldRenderer
                        v-for="inner in card.fields"
                        :key="inner.name"
                        :field="nestedField(inner, card.index)"
                        :form-id="form?.formId ?? id"
                        :columns="card.block.columns"
                        :data="scope"
                        :errors="errors"
                        :processing="form?.processing ?? false"
                        :components="form?.components ?? builtInComponents"
                        @change="setNested"
                    />
                </div>
            </div>
        </div>

        <div v-if="field.addable" ref="menuRoot" :class="classes.builderAddAnchor">
            <button
                type="button"
                :class="classes.builderAdd"
                :aria-haspopup="hasMenu ? 'menu' : undefined"
                :aria-expanded="hasMenu ? menuOpen : undefined"
                :data-open="menuOpen || undefined"
                :disabled="locked || full"
                @click="openMenu"
            >
                <Icon name="plus" class="size-4" />{{ field.addActionLabel }}
            </button>
            <div
                v-if="hasMenu && menuOpen"
                ref="menuPanel"
                role="menu"
                :aria-label="field.addActionLabel"
                :class="panelClass(classes.builderMenu)"
                @keydown="menuKeydown"
            >
                <button
                    v-for="(block, index) in field.blocks"
                    :key="block.name"
                    type="button"
                    role="menuitem"
                    :tabindex="index === activeItem ? 0 : -1"
                    :data-active="index === activeItem || undefined"
                    :class="classes.builderMenuItem"
                    @pointerenter="activeItem = index"
                    @click="add(block)"
                >
                    <span :class="classes.builderMenuIcon" aria-hidden="true">{{
                        block.icon
                    }}</span>
                    <span class="min-w-0">
                        <span :class="classes.builderMenuLabel">{{ block.label }}</span>
                        <span v-if="block.description" :class="classes.builderMenuDescription">
                            {{ block.description }}
                        </span>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
