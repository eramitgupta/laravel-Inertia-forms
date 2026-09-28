<script lang="ts">
    import { untrack } from 'svelte';
    import {
        classes,
        cx,
        fetchOptions,
        normalize,
        SEARCH_DELAY,
        selectedOptions,
        type FieldOption,
        type SelectSchema,
    } from '../core';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';
    import ClearButton from './ClearButton.svelte';

    /**
     * Custom dropdown for `Select`: single or multiple, optional search
     * (`searchable()`), server-side search (`searchUsing()`), option descriptions,
     * and a clear button (`clearable()`).
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<SelectSchema> = $props();

    const popover = createPopover();
    let control = $state<HTMLInputElement | HTMLButtonElement | null>(null);
    let query = $state('');
    let active = $state(0);
    const locked = $derived(disabled || field.readonly);
    const listId = $derived(`${id}-listbox`);
    const selectedValues = $derived(
        field.multiple
            ? (Array.isArray(value) ? value : []).map(normalize)
            : value === null || value === undefined || value === ''
              ? []
              : [normalize(value)],
    );
    const remote = $derived(field.search ?? null);
    const remoteKey = $derived(remote ? [remote.url, remote.token, remote.field].join('\n') : null);
    let results = $state<FieldOption[] | null>(null);
    let loading = $state(false);
    /** Every option seen so far, so selected values keep their label between searches. */
    const known = new Map<string, FieldOption>();
    let knownVersion = $state(0);
    const selected = $derived.by(() => {
        void knownVersion;
        for (const option of field.options) known.set(normalize(option.value), option);
        return selectedOptions(remote ? [...known.values()] : field.options, selectedValues);
    });
    const filtered = $derived.by(() => {
        if (remote) return results ?? [];
        const search = query.trim().toLocaleLowerCase();
        if (!field.searchable || !search) return field.options;
        return field.options.filter((option) =>
            [option.label, option.description ?? ''].some((text) =>
                text.toLocaleLowerCase().includes(search),
            ),
        );
    });
    const placeholder = $derived(
        field.placeholder ?? (field.searchable ? 'Search…' : 'Select an option'),
    );

    $effect(() => {
        if (!remoteKey || !popover.open) return;
        const search = untrack(() => remote)!;
        const term = query.trim();
        const controller = new AbortController();
        loading = true;
        const timer = setTimeout(() => {
            fetchOptions(search, term, controller.signal)
                .then((options) => {
                    for (const option of options) known.set(normalize(option.value), option);
                    knownVersion++;
                    results = options;
                    active = 0;
                    loading = false;
                })
                .catch((reason: unknown) => {
                    if (controller.signal.aborted) return;
                    console.warn(reason);
                    results = [];
                    loading = false;
                });
        }, SEARCH_DELAY);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    });
    const singleLabel = $derived(!field.multiple ? (selected[0]?.label ?? '') : '');
    const activeDescendant = $derived(
        popover.open && filtered[active] ? `${id}-option-${active}` : undefined,
    );

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function show() {
        if (locked) return;
        const selectedIndex = filtered.findIndex((option) =>
            selectedValues.includes(normalize(option.value)),
        );
        active = Math.max(selectedIndex, 0);
        popover.setOpen(true);
    }

    function close() {
        popover.setOpen(false);
        query = '';
    }

    function choose(option: FieldOption) {
        if (option.disabled) return;
        if (field.multiple) {
            const exists = selectedValues.includes(normalize(option.value));
            update(
                exists
                    ? selected
                          .filter((item) => normalize(item.value) !== normalize(option.value))
                          .map((item) => item.value)
                    : [...selected.map((item) => item.value), option.value],
            );
            query = '';
            return;
        }
        update(option.value);
        close();
        control?.focus();
    }

    function clear() {
        update(field.multiple ? [] : null);
        query = '';
        control?.focus();
    }

    function move(offset: number) {
        if (!filtered.length) return;
        active = (active + offset + filtered.length) % filtered.length;
    }

    function keydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                if (!popover.open) show();
                else move(event.key === 'ArrowDown' ? 1 : -1);
                break;
            case 'Home':
            case 'End':
                if (!popover.open) return;
                event.preventDefault();
                active = event.key === 'Home' ? 0 : Math.max(filtered.length - 1, 0);
                break;
            case 'Enter':
            case ' ':
                if (event.key === ' ' && field.searchable) return;
                event.preventDefault();
                if (!popover.open) show();
                else if (filtered[active]) choose(filtered[active]!);
                break;
            case 'Escape':
                if (popover.open) {
                    event.preventDefault();
                    close();
                }
                break;
            case 'Tab':
                close();
                break;
            case 'Backspace':
                if (field.multiple && query === '' && selected.length) {
                    update(selected.slice(0, -1).map((item) => item.value));
                } else if (!field.multiple && field.clearable && query === '' && selected.length) {
                    update(null);
                }
                break;
        }
    }
</script>

<div bind:this={popover.root} class={classes.popoverAnchor}>
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div
        class={classes.trigger}
        data-open={popover.open || undefined}
        aria-disabled={locked || undefined}
        aria-invalid={error ? true : undefined}
        onclick={() => {
            if (locked) return;
            control?.focus();
            if (popover.open && !field.searchable) close();
            else show();
        }}
    >
        {#if field.multiple && selected.length > 0}
            <span class={cx(classes.chips, 'flex-none')}>
                {#each selected as option (normalize(option.value))}
                    <span class={classes.chip}
                        >{option.label}{#if !locked}<button
                                type="button"
                                class={classes.chipRemove}
                                aria-label={`Remove ${option.label}`}
                                onclick={(event) => {
                                    event.stopPropagation();
                                    choose(option);
                                }}><Icon name="x" class="size-3" /></button
                            >{/if}</span
                    >
                {/each}
            </span>
        {/if}
        {#if !field.multiple && field.searchable && selected[0]}
            <span class={cx(classes.chips, 'flex-none')}
                ><span class={classes.chip}>{selected[0].label}</span></span
            >
        {/if}
        {#if field.searchable}
            <!-- svelte-ignore a11y_autofocus -->
            <input
                bind:this={control}
                {id}
                role="combobox"
                aria-expanded={popover.open}
                aria-controls={listId}
                aria-haspopup="listbox"
                aria-activedescendant={activeDescendant}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                aria-required={field.required || undefined}
                disabled={locked}
                autofocus={field.autofocus}
                onkeydown={keydown}
                type="text"
                autocomplete="off"
                aria-autocomplete="list"
                value={query}
                placeholder={selected.length ? '' : placeholder}
                class={classes.triggerSearch}
                oninput={(event) => {
                    query = event.currentTarget.value;
                    active = 0;
                    popover.setOpen(true);
                }}
            />
        {:else}
            <!-- svelte-ignore a11y_autofocus -->
            <button
                bind:this={control}
                {id}
                role="combobox"
                aria-expanded={popover.open}
                aria-controls={listId}
                aria-haspopup="listbox"
                aria-activedescendant={activeDescendant}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                aria-required={field.required || undefined}
                disabled={locked}
                autofocus={field.autofocus}
                onkeydown={keydown}
                type="button"
                class={classes.triggerButton}
                onclick={(event) => {
                    event.stopPropagation();
                    if (popover.open) close();
                    else show();
                }}
            >
                {#if selected.length === 0}
                    <span class={classes.triggerPlaceholder}>{placeholder}</span>
                {:else if field.multiple}
                    <span class="sr-only">{`${selected.length} selected`}</span>
                {:else}
                    <span class={classes.triggerValue}>{singleLabel}</span>
                {/if}
            </button>
        {/if}
        {#if field.clearable && selected.length > 0 && !locked}
            <ClearButton label={field.label} onClear={clear} />
        {/if}
        <Icon name={popover.open ? 'chevronUp' : 'chevronDown'} class={classes.icon} />
    </div>
    {#if popover.open}
        <div
            bind:this={popover.panel}
            id={listId}
            role="listbox"
            aria-label={field.label}
            aria-multiselectable={field.multiple || undefined}
            class={popover.panelClass(classes.comboboxList)}
        >
            {#if filtered.length === 0}
                <div class={classes.comboboxEmpty}>{loading ? 'Searching…' : 'No results'}</div>
            {/if}
            {#each filtered as option, index (normalize(option.value))}
                {@const selected = selectedValues.includes(normalize(option.value))}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
                <div
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    data-active={index === active || undefined}
                    class={classes.comboboxOption}
                    onpointerenter={() => (active = index)}
                    onpointerdown={(event) => {
                        event.preventDefault();
                        choose(option);
                    }}
                >
                    <span class={classes.optionText}>
                        <span class={classes.optionLabel}>{option.label}</span>
                        {#if option.description}
                            <span class={classes.optionDescription}>{option.description}</span>
                        {/if}
                    </span>
                    {#if selected}
                        <Icon name="check" class={classes.optionCheck} />
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>
