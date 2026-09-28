import { useRef, useState } from 'react';
import {
    classes,
    cx,
    keyValueRows,
    moveItem,
    type KeyValueRow,
    type KeyValueSchema,
} from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

/**
 * Editable key / value rows: add, remove, drag the handle or use the arrow
 * buttons to reorder. The value is a list of `{ key, value }` rows.
 */
export function KeyValue({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<KeyValueSchema>) {
    const rows = keyValueRows(value);
    const locked = disabled || field.readonly;
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const table = useRef<HTMLDivElement>(null);
    const full = field.maxItems !== null && rows.length >= field.maxItems;
    const grid = field.reorderable ? classes.kvGrid : classes.kvGridPlain;

    function update(next: KeyValueRow[]) {
        onChange(next);
    }

    function focusRow(index: number, selector: string) {
        requestAnimationFrame(() => {
            table.current
                ?.querySelectorAll<HTMLElement>(`[data-row="${index}"] ${selector}`)[0]
                ?.focus();
        });
    }

    function edit(index: number, part: keyof KeyValueRow, text: string) {
        update(rows.map((row, current) => (current === index ? { ...row, [part]: text } : row)));
    }

    function add() {
        update([...rows, { key: '', value: '' }]);
        focusRow(rows.length, field.editableKeys ? 'input' : 'input[data-part="value"]');
    }

    function remove(index: number) {
        update(rows.filter((_, current) => current !== index));
    }

    function move(index: number, offset: number) {
        const target = index + offset;
        update(moveItem(rows, index, target));
        const direction = offset < 0 ? 'up' : 'down';
        const edge = offset < 0 ? target === 0 : target === rows.length - 1;
        focusRow(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
    }

    return (
        <div>
            <div
                ref={table}
                id={id}
                role="group"
                aria-labelledby={`${id}-label`}
                aria-describedby={describedBy}
                className={classes.kvTable}
                data-invalid={error ? true : undefined}
            >
                <div className={cx(grid, classes.kvHeader)} aria-hidden="true">
                    {field.reorderable && <span className="w-[5.5rem]" />}
                    <span>{field.keyLabel}</span>
                    <span>{field.valueLabel}</span>
                    <span className="w-7" />
                </div>
                {rows.length === 0 && <div className={classes.kvEmpty}>No entries yet.</div>}
                {rows.map((row, index) => (
                    <div
                        key={index}
                        data-row={index}
                        data-dragging={dragIndex === index || undefined}
                        className={cx(grid, classes.kvRow)}
                        onDragOver={(event) => {
                            if (dragIndex === null) return;
                            event.preventDefault();
                            if (dragIndex !== index) {
                                update(moveItem(rows, dragIndex, index));
                                setDragIndex(index);
                            }
                        }}
                        onDrop={(event) => event.preventDefault()}
                    >
                        {field.reorderable && (
                            <div className={classes.kvControls}>
                                <span
                                    className={classes.kvHandle}
                                    draggable={!locked}
                                    aria-hidden="true"
                                    onDragStart={(event) => {
                                        setDragIndex(index);
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('text/plain', String(index));
                                        const rowElement =
                                            event.currentTarget.closest('[data-row]');
                                        if (rowElement)
                                            event.dataTransfer.setDragImage(rowElement, 16, 16);
                                    }}
                                    onDragEnd={() => setDragIndex(null)}
                                >
                                    <Icon name="grip" className="size-4" />
                                </span>
                                <button
                                    type="button"
                                    data-move="up"
                                    className={classes.kvButton}
                                    aria-label={`Move row ${index + 1} up`}
                                    disabled={locked || index === 0}
                                    onClick={() => move(index, -1)}
                                >
                                    <Icon name="chevronUp" className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    data-move="down"
                                    className={classes.kvButton}
                                    aria-label={`Move row ${index + 1} down`}
                                    disabled={locked || index === rows.length - 1}
                                    onClick={() => move(index, 1)}
                                >
                                    <Icon name="chevronDown" className="size-4" />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            data-part="key"
                            value={row.key}
                            placeholder={field.keyPlaceholder ?? undefined}
                            aria-label={`${field.keyLabel} ${index + 1}`}
                            aria-invalid={error ? true : undefined}
                            disabled={disabled}
                            readOnly={field.readonly || !field.editableKeys}
                            className={classes.input}
                            onChange={(event) => edit(index, 'key', event.target.value)}
                        />
                        <input
                            type="text"
                            data-part="value"
                            value={row.value}
                            placeholder={field.valuePlaceholder ?? undefined}
                            aria-label={`${field.valueLabel} ${index + 1}`}
                            aria-invalid={error ? true : undefined}
                            disabled={disabled}
                            readOnly={field.readonly}
                            className={classes.input}
                            onChange={(event) => edit(index, 'value', event.target.value)}
                        />
                        {field.deletable ? (
                            <button
                                type="button"
                                className={classes.kvRemove}
                                aria-label={`Remove row ${index + 1}`}
                                disabled={locked}
                                onClick={() => remove(index)}
                            >
                                <Icon name="x" className="size-4" />
                            </button>
                        ) : (
                            <span className="w-7" />
                        )}
                    </div>
                ))}
            </div>
            {field.addable && (
                <button
                    type="button"
                    className={classes.kvAdd}
                    disabled={locked || full}
                    onClick={add}
                >
                    <Icon name="plus" className="size-4" />
                    {field.addActionLabel}
                </button>
            )}
        </div>
    );
}
