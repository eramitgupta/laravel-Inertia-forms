<script lang="ts">
    import { classes, cx, preventNumberWheel, type TextInputSchema } from '../core';
    import type { FieldComponentProps } from '../types';
    import ClearButton from './ClearButton.svelte';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<TextInputSchema> = $props();

    const text = $derived(value === null || value === undefined ? '' : String(value));
    const showClear = $derived(field.clearable && text !== '' && !disabled && !field.readonly);
    const grouped = $derived(Boolean(field.prefix || field.suffix || field.clearable));

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    /** Svelte registers `onwheel` as passive, so add a listener that can cancel the step. */
    function numberWheel(node: HTMLInputElement) {
        node.addEventListener('wheel', preventNumberWheel, { passive: false });
        return { destroy: () => node.removeEventListener('wheel', preventNumberWheel) };
    }
</script>

{#snippet input()}
    <!-- svelte-ignore a11y_autofocus -->
    <input
        {id}
        name={field.name}
        type={field.type}
        value={text}
        placeholder={field.placeholder ?? undefined}
        required={field.required}
        {disabled}
        readonly={field.readonly}
        autofocus={field.autofocus}
        autocomplete={(field.autocomplete ?? undefined) as HTMLInputElement['autocomplete']}
        minlength={field.minLength ?? undefined}
        maxlength={field.maxLength ?? undefined}
        min={field.min ?? undefined}
        max={field.max ?? undefined}
        step={field.step ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        class={grouped ? classes.inputGroupInput : classes.input}
        oninput={(event) => update(event.currentTarget.value)}
        use:numberWheel
    />
{/snippet}

{#if !grouped}
    {@render input()}
{:else}
    <div class={cx(classes.inputGroup)}>
        {#if field.prefix}
            <span class={classes.addon}>{field.prefix}</span>
        {/if}
        {@render input()}
        {#if showClear}
            <span class={classes.addonEnd}>
                <ClearButton label={field.label} onClear={() => update('')} />
            </span>
        {/if}
        {#if field.suffix}
            <span class={classes.addon}>{field.suffix}</span>
        {/if}
    </div>
{/if}
