<script lang="ts">
    import { classes, cx, fileUploadHint, formatFileSize, type FileUploadSchema } from '../core';
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
    }: FieldComponentProps<FileUploadSchema> = $props();

    let input = $state<HTMLInputElement | null>(null);
    let dragging = $state(false);
    const files = $derived(
        (field.multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []).filter(
            (item): item is File => item instanceof File,
        ),
    );
    const previews = $derived(
        files.map((file) =>
            field.image && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        ),
    );
    const locked = $derived(disabled || field.readonly);
    const hint = $derived(fileUploadHint(field));

    $effect(() => {
        const urls = previews;
        return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
    });

    function update(next: unknown) {
        value = next;
        onChange?.(next);
    }

    function add(list: FileList | null | undefined) {
        const picked = Array.from(list ?? []);
        if (!picked.length) return;
        if (!field.multiple) {
            update(picked[0]);
        } else {
            const next = [...files, ...picked];
            update(field.maxFiles ? next.slice(0, field.maxFiles) : next);
        }
        if (input) input.value = '';
    }

    function remove(index: number) {
        update(field.multiple ? files.filter((_, position) => position !== index) : null);
    }

    function drop(event: DragEvent) {
        event.preventDefault();
        dragging = false;
        if (!locked) add(event.dataTransfer?.files);
    }
</script>

<div class="grid gap-3">
    <!-- svelte-ignore a11y_role_supports_aria_props -->
    <div
        role="button"
        tabindex={locked ? -1 : 0}
        aria-disabled={locked || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        class={cx(classes.dropzone, dragging && classes.dropzoneActive)}
        onclick={() => !locked && input?.click()}
        onkeydown={(event) => {
            if (!locked && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                input?.click();
            }
        }}
        ondragover={(event) => {
            event.preventDefault();
            if (!locked) dragging = true;
        }}
        ondragleave={() => (dragging = false)}
        ondrop={drop}
    >
        <Icon name="upload" class={classes.dropzoneIcon} />
        <span class={classes.dropzoneTitle}
            >{#if field.placeholder !== null && field.placeholder !== undefined}{field.placeholder}{:else}<span
                    class={classes.dropzoneLink}>Click to upload</span
                > or drag and drop{/if}</span
        >
        {#if hint}
            <span class={classes.dropzoneHint}>{hint}</span>
        {/if}
    </div>
    <input
        bind:this={input}
        {id}
        name={field.multiple ? `${field.name}[]` : field.name}
        type="file"
        class="sr-only"
        tabindex={-1}
        multiple={field.multiple}
        accept={field.accept ?? undefined}
        disabled={locked}
        onchange={(event) => add(event.currentTarget.files)}
    />
    {#if files.length > 0}
        <div role="list" class={classes.fileList}>
            {#each files as file, index (`${file.name}-${index}`)}
                <div role="listitem" class={classes.fileItem}>
                    {#if previews[index]}
                        <img src={previews[index]} alt="" class={classes.filePreview} />
                    {/if}
                    <span class={classes.fileName}>{file.name}</span>
                    <span class={classes.fileSize}>{formatFileSize(file.size)}</span>
                    {#if !locked}
                        <button
                            type="button"
                            class={classes.fileRemove}
                            onclick={() => remove(index)}
                        >
                            Remove
                        </button>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>
