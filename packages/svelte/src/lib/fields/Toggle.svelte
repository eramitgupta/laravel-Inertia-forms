<script lang="ts">
    import { classes, cx, type BooleanFieldSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<BooleanFieldSchema> = $props();

    const checked = $derived(value === field.trueValue);
    const stateLabel = $derived(checked ? field.onLabel : field.offLabel);

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }
</script>

<div class={classes.toggleRow}>
    <!-- svelte-ignore a11y_autofocus, a11y_consider_explicit_label -->
    <button
        {id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        disabled={disabled || field.readonly}
        autofocus={field.autofocus}
        class={classes.toggleTrack}
        onclick={() => update(checked ? field.falseValue : field.trueValue)}
    >
        <span aria-hidden="true" class={cx(classes.toggleThumb, checked && classes.toggleThumbOn)}
        ></span>
    </button>
    {#if stateLabel}
        <span class={classes.toggleText} aria-hidden="true">
            {stateLabel}
        </span>
    {/if}
</div>
