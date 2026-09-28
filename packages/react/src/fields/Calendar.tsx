import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
    addMonths,
    classes,
    isOutsideLimits,
    monthGrid,
    monthLabel,
    monthStart,
    parseIsoDate,
    todayIso,
    toIsoDate,
    weekdayLabels,
} from '../../../core/src';
import { Icon } from '../Icon';

interface CalendarProps {
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
    onHover?: (iso: string | null) => void;
}

function shift(iso: string, days: number): string {
    const date = parseIsoDate(iso)!;
    return toIsoDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

/**
 * Month grid(s) with navigation. Days are buttons; arrow keys move between them.
 */
export function Calendar(props: CalendarProps) {
    const {
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
    } = props;
    const root = useRef<HTMLDivElement>(null);
    const [focusIso, setFocusIso] = useState<string | null>(null);
    const today = todayIso();
    const visible = Array.from({ length: months }, (_, index) => addMonths(view, index));
    const weekdays = weekdayLabels(firstDayOfWeek);
    const visibleDays = visible.flatMap((month) =>
        monthGrid(month, firstDayOfWeek)
            .filter((day) => day.inMonth)
            .map((day) => day.iso),
    );
    const tabIso =
        focusIso && visibleDays.includes(focusIso)
            ? focusIso
            : (visibleDays.find(isSelected) ??
              (visibleDays.includes(today) ? today : visibleDays[0]));

    useEffect(() => {
        if (!focusIso) return;
        root.current
            ?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]:not([data-outside])`)
            ?.focus();
    }, [focusIso, view]);

    function keydown(event: KeyboardEvent<HTMLDivElement>) {
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
        setFocusIso(target);
    }

    return (
        <div
            ref={root}
            className={classes.calendar}
            onKeyDown={keydown}
            onPointerLeave={() => onHover?.(null)}
        >
            <div className={classes.calendarHeader}>
                <span className="flex gap-1">
                    <button
                        type="button"
                        className={classes.calendarNav}
                        aria-label="Previous year"
                        onClick={() => onView(addMonths(view, -12))}
                    >
                        <Icon name="chevronsLeft" className="size-4" />
                    </button>
                    <button
                        type="button"
                        className={classes.calendarNav}
                        aria-label="Previous month"
                        onClick={() => onView(addMonths(view, -1))}
                    >
                        <Icon name="chevronLeft" className="size-4" />
                    </button>
                </span>
                {months === 1 && (
                    <span className={classes.calendarTitle} aria-live="polite">
                        {monthLabel(view)}
                    </span>
                )}
                <span className="flex gap-1">
                    <button
                        type="button"
                        className={classes.calendarNav}
                        aria-label="Next month"
                        onClick={() => onView(addMonths(view, 1))}
                    >
                        <Icon name="chevronRight" className="size-4" />
                    </button>
                    <button
                        type="button"
                        className={classes.calendarNav}
                        aria-label="Next year"
                        onClick={() => onView(addMonths(view, 12))}
                    >
                        <Icon name="chevronsRight" className="size-4" />
                    </button>
                </span>
            </div>
            <div className={classes.calendarMonths}>
                {visible.map((month) => (
                    <div key={month.toISOString()} role="grid" aria-label={monthLabel(month)}>
                        {months > 1 && (
                            <p className={classes.calendarMonthTitle}>{monthLabel(month)}</p>
                        )}
                        <div className={classes.calendarGrid}>
                            {weekdays.map((weekday, index) => (
                                <span
                                    key={index}
                                    className={classes.calendarWeekday}
                                    aria-hidden="true"
                                >
                                    {weekday}
                                </span>
                            ))}
                            {monthGrid(month, firstDayOfWeek).map((day) => {
                                const selected = day.inMonth && isSelected(day.iso);
                                const tabbable = day.inMonth && day.iso === tabIso;
                                return (
                                    <button
                                        key={day.iso}
                                        type="button"
                                        data-iso={day.iso}
                                        data-outside={!day.inMonth || undefined}
                                        data-today={(day.inMonth && day.iso === today) || undefined}
                                        data-selected={selected || undefined}
                                        data-in-range={
                                            (day.inMonth && !selected && isInRange(day.iso)) ||
                                            undefined
                                        }
                                        aria-pressed={selected}
                                        aria-label={parseIsoDate(day.iso)!.toDateString()}
                                        tabIndex={tabbable ? 0 : -1}
                                        disabled={isOutsideLimits(day.iso, minDate, maxDate)}
                                        className={classes.calendarDay}
                                        onPointerEnter={() => onHover?.(day.iso)}
                                        onClick={() => onSelect(day.iso)}
                                    >
                                        {day.day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
