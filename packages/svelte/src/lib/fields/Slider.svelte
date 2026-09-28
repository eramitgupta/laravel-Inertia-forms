<script lang="ts">
    import { classes, type SliderSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<SliderSchema> = $props();

    const current = $derived(
        value === null || value === undefined || value === '' ? field.min : Number(value),
    );

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }
</script>

<div class={classes.sliderRow}>
    <!-- svelte-ignore a11y_autofocus -->
    <input
        {id}
        name={field.name}
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={current}
        disabled={disabled || field.readonly}
        autofocus={field.autofocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        class={classes.slider}
        oninput={(event) => update(Number(event.currentTarget.value))}
    />
    {#if field.showValue}
        <output for={id} class={classes.sliderValue}>
            {current}{field.suffix ?? ''}
        </output>
    {/if}
</div>
