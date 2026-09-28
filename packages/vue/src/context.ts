import { inject, type InjectionKey } from 'vue';
import type { FormErrors } from '../../core/src';
import type { FieldComponent } from './types';

/**
 * What `<Form>` shares with fields that render other fields, like Builder.
 * The values are read through getters, so they stay reactive.
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

export const formContextKey: InjectionKey<FormContextValue> = Symbol('erag-inertia-form');

export function useFormContext(): FormContextValue | null {
    return inject(formContextKey, null);
}
