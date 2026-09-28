import { useForm } from '@inertiajs/react';
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type FormEvent,
} from 'react';
import {
    classes,
    accentStyle,
    cx,
    errorKeysFor,
    firstWizardStepWithError,
    formSubmitter,
    gridClass,
    groupSubmitFields,
    hasSubmitField,
    isFieldsetVisible,
    isVisible,
    scrollFormIntoView,
    scrollToFirstError,
    setPath,
    submissionTarget,
    submitButtonClass,
    submitIntent,
    validateWizardStep,
    visibleFields,
    wizardStepErrorKeys,
    wizardStepFields,
    wizardSteps,
    wizardSubmitFields,
    type FieldSchema,
    type FieldsetSchema,
    type FormErrors,
    mergeComponents,
} from '../../core/src';
import { FormContext, type FormContextValue } from './context';
import { builtInComponents, FieldRenderer } from './FieldRenderer';
import { SubmitButton } from './fields/SubmitButton';
import { Icon } from './Icon';
import { SubmitterContext } from './submitter';
import type { FormProps } from './types';
import { WizardSteps } from './WizardSteps';

/**
 * Renders a form defined with `erag/inertia-forms` in Laravel.
 *
 *     <Form form={form} onSuccess={() => toast('Saved')} />
 */
export function Form({
    form: schema,
    components,
    className,
    accent,
    children,
    onDirtyChange,
    onBeforeSubmit,
    onSuccess,
    onError,
    onFinish,
}: FormProps) {
    const formId = `erag-form-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    const root = useRef<HTMLFormElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Inertia's form data type requires `any` values.
    const inertia = useForm<Record<string, any>>(schema.data);
    const data = inertia.data;
    const errors = inertia.errors as FormErrors;
    const isDirty = inertia.isDirty;
    const registry = useMemo(() => mergeComponents(builtInComponents, components), [components]);
    const [submitter, setSubmitter] = useState<HTMLElement | null>(null);
    const [scrollRequest, setScrollRequest] = useState<{ target: 'top' | 'error' } | null>(null);

    const wizard = schema.wizard ?? null;
    const [stepIndex, setStepIndex] = useState(0);
    const [checkingStep, setCheckingStep] = useState(false);
    const checking = useRef(false);
    const latestErrors = useRef(errors);
    latestErrors.current = errors;
    const steps = wizard ? wizardSteps(schema, data) : [];
    const currentStep = Math.min(stepIndex, Math.max(steps.length - 1, 0));
    const isLastStep = currentStep >= steps.length - 1;

    const visibleNames = visibleFields(schema, data).map((field) => field.name);
    const visibilityKey = visibleNames.join('|');
    const previouslyVisible = useRef(new Set(visibleNames));

    useEffect(() => {
        const current = new Set(visibleNames);
        const cleared = schema.fieldsets
            .flatMap((fieldset) => fieldset.fields)
            .filter(
                (field) =>
                    field.clearWhenHidden &&
                    previouslyVisible.current.has(field.name) &&
                    !current.has(field.name),
            );
        previouslyVisible.current = current;
        if (cleared.length) {
            inertia.setData((previous: Record<string, unknown>) =>
                cleared.reduce(
                    (next, field) => setPath(next, field.name, field.emptyValue),
                    previous,
                ),
            );
        }
        // Only react to visibility changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibilityKey]);

    const wasDirty = useRef(false);
    useEffect(() => {
        if (wasDirty.current === isDirty) return;
        wasDirty.current = isDirty;
        onDirtyChange?.(isDirty);
        // Only react to dirty state changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty]);

    // Scroll once the new step or the errors have rendered.
    useEffect(() => {
        if (!scrollRequest) return;
        const frame = requestAnimationFrame(() => {
            if (scrollRequest.target === 'top') scrollFormIntoView(root.current);
            else scrollToFirstError(root.current);
        });
        return () => cancelAnimationFrame(frame);
    }, [scrollRequest]);

    function setValue(name: string, value: unknown) {
        inertia.setData((previous: Record<string, unknown>) => setPath(previous, name, value));
        const keys = errorKeysFor(errors, name);
        if (keys.length) inertia.clearErrors(...keys);
    }

    const context: FormContextValue = {
        formId,
        errors,
        processing: inertia.processing,
        isDirty,
        data,
        components: registry,
        setValue,
    };

    /** Show the step with the first error and scroll to it. */
    function revealErrors(next: FormErrors) {
        if (wizard) {
            const step = firstWizardStepWithError(wizardSteps(schema, data), next);
            if (step !== -1) setStepIndex(step);
        }
        if (schema.scrollToFirstError) setScrollRequest({ target: 'error' });
    }

    function goToStep(index: number) {
        setStepIndex(index);
        setScrollRequest({ target: 'top' });
    }

    /** Check the current step on the server, then move to the next one. */
    async function continueWizard() {
        const fieldset = steps[currentStep];
        if (!wizard || !fieldset || checking.current) return;
        checking.current = true;
        setCheckingStep(true);
        try {
            const stepErrors = await validateWizardStep(wizard, currentStep, data);
            const stale = wizardStepErrorKeys(fieldset, latestErrors.current);
            if (stale.length) inertia.clearErrors(...stale);
            if (stepErrors) {
                inertia.setError(stepErrors as never);
                if (schema.scrollToFirstError) setScrollRequest({ target: 'error' });
            } else {
                goToStep(currentStep + 1);
            }
        } catch (error) {
            console.warn('[inertia-forms] Could not check the wizard step.', error);
        } finally {
            checking.current = false;
            setCheckingStep(false);
        }
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Enter (or Continue) on any step but the last moves on instead of submitting.
        if (wizard && !isLastStep) {
            void continueWizard();
            return;
        }
        const button = formSubmitter(event.nativeEvent);
        const intent = submitIntent(button);
        // The data passed to onBeforeSubmit includes the clicked button's intent.
        const proceed = onBeforeSubmit?.(intent ? { ...data, [intent.key]: intent.value } : data, {
            setErrors: (next) => {
                inertia.clearErrors();
                if (Object.keys(next).length) {
                    inertia.setError(next as never);
                    revealErrors(next);
                }
            },
        });
        if (proceed === false) return;
        if (!schema.action) {
            console.warn(
                '[inertia-forms] The form has no action. Set $actionRoute, route(), or url() on the form class.',
            );
            return;
        }
        setSubmitter(button ?? root.current?.querySelector<HTMLElement>('[type="submit"]') ?? null);
        const { method, spoof } = submissionTarget(schema);
        inertia.transform((payload) => ({
            ...payload,
            ...(intent ? { [intent.key]: intent.value } : {}),
            ...(spoof ? { _method: spoof } : {}),
        }));
        inertia.submit(method, schema.action, {
            forceFormData: schema.hasFiles,
            preserveScroll: true,
            onSuccess: (page) => {
                if (schema.resetOnSuccess) inertia.reset();
                onSuccess?.(page);
            },
            onError: (validationErrors) => {
                onError?.(validationErrors as FormErrors);
                revealErrors(validationErrors as FormErrors);
            },
            onFinish: () => onFinish?.(),
        });
    }

    const extra =
        typeof children === 'function'
            ? children({ isDirty, processing: inertia.processing })
            : children;

    function renderField(field: FieldSchema, columns: number) {
        return (
            <FieldRenderer
                key={field.name}
                field={field}
                formId={formId}
                columns={columns}
                data={data}
                errors={errors}
                processing={inertia.processing}
                components={registry}
                onChange={setValue}
            />
        );
    }

    function renderFieldset(fieldset: FieldsetSchema, key: string | number, fields: FieldSchema[]) {
        const grid = (
            <div className={gridClass(fieldset.columns)}>
                {groupSubmitFields(fields).map((row) =>
                    Array.isArray(row) ? (
                        <div key={`submit:${row[0]!.name}`} className={classes.submitGroup}>
                            {row.map((field) => renderField(field, fieldset.columns))}
                        </div>
                    ) : (
                        renderField(row, fieldset.columns)
                    ),
                )}
            </div>
        );

        if (!fieldset.legend) {
            return (
                <div
                    key={key}
                    id={fieldset.id ?? undefined}
                    className={cx(classes.fieldset, fieldset.class)}
                >
                    {grid}
                </div>
            );
        }

        return (
            <fieldset
                key={key}
                id={fieldset.id ?? undefined}
                className={cx(classes.fieldset, fieldset.class)}
            >
                <legend className={classes.legend}>{fieldset.legend}</legend>
                {fieldset.description && (
                    <p className={classes.fieldsetDescription}>{fieldset.description}</p>
                )}
                {grid}
            </fieldset>
        );
    }

    function renderWizard() {
        if (!wizard) return null;
        const fieldset = steps[currentStep];
        const submitFields = isLastStep ? wizardSubmitFields(schema, data) : [];
        const busy = checkingStep || inertia.processing;

        return (
            <>
                {steps.length > 0 && (
                    <WizardSteps steps={steps} current={currentStep} onSelect={goToStep} />
                )}
                {fieldset &&
                    renderFieldset(
                        fieldset,
                        fieldset.id ?? currentStep,
                        wizardStepFields(fieldset, data),
                    )}
                {extra}
                <div className={classes.wizardFooter}>
                    {currentStep > 0 && (
                        <button
                            type="button"
                            className={submitButtonClass('secondary', 'md')}
                            disabled={busy}
                            onClick={() => goToStep(currentStep - 1)}
                        >
                            <Icon name="chevronLeft" className={classes.submitIcon} />
                            {wizard.backLabel}
                        </button>
                    )}
                    <div className={classes.wizardActions}>
                        {!isLastStep ? (
                            <button
                                type="submit"
                                className={submitButtonClass('primary', 'md')}
                                disabled={busy}
                                aria-busy={checkingStep || undefined}
                            >
                                {checkingStep && (
                                    <span className={classes.submitSpinner} aria-hidden="true" />
                                )}
                                {wizard.nextLabel}
                                {!checkingStep && (
                                    <Icon name="chevronRight" className={classes.submitIcon} />
                                )}
                            </button>
                        ) : submitFields.length ? (
                            submitFields.map((field) => renderField(field, 1))
                        ) : (
                            !hasSubmitField(schema) && (
                                <SubmitButton label="Submit" processing={inertia.processing} />
                            )
                        )}
                    </div>
                </div>
            </>
        );
    }

    return (
        <FormContext.Provider value={context}>
            <SubmitterContext.Provider value={submitter}>
                <form
                    ref={root}
                    id={formId}
                    noValidate
                    className={cx(classes.form, schema.class, className)}
                    style={accentStyle(accent ?? schema.accent) as CSSProperties | undefined}
                    data-dirty={isDirty || undefined}
                    onSubmit={submit}
                >
                    {wizard ? (
                        renderWizard()
                    ) : (
                        <>
                            {schema.fieldsets.map((fieldset, index) =>
                                isFieldsetVisible(fieldset, data)
                                    ? renderFieldset(
                                          fieldset,
                                          fieldset.id ?? index,
                                          fieldset.fields.filter((field) =>
                                              isVisible(field.visibility, data),
                                          ),
                                      )
                                    : null,
                            )}
                            {extra}
                            {!hasSubmitField(schema) && (
                                <SubmitButton label="Submit" processing={inertia.processing} />
                            )}
                        </>
                    )}
                </form>
            </SubmitterContext.Provider>
        </FormContext.Provider>
    );
}
