import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import {
    classes,
    cx,
    fileUploadHint,
    formatFileSize,
    type FileUploadSchema,
} from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

export function FileUpload({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<FileUploadSchema>) {
    const input = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const files = useMemo(
        () =>
            (field.multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []).filter(
                (item): item is File => item instanceof File,
            ),
        [field.multiple, value],
    );
    const previews = useMemo(
        () =>
            files.map((file) =>
                field.image && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            ),
        [files, field.image],
    );
    const locked = disabled || field.readonly;

    useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)), [previews]);

    function add(list: FileList | null) {
        const picked = Array.from(list ?? []);
        if (!picked.length) return;
        if (!field.multiple) {
            onChange(picked[0]);
        } else {
            const next = [...files, ...picked];
            onChange(field.maxFiles ? next.slice(0, field.maxFiles) : next);
        }
        if (input.current) input.current.value = '';
    }

    function remove(index: number) {
        onChange(field.multiple ? files.filter((_, position) => position !== index) : null);
    }

    function drop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setDragging(false);
        if (!locked) add(event.dataTransfer.files);
    }

    const hint = fileUploadHint(field);

    return (
        <div className="grid gap-3">
            <div
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-disabled={locked || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cx(classes.dropzone, dragging && classes.dropzoneActive)}
                onClick={() => !locked && input.current?.click()}
                onKeyDown={(event) => {
                    if (!locked && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        input.current?.click();
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    if (!locked) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={drop}
            >
                <Icon name="upload" className={classes.dropzoneIcon} />
                <span className={classes.dropzoneTitle}>
                    {field.placeholder ?? (
                        <>
                            <span className={classes.dropzoneLink}>Click to upload</span> or drag
                            and drop
                        </>
                    )}
                </span>
                {hint && <span className={classes.dropzoneHint}>{hint}</span>}
            </div>
            <input
                ref={input}
                id={id}
                name={field.multiple ? `${field.name}[]` : field.name}
                type="file"
                className="sr-only"
                tabIndex={-1}
                multiple={field.multiple}
                accept={field.accept ?? undefined}
                disabled={locked}
                onChange={(event) => add(event.target.files)}
            />
            {files.length > 0 && (
                <div role="list" className={classes.fileList}>
                    {files.map((file, index) => (
                        <div
                            role="listitem"
                            key={`${file.name}-${index}`}
                            className={classes.fileItem}
                        >
                            {previews[index] && (
                                <img
                                    src={previews[index]!}
                                    alt=""
                                    className={classes.filePreview}
                                />
                            )}
                            <span className={classes.fileName}>{file.name}</span>
                            <span className={classes.fileSize}>{formatFileSize(file.size)}</span>
                            {!locked && (
                                <button
                                    type="button"
                                    className={classes.fileRemove}
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
