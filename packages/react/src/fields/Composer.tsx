import { useLayoutEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import {
    addComposerAttachments,
    classes,
    composerAccept,
    composerHasRoom,
    composerValue,
    dragHasFiles,
    formatFileSize,
    type ComposerSchema,
    type ComposerValue,
} from '../../../core/src';
import { useFormContext } from '../context';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

export function Composer({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<ComposerSchema>) {
    const processing = useFormContext()?.processing ?? false;
    const textarea = useRef<HTMLTextAreaElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const sendButton = useRef<HTMLButtonElement>(null);
    const [dragging, setDragging] = useState(false);
    const current = composerValue(value);
    const locked = disabled || field.readonly;
    const canAttach =
        field.attachments && !locked && composerHasRoom(field, current.attachments.length);
    const showHint = field.submitOnEnter && !locked;
    const hintId = `${id}-hint`;
    const ariaDescribedBy = [describedBy, showHint ? hintId : null].filter(Boolean).join(' ');

    useLayoutEffect(() => {
        const element = textarea.current;
        if (!element) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }, [current.message]);

    function update(next: Partial<ComposerValue>) {
        onChange({ ...current, ...next });
    }

    function addFiles(list: FileList | null | undefined) {
        const picked = Array.from(list ?? []);
        if (fileInput.current) fileInput.current.value = '';
        if (!picked.length || !canAttach) return;
        update({ attachments: addComposerAttachments(current.attachments, picked, field) });
    }

    function removeFile(index: number) {
        update({ attachments: current.attachments.filter((_, position) => position !== index) });
    }

    function send() {
        const button = sendButton.current;
        if (!button || button.disabled || !button.form) return;
        if (typeof button.form.requestSubmit === 'function') button.form.requestSubmit(button);
        else button.click();
    }

    function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (
            event.key !== 'Enter' ||
            event.shiftKey ||
            event.nativeEvent.isComposing ||
            event.keyCode === 229 ||
            !field.submitOnEnter ||
            locked
        )
            return;
        event.preventDefault();
        send();
    }

    function dragOver(event: DragEvent<HTMLDivElement>) {
        if (!field.attachments || locked || !dragHasFiles(event.dataTransfer)) return;
        event.preventDefault();
        setDragging(true);
    }

    function drop(event: DragEvent<HTMLDivElement>) {
        if (!field.attachments || locked || !dragHasFiles(event.dataTransfer)) return;
        event.preventDefault();
        setDragging(false);
        addFiles(event.dataTransfer.files);
    }

    return (
        <div className={classes.composer}>
            {field.quickReplies.length > 0 && (
                <div role="group" aria-label="Quick replies" className={classes.composerReplies}>
                    {field.quickReplies.map((reply, index) => (
                        <button
                            key={`${reply}-${index}`}
                            type="button"
                            className={classes.composerReply}
                            disabled={locked}
                            onClick={() => {
                                update({ message: reply });
                                textarea.current?.focus();
                            }}
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}
            <div
                className={classes.composerBox}
                data-dragging={dragging ? '' : undefined}
                data-disabled={locked ? '' : undefined}
                onDragOver={dragOver}
                onDragLeave={() => setDragging(false)}
                onDrop={drop}
            >
                <textarea
                    ref={textarea}
                    id={id}
                    name={`${field.name}[message]`}
                    rows={field.rows}
                    value={current.message}
                    placeholder={field.placeholder ?? undefined}
                    disabled={disabled}
                    readOnly={field.readonly}
                    autoFocus={field.autofocus}
                    maxLength={field.maxLength ?? undefined}
                    aria-required={field.required || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy || undefined}
                    className={classes.composerInput}
                    onChange={(event) => update({ message: event.target.value })}
                    onKeyDown={keyDown}
                />
                {current.attachments.length > 0 && (
                    <div role="list" aria-label="Attachments" className={classes.composerFiles}>
                        {current.attachments.map((file, index) => (
                            <div
                                role="listitem"
                                key={`${file.name}-${index}`}
                                className={classes.composerFile}
                            >
                                <span className={classes.composerFileIcon} aria-hidden="true">
                                    <Icon
                                        name="composerFile"
                                        className={classes.composerFileGlyph}
                                    />
                                </span>
                                <span className={classes.composerFileText}>
                                    <span className={classes.composerFileName} title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className={classes.composerFileSize}>
                                        {formatFileSize(file.size)}
                                    </span>
                                </span>
                                {!locked && (
                                    <button
                                        type="button"
                                        className={classes.composerFileRemove}
                                        aria-label={`Remove ${file.name}`}
                                        onClick={() => removeFile(index)}
                                    >
                                        <Icon name="x" className={classes.composerRemoveIcon} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className={classes.composerFooter}>
                    {field.attachments && (
                        <>
                            <button
                                type="button"
                                className={classes.composerAttach}
                                title="Attach files"
                                aria-label="Attach files"
                                aria-controls={`${id}-files`}
                                disabled={!canAttach}
                                onClick={() => fileInput.current?.click()}
                            >
                                <Icon
                                    name="composerPaperclip"
                                    className={classes.composerAttachIcon}
                                />
                            </button>
                            <input
                                ref={fileInput}
                                id={`${id}-files`}
                                name={`${field.name}[attachments][]`}
                                type="file"
                                className={classes.visuallyHidden}
                                tabIndex={-1}
                                aria-hidden="true"
                                multiple
                                accept={composerAccept(field.accept)}
                                disabled={!canAttach}
                                onChange={(event) => addFiles(event.target.files)}
                            />
                        </>
                    )}
                    <div className={classes.composerActions}>
                        {field.maxLength !== null && (
                            <span className={classes.composerCounter}>
                                {`${current.message.length} / ${field.maxLength}`}
                            </span>
                        )}
                        <button
                            ref={sendButton}
                            type="submit"
                            className={classes.composerSend}
                            disabled={locked || processing}
                            aria-busy={processing || undefined}
                        >
                            {field.sendLabel}
                            {processing ? (
                                <span className={classes.spinner} aria-hidden="true" />
                            ) : (
                                <Icon name="composerSend" className={classes.composerSendIcon} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {showHint && (
                <p id={hintId} className={classes.composerHint}>
                    Press <kbd className={classes.composerKbd}>Enter</kbd> to send,{' '}
                    <kbd className={classes.composerKbd}>Shift + Enter</kbd> for new line
                </p>
            )}
        </div>
    );
}
