<script lang="ts">
    import { calloutParts } from '../core/features/display';
    import { classes, icons, type DisplayFieldSchema, type IconName } from '../core';
    import Icon from '../Icon.svelte';
    import type { FieldComponentProps } from '../types';

    /** A notice inside the form, tinted by its tone (info, success, warning, danger). */
    let { field }: FieldComponentProps<DisplayFieldSchema> = $props();

    const callout = $derived(calloutParts(field, icons));
</script>

<div role={callout.role} data-tone={callout.tone} class={callout.className}>
    <Icon name={callout.icon as IconName} svg={callout.svg} class={callout.iconClass} />
    <div class={classes.calloutContent}>
        {#if field.title}
            <p class={classes.calloutTitle}>{field.title}</p>
        {/if}
        {#if field.body}
            <p class={classes.calloutBody}>{field.body}</p>
        {/if}
    </div>
</div>
