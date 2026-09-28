<script lang="ts">
    import { classes, nowTime, type TimePickerSchema } from '../core';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';
    import ClearButton from './ClearButton.svelte';
    import TimeColumns, { type TimePart } from './TimeColumns.svelte';

    /**
     * Time popover with scrollable hour and minute columns (`minuteStep()`).
     * Closes once every column has been picked, or when the last column is picked
     * for a time that was already set.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<TimePickerSchema> = $props();

    const popover = createPopover();
    const locked = $derived(disabled || field.readonly);
    const time = $derived(typeof value === 'string' ? value : '');

    let picked = new Set<TimePart>();
    let hadTime = false;

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function toggle() {
        if (locked) return;
        picked = new Set();
        hadTime = Boolean(time);
        popover.setOpen(!popover.open);
    }

    function pick(next: string, part: TimePart) {
        update(next);
        picked.add(part);
        const last: TimePart = field.withSeconds ? 'second' : 'minute';
        const columns: TimePart[] = field.withSeconds
            ? ['hour', 'minute', 'second']
            : ['hour', 'minute'];
        if (columns.every((column) => picked.has(column)) || (part === last && hadTime)) {
            popover.setOpen(false);
        }
    }
</script>

<div bind:this={popover.root} class={classes.popoverAnchor}>
    <div
        class={classes.trigger}
        data-open={popover.open || undefined}
        aria-disabled={locked || undefined}
        aria-invalid={error ? true : undefined}
    >
        <!-- svelte-ignore a11y_autofocus, a11y_role_supports_aria_props_implicit -->
        <button
            {id}
            type="button"
            class={classes.triggerButton}
            aria-haspopup="dialog"
            aria-expanded={popover.open}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={field.required || undefined}
            disabled={locked}
            autofocus={field.autofocus}
            onclick={toggle}
        >
            <span class={time ? classes.triggerValue : classes.triggerPlaceholder}
                >{time || field.placeholder || (field.withSeconds ? '--:--:--' : '--:--')}</span
            >
        </button>
        {#if field.clearable && time && !locked}
            <ClearButton label={field.label} onClear={() => update('')} />
        {/if}
        <Icon name="clock" class={classes.icon} />
    </div>
    {#if popover.open}
        <div
            bind:this={popover.panel}
            role="dialog"
            aria-label={field.label}
            class={popover.panelClass()}
        >
            <TimeColumns
                {id}
                value={time}
                withSeconds={field.withSeconds}
                minuteStep={field.minuteStep}
                minTime={field.minTime}
                maxTime={field.maxTime}
                onChange={pick}
            />
            <div class={classes.popoverFooter}>
                <button
                    type="button"
                    class={classes.popoverAction}
                    onclick={() => {
                        update(nowTime(field.withSeconds, field.minuteStep));
                        popover.setOpen(false);
                    }}
                >
                    Now
                </button>
                <button
                    type="button"
                    class={classes.popoverAction}
                    onclick={() => {
                        update('');
                        popover.setOpen(false);
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    {/if}
</div>
