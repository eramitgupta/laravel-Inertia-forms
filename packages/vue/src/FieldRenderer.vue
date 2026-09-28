<script lang="ts">
import type { FieldComponent } from './types';
import Blocks from './fields/Blocks.vue';
import Link from './fields/Link.vue';
import Slug from './fields/Slug.vue';
import OtpInput from './fields/OtpInput.vue';
import Composer from './fields/Composer.vue';
import Heading from './fields/Heading.vue';
import Text from './fields/Text.vue';
import Html from './fields/Html.vue';
import Separator from './fields/Separator.vue';
import Callout from './fields/Callout.vue';
import Checkbox from './fields/Checkbox.vue';
import CheckboxGroup from './fields/CheckboxGroup.vue';
import ColorPicker from './fields/ColorPicker.vue';
import DatePicker from './fields/DatePicker.vue';
import FileUpload from './fields/FileUpload.vue';
import KeyValue from './fields/KeyValue.vue';
import Radio from './fields/Radio.vue';
import Select from './fields/Select.vue';
import Slider from './fields/Slider.vue';
import TagsInput from './fields/TagsInput.vue';
import Textarea from './fields/Textarea.vue';
import TextInput from './fields/TextInput.vue';
import TimePicker from './fields/TimePicker.vue';
import Toggle from './fields/Toggle.vue';

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

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
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
import FieldWrapper, { describedBy } from './FieldWrapper.vue';
import SubmitButton from './fields/SubmitButton.vue';
import type { SubmitSchema } from '../../core/src';

const props = defineProps<{
    field: FieldSchema;
    formId: string;
    columns: number;
    data: Record<string, unknown>;
    errors: FormErrors;
    processing: boolean;
    components: Record<string, FieldComponent>;
}>();

const emit = defineEmits<{
    change: [name: string, value: unknown];
}>();

const isSpecial = computed(
    () => props.field.component === 'Hidden' || props.field.component === 'Submit',
);
const component = computed(() => props.components[props.field.component]);
const id = computed(() => fieldId(props.formId, props.field.name));
const error = computed(() => fieldError(props.errors, props.field.name, props.field.component));
const isDisplay = computed(() => DISPLAY_FIELDS.has(props.field.component));
const labelMode = computed(() =>
    GROUP_LABELS.has(props.field.component)
        ? 'group'
        : SELF_LABELLED.has(props.field.component)
          ? 'none'
          : 'label',
);

watchEffect(() => {
    if (!isSpecial.value && !component.value) {
        console.warn(`[inertia-forms] No component registered for "${props.field.component}".`);
    }
});
</script>

<template>
    <SubmitButton
        v-if="field.component === 'Submit'"
        :label="field.label"
        :processing-label="(field as SubmitSchema).processingLabel"
        :processing="processing"
        :disabled="field.disabled"
        :class="field.class"
        :variant="(field as SubmitSchema).variant"
        :size="(field as SubmitSchema).size"
        :full-width="(field as SubmitSchema).fullWidth"
        :icon="(field as SubmitSchema).icon"
        :icon-position="(field as SubmitSchema).iconPosition"
        :icon-svg="(field as SubmitSchema).iconSvg"
        :intent="(field as SubmitSchema).intent"
        :disable-until-dirty="(field as SubmitSchema).disableUntilDirty"
    />
    <div
        v-else-if="isDisplay && component"
        :class="cx(classes.displayField, columnSpanClass(field.columnSpan, columns), field.class)"
        :data-field="field.name"
    >
        <component
            :is="component"
            :field="field"
            :id="id"
            :model-value="getPath(data, field.name)"
            :error="error"
            :disabled="field.disabled"
            :described-by="describedBy(field, id, error)"
            @update:model-value="(value: unknown) => emit('change', field.name, value)"
        />
    </div>
    <FieldWrapper
        v-else-if="field.component !== 'Hidden' && component"
        :field="field"
        :id="id"
        :columns="columns"
        :error="error"
        :label-mode="labelMode"
    >
        <component
            :is="component"
            :field="field"
            :id="id"
            :model-value="getPath(data, field.name)"
            :error="error"
            :disabled="field.disabled"
            :described-by="describedBy(field, id, error)"
            @update:model-value="(value: unknown) => emit('change', field.name, value)"
        />
    </FieldWrapper>
</template>
