import type { Page } from '@inertiajs/core';
import type { Component } from 'vue';
import type { FieldSchema, FormErrors, FormSchema, FormState } from '../../core/src';

/**
 * Props every field component receives. Custom components use the same contract
 * and emit `update:modelValue`, so they also work with `v-model`.
 */
export interface FieldComponentProps<TField extends FieldSchema = FieldSchema> {
    field: TField;
    id: string;
    modelValue: unknown;
    error?: string | undefined;
    disabled: boolean;
    describedBy?: string | undefined;
}

/**
 * Events every field component emits.
 */
export interface FieldComponentEmits {
    'update:modelValue': [value: unknown];
}

export type FieldComponent = Component;

export interface BeforeSubmitHelpers {
    /** Show errors under fields without sending the request. */
    setErrors: (errors: FormErrors) => void;
}

export interface FormProps {
    /** The serialized form from `Form::make()` in Laravel. */
    form: FormSchema;
    /** Override built-in field components or register custom ones by name. */
    components?: Record<string, FieldComponent>;
    /** Accent color for buttons, focus rings, and selections. Overrides `Form::accent()`. */
    accent?: string;
    /**
     * Runs before the Inertia request. Return `false` to cancel it, for example
     * after client-side checks or to handle the data yourself.
     */
    onBeforeSubmit?: (
        data: Record<string, unknown>,
        helpers: BeforeSubmitHelpers,
    ) => boolean | void;
}

/**
 * Events emitted by `<Form>`.
 */
export interface FormEmits {
    success: [page: Page];
    error: [errors: FormErrors];
    finish: [];
    /** The form got unsaved changes (`true`) or lost them (`false`). */
    dirtyChange: [isDirty: boolean];
}

/**
 * Slots of `<Form>`. The default slot renders after the fields and before the
 * default submit button, and receives the form state:
 *
 *     <Form :form="form" v-slot="{ isDirty }">
 *         <p v-if="isDirty">You have unsaved changes.</p>
 *     </Form>
 */
export interface FormSlots {
    default?: (state: FormState) => unknown;
}
