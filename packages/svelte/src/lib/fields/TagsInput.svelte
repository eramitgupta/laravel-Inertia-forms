<script lang="ts">
    import { addTags, classes, cx, moveItem, type TagsInputSchema } from '../core';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';

    /**
     * Free-text tags: Enter or comma adds, Backspace removes the last tag,
     * drag the handle to reorder, and matching suggestions appear while typing.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<TagsInputSchema> = $props();

    const popover = createPopover();
    let input = $state<HTMLInputElement | null>(null);
    let text = $state('');
    let dragIndex = $state<number | null>(null);
    let active = $state(-1);
    const tags = $derived(Array.isArray(value) ? (value as string[]) : []);
    const locked = $derived(disabled || field.readonly);
    const full = $derived(Boolean(field.maxTags && tags.length >= field.maxTags));
    const suggestions = $derived.by(() => {
        const search = text.trim().toLocaleLowerCase();
        return field.suggestions.filter(
            (suggestion) =>
                !tags.includes(suggestion) &&
                (!search || suggestion.toLocaleLowerCase().includes(search)),
        );
    });
    const listId = $derived(`${id}-suggestions`);

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function commit(raw: string) {
        const next = addTags(tags, raw, field);
        if (next !== tags) update(next);
        text = '';
        active = -1;
    }

    function keydown(event: KeyboardEvent) {
        const showing = popover.open && suggestions.length > 0;
        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
            event.preventDefault();
            popover.setOpen(true);
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            active =
                (active + offset + suggestions.length + (active < 0 && offset < 0 ? 1 : 0)) %
                suggestions.length;
            return;
        }
        if (event.key === 'Enter' || event.key === ',' || (event.key === 'Tab' && text.trim())) {
            const suggestion = showing && active >= 0 ? suggestions[active] : undefined;
            if (!suggestion && !text.trim()) return;
            event.preventDefault();
            commit(suggestion ?? text);
            return;
        }
        if (event.key === 'Backspace' && !text && tags.length) {
            update(tags.slice(0, -1));
        } else if (event.key === 'Escape') {
            active = -1;
            popover.setOpen(false);
        }
    }
</script>

<div bind:this={popover.root} class={classes.popoverAnchor}>
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div
        class={cx(classes.trigger, 'flex-wrap')}
        data-open={popover.open || undefined}
        aria-disabled={locked || undefined}
        aria-invalid={error ? true : undefined}
        onclick={() => input?.focus()}
    >
        {#if tags.length > 0}
            <div
                role="list"
                class={cx(classes.chips, 'flex-none')}
                aria-label={`${field.label} tags`}
            >
                {#each tags as tag, index (tag)}
                    <div
                        role="listitem"
                        class={classes.chip}
                        data-dragging={dragIndex === index || undefined}
                        draggable={field.reorderable && !locked}
                        ondragstart={(event) => {
                            dragIndex = index;
                            if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
                        }}
                        ondragover={(event) => {
                            if (dragIndex === null) return;
                            event.preventDefault();
                            if (dragIndex !== index) {
                                update(moveItem(tags, dragIndex, index));
                                dragIndex = index;
                            }
                        }}
                        ondragend={() => (dragIndex = null)}
                    >
                        {#if field.reorderable && !locked}
                            <Icon name="grip" class={cx(classes.chipHandle, 'size-3.5')} />
                        {/if}
                        <span class="truncate">{tag}</span>
                        {#if !locked}
                            <button
                                type="button"
                                class={classes.chipRemove}
                                aria-label={`Remove ${tag}`}
                                onclick={(event) => {
                                    event.stopPropagation();
                                    update(tags.filter((item) => item !== tag));
                                }}
                            >
                                <Icon name="x" class="size-3" />
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
        {#if !full}
            <!-- svelte-ignore a11y_autofocus -->
            <input
                bind:this={input}
                {id}
                type="text"
                role="combobox"
                autocomplete="off"
                aria-autocomplete="list"
                aria-expanded={popover.open && suggestions.length > 0}
                aria-controls={listId}
                aria-activedescendant={popover.open && suggestions[active]
                    ? `${id}-suggestion-${active}`
                    : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                bind:value={text}
                maxlength={field.maxTagLength ?? undefined}
                placeholder={tags.length ? '' : (field.placeholder ?? 'Type and press Enter')}
                disabled={locked}
                autofocus={field.autofocus}
                class={classes.triggerSearch}
                onfocus={() => popover.setOpen(true)}
                oninput={() => {
                    active = -1;
                    popover.setOpen(true);
                }}
                onkeydown={keydown}
                onpaste={(event) => {
                    const pasted = event.clipboardData?.getData('text') ?? '';
                    if (!/[,\n]/.test(pasted)) return;
                    event.preventDefault();
                    commit(text + pasted);
                }}
                onblur={() => text.trim() && commit(text)}
            />
        {/if}
    </div>
    {#if popover.open && suggestions.length > 0 && !locked && !full}
        <div
            bind:this={popover.panel}
            id={listId}
            role="listbox"
            aria-label={`${field.label} suggestions`}
            class={popover.panelClass(classes.comboboxList)}
        >
            {#each suggestions as suggestion, index (suggestion)}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
                <div
                    id={`${id}-suggestion-${index}`}
                    role="option"
                    aria-selected={false}
                    data-active={index === active || undefined}
                    class={classes.comboboxOption}
                    onpointerenter={() => (active = index)}
                    onpointerdown={(event) => {
                        event.preventDefault();
                        commit(suggestion);
                    }}
                >
                    <span class={classes.optionLabel}>{suggestion}</span>
                </div>
            {/each}
        </div>
    {/if}
</div>
