<script lang="ts">
    import { choiceListClass, classes, normalize, type ChoiceListSchema } from '../core';
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

    const selected = $derived<unknown[]>(Array.isArray(value) ? value : []);
    const cards = $derived(field.options.some((option) => option.description));

    function isChecked(optionValue: unknown): boolean {
        return selected.some((item) => normalize(item) === normalize(optionValue));
    }

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function toggle(optionValue: unknown, checked: boolean) {
        update(
            checked
                ? [...selected, optionValue]
                : selected.filter((item) => normalize(item) !== normalize(optionValue)),
        );
    }
</script>

{#if field.buttons}
    <!-- svelte-ignore a11y_role_supports_aria_props -->
    <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        class={classes.pills}
    >
        {#each field.options as option, index (String(option.value))}
            <label class={classes.pill}>
                <!-- svelte-ignore a11y_autofocus -->
                <input
                    id={`${id}-${index}`}
                    type="checkbox"
                    name={`${field.name}[]`}
                    value={String(option.value)}
                    checked={isChecked(option.value)}
                    disabled={disabled || field.readonly || option.disabled}
                    autofocus={field.autofocus && index === 0}
                    class={classes.visuallyHidden}
                    onchange={(event) => toggle(option.value, event.currentTarget.checked)}
                />{option.label}</label
            >
        {/each}
    </div>
{:else}
    <!-- svelte-ignore a11y_role_supports_aria_props -->
    <div
        role="group"
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
                    type="checkbox"
                    name={`${field.name}[]`}
                    value={String(option.value)}
                    checked={isChecked(option.value)}
                    disabled={disabled || field.readonly || option.disabled}
                    autofocus={field.autofocus && index === 0}
                    class={classes.checkbox}
                    onchange={(event) => toggle(option.value, event.currentTarget.checked)}
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
