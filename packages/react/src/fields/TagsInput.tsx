import { useRef, useState, type KeyboardEvent } from 'react';
import { addTags, classes, cx, moveItem, type TagsInputSchema } from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';

/**
 * Free-text tags: Enter or comma adds, Backspace removes the last tag,
 * drag the handle to reorder, and matching suggestions appear while typing.
 */
export function TagsInput({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<TagsInputSchema>) {
    const { root, panel, open, setOpen, panelClass } = usePopover();
    const input = useRef<HTMLInputElement>(null);
    const [text, setText] = useState('');
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [active, setActive] = useState(-1);
    const tags = Array.isArray(value) ? (value as string[]) : [];
    const locked = disabled || field.readonly;
    const full = Boolean(field.maxTags && tags.length >= field.maxTags);
    const search = text.trim().toLocaleLowerCase();
    const suggestions = field.suggestions.filter(
        (suggestion) =>
            !tags.includes(suggestion) &&
            (!search || suggestion.toLocaleLowerCase().includes(search)),
    );
    const listId = `${id}-suggestions`;

    function commit(raw: string) {
        const next = addTags(tags, raw, field);
        if (next !== tags) onChange(next);
        setText('');
        setActive(-1);
    }

    function keydown(event: KeyboardEvent<HTMLInputElement>) {
        const showing = open && suggestions.length > 0;
        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
            event.preventDefault();
            setOpen(true);
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            setActive(
                (current) =>
                    (current + offset + suggestions.length + (current < 0 && offset < 0 ? 1 : 0)) %
                    suggestions.length,
            );
            return;
        }
        if (event.key === 'Enter' || event.key === ',' || (event.key === 'Tab' && text.trim())) {
            const suggestion = showing && active >= 0 ? suggestions[active] : undefined;
            if (!suggestion && !text.trim()) return;
            event.preventDefault();
            commit(suggestion ?? text);
            return;
        }
        if (event.key === 'Backspace' && !text && tags.length) {
            onChange(tags.slice(0, -1));
        } else if (event.key === 'Escape') {
            setActive(-1);
            setOpen(false);
        }
    }

    return (
        <div ref={root} className={classes.popoverAnchor}>
            <div
                className={cx(classes.trigger, 'flex-wrap')}
                data-open={open || undefined}
                aria-disabled={locked || undefined}
                aria-invalid={error ? true : undefined}
                onClick={() => input.current?.focus()}
            >
                {tags.length > 0 && (
                    <div
                        role="list"
                        className={cx(classes.chips, 'flex-none')}
                        aria-label={`${field.label} tags`}
                    >
                        {tags.map((tag, index) => (
                            <div
                                role="listitem"
                                key={tag}
                                className={classes.chip}
                                data-dragging={dragIndex === index || undefined}
                                draggable={field.reorderable && !locked}
                                onDragStart={(event) => {
                                    setDragIndex(index);
                                    event.dataTransfer.effectAllowed = 'move';
                                }}
                                onDragOver={(event) => {
                                    if (dragIndex === null) return;
                                    event.preventDefault();
                                    if (dragIndex !== index) {
                                        onChange(moveItem(tags, dragIndex, index));
                                        setDragIndex(index);
                                    }
                                }}
                                onDragEnd={() => setDragIndex(null)}
                            >
                                {field.reorderable && !locked && (
                                    <Icon
                                        name="grip"
                                        className={cx(classes.chipHandle, 'size-3.5')}
                                    />
                                )}
                                <span className="truncate">{tag}</span>
                                {!locked && (
                                    <button
                                        type="button"
                                        className={classes.chipRemove}
                                        aria-label={`Remove ${tag}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onChange(tags.filter((item) => item !== tag));
                                        }}
                                    >
                                        <Icon name="x" className="size-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {!full && (
                    <input
                        ref={input}
                        id={id}
                        type="text"
                        role="combobox"
                        autoComplete="off"
                        aria-autocomplete="list"
                        aria-expanded={open && suggestions.length > 0}
                        aria-controls={listId}
                        aria-activedescendant={
                            open && suggestions[active] ? `${id}-suggestion-${active}` : undefined
                        }
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        value={text}
                        maxLength={field.maxTagLength ?? undefined}
                        placeholder={
                            tags.length ? '' : (field.placeholder ?? 'Type and press Enter')
                        }
                        disabled={locked}
                        autoFocus={field.autofocus}
                        className={classes.triggerSearch}
                        onFocus={() => setOpen(true)}
                        onChange={(event) => {
                            setText(event.target.value);
                            setActive(-1);
                            setOpen(true);
                        }}
                        onKeyDown={keydown}
                        onPaste={(event) => {
                            const pasted = event.clipboardData.getData('text');
                            if (!/[,\n]/.test(pasted)) return;
                            event.preventDefault();
                            commit(text + pasted);
                        }}
                        onBlur={() => text.trim() && commit(text)}
                    />
                )}
            </div>
            {open && suggestions.length > 0 && !locked && !full && (
                <div
                    ref={panel as never}
                    id={listId}
                    role="listbox"
                    aria-label={`${field.label} suggestions`}
                    className={panelClass(classes.comboboxList)}
                >
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            id={`${id}-suggestion-${index}`}
                            role="option"
                            aria-selected={false}
                            data-active={index === active || undefined}
                            className={classes.comboboxOption}
                            onPointerEnter={() => setActive(index)}
                            onPointerDown={(event) => {
                                event.preventDefault();
                                commit(suggestion);
                            }}
                        >
                            <span className={classes.optionLabel}>{suggestion}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
