import { useLayoutEffect, useRef } from 'react';
import {
    classes,
    formatTime,
    hourOptions,
    isTimeOutsideLimits,
    minuteOptions,
    parseTime,
    secondOptions,
    type TimeParts,
} from '../../../core/src';

interface TimeColumnsProps {
    id: string;
    value: string;
    withSeconds: boolean;
    minuteStep: number;
    minTime?: string | null;
    maxTime?: string | null;
    /** Receives the new time and the column that was picked. */
    onChange: (time: string, part: Part) => void;
}

export type TimePart = keyof TimeParts;
type Part = TimePart;

/**
 * Scrollable hour / minute (/ second) lists used by TimePicker and DatePicker::withTime().
 */
export function TimeColumns({
    id,
    value,
    withSeconds,
    minuteStep,
    minTime,
    maxTime,
    onChange,
}: TimeColumnsProps) {
    const root = useRef<HTMLDivElement>(null);
    const parts = parseTime(value);
    const columns: Array<{ part: Part; title: string; options: string[] }> = [
        { part: 'hour', title: 'Hour', options: hourOptions() },
        { part: 'minute', title: 'Min', options: minuteOptions(minuteStep) },
        ...(withSeconds
            ? [{ part: 'second' as const, title: 'Sec', options: secondOptions() }]
            : []),
    ];

    useLayoutEffect(() => {
        root.current?.querySelectorAll<HTMLElement>('[aria-selected="true"]').forEach((option) => {
            const list = option.parentElement;
            if (list)
                list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2;
        });
        // Center the selection only when the columns first appear.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function pick(part: Part, option: string) {
        const next: TimeParts = {
            hour: '00',
            minute: '00',
            second: '00',
            ...parts,
            [part]: option,
        };
        onChange(formatTime(next, withSeconds), part);
    }

    return (
        <div ref={root} className={classes.timeColumns}>
            {columns.map((column) => (
                <div key={column.part} className={classes.timeColumn}>
                    <span id={`${id}-${column.part}-title`} className={classes.timeColumnTitle}>
                        {column.title}
                    </span>
                    <div
                        role="listbox"
                        aria-labelledby={`${id}-${column.part}-title`}
                        className={classes.timeList}
                    >
                        {column.options.map((option) => {
                            const candidate = formatTime(
                                {
                                    hour: '00',
                                    minute: '00',
                                    second: '00',
                                    ...parts,
                                    [column.part]: option,
                                },
                                withSeconds,
                            );
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    role="option"
                                    aria-selected={parts?.[column.part] === option}
                                    disabled={
                                        column.part === 'hour'
                                            ? false
                                            : isTimeOutsideLimits(candidate, minTime, maxTime)
                                    }
                                    className={classes.timeOption}
                                    onClick={() => pick(column.part, option)}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
