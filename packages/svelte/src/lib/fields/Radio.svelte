<script lang="ts">
    import { choiceListClass, classes, type ChoiceListSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<ChoiceListSchema> = $props();

    const cards = $derived(field.options.some((option) => option.description));

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }
</script>

{#if field.buttons}
    <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        class={classes.segmented}
    >
        {#each field.options as option, index (String(option.value))}
            <label class={classes.segment}>
                <!-- svelte-ignore a11y_autofocus -->
                <input
                    id={`${id}-${index}`}
                    type="radio"
                    name={field.name}
                    value={String(option.value)}
                    checked={String(value) === String(option.value) && value !== null}
                    disabled={disabled || field.readonly || option.disabled}
                    autofocus={field.autofocus && index === 0}
                    class={classes.visuallyHidden}
                    onchange={() => update(option.value)}
                />{option.label}</label
            >
        {/each}
    </div>
{:else}
    <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        class={choiceListClass(field.inline, field.columns)}
    >
        {#each field.options as option, index (String(option.value))}
            {@const optionId = `${id}-${index}`}
            <label for={optionId} class={cards ? classes.choiceCard : classes.choice}>
                <!-- svelte-ignore a11y_autofocus -->
                <input
                    id={optionId}
                    type="radio"
                    name={field.name}
                    value={String(option.value)}
                    checked={String(value) === String(option.value) && value !== null}
                    required={field.required}
                    disabled={disabled || field.readonly || option.disabled}
                    autofocus={field.autofocus && index === 0}
                    class={classes.radio}
                    onchange={() => update(option.value)}
                />
                <span class={classes.choiceText}>
                    <span class={classes.choiceLabel}>{option.label}</span>
                    {#if option.description}
                        <span class={classes.choiceDescription}>{option.description}</span>
                    {/if}
                </span>
            </label>
        {/each}
    </div>
{/if}
