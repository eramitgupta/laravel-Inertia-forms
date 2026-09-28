import {
    classes,
    columnSpanClass,
    cx,
    fieldError,
    fieldId,
    getPath,
    type FieldSchema,
    type FormErrors,
} from '../../core/src';
import { describedBy, FieldWrapper } from './FieldWrapper';
import { Checkbox } from './fields/Checkbox';
import { CheckboxGroup } from './fields/CheckboxGroup';
import { ColorPicker } from './fields/ColorPicker';
import { DatePicker } from './fields/DatePicker';
import { FileUpload } from './fields/FileUpload';
import { Radio } from './fields/Radio';
import { Select } from './fields/Select';
import { Slider } from './fields/Slider';
import { Blocks } from './fields/Blocks';
import { Link } from './fields/Link';
import { Slug } from './fields/Slug';
import { OtpInput } from './fields/OtpInput';
import { Composer } from './fields/Composer';
import { Heading } from './fields/Heading';
import { Text } from './fields/Text';
import { Html } from './fields/Html';
import { Separator } from './fields/Separator';
import { Callout } from './fields/Callout';
import { KeyValue } from './fields/KeyValue';
import { TagsInput } from './fields/TagsInput';
import { SubmitButton } from './fields/SubmitButton';
import { Textarea } from './fields/Textarea';
import { TextInput } from './fields/TextInput';
import { TimePicker } from './fields/TimePicker';
import { Toggle } from './fields/Toggle';
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

interface FieldRendererProps {
    field: FieldSchema;
    formId: string;
    columns: number;
    data: Record<string, unknown>;
    errors: FormErrors;
    processing: boolean;
    components: Record<string, FieldComponent>;
    onChange: (name: string, value: unknown) => void;
}

export function FieldRenderer({
    field,
    formId,
    columns,
    data,
    errors,
    processing,
    components,
    onChange,
}: FieldRendererProps) {
    if (field.component === 'Hidden') return null;

    if (field.component === 'Submit') {
        const submit = field as import('../../core/src').SubmitSchema;
        return (
            <SubmitButton
                label={submit.label}
                processingLabel={submit.processingLabel}
                processing={processing}
                disabled={submit.disabled}
                className={submit.class}
                variant={submit.variant}
                size={submit.size}
                fullWidth={submit.fullWidth}
                icon={submit.icon}
                iconPosition={submit.iconPosition}
                iconSvg={submit.iconSvg}
                intent={submit.intent}
                disableUntilDirty={submit.disableUntilDirty}
            />
        );
    }

    const Component = components[field.component];
    const id = fieldId(formId, field.name);
    const error = fieldError(errors, field.name, field.component);

    if (!Component) {
        console.warn(`[inertia-forms] No component registered for "${field.component}".`);
        return null;
    }

    if (DISPLAY_FIELDS.has(field.component)) {
        return (
            <div
                className={cx(
                    classes.displayField,
                    columnSpanClass(field.columnSpan, columns),
                    field.class,
                )}
                data-field={field.name}
            >
                <Component
                    field={field}
                    id={id}
                    value={getPath(data, field.name)}
                    error={error}
                    disabled={field.disabled}
                    describedBy={describedBy(field, id, error)}
                    onChange={(value) => onChange(field.name, value)}
                />
            </div>
        );
    }

    return (
        <FieldWrapper
            field={field}
            id={id}
            columns={columns}
            error={error}
            labelMode={
                GROUP_LABELS.has(field.component)
                    ? 'group'
                    : SELF_LABELLED.has(field.component)
                      ? 'none'
                      : 'label'
            }
        >
            <Component
                field={field}
                id={id}
                value={getPath(data, field.name)}
                error={error}
                disabled={field.disabled}
                describedBy={describedBy(field, id, error)}
                onChange={(value) => onChange(field.name, value)}
            />
        </FieldWrapper>
    );
}
