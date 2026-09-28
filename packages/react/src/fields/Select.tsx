import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
    classes,
    cx,
    fetchOptions,
    normalize,
    SEARCH_DELAY,
    selectedOptions,
    type FieldOption,
    type SelectSchema,
} from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';
import { ClearButton } from './ClearButton';

/**
 * Custom dropdown for `Select`: single or multiple, optional search
 * (`searchable()`), server-side search (`searchUsing()`), option descriptions,
 * and a clear button (`clearable()`).
 */
export function Select({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<SelectSchema>) {
    const { root, panel, open, setOpen, panelClass } = usePopover();
    const control = useRef<HTMLInputElement & HTMLButtonElement>(null);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const locked = disabled || field.readonly;
    const listId = `${id}-listbox`;
    const selectedValues = field.multiple
        ? (Array.isArray(value) ? value : []).map(normalize)
        : value === null || value === undefined || value === ''
          ? []
          : [normalize(value)];
    const remote = field.search ?? null;
    const [results, setResults] = useState<FieldOption[] | null>(null);
    const [loading, setLoading] = useState(false);
    // Every option seen so far, so selected values keep their label between searches.
    const known = useRef(new Map<string, FieldOption>());
    for (const option of field.options) known.current.set(normalize(option.value), option);
    const selected = selectedOptions(
        remote ? [...known.current.values()] : field.options,
        selectedValues,
    );
    const filtered = useMemo(() => {
        if (remote) return results ?? [];
        const search = query.trim().toLocaleLowerCase();
        if (!field.searchable || !search) return field.options;
        return field.options.filter((option) =>
            [option.label, option.description ?? ''].some((text) =>
                text.toLocaleLowerCase().includes(search),
            ),
        );
    }, [field.options, field.searchable, query, remote, results]);

    useEffect(() => {
        if (!remote || !open) return;
        const controller = new AbortController();
        setLoading(true);
        const timer = setTimeout(() => {
            fetchOptions(remote, query.trim(), controller.signal)
                .then((options) => {
                    for (const option of options)
                        known.current.set(normalize(option.value), option);
                    setResults(options);
                    setActive(0);
                    setLoading(false);
                })
                .catch((reason: unknown) => {
                    if (controller.signal.aborted) return;
                    console.warn(reason);
                    setResults([]);
                    setLoading(false);
                });
        }, SEARCH_DELAY);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [open, query, remote?.url, remote?.token, remote?.field]);
    const placeholder = field.placeholder ?? (field.searchable ? 'Search…' : 'Select an option');
    const singleLabel = !field.multiple ? (selected[0]?.label ?? '') : '';

    function show() {
        if (locked) return;
        const selectedIndex = filtered.findIndex((option) =>
            selectedValues.includes(normalize(option.value)),
        );
        setActive(Math.max(selectedIndex, 0));
        setOpen(true);
    }

    function close() {
        setOpen(false);
        setQuery('');
    }

    function choose(option: FieldOption) {
        if (option.disabled) return;
        if (field.multiple) {
            const exists = selectedValues.includes(normalize(option.value));
            onChange(
                exists
                    ? selected
                          .filter((item) => normalize(item.value) !== normalize(option.value))
                          .map((item) => item.value)
                    : [...selected.map((item) => item.value), option.value],
            );
            setQuery('');
            return;
        }
        onChange(option.value);
        close();
        control.current?.focus();
    }

    function clear() {
        onChange(field.multiple ? [] : null);
        setQuery('');
        control.current?.focus();
    }

    function move(offset: number) {
        if (!filtered.length) return;
        setActive((current) => (current + offset + filtered.length) % filtered.length);
    }

    function keydown(event: KeyboardEvent<HTMLElement>) {
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                if (!open) show();
                else move(event.key === 'ArrowDown' ? 1 : -1);
                break;
            case 'Home':
            case 'End':
                if (!open) return;
                event.preventDefault();
                setActive(event.key === 'Home' ? 0 : Math.max(filtered.length - 1, 0));
                break;
            case 'Enter':
            case ' ':
                if (event.key === ' ' && field.searchable) return;
                event.preventDefault();
                if (!open) show();
                else if (filtered[active]) choose(filtered[active]!);
                break;
            case 'Escape':
                if (open) {
                    event.preventDefault();
                    close();
                }
                break;
            case 'Tab':
                close();
                break;
            case 'Backspace':
                if (field.multiple && query === '' && selected.length) {
                    onChange(selected.slice(0, -1).map((item) => item.value));
                } else if (!field.multiple && field.clearable && query === '' && selected.length) {
                    onChange(null);
                }
                break;
        }
    }

    const shared = {
        id,
        role: 'combobox',
        'aria-expanded': open,
        'aria-controls': listId,
        'aria-haspopup': 'listbox' as const,
        'aria-activedescendant': open && filtered[active] ? `${id}-option-${active}` : undefined,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': field.required || undefined,
        disabled: locked,
        autoFocus: field.autofocus,
        onKeyDown: keydown,
    };

    return (
        <div ref={root} className={classes.popoverAnchor}>
            <div
                className={classes.trigger}
                data-open={open || undefined}
                aria-disabled={locked || undefined}
                aria-invalid={error ? true : undefined}
                onClick={() => {
                    if (locked) return;
                    control.current?.focus();
                    if (open && !field.searchable) close();
                    else show();
                }}
            >
                {field.multiple && selected.length > 0 && (
                    <span className={cx(classes.chips, 'flex-none')}>
                        {selected.map((option) => (
                            <span key={normalize(option.value)} className={classes.chip}>
                                {option.label}
                                {!locked && (
                                    <button
                                        type="button"
                                        className={classes.chipRemove}
                                        aria-label={`Remove ${option.label}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            choose(option);
                                        }}
                                    >
                                        <Icon name="x" className="size-3" />
                                    </button>
                                )}
                            </span>
                        ))}
                    </span>
                )}
                {!field.multiple && field.searchable && selected[0] && (
                    <span className={cx(classes.chips, 'flex-none')}>
                        <span className={classes.chip}>{selected[0].label}</span>
                    </span>
                )}
                {field.searchable ? (
                    <input
                        {...shared}
                        ref={control}
                        type="text"
                        autoComplete="off"
                        aria-autocomplete="list"
                        value={query}
                        placeholder={selected.length ? '' : placeholder}
                        className={classes.triggerSearch}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setActive(0);
                            setOpen(true);
                        }}
                    />
                ) : (
                    <button
                        {...shared}
                        ref={control}
                        type="button"
                        className={classes.triggerButton}
                        onClick={(event) => {
                            event.stopPropagation();
                            if (open) close();
                            else show();
                        }}
                    >
                        {selected.length === 0 ? (
                            <span className={classes.triggerPlaceholder}>{placeholder}</span>
                        ) : field.multiple ? (
                            <span className="sr-only">{`${selected.length} selected`}</span>
                        ) : (
                            <span className={classes.triggerValue}>{singleLabel}</span>
                        )}
                    </button>
                )}
                {field.clearable && selected.length > 0 && !locked && (
                    <ClearButton label={field.label} onClear={clear} />
                )}
                <Icon name={open ? 'chevronUp' : 'chevronDown'} className={classes.icon} />
            </div>
            {open && (
                <div
                    ref={panel as never}
                    id={listId}
                    role="listbox"
                    aria-label={field.label}
                    aria-multiselectable={field.multiple || undefined}
                    className={panelClass(classes.comboboxList)}
                >
                    {filtered.length === 0 && (
                        <div className={classes.comboboxEmpty}>
                            {loading ? 'Searching…' : 'No results'}
                        </div>
                    )}
                    {filtered.map((option, index) => {
                        const selected = selectedValues.includes(normalize(option.value));
                        return (
                            <div
                                key={normalize(option.value)}
                                id={`${id}-option-${index}`}
                                role="option"
                                aria-selected={selected}
                                aria-disabled={option.disabled || undefined}
                                data-active={index === active || undefined}
                                className={classes.comboboxOption}
                                onPointerEnter={() => setActive(index)}
                                onPointerDown={(event) => {
                                    event.preventDefault();
                                    choose(option);
                                }}
                            >
                                <span className={classes.optionText}>
                                    <span className={classes.optionLabel}>{option.label}</span>
                                    {option.description && (
                                        <span className={classes.optionDescription}>
                                            {option.description}
                                        </span>
                                    )}
                                </span>
                                {selected && <Icon name="check" className={classes.optionCheck} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
