<script module lang="ts">
    /**
     * Copy the reactive form values into plain objects and arrays for Inertia.
     * Files, blobs and dates are passed through untouched.
     */
    function toPlain(value: unknown): unknown {
        if (Array.isArray(value)) return value.map(toPlain);
        if (
            value !== null &&
            typeof value === 'object' &&
            Object.getPrototypeOf(value) === Object.prototype
        ) {
            return Object.fromEntries(
                Object.entries(value).map(([key, item]) => [key, toPlain(item)]),
            );
        }
        return value;
    }

    /** Serialize a style object such as `accentStyle()` into an inline `style` attribute. */
    function styleString(style: Record<string, string> | undefined): string | undefined {
        if (!style) return undefined;
        return Object.entries(style)
            .map(([property, value]) => `${property}: ${value}`)
            .join('; ');
    }
</script>

<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import { tick, untrack } from 'svelte';
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
    } from './core';
    import { setFormContext } from './context';
    import FieldRenderer, { builtInComponents } from './FieldRenderer.svelte';
    import SubmitButton from './fields/SubmitButton.svelte';
    import Icon from './Icon.svelte';
    import { setSubmitterContext } from './submitter';
    import type { FormProps } from './types';
    import WizardSteps from './WizardSteps.svelte';

    /**
     * Renders a form defined with `erag/inertia-forms` in Laravel.
     *
     *     <Form {form} onSuccess={() => toast('Saved')} />
     */
    let {
        form: schema,
        components,
        class: className,
        accent,
        children,
        onDirtyChange,
        onBeforeSubmit,
        onSuccess,
        onError,
        onFinish,
    }: FormProps = $props();

    const uid = $props.id();
    const formId = `erag-form-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
    let root = $state<HTMLFormElement | null>(null);

    /**
     * The field values live under one `fields` key so that dynamic, nested field names can
     * never collide with the form helper's own properties (`errors`, `processing`, `data`, ...).
     * The transform below unwraps them again, so the server receives the same payload as React.
     */
    const inertia = useForm<{ fields: Record<string, any> }>({
        fields: untrack(() => schema.data),
    });
    const data = $derived(inertia.fields as Record<string, unknown>);
    const errors = $derived(inertia.errors as FormErrors);
    const isDirty = $derived(inertia.isDirty);
    let wasDirty = false;

    $effect(() => {
        const dirty = isDirty;
        if (dirty === wasDirty) return;
        wasDirty = dirty;
        untrack(() => onDirtyChange?.(dirty));
    });
    const registry = $derived(mergeComponents(builtInComponents, components));
    let submitter = $state<HTMLElement | null>(null);

    const wizard = $derived(schema.wizard ?? null);
    let stepIndex = $state(0);
    let checkingStep = $state(false);
    const steps = $derived(wizard ? wizardSteps(schema, data) : []);
    const currentStep = $derived(Math.min(stepIndex, Math.max(steps.length - 1, 0)));
    const isLastStep = $derived(currentStep >= steps.length - 1);
    const wizardSubmits = $derived(wizard && isLastStep ? wizardSubmitFields(schema, data) : []);

    const visibilityKey = $derived(
        visibleFields(schema, data)
            .map((field) => field.name)
            .join('|'),
    );
    let previouslyVisible: Set<string> | null = null;

    $effect(() => {
        const current = new Set(visibilityKey.split('|'));
        untrack(() => {
            const previous = previouslyVisible;
            previouslyVisible = current;
            if (!previous) return;
            const cleared = schema.fieldsets
                .flatMap((fieldset) => fieldset.fields)
                .filter(
                    (field) =>
                        field.clearWhenHidden &&
                        previous.has(field.name) &&
                        !current.has(field.name),
                );
            if (cleared.length) {
                inertia.fields = cleared.reduce(
                    (next, field) => setPath(next, field.name, field.emptyValue),
                    inertia.fields,
                );
            }
        });
    });

    function setValue(name: string, value: unknown) {
        inertia.fields = setPath(inertia.fields, name, value);
        const keys = errorKeysFor(errors, name);
        if (keys.length) inertia.clearErrors(...(keys as never[]));
    }

    setFormContext({
        formId,
        get errors() {
            return errors;
        },
        get processing() {
            return inertia.processing;
        },
        get isDirty() {
            return isDirty;
        },
        get data() {
            return data;
        },
        get components() {
            return registry;
        },
        setValue,
    });

    setSubmitterContext({
        get active() {
            return submitter;
        },
    });

    /** Scroll once the new step or the errors have rendered. */
    function scrollAfterRender(target: 'top' | 'error') {
        requestAnimationFrame(() => {
            void tick().then(() => {
                if (target === 'top') scrollFormIntoView(root);
                else scrollToFirstError(root);
            });
        });
    }

    /** Show the step with the first error and scroll to it. */
    function revealErrors(next: FormErrors) {
        if (wizard) {
            const step = firstWizardStepWithError(steps, next);
            if (step !== -1) stepIndex = step;
        }
        if (schema.scrollToFirstError) scrollAfterRender('error');
    }

    function goToStep(index: number) {
        stepIndex = index;
        scrollAfterRender('top');
    }

    /** Check the current step on the server, then move to the next one. */
    async function continueWizard() {
        const index = currentStep;
        const fieldset = steps[index];
        if (!wizard || !fieldset || checkingStep) return;
        checkingStep = true;
        try {
            const stepErrors = await validateWizardStep(
                wizard,
                index,
                toPlain(inertia.fields) as Record<string, unknown>,
            );
            const stale = wizardStepErrorKeys(fieldset, errors);
            if (stale.length) inertia.clearErrors(...(stale as never[]));
            if (stepErrors) {
                inertia.setError(stepErrors as never);
                if (schema.scrollToFirstError) scrollAfterRender('error');
            } else {
                goToStep(index + 1);
            }
        } catch (error) {
            console.warn('[inertia-forms] Could not check the wizard step.', error);
        } finally {
            checkingStep = false;
        }
    }

    function submit(event: SubmitEvent) {
        event.preventDefault();
        // Enter (or Continue) on any step but the last moves on instead of submitting.
        if (wizard && !isLastStep) {
            void continueWizard();
            return;
        }
        const button = formSubmitter(event);
        const intent = submitIntent(button);
        const plain = toPlain(inertia.fields) as Record<string, unknown>;
        // The data passed to onBeforeSubmit includes the clicked button's intent.
        const proceed = onBeforeSubmit?.(
            intent ? { ...plain, [intent.key]: intent.value } : plain,
            {
                setErrors: (next) => {
                    inertia.clearErrors();
                    if (Object.keys(next).length) {
                        inertia.setError(next as never);
                        revealErrors(next);
                    }
                },
            },
        );
        if (proceed === false) return;
        if (!schema.action) {
            console.warn(
                '[inertia-forms] The form has no action. Set $actionRoute, route(), or url() on the form class.',
            );
            return;
        }
        submitter = button ?? root?.querySelector<HTMLElement>('[type="submit"]') ?? null;
        const { method, spoof } = submissionTarget(schema);
        inertia.transform((payload) => ({
            ...(toPlain(payload.fields) as Record<string, unknown>),
            ...(intent ? { [intent.key]: intent.value } : {}),
            ...(spoof ? { _method: spoof } : {}),
        }));
        inertia.submit(method, schema.action, {
            forceFormData: schema.hasFiles,
            preserveScroll: true,
            onSuccess: (page) => {
                // Make the saved values the new starting point. Svelte's form helper does
                // this too, but without updating `isDirty`, so the form would stay dirty.
                if (schema.resetOnSuccess) inertia.reset();
                else inertia.defaults();
                onSuccess?.(page);
            },
            onError: (validationErrors) => {
                onError?.(validationErrors as FormErrors);
                revealErrors(validationErrors as FormErrors);
            },
            onFinish: () => onFinish?.(),
        });
    }
</script>

{#snippet field(item: FieldSchema, columns: number)}
    <FieldRenderer
        field={item}
        {formId}
        {columns}
        {data}
        {errors}
        processing={inertia.processing}
        components={registry}
        onChange={setValue}
    />
{/snippet}

{#snippet section(fieldset: FieldsetSchema, fields: FieldSchema[])}
    {#snippet grid()}
        <div class={gridClass(fieldset.columns)}>
            {#each groupSubmitFields(fields) as row (Array.isArray(row) ? `submit:${row[0]!.name}` : row.name)}
                {#if Array.isArray(row)}
                    <div class={classes.submitGroup}>
                        {#each row as item (item.name)}
                            {@render field(item, fieldset.columns)}
                        {/each}
                    </div>
                {:else}
                    {@render field(row, fieldset.columns)}
                {/if}
            {/each}
        </div>
    {/snippet}
    {#if !fieldset.legend}
        <div id={fieldset.id ?? undefined} class={cx(classes.fieldset, fieldset.class)}>
            {@render grid()}
        </div>
    {:else}
        <fieldset id={fieldset.id ?? undefined} class={cx(classes.fieldset, fieldset.class)}>
            <legend class={classes.legend}>{fieldset.legend}</legend>
            {#if fieldset.description}
                <p class={classes.fieldsetDescription}>{fieldset.description}</p>
            {/if}
            {@render grid()}
        </fieldset>
    {/if}
{/snippet}

<form
    bind:this={root}
    id={formId}
    novalidate
    class={cx(classes.form, schema.class, className)}
    style={styleString(accentStyle(accent ?? schema.accent))}
    data-dirty={isDirty || undefined}
    onsubmit={submit}
>
    {#if wizard}
        {#if steps.length}
            <WizardSteps {steps} current={currentStep} onSelect={goToStep} />
        {/if}
        {#each steps[currentStep] ? [steps[currentStep]] : [] as fieldset (fieldset.id ?? currentStep)}
            {@render section(fieldset, wizardStepFields(fieldset, data))}
        {/each}
        {@render children?.({ isDirty, processing: inertia.processing })}
        <div class={classes.wizardFooter}>
            {#if currentStep > 0}
                <button
                    type="button"
                    class={submitButtonClass('secondary', 'md')}
                    disabled={checkingStep || inertia.processing}
                    onclick={() => goToStep(currentStep - 1)}
                >
                    <Icon name="chevronLeft" class={classes.submitIcon} />{wizard.backLabel}
                </button>
            {/if}
            <div class={classes.wizardActions}>
                {#if !isLastStep}
                    <button
                        type="submit"
                        class={submitButtonClass('primary', 'md')}
                        disabled={checkingStep || inertia.processing}
                        aria-busy={checkingStep || undefined}
                    >
                        {#if checkingStep}<span class={classes.submitSpinner} aria-hidden="true"
                            ></span>{/if}{wizard.nextLabel}{#if !checkingStep}<Icon
                                name="chevronRight"
                                class={classes.submitIcon}
                            />{/if}
                    </button>
                {:else if wizardSubmits.length}
                    {#each wizardSubmits as item (item.name)}
                        {@render field(item, 1)}
                    {/each}
                {:else if !hasSubmitField(schema)}
                    <SubmitButton label="Submit" processing={inertia.processing} />
                {/if}
            </div>
        </div>
    {:else}
        {#each schema.fieldsets as fieldset, index (fieldset.id ?? index)}
            {#if isFieldsetVisible(fieldset, data)}
                {@render section(
                    fieldset,
                    fieldset.fields.filter((item) => isVisible(item.visibility, data)),
                )}
            {/if}
        {/each}
        {@render children?.({ isDirty, processing: inertia.processing })}
        {#if !hasSubmitField(schema)}
            <SubmitButton label="Submit" processing={inertia.processing} />
        {/if}
    {/if}
</form>
