<script lang="ts">
    import {
        classes,
        linkParts,
        linkSchemeHint,
        linkValue,
        type LinkParts,
        type LinkSchema,
    } from '../core';
    import Icon from '../Icon.svelte';
    import type { FieldComponentProps } from '../types';

    /**
     * A URL with a link icon. `structured` fields add an optional link text box
     * and a "Same tab / New tab" choice and store `{ url, label?, target? }`.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<LinkSchema> = $props();

    const TARGETS = [
        { value: '_self', label: 'Same tab' },
        { value: '_blank', label: 'New tab' },
    ] as const;

    const parts = $derived(linkParts(value));
    const hint = $derived(linkSchemeHint(field, parts.url));
    const hintId = $derived(`${id}-hint`);
    const locked = $derived(disabled || field.readonly);
    const urlDescribedBy = $derived([describedBy, hint ? hintId : null].filter(Boolean).join(' '));

    function update(changes: Partial<LinkParts>) {
        const next = linkValue(field, { ...parts, ...changes });
        value = next;
        onChange?.(next);
    }
</script>

<div class={classes.link}>
    <div class={classes.inputGroup}>
        <span class={classes.linkIcon}>
            <Icon name="linkChain" class="size-4" />
        </span>
        <!-- svelte-ignore a11y_autofocus -->
        <input
            {id}
            name={field.structured ? `${field.name}[url]` : field.name}
            type="url"
            inputmode="url"
            autocomplete="url"
            value={parts.url}
            placeholder={field.placeholder ?? 'https://example.com'}
            required={field.required}
            {disabled}
            readonly={field.readonly}
            autofocus={field.autofocus}
            aria-invalid={error ? true : undefined}
            aria-describedby={urlDescribedBy || undefined}
            class={classes.inputGroupInput}
            oninput={(event) => update({ url: event.currentTarget.value })}
            onblur={(event) => {
                const trimmed = event.currentTarget.value.trim();
                if (trimmed !== parts.url) update({ url: trimmed });
            }}
        />
    </div>
    {#if field.structured && (field.withLabel || field.withTarget)}
        <div class={classes.linkOptions}>
            {#if field.withLabel}
                <div class={classes.linkText}>
                    <input
                        id={`${id}-text`}
                        name={`${field.name}[label]`}
                        type="text"
                        value={parts.label}
                        placeholder={field.labelPlaceholder ?? 'Link text'}
                        {disabled}
                        readonly={field.readonly}
                        aria-label={`${field.label} text`}
                        aria-invalid={error ? true : undefined}
                        class={classes.input}
                        oninput={(event) => update({ label: event.currentTarget.value })}
                    />
                </div>
            {/if}
            {#if field.withTarget}
                <div
                    role="radiogroup"
                    aria-label={`Open ${field.label} in`}
                    class={classes.segmented}
                >
                    {#each TARGETS as target (target.value)}
                        <label class={classes.segment}>
                            <input
                                id={`${id}-target${target.value}`}
                                type="radio"
                                name={`${field.name}[target]`}
                                value={target.value}
                                checked={target.value === '_blank'
                                    ? parts.target === '_blank'
                                    : parts.target !== '_blank'}
                                disabled={locked}
                                class={classes.visuallyHidden}
                                onchange={() => update({ target: target.value })}
                            />{target.label}</label
                        >
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
    {#if hint}
        <p id={hintId} class={classes.linkHint}>{hint}</p>
    {/if}
</div>
