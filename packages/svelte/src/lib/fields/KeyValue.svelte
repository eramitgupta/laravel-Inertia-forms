<script lang="ts">
    import {
        classes,
        cx,
        keyValueRows,
        moveItem,
        type KeyValueRow,
        type KeyValueSchema,
    } from '../core';
    import Icon from '../Icon.svelte';
    import type { FieldComponentProps } from '../types';

    /**
     * Editable key / value rows: add, remove, drag the handle or use the arrow
     * buttons to reorder. The value is a list of `{ key, value }` rows.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<KeyValueSchema> = $props();

    let table = $state<HTMLDivElement | null>(null);
    let dragIndex = $state<number | null>(null);
    const rows = $derived(keyValueRows(value));
    const locked = $derived(disabled || field.readonly);
    const full = $derived(field.maxItems !== null && rows.length >= field.maxItems);
    const grid = $derived(field.reorderable ? classes.kvGrid : classes.kvGridPlain);

    function update(next: KeyValueRow[]) {
        value = next;
        onChange?.(next);
    }

    function focusRow(index: number, selector: string) {
        requestAnimationFrame(() => {
            table?.querySelectorAll<HTMLElement>(`[data-row="${index}"] ${selector}`)[0]?.focus();
        });
    }

    function edit(index: number, part: keyof KeyValueRow, text: string) {
        update(rows.map((row, current) => (current === index ? { ...row, [part]: text } : row)));
    }

    function add() {
        const index = rows.length;
        update([...rows, { key: '', value: '' }]);
        focusRow(index, field.editableKeys ? 'input' : 'input[data-part="value"]');
    }

    function remove(index: number) {
        update(rows.filter((_, current) => current !== index));
    }

    function move(index: number, offset: number) {
        const target = index + offset;
        const last = rows.length - 1;
        update(moveItem(rows, index, target));
        const direction = offset < 0 ? 'up' : 'down';
        const edge = offset < 0 ? target === 0 : target === last;
        focusRow(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
    }
</script>

<div>
    <div
        bind:this={table}
        {id}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        class={classes.kvTable}
        data-invalid={error ? true : undefined}
    >
        <div class={cx(grid, classes.kvHeader)} aria-hidden="true">
            {#if field.reorderable}<span class="w-[5.5rem]"></span>{/if}
            <span>{field.keyLabel}</span>
            <span>{field.valueLabel}</span>
            <span class="w-7"></span>
        </div>
        {#if rows.length === 0}
            <div class={classes.kvEmpty}>No entries yet.</div>
        {/if}
        {#each rows as row, index (index)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                data-row={index}
                data-dragging={dragIndex === index || undefined}
                class={cx(grid, classes.kvRow)}
                ondragover={(event) => {
                    if (dragIndex === null) return;
                    event.preventDefault();
                    if (dragIndex !== index) {
                        update(moveItem(rows, dragIndex, index));
                        dragIndex = index;
                    }
                }}
                ondrop={(event) => event.preventDefault()}
            >
                {#if field.reorderable}
                    <div class={classes.kvControls}>
                        <span
                            class={classes.kvHandle}
                            draggable={!locked}
                            aria-hidden="true"
                            ondragstart={(event) => {
                                dragIndex = index;
                                if (!event.dataTransfer) return;
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', String(index));
                                const rowElement = (event.currentTarget as HTMLElement).closest(
                                    '[data-row]',
                                );
                                if (rowElement) event.dataTransfer.setDragImage(rowElement, 16, 16);
                            }}
                            ondragend={() => (dragIndex = null)}
                        >
                            <Icon name="grip" class="size-4" />
                        </span>
                        <button
                            type="button"
                            data-move="up"
                            class={classes.kvButton}
                            aria-label={`Move row ${index + 1} up`}
                            disabled={locked || index === 0}
                            onclick={() => move(index, -1)}
                        >
                            <Icon name="chevronUp" class="size-4" />
                        </button>
                        <button
                            type="button"
                            data-move="down"
                            class={classes.kvButton}
                            aria-label={`Move row ${index + 1} down`}
                            disabled={locked || index === rows.length - 1}
                            onclick={() => move(index, 1)}
                        >
                            <Icon name="chevronDown" class="size-4" />
                        </button>
                    </div>
                {/if}
                <input
                    type="text"
                    data-part="key"
                    value={row.key}
                    placeholder={field.keyPlaceholder ?? undefined}
                    aria-label={`${field.keyLabel} ${index + 1}`}
                    aria-invalid={error ? true : undefined}
                    {disabled}
                    readonly={field.readonly || !field.editableKeys}
                    class={classes.input}
                    oninput={(event) => edit(index, 'key', event.currentTarget.value)}
                />
                <input
                    type="text"
                    data-part="value"
                    value={row.value}
                    placeholder={field.valuePlaceholder ?? undefined}
                    aria-label={`${field.valueLabel} ${index + 1}`}
                    aria-invalid={error ? true : undefined}
                    {disabled}
                    readonly={field.readonly}
                    class={classes.input}
                    oninput={(event) => edit(index, 'value', event.currentTarget.value)}
                />
                {#if field.deletable}
                    <button
                        type="button"
                        class={classes.kvRemove}
                        aria-label={`Remove row ${index + 1}`}
                        disabled={locked}
                        onclick={() => remove(index)}
                    >
                        <Icon name="x" class="size-4" />
                    </button>
                {:else}
                    <span class="w-7"></span>
                {/if}
            </div>
        {/each}
    </div>
    {#if field.addable}
        <button type="button" class={classes.kvAdd} disabled={locked || full} onclick={add}>
            <Icon name="plus" class="size-4" />
            {field.addActionLabel}
        </button>
    {/if}
</div>
