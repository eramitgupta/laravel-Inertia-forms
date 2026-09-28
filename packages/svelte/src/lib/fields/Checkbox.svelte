<script lang="ts">
    import { classes, type BooleanFieldSchema } from '../core';
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

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }
</script>

<label for={id} class={classes.choice}>
    <!-- svelte-ignore a11y_autofocus -->
    <input
        {id}
        name={field.name}
        type="checkbox"
        checked={value === field.trueValue}
        required={field.required}
        disabled={disabled || field.readonly}
        autofocus={field.autofocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        class={classes.checkbox}
        onchange={(event) =>
            update(event.currentTarget.checked ? field.trueValue : field.falseValue)}
    />
    <span class={classes.choiceText}>
        <span class={classes.choiceLabel}
            >{field.label}{#if field.required}<span class={classes.required} aria-hidden="true"
                    >*</span
                >{/if}</span
        >
    </span>
</label>
