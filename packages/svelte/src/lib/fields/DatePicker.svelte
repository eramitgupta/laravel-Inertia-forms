<script module lang="ts">
    import type { DateRangeValue } from '../core';

    function toRange(value: unknown): DateRangeValue {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const range = value as Partial<DateRangeValue>;
            return { start: range.start ?? '', end: range.end ?? '' };
        }
        return { start: '', end: '' };
    }
</script>

<script lang="ts">
    import { untrack } from 'svelte';
    import {
        classes,
        datePart,
        formatDisplayDate,
        monthStart,
        nextRange,
        timePart,
        todayIso,
        type DatePickerSchema,
    } from '../core';
    import Icon from '../Icon.svelte';
    import { createPopover } from '../popover.svelte';
    import type { FieldComponentProps } from '../types';
    import Calendar from './Calendar.svelte';
    import ClearButton from './ClearButton.svelte';
    import TimeColumns from './TimeColumns.svelte';

    /**
     * Calendar popover for a single date, a date and time (`withTime()`),
     * or a start–end range (`range()`).
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<DatePickerSchema> = $props();

    const popover = createPopover();
    let view = $state(
        untrack(() => monthStart(field.range ? toRange(value).start : (value as string))),
    );
    let hover = $state<string | null>(null);
    const locked = $derived(disabled || field.readonly);
    const single = $derived(typeof value === 'string' ? value : '');
    const range = $derived(toRange(value));
    const hasValue = $derived(field.range ? Boolean(range.start || range.end) : Boolean(single));
    const display = $derived(
        field.range
            ? range.start
                ? `${formatDisplayDate(range.start)} – ${range.end ? formatDisplayDate(range.end) : '…'}`
                : ''
            : formatDisplayDate(single),
    );
    const placeholder = $derived(
        field.placeholder ?? (field.range ? 'Select dates' : 'Select a date'),
    );

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function toggle() {
        if (locked) return;
        if (!popover.open) view = monthStart(field.range ? range.start : single);
        popover.setOpen(!popover.open);
    }

    function select(iso: string) {
        if (field.range) {
            const next = nextRange(range, iso);
            update(next);
            if (next.end) popover.setOpen(false);
            return;
        }
        if (field.withTime) {
            update(`${iso}T${timePart(single) || '09:00'}`);
            return;
        }
        update(iso);
        popover.setOpen(false);
    }

    function isSelected(iso: string): boolean {
        return field.range ? iso === range.start || iso === range.end : iso === datePart(single);
    }

    function isInRange(iso: string): boolean {
        if (!field.range || !range.start) return false;
        const end = range.end || (hover && hover > range.start ? hover : '');
        return Boolean(end) && iso > range.start && iso < end;
    }

    function clear() {
        update(field.range ? { start: '', end: '' } : '');
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
            <span class={display ? classes.triggerValue : classes.triggerPlaceholder}
                >{display || placeholder}</span
            >
        </button>
        {#if field.clearable && hasValue && !locked}
            <ClearButton label={field.label} onClear={clear} />
        {/if}
        <Icon name="calendar" class={classes.icon} />
    </div>
    {#if popover.open}
        <div
            bind:this={popover.panel}
            role="dialog"
            aria-label={field.label}
            class={popover.panelClass()}
        >
            <div class="flex flex-col gap-3 sm:flex-row">
                <Calendar
                    {view}
                    months={field.months}
                    firstDayOfWeek={field.firstDayOfWeek}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
                    {isSelected}
                    {isInRange}
                    onView={(month) => (view = month)}
                    onSelect={select}
                    onHover={field.range ? (iso) => (hover = iso) : undefined}
                />
                {#if field.withTime}
                    <TimeColumns
                        id={`${id}-time`}
                        value={timePart(single)}
                        withSeconds={false}
                        minuteStep={5}
                        onChange={(time, part) => {
                            const hadDate = Boolean(datePart(single));
                            update(`${datePart(single) || todayIso()}T${time}`);
                            if (part === 'minute' && hadDate) popover.setOpen(false);
                        }}
                    />
                {/if}
            </div>
            <div class={classes.popoverFooter}>
                <button
                    type="button"
                    class={classes.popoverAction}
                    onclick={() => {
                        view = monthStart(todayIso());
                        if (!field.range) select(todayIso());
                    }}
                >
                    Today
                </button>
                <button type="button" class={classes.popoverAction} onclick={clear}>Clear</button>
            </div>
        </div>
    {/if}
</div>
