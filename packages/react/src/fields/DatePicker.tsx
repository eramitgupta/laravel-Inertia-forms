import { useState } from 'react';
import {
    classes,
    datePart,
    formatDisplayDate,
    monthStart,
    nextRange,
    timePart,
    todayIso,
    type DatePickerSchema,
    type DateRangeValue,
} from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import { Calendar } from './Calendar';
import { ClearButton } from './ClearButton';
import { TimeColumns } from './TimeColumns';

function toRange(value: unknown): DateRangeValue {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const range = value as Partial<DateRangeValue>;
        return { start: range.start ?? '', end: range.end ?? '' };
    }
    return { start: '', end: '' };
}

/**
 * Calendar popover for a single date, a date and time (`withTime()`),
 * or a start–end range (`range()`).
 */
export function DatePicker({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<DatePickerSchema>) {
    const { root, panel, open, setOpen, panelClass } = usePopover();
    const [view, setView] = useState(() =>
        monthStart(field.range ? toRange(value).start : (value as string)),
    );
    const [hover, setHover] = useState<string | null>(null);
    const locked = disabled || field.readonly;
    const single = typeof value === 'string' ? value : '';
    const range = toRange(value);
    const hasValue = field.range ? Boolean(range.start || range.end) : Boolean(single);

    const display = field.range
        ? range.start
            ? `${formatDisplayDate(range.start)} – ${range.end ? formatDisplayDate(range.end) : '…'}`
            : ''
        : formatDisplayDate(single);
    const placeholder = field.placeholder ?? (field.range ? 'Select dates' : 'Select a date');

    function toggle() {
        if (locked) return;
        if (!open) setView(monthStart(field.range ? range.start : single));
        setOpen(!open);
    }

    function select(iso: string) {
        if (field.range) {
            const next = nextRange(range, iso);
            onChange(next);
            if (next.end) setOpen(false);
            return;
        }
        if (field.withTime) {
            onChange(`${iso}T${timePart(single) || '09:00'}`);
            return;
        }
        onChange(iso);
        setOpen(false);
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
        onChange(field.range ? { start: '', end: '' } : '');
    }

    return (
        <div ref={root} className={classes.popoverAnchor}>
            <div
                className={classes.trigger}
                data-open={open || undefined}
                aria-disabled={locked || undefined}
                aria-invalid={error ? true : undefined}
            >
                <button
                    id={id}
                    type="button"
                    className={classes.triggerButton}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    aria-required={field.required || undefined}
                    disabled={locked}
                    autoFocus={field.autofocus}
                    onClick={toggle}
                >
                    <span className={display ? classes.triggerValue : classes.triggerPlaceholder}>
                        {display || placeholder}
                    </span>
                </button>
                {field.clearable && hasValue && !locked && (
                    <ClearButton label={field.label} onClear={clear} />
                )}
                <Icon name="calendar" className={classes.icon} />
            </div>
            {open && (
                <div ref={panel} role="dialog" aria-label={field.label} className={panelClass()}>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Calendar
                            view={view}
                            months={field.months}
                            firstDayOfWeek={field.firstDayOfWeek}
                            minDate={field.minDate}
                            maxDate={field.maxDate}
                            isSelected={isSelected}
                            isInRange={isInRange}
                            onView={setView}
                            onSelect={select}
                            onHover={field.range ? setHover : undefined}
                        />
                        {field.withTime && (
                            <TimeColumns
                                id={`${id}-time`}
                                value={timePart(single)}
                                withSeconds={false}
                                minuteStep={5}
                                onChange={(time, part) => {
                                    onChange(`${datePart(single) || todayIso()}T${time}`);
                                    if (part === 'minute' && datePart(single)) setOpen(false);
                                }}
                            />
                        )}
                    </div>
                    <div className={classes.popoverFooter}>
                        <button
                            type="button"
                            className={classes.popoverAction}
                            onClick={() => {
                                setView(monthStart(todayIso()));
                                if (!field.range) select(todayIso());
                            }}
                        >
                            Today
                        </button>
                        <button type="button" className={classes.popoverAction} onClick={clear}>
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
