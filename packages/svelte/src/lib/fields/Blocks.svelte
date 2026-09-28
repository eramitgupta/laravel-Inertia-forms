<script module lang="ts">
    let nextUid = 0;
    const newUid = () => ++nextUid;

    const FOCUSABLE =
        'input:not([type=hidden]), textarea, select, button[role=combobox], button[aria-haspopup]';
</script>

<script lang="ts">
    import { untrack } from 'svelte';
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
    } from '../core';
    import { getFormContext } from '../context';
    import FieldRenderer, { builtInComponents } from '../FieldRenderer.svelte';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';

    /**
     * A list of collapsible content blocks (and Repeater items). Each block type has its own fields,
     * rendered with the same components as the rest of the form.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<BlocksSchema> = $props();

    const form = getFormContext();
    const menu = createPopover();
    let root = $state<HTMLDivElement | null>(null);
    let activeItem = $state(0);
    let dragIndex = $state<number | null>(null);

    const repeater = $derived(isRepeater(field));
    const items = $derived(builderItems(field, value));
    const locked = $derived(disabled || field.readonly);
    const errors = $derived(form?.errors ?? {});

    // Stable keys per block, kept in step with add / remove / move.
    let uidList: number[] = [];
    const uids = $derived.by(() => {
        if (uidList.length !== items.length) {
            uidList = items.map((_, index) => uidList[index] ?? newUid());
        }
        return uidList;
    });
    let collapsed = $state<Set<number>>(
        untrack(() => (field.collapsed ? new Set(uids) : new Set())),
    );

    const full = $derived(field.maxItems !== null && items.length >= field.maxItems);
    // A Repeater has a single item type, so its add button never opens a menu.
    const hasMenu = $derived(!repeater && field.blocks.length > 1);
    const allCollapsed = $derived(items.length > 0 && uids.every((uid) => collapsed.has(uid)));
    const blockFor = (item: BlockItem): BlockSchema | undefined =>
        field.blocks.find((block) => block.name === item.type);
    const hasErrors = (index: number) =>
        Object.keys(errors).some((key) => key.startsWith(`${field.name}.${index}.`));

    // Open blocks that have validation errors so the messages can be seen.
    const errorKey = $derived(items.map((_, index) => (hasErrors(index) ? index : '')).join(','));
    $effect(() => {
        void errorKey;
        untrack(() => {
            const invalid = uids.filter((_, index) => hasErrors(index));
            if (invalid.some((uid) => collapsed.has(uid))) {
                collapsed = new Set([...collapsed].filter((uid) => !invalid.includes(uid)));
            }
        });
    });

    function emit(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function update(next: BlockItem[], nextUids: number[]) {
        uidList = nextUids;
        emit(builderValue(field, next));
    }

    function focusIn(index: number, selector: string) {
        requestAnimationFrame(() => {
            root?.querySelector<HTMLElement>(`[data-block="${index}"] ${selector}`)?.focus();
        });
    }

    function add(block: BlockSchema) {
        menu.setOpen(false);
        const uid = newUid();
        const index = items.length;
        update([...items, { type: block.name, data: blockDefaults(block) }], [...uids, uid]);
        focusIn(index, `[data-block-body] :is(${FOCUSABLE})`);
    }

    function remove(index: number) {
        update(
            items.filter((_, current) => current !== index),
            uids.filter((_, current) => current !== index),
        );
    }

    function move(index: number, offset: number) {
        const target = index + offset;
        const last = items.length - 1;
        update(moveItem(items, index, target), moveItem(uids, index, target));
        const edge = offset < 0 ? target === 0 : target === last;
        const direction = offset < 0 ? 'up' : 'down';
        focusIn(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
    }

    function toggle(uid: number) {
        const next = new Set(collapsed);
        if (next.has(uid)) next.delete(uid);
        else next.add(uid);
        collapsed = next;
    }

    function toggleAll() {
        collapsed = allCollapsed ? new Set() : new Set(uids);
    }

    function openMenu() {
        if (!hasMenu) {
            if (field.blocks[0]) add(field.blocks[0]);
            return;
        }
        activeItem = 0;
        menu.setOpen(!menu.open);
        requestAnimationFrame(() => root?.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
    }

    function menuKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const count = field.blocks.length;
        const next = (activeItem + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
        activeItem = next;
        root?.querySelectorAll<HTMLElement>('[role="menuitem"]')[next]?.focus();
    }

    // Nested fields read and write the field value through a form-shaped scope.
    const scope = $derived(setPath({}, field.name, builderValue(field, items)));
    function setNested(name: string, next: unknown) {
        if (form) {
            form.setValue(name, next);
            return;
        }
        emit(getPath(setPath(scope, name, next), field.name));
    }
</script>

<div
    bind:this={root}
    {id}
    role="group"
    aria-labelledby={`${id}-label`}
    aria-describedby={describedBy}
    class={classes.builder}
    data-invalid={error ? true : undefined}
>
    {#if field.collapsible && items.length > 0}
        <button type="button" class={classes.builderCollapseAll} onclick={toggleAll}>
            {allCollapsed ? 'Expand all' : 'Collapse all'}
        </button>
    {/if}

    {#if items.length === 0}
        <div class={classes.builderEmpty}>{repeater ? 'No items yet.' : 'No blocks yet.'}</div>
    {/if}

    {#each items as item, index (uids[index])}
        {@const block = blockFor(item)}
        {#if block}
            {@const uid = uids[index]!}
            {@const isCollapsed = field.collapsible && collapsed.has(uid)}
            {@const bodyId = `${id}-block-${uid}`}
            {@const fields = block.fields.filter(
                (inner) => inner.component !== 'Submit' && isVisible(inner.visibility, item.data),
            )}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                data-block={index}
                data-dragging={dragIndex === index || undefined}
                data-invalid={hasErrors(index) || undefined}
                class={classes.block}
                ondragover={(event) => {
                    if (dragIndex === null) return;
                    event.preventDefault();
                    if (dragIndex !== index) {
                        update(moveItem(items, dragIndex, index), moveItem(uids, dragIndex, index));
                        dragIndex = index;
                    }
                }}
                ondrop={(event) => event.preventDefault()}
            >
                <div class={cx(classes.blockHeader, !isCollapsed && classes.blockHeaderOpen)}>
                    {#if field.reorderable}
                        <span
                            class={classes.kvHandle}
                            draggable={!locked}
                            aria-hidden="true"
                            ondragstart={(event) => {
                                dragIndex = index;
                                if (!event.dataTransfer) return;
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', String(index));
                                const card = (event.currentTarget as HTMLElement).closest(
                                    '[data-block]',
                                );
                                if (card) event.dataTransfer.setDragImage(card, 16, 16);
                            }}
                            ondragend={() => (dragIndex = null)}
                        >
                            <Icon name="grip" class="size-4" />
                        </span>
                    {/if}
                    <button
                        type="button"
                        class={classes.blockToggle}
                        aria-expanded={field.collapsible ? !isCollapsed : undefined}
                        aria-controls={field.collapsible ? bodyId : undefined}
                        disabled={!field.collapsible}
                        onclick={() => toggle(uid)}
                    >
                        {#if field.collapsible}
                            <span
                                class={classes.blockChevron}
                                data-collapsed={isCollapsed || undefined}
                            >
                                <Icon name="chevronDown" class="size-4" />
                            </span>
                        {/if}
                        <span class={classes.blockHeading}>
                            <span class={classes.blockTitleRow}>
                                <span class={classes.blockTitle}>
                                    {blockTitle(block, item, index)}
                                </span>
                                {#if !repeater}
                                    <span class={classes.blockBadge}>{block.label}</span>
                                {/if}
                            </span>
                            {#if block.description}
                                <span class={classes.blockDescription}>{block.description}</span>
                            {/if}
                        </span>
                    </button>
                    <div class={classes.blockActions}>
                        {#if field.reorderable}
                            <button
                                type="button"
                                data-move="up"
                                class={classes.kvButton}
                                aria-label={`Move ${block.label} ${index + 1} up`}
                                disabled={locked || index === 0}
                                onclick={() => move(index, -1)}
                            >
                                <Icon name="chevronUp" class="size-4" />
                            </button>
                            <button
                                type="button"
                                data-move="down"
                                class={classes.kvButton}
                                aria-label={`Move ${block.label} ${index + 1} down`}
                                disabled={locked || index === items.length - 1}
                                onclick={() => move(index, 1)}
                            >
                                <Icon name="chevronDown" class="size-4" />
                            </button>
                        {/if}
                        {#if field.deletable}
                            <button
                                type="button"
                                class={classes.kvRemove}
                                aria-label={`Delete ${block.label} ${index + 1}`}
                                disabled={locked ||
                                    (field.minItems !== null && items.length <= field.minItems)}
                                onclick={() => remove(index)}
                            >
                                <Icon name="trash" class="size-4" />
                            </button>
                        {/if}
                    </div>
                </div>
                {#if !isCollapsed}
                    <div id={bodyId} data-block-body="true" class={classes.blockBody}>
                        <div class={gridClass(block.columns)}>
                            {#each fields as inner (inner.name)}
                                <FieldRenderer
                                    field={{
                                        ...inner,
                                        name: builderFieldName(field, index, inner.name),
                                        disabled: inner.disabled || Boolean(disabled),
                                        readonly: inner.readonly || field.readonly,
                                    }}
                                    formId={form?.formId ?? id}
                                    columns={block.columns}
                                    data={scope}
                                    {errors}
                                    processing={form?.processing ?? false}
                                    components={form?.components ?? builtInComponents}
                                    onChange={setNested}
                                />
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    {/each}

    {#if field.addable}
        <div bind:this={menu.root} class={classes.builderAddAnchor}>
            <button
                type="button"
                class={classes.builderAdd}
                aria-haspopup={hasMenu ? 'menu' : undefined}
                aria-expanded={hasMenu ? menu.open : undefined}
                data-open={menu.open || undefined}
                disabled={locked || full}
                onclick={openMenu}
            >
                <Icon name="plus" class="size-4" />
                {field.addActionLabel}
            </button>
            {#if hasMenu && menu.open}
                <!-- svelte-ignore a11y_interactive_supports_focus -->
                <div
                    bind:this={menu.panel}
                    role="menu"
                    aria-label={field.addActionLabel}
                    class={menu.panelClass(classes.builderMenu)}
                    onkeydown={menuKeydown}
                >
                    {#each field.blocks as block, index (block.name)}
                        <button
                            type="button"
                            role="menuitem"
                            tabindex={index === activeItem ? 0 : -1}
                            data-active={index === activeItem || undefined}
                            class={classes.builderMenuItem}
                            onpointerenter={() => (activeItem = index)}
                            onclick={() => add(block)}
                        >
                            <span class={classes.builderMenuIcon} aria-hidden="true">
                                {block.icon}
                            </span>
                            <span class="min-w-0">
                                <span class={classes.builderMenuLabel}>{block.label}</span>
                                {#if block.description}
                                    <span class={classes.builderMenuDescription}>
                                        {block.description}
                                    </span>
                                {/if}
                            </span>
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>
