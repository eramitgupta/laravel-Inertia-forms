<script module lang="ts">
    import type { FieldSchema } from './core';

    export function describedBy(
        field: FieldSchema,
        id: string,
        error?: string,
    ): string | undefined {
        const ids = [field.help ? `${id}-help` : null, error ? `${id}-error` : null].filter(
            Boolean,
        );
        return ids.length ? ids.join(' ') : undefined;
    }
</script>

<script lang="ts">
    import type { Snippet } from 'svelte';
    import { classes, columnSpanClass, cx } from './core';

    interface Props {
        field: FieldSchema;
        id: string;
        columns: number;
        error?: string | undefined;
        /** `label` for single inputs, `group` for radio/checkbox lists, `none` when the control labels itself. */
        labelMode: 'label' | 'group' | 'none';
        children: Snippet;
    }

    let { field, id, columns, error, labelMode, children }: Props = $props();
</script>

{#snippet label()}{field.label}{#if field.required}<span class={classes.required} aria-hidden="true"
            >*</span
        >{/if}{/snippet}

<div
    class={cx(classes.field, columnSpanClass(field.columnSpan, columns), field.class)}
    data-field={field.name}
>
    {#if labelMode === 'label'}
        <label for={id} class={classes.label}>{@render label()}</label>
    {/if}
    {#if labelMode === 'group'}
        <span id={`${id}-label`} class={classes.label}>{@render label()}</span>
    {/if}
    {@render children()}
    {#if field.help}
        <p id={`${id}-help`} class={classes.help}>
            {field.help}
        </p>
    {/if}
    {#if error}
        <p id={`${id}-error`} class={classes.error} role="alert">
            {error}
        </p>
    {/if}
</div>
