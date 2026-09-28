import { createContext, useContext } from 'react';
import type { FormErrors } from '../../core/src';
import type { FieldComponent } from './types';

/**
 * What `<Form>` shares with fields that render other fields, like Builder.
 */
export interface FormContextValue {
    formId: string;
    errors: FormErrors;
    processing: boolean;
    /** True when any value differs from what the form started with (or last saved). */
    isDirty: boolean;
    /** Current form values, e.g. for a Slug that follows another field. */
    data: Record<string, unknown>;
    components: Record<string, FieldComponent>;
    /** Set any value by its full path, e.g. `body.0.data.heading`. */
    setValue: (name: string, value: unknown) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue | null {
    return useContext(FormContext);
}
