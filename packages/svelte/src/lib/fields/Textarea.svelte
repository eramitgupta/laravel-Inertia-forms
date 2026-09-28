<script lang="ts">
    import { classes, cx, type TextareaSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<TextareaSchema> = $props();

    let textarea = $state<HTMLTextAreaElement | null>(null);
    const text = $derived(value === null || value === undefined ? '' : String(value));

    $effect(() => {
        void text;
        if (!field.autoResize || !textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }
</script>

<!-- svelte-ignore a11y_autofocus -->
<textarea
    bind:this={textarea}
    {id}
    name={field.name}
    rows={field.rows}
    value={text}
    placeholder={field.placeholder ?? undefined}
    required={field.required}
    {disabled}
    readonly={field.readonly}
    autofocus={field.autofocus}
    minlength={field.minLength ?? undefined}
    maxlength={field.maxLength ?? undefined}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    class={cx(classes.input, classes.textarea, field.autoResize && 'resize-none overflow-hidden')}
    oninput={(event) => update(event.currentTarget.value)}
></textarea>
{#if field.showCharacterCount}
    <p class={classes.counter}>
        {text.length}{field.maxLength ? ` / ${field.maxLength}` : ''}
    </p>
{/if}
