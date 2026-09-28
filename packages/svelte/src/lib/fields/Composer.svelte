<script lang="ts">
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
    } from '../core';
    import { getFormContext } from '../context';
    import Icon from '../Icon.svelte';
    import type { FieldComponentProps } from '../types';

    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<ComposerSchema> = $props();

    const form = getFormContext();
    let textarea = $state<HTMLTextAreaElement | null>(null);
    let fileInput = $state<HTMLInputElement | null>(null);
    let sendButton = $state<HTMLButtonElement | null>(null);
    let dragging = $state(false);
    const current = $derived(composerValue(value));
    const processing = $derived(form?.processing ?? false);
    const locked = $derived(disabled || field.readonly);
    const canAttach = $derived(
        field.attachments && !locked && composerHasRoom(field, current.attachments.length),
    );
    const showHint = $derived(field.submitOnEnter && !locked);
    const hintId = $derived(`${id}-hint`);
    const ariaDescribedBy = $derived(
        [describedBy, showHint ? hintId : null].filter(Boolean).join(' ') || undefined,
    );

    $effect(() => {
        void current.message;
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });

    function update(next: Partial<ComposerValue>) {
        const merged = { ...current, ...next };
        value = merged;
        onChange?.(merged);
    }

    function addFiles(list: FileList | null | undefined) {
        const picked = Array.from(list ?? []);
        if (fileInput) fileInput.value = '';
        if (!picked.length || !canAttach) return;
        update({ attachments: addComposerAttachments(current.attachments, picked, field) });
    }

    function removeFile(index: number) {
        update({ attachments: current.attachments.filter((_, position) => position !== index) });
    }

    function send() {
        const button = sendButton;
        if (!button || button.disabled || !button.form) return;
        if (typeof button.form.requestSubmit === 'function') button.form.requestSubmit(button);
        else button.click();
    }

    function keydown(event: KeyboardEvent) {
        if (
            event.key !== 'Enter' ||
            event.shiftKey ||
            event.isComposing ||
            event.keyCode === 229 ||
            !field.submitOnEnter ||
            locked
        )
            return;
        event.preventDefault();
        send();
    }

    function dragover(event: DragEvent) {
        if (!field.attachments || locked || !dragHasFiles(event.dataTransfer)) return;
        event.preventDefault();
        dragging = true;
    }

    function drop(event: DragEvent) {
        if (!field.attachments || locked || !dragHasFiles(event.dataTransfer)) return;
        event.preventDefault();
        dragging = false;
        addFiles(event.dataTransfer?.files);
    }
</script>

<div class={classes.composer}>
    {#if field.quickReplies.length > 0}
        <div role="group" aria-label="Quick replies" class={classes.composerReplies}>
            {#each field.quickReplies as reply, index (`${reply}-${index}`)}
                <button
                    type="button"
                    class={classes.composerReply}
                    disabled={locked}
                    onclick={() => {
                        update({ message: reply });
                        textarea?.focus();
                    }}>{reply}</button
                >
            {/each}
        </div>
    {/if}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class={classes.composerBox}
        data-dragging={dragging ? '' : undefined}
        data-disabled={locked ? '' : undefined}
        ondragover={dragover}
        ondragleave={() => (dragging = false)}
        ondrop={drop}
    >
        <!-- svelte-ignore a11y_autofocus -->
        <textarea
            bind:this={textarea}
            {id}
            name={`${field.name}[message]`}
            rows={field.rows}
            value={current.message}
            placeholder={field.placeholder ?? undefined}
            {disabled}
            readonly={field.readonly}
            autofocus={field.autofocus}
            maxlength={field.maxLength ?? undefined}
            aria-required={field.required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={ariaDescribedBy}
            class={classes.composerInput}
            oninput={(event) => update({ message: event.currentTarget.value })}
            onkeydown={keydown}
        ></textarea>
        {#if current.attachments.length > 0}
            <div role="list" aria-label="Attachments" class={classes.composerFiles}>
                {#each current.attachments as file, index (`${file.name}-${index}`)}
                    <div role="listitem" class={classes.composerFile}>
                        <span class={classes.composerFileIcon} aria-hidden="true">
                            <Icon name="composerFile" class={classes.composerFileGlyph} />
                        </span>
                        <span class={classes.composerFileText}>
                            <span class={classes.composerFileName} title={file.name}
                                >{file.name}</span
                            >
                            <span class={classes.composerFileSize}>{formatFileSize(file.size)}</span
                            >
                        </span>
                        {#if !locked}
                            <button
                                type="button"
                                class={classes.composerFileRemove}
                                aria-label={`Remove ${file.name}`}
                                onclick={() => removeFile(index)}
                            >
                                <Icon name="x" class={classes.composerRemoveIcon} />
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
        <div class={classes.composerFooter}>
            {#if field.attachments}
                <button
                    type="button"
                    class={classes.composerAttach}
                    title="Attach files"
                    aria-label="Attach files"
                    aria-controls={`${id}-files`}
                    disabled={!canAttach}
                    onclick={() => fileInput?.click()}
                >
                    <Icon name="composerPaperclip" class={classes.composerAttachIcon} />
                </button>
                <input
                    bind:this={fileInput}
                    id={`${id}-files`}
                    name={`${field.name}[attachments][]`}
                    type="file"
                    class={classes.visuallyHidden}
                    tabindex={-1}
                    aria-hidden="true"
                    multiple
                    accept={composerAccept(field.accept)}
                    disabled={!canAttach}
                    onchange={(event) => addFiles(event.currentTarget.files)}
                />
            {/if}
            <div class={classes.composerActions}>
                {#if field.maxLength !== null}
                    <span class={classes.composerCounter}
                        >{`${current.message.length} / ${field.maxLength}`}</span
                    >
                {/if}
                <button
                    bind:this={sendButton}
                    type="submit"
                    class={classes.composerSend}
                    disabled={locked || processing}
                    aria-busy={processing || undefined}
                >
                    {field.sendLabel}
                    {#if processing}
                        <span class={classes.spinner} aria-hidden="true"></span>
                    {:else}
                        <Icon name="composerSend" class={classes.composerSendIcon} />
                    {/if}
                </button>
            </div>
        </div>
    </div>
    {#if showHint}
        <p id={hintId} class={classes.composerHint}>
            Press <kbd class={classes.composerKbd}>Enter</kbd> to send,
            <kbd class={classes.composerKbd}>Shift + Enter</kbd> for new line
        </p>
    {/if}
</div>
