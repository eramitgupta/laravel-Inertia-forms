import { getContext, setContext } from 'svelte';

/**
 * The button that submitted the form, so only that button shows its
 * processing state. `null` means any button may show it.
 */
export interface SubmitterContext {
    readonly active: HTMLElement | null;
}

const SUBMITTER_CONTEXT = Symbol('erag-inertia-forms-submitter');

/** Share the submitting button with the submit buttons below. Call during component initialisation. */
export function setSubmitterContext(context: SubmitterContext): SubmitterContext {
    return setContext(SUBMITTER_CONTEXT, context);
}

export function getSubmitterContext(): SubmitterContext | null {
    return getContext<SubmitterContext | undefined>(SUBMITTER_CONTEXT) ?? null;
}
