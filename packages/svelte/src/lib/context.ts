import { getContext, setContext } from 'svelte';
import type { FormErrors } from './core';
import type { FieldComponent } from './types';

/**
 * What `<Form>` shares with fields that render other fields, like Builder.
 * The properties are getters over the form's state, so reading them stays reactive.
 */
export interface FormContextValue {
    readonly formId: string;
    readonly errors: FormErrors;
    readonly processing: boolean;
    /** True when any value differs from what the form started with (or last saved). */
    readonly isDirty: boolean;
    /** Current form values, e.g. for a Slug that follows another field. */
    readonly data: Record<string, unknown>;
    readonly components: Record<string, FieldComponent>;
    /** Set any value by its full path, e.g. `body.0.data.heading`. */
    setValue: (name: string, value: unknown) => void;
}

const FORM_CONTEXT = Symbol('erag-inertia-forms');

/** Share the form context with every field below. Call during component initialisation. */
export function setFormContext(context: FormContextValue): FormContextValue {
    return setContext(FORM_CONTEXT, context);
}

/** The surrounding `<Form>`'s context, or `null` when the field is rendered standalone. */
export function getFormContext(): FormContextValue | null {
    return getContext<FormContextValue | undefined>(FORM_CONTEXT) ?? null;
}
