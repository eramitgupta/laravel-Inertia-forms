import type { Page } from '@inertiajs/core';
import type { ComponentType, ReactNode } from 'react';
import type { FieldSchema, FormErrors, FormSchema, FormState } from '../../core/src';

/**
 * Props every field component receives. Custom components use the same contract.
 */
export interface FieldComponentProps<TField extends FieldSchema = FieldSchema> {
    field: TField;
    id: string;
    value: unknown;
    error?: string | undefined;
    disabled: boolean;
    describedBy?: string | undefined;
    onChange: (value: unknown) => void;
}

export type FieldComponent = ComponentType<FieldComponentProps<any>>;

export interface BeforeSubmitHelpers {
    /** Show errors under fields without sending the request. */
    setErrors: (errors: FormErrors) => void;
}

export interface FormProps {
    /** The serialized form from `Form::make()` in Laravel. */
    form: FormSchema;
    /** Override built-in field components or register custom ones by name. */
    components?: Record<string, FieldComponent>;
    className?: string;
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
    /**
     * Rendered after the fields and before the default submit button. Pass a
     * function to read the form state: `{({ isDirty }) => isDirty && <p>Unsaved changes</p>}`.
     */
    children?: ReactNode | ((state: FormState) => ReactNode);
    /** Called when the form gets unsaved changes (`true`) or loses them (`false`). */
    onDirtyChange?: (isDirty: boolean) => void;
    onSuccess?: (page: Page) => void;
    onError?: (errors: FormErrors) => void;
    onFinish?: () => void;
}
