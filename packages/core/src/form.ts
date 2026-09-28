import { isVisible, normalize } from './visibility';
import type { FieldOption, FieldSchema, FieldsetSchema, FormErrors, FormSchema } from './types';

/**
 * Fields that are currently visible, including their fieldset's visibility.
 */
export function visibleFields(schema: FormSchema, data: Record<string, unknown>): FieldSchema[] {
    return schema.fieldsets.flatMap((fieldset) =>
        isVisible(fieldset.visibility, data)
            ? fieldset.fields.filter((field) => isVisible(field.visibility, data))
            : [],
    );
}

export function isFieldsetVisible(
    fieldset: FieldsetSchema,
    data: Record<string, unknown>,
): boolean {
    return isVisible(fieldset.visibility, data);
}

export function hasSubmitField(schema: FormSchema): boolean {
    return schema.fieldsets.some((fieldset) =>
        fieldset.fields.some(
            (field) => field.component === 'Submit' || field.component === 'Composer',
        ),
    );
}

/**
 * The first error for a field, including nested errors like `tags.0`.
 */
export function fieldError(
    errors: FormErrors,
    name: string,
    component?: string,
): string | undefined {
    if (errors[name]) return errors[name];
    // Blocks and Repeater items show their own errors, so the field only shows errors about itself.
    if (component === 'Blocks' || component === 'Repeater') return undefined;
    const nested = Object.keys(errors).find((key) => key.startsWith(`${name}.`));
    return nested ? errors[nested] : undefined;
}

/**
 * Stable DOM id for a field.
 */
export function fieldId(formId: string, name: string): string {
    return `${formId}-${name.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

/**
 * Laravel cannot read multipart bodies for PUT/PATCH/DELETE, so file forms
 * are sent as POST with a `_method` override.
 */
export function submissionTarget(schema: FormSchema): {
    method: FormSchema['method'];
    spoof: string | null;
} {
    if (schema.hasFiles && schema.method !== 'post' && schema.method !== 'get') {
        return { method: 'post', spoof: schema.method };
    }
    return { method: schema.method, spoof: null };
}

export function scrollToFirstError(root: HTMLElement | null): void {
    const invalid = root?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!invalid) return;
    invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalid.focus({ preventScroll: true });
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Short hint under the file dropzone, like `PDF, DOCX · up to 2.0 MB · max 3 files`.
 */
export function fileUploadHint(field: {
    accept: string | null;
    image: boolean;
    maxSize: number | null;
    multiple: boolean;
    maxFiles: number | null;
}): string {
    const extensions = (field.accept ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.startsWith('.'))
        .map((item) => item.slice(1).toUpperCase());
    const types = extensions.length ? extensions.join(', ') : field.image ? 'Images' : null;

    return [
        types,
        field.maxSize ? `up to ${formatFileSize(field.maxSize * 1024)}` : null,
        field.multiple && field.maxFiles ? `max ${field.maxFiles} files` : null,
    ]
        .filter(Boolean)
        .join(' · ');
}

/**
 * Error keys that belong to a field: the field itself and its items (`tags.0`).
 */
export function errorKeysFor(errors: FormErrors, name: string): string[] {
    return Object.keys(errors).filter((key) => key === name || key.startsWith(`${name}.`));
}

/**
 * The options matching `values`, in the order the values were picked.
 */
export function selectedOptions(options: FieldOption[], values: string[]): FieldOption[] {
    return values.flatMap((value) => options.filter((option) => normalize(option.value) === value));
}

/**
 * Components that also answer to another name: a custom `Select` replaces the
 * `Combobox` dropdown, and a custom `Blocks` also renders `Repeater` fields.
 */
const COMPONENT_ALIASES: Record<string, string> = { Combobox: 'Select', Repeater: 'Blocks' };

/**
 * Built-in components merged with the ones passed to `<Form>`.
 */
export function mergeComponents<T>(
    builtIn: Record<string, T>,
    custom: Record<string, T> | undefined,
): Record<string, T> {
    const merged = { ...builtIn, ...custom };
    for (const [name, alias] of Object.entries(COMPONENT_ALIASES)) {
        if (custom?.[alias] && !custom[name]) merged[name] = custom[alias]!;
    }
    return merged;
}

/**
 * Keep the mouse wheel from changing a focused number input. Browsers step
 * the value while the pointer scrolls over it, which quietly edits the form;
 * the page scrolls instead. Register it as a non-passive `wheel` listener.
 */
export function preventNumberWheel(event: WheelEvent): void {
    const input = event.currentTarget;

    if (
        !(input instanceof HTMLInputElement) ||
        input.type !== 'number' ||
        input.ownerDocument.activeElement !== input
    ) {
        return;
    }

    event.preventDefault();
    input.ownerDocument.defaultView?.scrollBy({ top: event.deltaY, left: event.deltaX });
}
