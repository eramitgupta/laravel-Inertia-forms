<script lang="ts">
    import {
        classes,
        wizardCircleClass,
        wizardProgress,
        wizardStepIcon,
        wizardStepLabel,
        wizardStepState,
        type FieldsetSchema,
    } from './core';
    import Icon from './Icon.svelte';

    /**
     * The stepper above a wizard form. Completed steps are buttons that go back;
     * narrow screens only show the current step.
     */
    interface Props {
        steps: FieldsetSchema[];
        current: number;
        /** Go back to a completed step. */
        onSelect: (index: number) => void;
    }

    let { steps, current, onSelect }: Props = $props();
    const currentStep = $derived(steps[current]);
</script>

{#snippet content(fieldset: FieldsetSchema, index: number)}
    {@const state = wizardStepState(index, current)}
    {@const icon = wizardStepIcon(fieldset)}
    <span class={wizardCircleClass(state)} aria-hidden="true">
        {#if state === 'complete'}
            <Icon name="check" class={classes.wizardCircleIcon} />
        {:else if icon || fieldset.iconSvg}
            <Icon name={icon} svg={fieldset.iconSvg} class={classes.wizardCircleIcon} />
        {:else}
            {index + 1}
        {/if}
    </span>
    <span class={classes.wizardStepText}>
        <span
            class={state === 'upcoming' ? classes.wizardStepTitleUpcoming : classes.wizardStepTitle}
            >{wizardStepLabel(fieldset, index)}</span
        >
        {#if fieldset.description}
            <span class={classes.wizardStepDescription}>{fieldset.description}</span>
        {/if}
    </span>
{/snippet}

<nav aria-label="Progress" class={classes.wizardNav}>
    {#if currentStep}
        <div class={classes.wizardCompact}>
            <p class={classes.wizardCompactCount}>{`Step ${current + 1} of ${steps.length}`}</p>
            <p class={classes.wizardCompactTitle}>{wizardStepLabel(currentStep, current)}</p>
            <div class={classes.wizardCompactTrack} aria-hidden="true">
                <span
                    class={classes.wizardCompactBar}
                    style:width={wizardProgress(current, steps.length)}
                ></span>
            </div>
        </div>
    {/if}
    <ol class={classes.wizardList}>
        {#each steps as fieldset, index (fieldset.id ?? index)}
            <li class={classes.wizardItem} aria-current={index === current ? 'step' : undefined}>
                {#if index < current}
                    <button
                        type="button"
                        class={classes.wizardStepButton}
                        onclick={() => onSelect(index)}
                    >
                        {@render content(fieldset, index)}
                    </button>
                {:else}
                    <div class={classes.wizardStepStatic}>{@render content(fieldset, index)}</div>
                {/if}
                {#if index < steps.length - 1}
                    <span
                        aria-hidden="true"
                        class={index < current
                            ? classes.wizardConnectorComplete
                            : classes.wizardConnector}
                    ></span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>
