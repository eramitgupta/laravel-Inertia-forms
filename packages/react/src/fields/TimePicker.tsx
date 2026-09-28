import { useRef } from 'react';
import { classes, nowTime, type TimePickerSchema } from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import { ClearButton } from './ClearButton';
import { TimeColumns, type TimePart } from './TimeColumns';

/**
 * Time popover with scrollable hour and minute columns (`minuteStep()`).
 * Closes once every column has been picked, or when the last column is picked
 * for a time that was already set.
 */
export function TimePicker({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<TimePickerSchema>) {
    const { root, panel, open, setOpen, panelClass } = usePopover();
    const locked = disabled || field.readonly;
    const time = typeof value === 'string' ? value : '';
    const picked = useRef(new Set<TimePart>());
    const hadTime = useRef(false);

    function toggle() {
        if (locked) return;
        picked.current = new Set();
        hadTime.current = Boolean(time);
        setOpen(!open);
    }

    function pick(next: string, part: TimePart) {
        onChange(next);
        picked.current.add(part);
        const last: TimePart = field.withSeconds ? 'second' : 'minute';
        const columns: TimePart[] = field.withSeconds
            ? ['hour', 'minute', 'second']
            : ['hour', 'minute'];
        if (
            columns.every((column) => picked.current.has(column)) ||
            (part === last && hadTime.current)
        ) {
            setOpen(false);
        }
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
                    <span className={time ? classes.triggerValue : classes.triggerPlaceholder}>
                        {time || field.placeholder || (field.withSeconds ? '--:--:--' : '--:--')}
                    </span>
                </button>
                {field.clearable && time && !locked && (
                    <ClearButton label={field.label} onClear={() => onChange('')} />
                )}
                <Icon name="clock" className={classes.icon} />
            </div>
            {open && (
                <div ref={panel} role="dialog" aria-label={field.label} className={panelClass()}>
                    <TimeColumns
                        id={id}
                        value={time}
                        withSeconds={field.withSeconds}
                        minuteStep={field.minuteStep}
                        minTime={field.minTime}
                        maxTime={field.maxTime}
                        onChange={pick}
                    />
                    <div className={classes.popoverFooter}>
                        <button
                            type="button"
                            className={classes.popoverAction}
                            onClick={() => {
                                onChange(nowTime(field.withSeconds, field.minuteStep));
                                setOpen(false);
                            }}
                        >
                            Now
                        </button>
                        <button
                            type="button"
                            className={classes.popoverAction}
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
