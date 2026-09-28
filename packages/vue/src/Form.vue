<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { computed, nextTick, onMounted, provide, ref, shallowRef, useId, watch } from 'vue';
import {
    accentStyle,
    classes,
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
import { formContextKey } from './context';
import FieldRenderer, { builtInComponents } from './FieldRenderer.vue';
import SubmitButton from './fields/SubmitButton.vue';
import Icon from './Icon.vue';
import { submitterKey } from './submitter';
import type { FormEmits, FormProps, FormSlots } from './types';
import WizardSteps from './WizardSteps.vue';

/**
 * Renders a form defined with `erag/inertia-forms` in Laravel.
 *
 *     <Form :form="form" @success="() => toast('Saved')" />
 *
 * `onBeforeSubmit` (or `@before-submit`) runs before the request; return
 * `false` to cancel it.
 */
const props = defineProps<FormProps>();
const emit = defineEmits<FormEmits>();
defineSlots<FormSlots>();

type Row =
    | { kind: 'field'; key: string; field: FieldSchema }
    | { kind: 'submit'; key: string; fields: FieldSchema[] };

interface Section {
    key: string | number;
    fieldset: FieldsetSchema;
    rows: Row[];
}

const schema = computed(() => props.form);
const formId = `erag-form-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
const root = ref<HTMLFormElement | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Inertia's form data type requires `any` values.
const inertia = useForm<Record<string, any>>(props.form.data);
const data = computed<Record<string, unknown>>(() => inertia.data());
const errors = computed(() => inertia.errors as FormErrors);
const registry = computed(() => mergeComponents(builtInComponents, props.components));
const showDefaultSubmit = computed(() => !hasSubmitField(schema.value));
const submitter = shallowRef<HTMLElement | null>(null);
provide(submitterKey, submitter);
/**
 * Bound only when an accent is set, so server rendering omits an empty `style`.
 */
const accentAttributes = computed(() => {
    const style = accentStyle(props.accent ?? schema.value.accent);
    return style ? { style } : {};
});

const wizard = computed(() => schema.value.wizard ?? null);
const stepIndex = ref(0);
const checkingStep = ref(false);
const steps = computed(() => (wizard.value ? wizardSteps(schema.value, data.value) : []));
const currentStep = computed(() => Math.min(stepIndex.value, Math.max(steps.value.length - 1, 0)));
const isLastStep = computed(() => currentStep.value >= steps.value.length - 1);
const wizardSubmits = computed(() =>
    wizard.value && isLastStep.value ? wizardSubmitFields(schema.value, data.value) : [],
);

function rows(fields: FieldSchema[]): Row[] {
    return groupSubmitFields(fields).map((row) =>
        Array.isArray(row)
            ? { kind: 'submit', key: `submit:${row[0]!.name}`, fields: row }
            : { kind: 'field', key: row.name, field: row },
    );
}

/** The fieldsets to render: every visible one, or the current wizard step. */
const sections = computed<Section[]>(() => {
    if (wizard.value) {
        const fieldset = steps.value[currentStep.value];
        return fieldset
            ? [
                  {
                      key: fieldset.id ?? currentStep.value,
                      fieldset,
                      rows: rows(wizardStepFields(fieldset, data.value)),
                  },
              ]
            : [];
    }
    return schema.value.fieldsets.flatMap((fieldset, index) =>
        isFieldsetVisible(fieldset, data.value)
            ? [
                  {
                      key: fieldset.id ?? index,
                      fieldset,
                      rows: rows(
                          fieldset.fields.filter((field) =>
                              isVisible(field.visibility, data.value),
                          ),
                      ),
                  },
              ]
            : [],
    );
});

const visibleNames = computed(() =>
    visibleFields(schema.value, data.value).map((field) => field.name),
);
const visibilityKey = computed(() => visibleNames.value.join('|'));
let previouslyVisible = new Set(visibleNames.value);

/**
 * Write a (possibly dotted) path into the useForm data. Only the top-level key
 * is replaced, which keeps the reactive form and the submitted payload in sync.
 */
function writePaths(entries: Array<[name: string, value: unknown]>) {
    const next = entries.reduce(
        (carry, [name, value]) => setPath(carry, name, value),
        inertia.data() as Record<string, unknown>,
    );
    new Set(entries.map(([name]) => name.split('.')[0]!)).forEach((key) => {
        inertia[key] = next[key];
    });
}

watch(visibilityKey, () => {
    const current = new Set(visibleNames.value);
    const cleared = schema.value.fieldsets
        .flatMap((fieldset) => fieldset.fields)
        .filter(
            (field) =>
                field.clearWhenHidden &&
                previouslyVisible.has(field.name) &&
                !current.has(field.name),
        );
    previouslyVisible = current;
    if (cleared.length) {
        writePaths(cleared.map((field) => [field.name, field.emptyValue]));
    }
});

function setValue(name: string, value: unknown) {
    writePaths([[name, value]]);
    const keys = errorKeysFor(errors.value, name);
    if (keys.length) inertia.clearErrors(...keys);
}

watch(
    () => inertia.isDirty,
    (isDirty) => emit('dirtyChange', isDirty),
);

provide(formContextKey, {
    formId,
    get errors() {
        return errors.value;
    },
    get processing() {
        return inertia.processing;
    },
    get isDirty() {
        return inertia.isDirty;
    },
    get data() {
        return data.value;
    },
    get components() {
        return registry.value;
    },
    setValue,
});

/**
 * Browsers only honour `autofocus` on the first page load, so focus it on mount
 * like React's `autoFocus` does after client-side visits.
 */
onMounted(() => root.value?.querySelector<HTMLElement>('[autofocus]')?.focus());

/** Scroll once the new step or the errors have rendered. */
function scrollAfterRender(target: 'top' | 'error') {
    requestAnimationFrame(() => {
        void nextTick().then(() => {
            if (target === 'top') scrollFormIntoView(root.value);
            else scrollToFirstError(root.value);
        });
    });
}

/** Show the step with the first error and scroll to it. */
function revealErrors(next: FormErrors) {
    if (wizard.value) {
        const step = firstWizardStepWithError(steps.value, next);
        if (step !== -1) stepIndex.value = step;
    }
    if (schema.value.scrollToFirstError) scrollAfterRender('error');
}

function goToStep(index: number) {
    stepIndex.value = index;
    scrollAfterRender('top');
}

/** Check the current step on the server, then move to the next one. */
async function continueWizard() {
    const index = currentStep.value;
    const fieldset = steps.value[index];
    if (!wizard.value || !fieldset || checkingStep.value) return;
    checkingStep.value = true;
    try {
        const stepErrors = await validateWizardStep(wizard.value, index, data.value);
        const stale = wizardStepErrorKeys(fieldset, errors.value);
        if (stale.length) inertia.clearErrors(...stale);
        if (stepErrors) {
            inertia.setError(stepErrors as never);
            if (schema.value.scrollToFirstError) scrollAfterRender('error');
        } else {
            goToStep(index + 1);
        }
    } catch (error) {
        console.warn('[inertia-forms] Could not check the wizard step.', error);
    } finally {
        checkingStep.value = false;
    }
}

function submit(event: Event) {
    event.preventDefault();
    // Enter (or Continue) on any step but the last moves on instead of submitting.
    if (wizard.value && !isLastStep.value) {
        void continueWizard();
        return;
    }
    const button = formSubmitter(event);
    const intent = submitIntent(button);
    // The data passed to onBeforeSubmit includes the clicked button's intent.
    const proceed = props.onBeforeSubmit?.(
        intent ? { ...data.value, [intent.key]: intent.value } : data.value,
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
    const action = schema.value.action;
    if (!action) {
        console.warn(
            '[inertia-forms] The form has no action. Set $actionRoute, route(), or url() on the form class.',
        );
        return;
    }
    submitter.value = button ?? root.value?.querySelector<HTMLElement>('[type="submit"]') ?? null;
    const { method, spoof } = submissionTarget(schema.value);
    inertia.transform((payload) => ({
        ...payload,
        ...(intent ? { [intent.key]: intent.value } : {}),
        ...(spoof ? { _method: spoof } : {}),
    }));
    inertia.submit(method, action, {
        forceFormData: schema.value.hasFiles,
        preserveScroll: true,
        onSuccess: (page) => {
            if (schema.value.resetOnSuccess) inertia.reset();
            emit('success', page);
        },
        onError: (validationErrors) => {
            emit('error', validationErrors as FormErrors);
            revealErrors(validationErrors as FormErrors);
        },
        onFinish: () => emit('finish'),
    });
}
</script>

<template>
    <form
        :id="formId"
        ref="root"
        novalidate
        :class="cx(classes.form, form.class)"
        v-bind="accentAttributes"
        :data-dirty="inertia.isDirty || undefined"
        @submit="submit"
    >
        <WizardSteps
            v-if="wizard && steps.length"
            :steps="steps"
            :current="currentStep"
            @select="goToStep"
        />
        <component
            :is="section.fieldset.legend ? 'fieldset' : 'div'"
            v-for="section in sections"
            :id="section.fieldset.id ?? undefined"
            :key="section.key"
            :class="cx(classes.fieldset, section.fieldset.class)"
        >
            <template v-if="section.fieldset.legend">
                <legend :class="classes.legend">{{ section.fieldset.legend }}</legend>
                <p v-if="section.fieldset.description" :class="classes.fieldsetDescription">
                    {{ section.fieldset.description }}
                </p>
            </template>
            <div :class="gridClass(section.fieldset.columns)">
                <template v-for="row in section.rows" :key="row.key">
                    <div v-if="row.kind === 'submit'" :class="classes.submitGroup">
                        <FieldRenderer
                            v-for="field in row.fields"
                            :key="field.name"
                            :field="field"
                            :form-id="formId"
                            :columns="section.fieldset.columns"
                            :data="data"
                            :errors="errors"
                            :processing="inertia.processing"
                            :components="registry"
                            @change="setValue"
                        />
                    </div>
                    <FieldRenderer
                        v-else
                        :field="row.field"
                        :form-id="formId"
                        :columns="section.fieldset.columns"
                        :data="data"
                        :errors="errors"
                        :processing="inertia.processing"
                        :components="registry"
                        @change="setValue"
                    />
                </template>
            </div>
        </component>
        <slot v-bind="{ isDirty: inertia.isDirty, processing: inertia.processing }" />
        <div v-if="wizard" :class="classes.wizardFooter">
            <button
                v-if="currentStep > 0"
                type="button"
                :class="submitButtonClass('secondary', 'md')"
                :disabled="checkingStep || inertia.processing"
                @click="goToStep(currentStep - 1)"
            >
                <Icon name="chevronLeft" :class="classes.submitIcon" />{{ wizard.backLabel }}
            </button>
            <div :class="classes.wizardActions">
                <button
                    v-if="!isLastStep"
                    type="submit"
                    :class="submitButtonClass('primary', 'md')"
                    :disabled="checkingStep || inertia.processing"
                    :aria-busy="checkingStep || undefined"
                >
                    <span v-if="checkingStep" :class="classes.submitSpinner" aria-hidden="true" />{{
                        wizard.nextLabel
                    }}<Icon v-if="!checkingStep" name="chevronRight" :class="classes.submitIcon" />
                </button>
                <template v-else-if="wizardSubmits.length">
                    <FieldRenderer
                        v-for="field in wizardSubmits"
                        :key="field.name"
                        :field="field"
                        :form-id="formId"
                        :columns="1"
                        :data="data"
                        :errors="errors"
                        :processing="inertia.processing"
                        :components="registry"
                        @change="setValue"
                    />
                </template>
                <SubmitButton
                    v-else-if="showDefaultSubmit"
                    label="Submit"
                    :processing="inertia.processing"
                />
            </div>
        </div>
        <SubmitButton
            v-else-if="showDefaultSubmit"
            label="Submit"
            :processing="inertia.processing"
        />
    </form>
</template>
