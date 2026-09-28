<script module lang="ts">
    import type { TimeParts } from '../core';

    export type TimePart = keyof TimeParts;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import {
        classes,
        formatTime,
        hourOptions,
        isTimeOutsideLimits,
        minuteOptions,
        parseTime,
        secondOptions,
    } from '../core';

    type Part = TimePart;

    interface Props {
        id: string;
        value: string;
        withSeconds: boolean;
        minuteStep: number;
        minTime?: string | null | undefined;
        maxTime?: string | null | undefined;
        /** Receives the new time and the column that was picked. */
        onChange: (time: string, part: Part) => void;
    }

    /**
     * Scrollable hour / minute (/ second) lists used by TimePicker and DatePicker::withTime().
     */
    let { id, value, withSeconds, minuteStep, minTime, maxTime, onChange }: Props = $props();

    let root = $state<HTMLDivElement | null>(null);
    const parts = $derived(parseTime(value));
    const columns = $derived<Array<{ part: Part; title: string; options: string[] }>>([
        { part: 'hour', title: 'Hour', options: hourOptions() },
        { part: 'minute', title: 'Min', options: minuteOptions(minuteStep) },
        ...(withSeconds
            ? [{ part: 'second' as const, title: 'Sec', options: secondOptions() }]
            : []),
    ]);

    // Center the selection only when the columns first appear.
    onMount(() => {
        root?.querySelectorAll<HTMLElement>('[aria-selected="true"]').forEach((option) => {
            const list = option.parentElement;
            if (list) {
                list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2;
            }
        });
    });

    function candidate(part: Part, option: string): string {
        return formatTime(
            { hour: '00', minute: '00', second: '00', ...parts, [part]: option },
            withSeconds,
        );
    }
</script>

<div bind:this={root} class={classes.timeColumns}>
    {#each columns as column (column.part)}
        <div class={classes.timeColumn}>
            <span id={`${id}-${column.part}-title`} class={classes.timeColumnTitle}
                >{column.title}</span
            >
            <div
                role="listbox"
                aria-labelledby={`${id}-${column.part}-title`}
                class={classes.timeList}
            >
                {#each column.options as option (option)}
                    <button
                        type="button"
                        role="option"
                        aria-selected={parts?.[column.part] === option}
                        disabled={column.part === 'hour'
                            ? false
                            : isTimeOutsideLimits(candidate(column.part, option), minTime, maxTime)}
                        class={classes.timeOption}
                        onclick={() => onChange(candidate(column.part, option), column.part)}
                        >{option}</button
                    >
                {/each}
            </div>
        </div>
    {/each}
</div>
