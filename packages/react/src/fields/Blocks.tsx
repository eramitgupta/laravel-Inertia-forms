import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
    blockDefaults,
    blockTitle,
    builderFieldName,
    builderItems,
    builderValue,
    classes,
    cx,
    getPath,
    gridClass,
    isRepeater,
    isVisible,
    moveItem,
    setPath,
    type BlockSchema,
    type BlockItem,
    type BlocksSchema,
} from '../../../core/src';
import { useFormContext } from '../context';
import { builtInComponents, FieldRenderer } from '../FieldRenderer';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';
import { usePopover } from '../usePopover';

let nextUid = 0;
const newUid = () => ++nextUid;

const FOCUSABLE =
    'input:not([type=hidden]), textarea, select, button[role=combobox], button[aria-haspopup]';

/**
 * A list of collapsible content blocks (and Repeater items). Each block type has its own fields,
 * rendered with the same components as the rest of the form.
 */
export function Blocks({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<BlocksSchema>) {
    const form = useFormContext();
    const repeater = isRepeater(field);
    const items = builderItems(field, value);
    const locked = disabled || field.readonly;
    const errors = form?.errors ?? {};
    const root = useRef<HTMLDivElement>(null);
    const menu = usePopover();
    const [activeItem, setActiveItem] = useState(0);
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    // Stable keys per block, kept in step with add / remove / move.
    const uids = useRef<number[]>([]);
    if (uids.current.length !== items.length) {
        uids.current = items.map((_, index) => uids.current[index] ?? newUid());
    }
    const [collapsed, setCollapsed] = useState<Set<number>>(() =>
        field.collapsed ? new Set(uids.current) : new Set(),
    );

    const full = field.maxItems !== null && items.length >= field.maxItems;
    // A Repeater has a single item type, so its add button never opens a menu.
    const hasMenu = !repeater && field.blocks.length > 1;
    const allCollapsed = items.length > 0 && uids.current.every((uid) => collapsed.has(uid));
    const blockFor = (item: BlockItem): BlockSchema | undefined =>
        field.blocks.find((block) => block.name === item.type);
    const hasErrors = (index: number) =>
        Object.keys(errors).some((key) => key.startsWith(`${field.name}.${index}.`));

    // Open blocks that have validation errors so the messages can be seen.
    const errorKey = items.map((_, index) => (hasErrors(index) ? index : '')).join(',');
    useEffect(() => {
        const invalid = uids.current.filter((_, index) => hasErrors(index));
        if (invalid.some((uid) => collapsed.has(uid))) {
            setCollapsed(
                (current) => new Set([...current].filter((uid) => !invalid.includes(uid))),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorKey]);

    function update(next: BlockItem[], nextUids: number[]) {
        uids.current = nextUids;
        onChange(builderValue(field, next));
    }

    function focusIn(index: number, selector: string) {
        requestAnimationFrame(() => {
            root.current
                ?.querySelector<HTMLElement>(`[data-block="${index}"] ${selector}`)
                ?.focus();
        });
    }

    function add(block: BlockSchema) {
        menu.setOpen(false);
        const uid = newUid();
        update(
            [...items, { type: block.name, data: blockDefaults(block) }],
            [...uids.current, uid],
        );
        focusIn(items.length, `[data-block-body] :is(${FOCUSABLE})`);
    }

    function remove(index: number) {
        update(
            items.filter((_, current) => current !== index),
            uids.current.filter((_, current) => current !== index),
        );
    }

    function move(index: number, offset: number) {
        const target = index + offset;
        update(moveItem(items, index, target), moveItem(uids.current, index, target));
        const edge = offset < 0 ? target === 0 : target === items.length - 1;
        const direction = offset < 0 ? 'up' : 'down';
        focusIn(target, `button[data-move="${edge ? (offset < 0 ? 'down' : 'up') : direction}"]`);
    }

    function toggle(uid: number) {
        setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(uid)) next.delete(uid);
            else next.add(uid);
            return next;
        });
    }

    function toggleAll() {
        setCollapsed(allCollapsed ? new Set() : new Set(uids.current));
    }

    function openMenu() {
        if (!hasMenu) {
            if (field.blocks[0]) add(field.blocks[0]);
            return;
        }
        setActiveItem(0);
        menu.setOpen(!menu.open);
        requestAnimationFrame(() =>
            root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
        );
    }

    function menuKeydown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const count = field.blocks.length;
        const next = (activeItem + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
        setActiveItem(next);
        root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[next]?.focus();
    }

    // Nested fields read and write the field value through a form-shaped scope.
    const scope = setPath({}, field.name, builderValue(field, items));
    function setNested(name: string, next: unknown) {
        if (form) {
            form.setValue(name, next);
            return;
        }
        onChange(getPath(setPath(scope, name, next), field.name));
    }

    return (
        <div
            ref={root}
            id={id}
            role="group"
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            className={classes.builder}
            data-invalid={error ? true : undefined}
        >
            {field.collapsible && items.length > 0 && (
                <button type="button" className={classes.builderCollapseAll} onClick={toggleAll}>
                    {allCollapsed ? 'Expand all' : 'Collapse all'}
                </button>
            )}

            {items.length === 0 && (
                <div className={classes.builderEmpty}>
                    {repeater ? 'No items yet.' : 'No blocks yet.'}
                </div>
            )}

            {items.map((item, index) => {
                const block = blockFor(item);
                if (!block) return null;
                const uid = uids.current[index]!;
                const isCollapsed = field.collapsible && collapsed.has(uid);
                const bodyId = `${id}-block-${uid}`;
                const fields = block.fields.filter(
                    (inner) =>
                        inner.component !== 'Submit' && isVisible(inner.visibility, item.data),
                );

                return (
                    <div
                        key={uid}
                        data-block={index}
                        data-dragging={dragIndex === index || undefined}
                        data-invalid={hasErrors(index) || undefined}
                        className={classes.block}
                        onDragOver={(event) => {
                            if (dragIndex === null) return;
                            event.preventDefault();
                            if (dragIndex !== index) {
                                update(
                                    moveItem(items, dragIndex, index),
                                    moveItem(uids.current, dragIndex, index),
                                );
                                setDragIndex(index);
                            }
                        }}
                        onDrop={(event) => event.preventDefault()}
                    >
                        <div
                            className={cx(
                                classes.blockHeader,
                                !isCollapsed && classes.blockHeaderOpen,
                            )}
                        >
                            {field.reorderable && (
                                <span
                                    className={classes.kvHandle}
                                    draggable={!locked}
                                    aria-hidden="true"
                                    onDragStart={(event) => {
                                        setDragIndex(index);
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('text/plain', String(index));
                                        const card = event.currentTarget.closest('[data-block]');
                                        if (card) event.dataTransfer.setDragImage(card, 16, 16);
                                    }}
                                    onDragEnd={() => setDragIndex(null)}
                                >
                                    <Icon name="grip" className="size-4" />
                                </span>
                            )}
                            <button
                                type="button"
                                className={classes.blockToggle}
                                aria-expanded={field.collapsible ? !isCollapsed : undefined}
                                aria-controls={field.collapsible ? bodyId : undefined}
                                disabled={!field.collapsible}
                                onClick={() => toggle(uid)}
                            >
                                {field.collapsible && (
                                    <span
                                        className={classes.blockChevron}
                                        data-collapsed={isCollapsed || undefined}
                                    >
                                        <Icon name="chevronDown" className="size-4" />
                                    </span>
                                )}
                                <span className={classes.blockHeading}>
                                    <span className={classes.blockTitleRow}>
                                        <span className={classes.blockTitle}>
                                            {blockTitle(block, item, index)}
                                        </span>
                                        {!repeater && (
                                            <span className={classes.blockBadge}>
                                                {block.label}
                                            </span>
                                        )}
                                    </span>
                                    {block.description && (
                                        <span className={classes.blockDescription}>
                                            {block.description}
                                        </span>
                                    )}
                                </span>
                            </button>
                            <div className={classes.blockActions}>
                                {field.reorderable && (
                                    <>
                                        <button
                                            type="button"
                                            data-move="up"
                                            className={classes.kvButton}
                                            aria-label={`Move ${block.label} ${index + 1} up`}
                                            disabled={locked || index === 0}
                                            onClick={() => move(index, -1)}
                                        >
                                            <Icon name="chevronUp" className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            data-move="down"
                                            className={classes.kvButton}
                                            aria-label={`Move ${block.label} ${index + 1} down`}
                                            disabled={locked || index === items.length - 1}
                                            onClick={() => move(index, 1)}
                                        >
                                            <Icon name="chevronDown" className="size-4" />
                                        </button>
                                    </>
                                )}
                                {field.deletable && (
                                    <button
                                        type="button"
                                        className={classes.kvRemove}
                                        aria-label={`Delete ${block.label} ${index + 1}`}
                                        disabled={
                                            locked ||
                                            (field.minItems !== null &&
                                                items.length <= field.minItems)
                                        }
                                        onClick={() => remove(index)}
                                    >
                                        <Icon name="trash" className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div id={bodyId} data-block-body className={classes.blockBody}>
                                <div className={gridClass(block.columns)}>
                                    {fields.map((inner) => (
                                        <FieldRenderer
                                            key={inner.name}
                                            field={{
                                                ...inner,
                                                name: builderFieldName(field, index, inner.name),
                                                disabled: inner.disabled || Boolean(disabled),
                                                readonly: inner.readonly || field.readonly,
                                            }}
                                            formId={form?.formId ?? id}
                                            columns={block.columns}
                                            data={scope}
                                            errors={errors}
                                            processing={form?.processing ?? false}
                                            components={form?.components ?? builtInComponents}
                                            onChange={setNested}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {field.addable && (
                <div ref={menu.root} className={classes.builderAddAnchor}>
                    <button
                        type="button"
                        className={classes.builderAdd}
                        aria-haspopup={hasMenu ? 'menu' : undefined}
                        aria-expanded={hasMenu ? menu.open : undefined}
                        data-open={menu.open || undefined}
                        disabled={locked || full}
                        onClick={openMenu}
                    >
                        <Icon name="plus" className="size-4" />
                        {field.addActionLabel}
                    </button>
                    {hasMenu && menu.open && (
                        <div
                            ref={menu.panel}
                            role="menu"
                            aria-label={field.addActionLabel}
                            className={menu.panelClass(classes.builderMenu)}
                            onKeyDown={menuKeydown}
                        >
                            {field.blocks.map((block, index) => (
                                <button
                                    key={block.name}
                                    type="button"
                                    role="menuitem"
                                    tabIndex={index === activeItem ? 0 : -1}
                                    data-active={index === activeItem || undefined}
                                    className={classes.builderMenuItem}
                                    onPointerEnter={() => setActiveItem(index)}
                                    onClick={() => add(block)}
                                >
                                    <span className={classes.builderMenuIcon} aria-hidden="true">
                                        {block.icon}
                                    </span>
                                    <span className="min-w-0">
                                        <span className={classes.builderMenuLabel}>
                                            {block.label}
                                        </span>
                                        {block.description && (
                                            <span className={classes.builderMenuDescription}>
                                                {block.description}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
