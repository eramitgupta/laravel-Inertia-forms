import { classes, cx } from './classes';
import { errorKeysFor } from './form';
import { icons, type IconName } from './icons';
import { csrfHeaders } from './remote';
import { isVisible } from './visibility';
import type {
    FieldSchema,
    FieldsetSchema,
    FormErrors,
    FormSchema,
    SubmitSize,
    SubmitVariant,
    WizardSettings,
} from './types';

export type WizardStepState = 'complete' | 'current' | 'upcoming';

function isKnownIcon(name: unknown): name is IconName {
    return typeof name === 'string' && Object.prototype.hasOwnProperty.call(icons, name);
}

/**
 * The fieldsets shown as wizard steps: visible fieldsets with at least one
 * field that isn't a submit button. Mirrors `Form::wizardSteps()` in PHP, so
 * the step index sent to the server points at the same fieldset.
 */
export function wizardSteps(schema: FormSchema, data: Record<string, unknown>): FieldsetSchema[] {
    return schema.fieldsets.filter(
        (fieldset) =>
            isVisible(fieldset.visibility, data) &&
            fieldset.fields.some((field) => field.component !== 'Submit'),
    );
}

/** The visible fields of a step, without its submit buttons. */
export function wizardStepFields(
    fieldset: FieldsetSchema,
    data: Record<string, unknown>,
): FieldSchema[] {
    return fieldset.fields.filter(
        (field) => field.component !== 'Submit' && isVisible(field.visibility, data),
    );
}

/** Every visible submit button of the form. A wizard shows them on its last step. */
export function wizardSubmitFields(
    schema: FormSchema,
    data: Record<string, unknown>,
): FieldSchema[] {
    return schema.fieldsets
        .filter((fieldset) => isVisible(fieldset.visibility, data))
        .flatMap((fieldset) =>
            fieldset.fields.filter(
                (field) => field.component === 'Submit' && isVisible(field.visibility, data),
            ),
        );
}

export function wizardStepState(index: number, current: number): WizardStepState {
    if (index < current) return 'complete';
    return index === current ? 'current' : 'upcoming';
}

export function wizardCircleClass(state: WizardStepState): string {
    return cx(
        classes.wizardCircle,
        state === 'complete'
            ? classes.wizardCircleComplete
            : state === 'current'
              ? classes.wizardCircleCurrent
              : classes.wizardCircleUpcoming,
    );
}

/** The step's own icon when it is a known icon name, otherwise `null` (show the number). */
export function wizardStepIcon(fieldset: FieldsetSchema): IconName | null {
    return isKnownIcon(fieldset.icon) ? fieldset.icon : null;
}

export function wizardStepLabel(fieldset: FieldsetSchema, index: number): string {
    return fieldset.legend || `Step ${index + 1}`;
}

/** Width of the compact progress bar, e.g. `67%` on step 2 of 3. */
export function wizardProgress(current: number, total: number): string {
    return `${total > 0 ? Math.round(((current + 1) / total) * 100) : 0}%`;
}

/** Error keys that belong to the fields of one step. */
export function wizardStepErrorKeys(fieldset: FieldsetSchema, errors: FormErrors): string[] {
    return fieldset.fields.flatMap((field) =>
        field.component === 'Submit' ? [] : errorKeysFor(errors, field.name),
    );
}

/** Index of the first step with an errored field, or -1. */
export function firstWizardStepWithError(steps: FieldsetSchema[], errors: FormErrors): number {
    return steps.findIndex((fieldset) => wizardStepErrorKeys(fieldset, errors).length > 0);
}

/**
 * A JSON-safe copy of the form data without File and Blob values. Files are
 * checked when the whole form is submitted.
 */
export function withoutFiles(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.filter((item) => !isFileLike(item)).map(withoutFiles);
    }
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, item]) => !isFileLike(item))
                .map(([key, item]) => [key, withoutFiles(item)]),
        );
    }
    return value;
}

function isFileLike(value: unknown): boolean {
    return (
        (typeof Blob !== 'undefined' && value instanceof Blob) ||
        (typeof FileList !== 'undefined' && value instanceof FileList)
    );
}

/**
 * Ask the server to check one wizard step. Resolves with `null` when the step
 * is valid (or the form has no endpoint), or with the first message per field
 * on a 422. Any other failure rejects.
 */
export async function validateWizardStep(
    wizard: WizardSettings,
    step: number,
    data: Record<string, unknown>,
): Promise<FormErrors | null> {
    if (!wizard.validateUrl) return null;

    const response = await fetch(wizard.validateUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...csrfHeaders(),
        },
        body: JSON.stringify({ form: wizard.token, step, data: withoutFiles(data) }),
    });

    if (response.status === 422) {
        const body = (await response.json()) as { errors?: Record<string, string | string[]> };
        return Object.fromEntries(
            Object.entries(body.errors ?? {}).map(([key, messages]) => [
                key,
                Array.isArray(messages) ? String(messages[0] ?? '') : String(messages),
            ]),
        );
    }

    if (!response.ok) throw new Error(`[inertia-forms] Step check failed (${response.status}).`);

    return null;
}

/** Bring the top of the form back into view when it has scrolled out above. */
export function scrollFormIntoView(root: HTMLElement | null): void {
    if (!root || typeof root.scrollIntoView !== 'function') return;
    if (root.getBoundingClientRect().top >= 0) return;
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SUBMIT_VARIANTS: Record<SubmitVariant, string> = {
    primary: classes.submitPrimary,
    secondary: classes.submitSecondary,
    danger: classes.submitDanger,
    outline: classes.submitOutline,
    ghost: classes.submitGhost,
    link: classes.submitLink,
};

const SUBMIT_SIZES: Record<SubmitSize, string> = {
    sm: classes.submitSm,
    md: classes.submitMd,
    lg: classes.submitLg,
};

const LINK_SIZES: Record<SubmitSize, string> = {
    sm: classes.submitLinkSm,
    md: classes.submitLinkMd,
    lg: classes.submitLinkLg,
};

/** Classes for a submit (or wizard) button. */
export function submitButtonClass(
    variant: SubmitVariant | null | undefined,
    size: SubmitSize | null | undefined,
    fullWidth?: boolean | null,
): string {
    const style = variant && variant in SUBMIT_VARIANTS ? variant : 'primary';
    const scale = size && size in SUBMIT_SIZES ? size : 'md';
    return cx(
        classes.submitButton,
        SUBMIT_VARIANTS[style],
        style === 'link' ? LINK_SIZES[scale] : SUBMIT_SIZES[scale],
        fullWidth && classes.submitFull,
    );
}

/** The icon of a submit button when it is a known icon name. */
export function submitIconName(icon: unknown): IconName | null {
    return isKnownIcon(icon) ? icon : null;
}

export function submitIconClass(size: SubmitSize | null | undefined): string {
    return size === 'lg' ? classes.submitIconLg : classes.submitIcon;
}

/**
 * Group consecutive submit buttons so they render side by side in one row.
 * Other fields stay as they are; each group is an array.
 */
export function groupSubmitFields(fields: FieldSchema[]): Array<FieldSchema | FieldSchema[]> {
    const rows: Array<FieldSchema | FieldSchema[]> = [];
    for (const field of fields) {
        const last = rows[rows.length - 1];
        if (field.component !== 'Submit') rows.push(field);
        else if (Array.isArray(last)) last.push(field);
        else rows.push([field]);
    }
    return rows;
}

/**
 * The button that submitted the form, or `null` for `form.requestSubmit()`
 * and other programmatic submits.
 */
export function formSubmitter(event: Event): HTMLElement | null {
    const submitter = (event as SubmitEvent).submitter ?? null;
    return submitter && submitter !== event.currentTarget && submitter.tagName !== 'FORM'
        ? submitter
        : null;
}

/**
 * The `name=value` a submit button adds to the payload, like a native form
 * submission would. Submit fields with an intent render them on the button.
 */
export function submitIntent(
    submitter: Element | null | undefined,
): { key: string; value: string } | null {
    const key = submitter?.getAttribute('name');
    if (!submitter || !key) return null;
    return { key, value: (submitter as HTMLButtonElement).value ?? '' };
}
