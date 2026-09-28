<script lang="ts">
    import {
        classes,
        cx,
        submitButtonClass,
        submitIconClass,
        submitIconName,
        type SubmitSize,
        type SubmitVariant,
    } from '../core';
    import Icon from '../Icon.svelte';
    import { getFormContext } from '../context';
    import { getSubmitterContext } from '../submitter';

    interface Props {
        label: string;
        processingLabel?: string | null;
        processing: boolean;
        disabled?: boolean;
        class?: string | null;
        variant?: SubmitVariant;
        size?: SubmitSize;
        /** Stretch the button across its row. */
        fullWidth?: boolean;
        /** A package icon name shown next to the label. */
        icon?: string | null;
        iconPosition?: 'left' | 'right';
        /** SVG markup for an icon the package doesn't draw itself; used instead of `icon`. */
        iconSvg?: string | null;
        /** Sent with the form as `key=value` when this button submits it. */
        intent?: { key: string; value: string } | null;
        /** Stay disabled until the surrounding `<Form>` has unsaved changes. */
        disableUntilDirty?: boolean;
    }

    let {
        label,
        processingLabel,
        processing,
        disabled,
        class: className,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        icon,
        iconPosition = 'left',
        iconSvg,
        intent,
        disableUntilDirty = false,
    }: Props = $props();

    const form = getFormContext();
    /** Outside a `<Form>` there is no dirty state, so the option has no effect. */
    const clean = $derived(disableUntilDirty && form !== null && !form.isDirty);

    const submitter = getSubmitterContext();
    let button = $state<HTMLButtonElement | null>(null);
    /** Only the button that submitted the form shows the processing state. */
    const busy = $derived(processing && (!submitter?.active || submitter.active === button));
    const svg = $derived(busy ? null : (iconSvg ?? null));
    const iconName = $derived(busy || svg ? null : submitIconName(icon));
</script>

<div class={cx(classes.submitRow, fullWidth && classes.submitRowFull, className)}>
    <button
        bind:this={button}
        type="submit"
        name={intent?.key}
        value={intent?.value}
        class={submitButtonClass(variant, size, fullWidth)}
        disabled={processing || disabled || clean}
        aria-busy={busy || undefined}
        >{#if busy}<span class={classes.submitSpinner} aria-hidden="true"
            ></span>{/if}{#if (iconName || svg) && iconPosition !== 'right'}<Icon
                name={iconName}
                {svg}
                class={submitIconClass(size)}
            />{/if}{busy && processingLabel
            ? processingLabel
            : label}{#if (iconName || svg) && iconPosition === 'right'}<Icon
                name={iconName}
                {svg}
                class={submitIconClass(size)}
            />{/if}</button
    >
</div>
