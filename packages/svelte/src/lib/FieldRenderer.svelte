<script module lang="ts">
    import Blocks from './fields/Blocks.svelte';
    import Link from './fields/Link.svelte';
    import Slug from './fields/Slug.svelte';
    import OtpInput from './fields/OtpInput.svelte';
    import Composer from './fields/Composer.svelte';
    import Heading from './fields/Heading.svelte';
    import Text from './fields/Text.svelte';
    import Html from './fields/Html.svelte';
    import Separator from './fields/Separator.svelte';
    import Callout from './fields/Callout.svelte';
    import Checkbox from './fields/Checkbox.svelte';
    import CheckboxGroup from './fields/CheckboxGroup.svelte';
    import ColorPicker from './fields/ColorPicker.svelte';
    import DatePicker from './fields/DatePicker.svelte';
    import FileUpload from './fields/FileUpload.svelte';
    import KeyValue from './fields/KeyValue.svelte';
    import Radio from './fields/Radio.svelte';
    import Select from './fields/Select.svelte';
    import Slider from './fields/Slider.svelte';
    import TagsInput from './fields/TagsInput.svelte';
    import Textarea from './fields/Textarea.svelte';
    import TextInput from './fields/TextInput.svelte';
    import TimePicker from './fields/TimePicker.svelte';
    import Toggle from './fields/Toggle.svelte';
    import type { FieldComponent } from './types';

    export const builtInComponents: Record<string, FieldComponent> = {
        TextInput,
        Textarea,
        Select,
        Combobox: Select,
        Radio,
        Checkbox,
        CheckboxGroup,
        Toggle,
        DatePicker,
        TimePicker,
        ColorPicker,
        Slider,
        FileUpload,
        TagsInput,
        KeyValue,
        Blocks,
        Repeater: Blocks,
        Link,
        Slug,
        OtpInput,
        Composer,
        Heading,
        Text,
        Html,
        Separator,
        Callout,
    };

    const GROUP_LABELS = new Set(['Radio', 'CheckboxGroup', 'KeyValue', 'Blocks', 'Repeater']);
    const SELF_LABELLED = new Set(['Checkbox']);
    /** Fields that only show something: no label, help, error or value. */
    const DISPLAY_FIELDS = new Set(['Heading', 'Text', 'Html', 'Separator', 'Callout']);
</script>

<script lang="ts">
    import {
        classes,
        columnSpanClass,
        cx,
        fieldError,
        fieldId,
        getPath,
        type FieldSchema,
        type FormErrors,
    } from './core';
    import FieldWrapper, { describedBy } from './FieldWrapper.svelte';
    import SubmitButton from './fields/SubmitButton.svelte';
    import type { SubmitSchema } from './core';

    interface Props {
        field: FieldSchema;
        formId: string;
        columns: number;
        data: Record<string, unknown>;
        errors: FormErrors;
        processing: boolean;
        components: Record<string, FieldComponent>;
        onChange: (name: string, value: unknown) => void;
    }

    let { field, formId, columns, data, errors, processing, components, onChange }: Props =
        $props();

    const id = $derived(fieldId(formId, field.name));
    const error = $derived(fieldError(errors, field.name, field.component));
    const Component = $derived.by(() => {
        if (field.component === 'Hidden' || field.component === 'Submit') return null;
        const component = components[field.component];
        if (!component) {
            console.warn(`[inertia-forms] No component registered for "${field.component}".`);
        }
        return component ?? null;
    });
    const labelMode = $derived(
        GROUP_LABELS.has(field.component)
            ? 'group'
            : SELF_LABELLED.has(field.component)
              ? 'none'
              : 'label',
    );
</script>

{#if field.component === 'Submit'}
    {@const submit = field as SubmitSchema}
    <SubmitButton
        label={submit.label}
        processingLabel={submit.processingLabel}
        {processing}
        disabled={submit.disabled}
        class={submit.class}
        variant={submit.variant}
        size={submit.size}
        fullWidth={submit.fullWidth}
        icon={submit.icon}
        iconPosition={submit.iconPosition}
        iconSvg={submit.iconSvg}
        intent={submit.intent}
        disableUntilDirty={submit.disableUntilDirty}
    />
{:else if Component && DISPLAY_FIELDS.has(field.component)}
    <div
        class={cx(classes.displayField, columnSpanClass(field.columnSpan, columns), field.class)}
        data-field={field.name}
    >
        <Component
            {field}
            {id}
            value={getPath(data, field.name)}
            {error}
            disabled={field.disabled}
            describedBy={describedBy(field, id, error)}
            onChange={(value: unknown) => onChange(field.name, value)}
        />
    </div>
{:else if Component}
    <FieldWrapper {field} {id} {columns} {error} {labelMode}>
        <Component
            {field}
            {id}
            value={getPath(data, field.name)}
            {error}
            disabled={field.disabled}
            describedBy={describedBy(field, id, error)}
            onChange={(value: unknown) => onChange(field.name, value)}
        />
    </FieldWrapper>
{/if}
