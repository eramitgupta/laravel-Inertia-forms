<script module lang="ts">
    import { parseIsoDate, toIsoDate } from '../core';

    function shift(iso: string, days: number): string {
        const date = parseIsoDate(iso)!;
        return toIsoDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
    }
</script>

<script lang="ts">
    import {
        addMonths,
        classes,
        isOutsideLimits,
        monthGrid,
        monthLabel,
        monthStart,
        todayIso,
        weekdayLabels,
    } from '../core';
    import Icon from '../Icon.svelte';

    interface Props {
        /** First visible month. */
        view: Date;
        months: number;
        firstDayOfWeek: number;
        minDate?: string | null;
        maxDate?: string | null;
        isSelected: (iso: string) => boolean;
        isInRange: (iso: string) => boolean;
        onView: (month: Date) => void;
        onSelect: (iso: string) => void;
        onHover?: ((iso: string | null) => void) | undefined;
    }

    /**
     * Month grid(s) with navigation. Days are buttons; arrow keys move between them.
     */
    let {
        view,
        months,
        firstDayOfWeek,
        minDate,
        maxDate,
        isSelected,
        isInRange,
        onView,
        onSelect,
        onHover,
    }: Props = $props();

    let root = $state<HTMLDivElement | null>(null);
    let focusIso = $state<string | null>(null);
    const today = $derived(todayIso());
    const visible = $derived(Array.from({ length: months }, (_, index) => addMonths(view, index)));
    const weekdays = $derived(weekdayLabels(firstDayOfWeek));
    const visibleDays = $derived(
        visible.flatMap((month) =>
            monthGrid(month, firstDayOfWeek)
                .filter((day) => day.inMonth)
                .map((day) => day.iso),
        ),
    );
    const tabIso = $derived(
        focusIso && visibleDays.includes(focusIso)
            ? focusIso
            : (visibleDays.find(isSelected) ??
                  (visibleDays.includes(today) ? today : visibleDays[0])),
    );

    $effect(() => {
        void view;
        if (!focusIso) return;
        root?.querySelector<HTMLButtonElement>(
            `[data-iso="${focusIso}"]:not([data-outside])`,
        )?.focus();
    });

    function keydown(event: KeyboardEvent) {
        const iso = (event.target as HTMLElement).dataset.iso;
        const offsets: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7,
        };
        if (!iso) return;
        let target: string | null = null;
        if (event.key in offsets) target = shift(iso, offsets[event.key]!);
        if (event.key === 'PageUp' || event.key === 'PageDown') {
            const date = parseIsoDate(iso)!;
            target = toIsoDate(
                new Date(
                    date.getFullYear(),
                    date.getMonth() + (event.key === 'PageUp' ? -1 : 1),
                    date.getDate(),
                ),
            );
        }
        if (!target) return;
        event.preventDefault();
        const first = view;
        const last = addMonths(view, months - 1);
        const month = monthStart(target);
        if (month < first) onView(month);
        if (month > last) onView(addMonths(month, -(months - 1)));
        focusIso = target;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    bind:this={root}
    class={classes.calendar}
    onkeydown={keydown}
    onpointerleave={() => onHover?.(null)}
>
    <div class={classes.calendarHeader}>
        <span class="flex gap-1">
            <button
                type="button"
                class={classes.calendarNav}
                aria-label="Previous year"
                onclick={() => onView(addMonths(view, -12))}
            >
                <Icon name="chevronsLeft" class="size-4" />
            </button>
            <button
                type="button"
                class={classes.calendarNav}
                aria-label="Previous month"
                onclick={() => onView(addMonths(view, -1))}
            >
                <Icon name="chevronLeft" class="size-4" />
            </button>
        </span>
        {#if months === 1}
            <span class={classes.calendarTitle} aria-live="polite">{monthLabel(view)}</span>
        {/if}
        <span class="flex gap-1">
            <button
                type="button"
                class={classes.calendarNav}
                aria-label="Next month"
                onclick={() => onView(addMonths(view, 1))}
            >
                <Icon name="chevronRight" class="size-4" />
            </button>
            <button
                type="button"
                class={classes.calendarNav}
                aria-label="Next year"
                onclick={() => onView(addMonths(view, 12))}
            >
                <Icon name="chevronsRight" class="size-4" />
            </button>
        </span>
    </div>
    <div class={classes.calendarMonths}>
        {#each visible as month (month.toISOString())}
            <div role="grid" aria-label={monthLabel(month)}>
                {#if months > 1}
                    <p class={classes.calendarMonthTitle}>{monthLabel(month)}</p>
                {/if}
                <div class={classes.calendarGrid}>
                    {#each weekdays as weekday, index (index)}
                        <span class={classes.calendarWeekday} aria-hidden="true">{weekday}</span>
                    {/each}
                    {#each monthGrid(month, firstDayOfWeek) as day (day.iso)}
                        {@const selected = day.inMonth && isSelected(day.iso)}
                        {@const tabbable = day.inMonth && day.iso === tabIso}
                        <button
                            type="button"
                            data-iso={day.iso}
                            data-outside={!day.inMonth || undefined}
                            data-today={(day.inMonth && day.iso === today) || undefined}
                            data-selected={selected || undefined}
                            data-in-range={(day.inMonth && !selected && isInRange(day.iso)) ||
                                undefined}
                            aria-pressed={selected}
                            aria-label={parseIsoDate(day.iso)!.toDateString()}
                            tabindex={tabbable ? 0 : -1}
                            disabled={isOutsideLimits(day.iso, minDate, maxDate)}
                            class={classes.calendarDay}
                            onpointerenter={() => onHover?.(day.iso)}
                            onclick={() => onSelect(day.iso)}>{day.day}</button
                        >
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
