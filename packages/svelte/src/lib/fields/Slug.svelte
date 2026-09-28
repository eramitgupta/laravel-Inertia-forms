<script lang="ts">
    import { untrack } from 'svelte';
    import { classes, slugify, slugSource, type SlugSchema } from '../core';
    import { getFormContext } from '../context';
    import Icon from '../Icon.svelte';
    import type { FieldComponentProps } from '../types';

    /**
     * A URL-safe slug that follows the `from` field until it is edited by hand.
     * Clearing it follows the source again; the button regenerates it on demand.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<SlugSchema> = $props();

    const form = getFormContext();

    const text = $derived(
        typeof value === 'string' || typeof value === 'number' ? String(value) : '',
    );
    const options = $derived({
        separator: field.separator,
        lowercase: field.lowercase,
        maxLength: field.maxLength,
    });
    const follows = $derived(Boolean(form && field.from));
    const generated = $derived(
        follows ? slugify(slugSource(form?.data, field.name, field.from), options) : '',
    );
    let manual = $state(untrack(() => follows && text !== '' && text !== generated));
    const syncing = $derived(follows && !manual && !disabled);

    $effect(() => {
        if (syncing && text !== generated) update(generated);
    });

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function regenerate() {
        manual = false;
        if (text !== generated) update(generated);
    }
</script>

<div class={classes.inputGroup}>
    {#if field.prefix}
        <span class={classes.slugPrefix}>{field.prefix}</span>
    {/if}
    <!-- svelte-ignore a11y_autofocus -->
    <input
        {id}
        name={field.name}
        type="text"
        value={text}
        placeholder={field.placeholder ?? undefined}
        required={field.required}
        {disabled}
        readonly={field.readonly}
        autofocus={field.autofocus}
        autocomplete="off"
        autocapitalize="off"
        spellcheck={false}
        maxlength={field.maxLength ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        class={classes.inputGroupInput}
        oninput={(event) => {
            manual = follows && event.currentTarget.value !== '';
            update(event.currentTarget.value);
        }}
        onblur={(event) => {
            const typed = event.currentTarget.value;
            const slug = slugify(typed, options);
            manual = follows && slug !== '' && slug !== generated;
            if (slug !== typed) update(slug);
        }}
    />
    {#if follows && manual && generated !== '' && !disabled && !field.readonly}
        <span class={classes.addonEnd}>
            <button
                type="button"
                class={classes.iconButton}
                aria-label={`Regenerate ${field.label}`}
                title={`Regenerate ${field.label}`}
                onclick={regenerate}
            >
                <Icon name="slugRegenerate" class="size-4" />
            </button>
        </span>
    {/if}
</div>
