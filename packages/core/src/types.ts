export type VisibilityOperator =
    | '='
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'in'
    | 'not_in'
    | 'contains'
    | 'empty'
    | 'not_empty'
    | 'truthy'
    | 'falsy';

export interface VisibilityCondition {
    field: string;
    operator: VisibilityOperator;
    value: unknown;
    negate: boolean;
}

export interface FieldOption {
    value: string | number | boolean;
    label: string;
    description: string | null;
    disabled: boolean;
}

export interface BaseFieldSchema {
    component: string;
    name: string;
    label: string;
    help: string | null;
    placeholder: string | null;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    autofocus: boolean;
    columnSpan: number | null;
    class: string | null;
    visibility: VisibilityCondition[] | null;
    clearWhenHidden: boolean;
    clearable: boolean;
    emptyValue: unknown;
    [key: string]: unknown;
}

export interface TextInputSchema extends BaseFieldSchema {
    component: 'TextInput';
    type: string;
    minLength: number | null;
    maxLength: number | null;
    min: number | null;
    max: number | null;
    step: number | string | null;
    prefix: string | null;
    suffix: string | null;
    autocomplete: string | null;
}

export interface TextareaSchema extends BaseFieldSchema {
    component: 'Textarea';
    rows: number;
    autoResize: boolean;
    minLength: number | null;
    maxLength: number | null;
    showCharacterCount: boolean;
}

export interface OptionsFieldSchema extends BaseFieldSchema {
    options: FieldOption[];
}

/** Where a `Select::searchUsing()` field loads its options from. */
export interface SelectSearch {
    url: string;
    token: string;
    field: string;
}

export interface SelectSchema extends OptionsFieldSchema {
    component: 'Select';
    multiple: boolean;
    searchable: boolean;
    search?: SelectSearch | null;
}

export interface ChoiceListSchema extends OptionsFieldSchema {
    component: 'Radio' | 'CheckboxGroup';
    inline: boolean;
    columns: number | null;
    buttons: boolean;
}

export interface BooleanFieldSchema extends BaseFieldSchema {
    component: 'Checkbox' | 'Toggle';
    trueValue: unknown;
    falseValue: unknown;
    onLabel?: string | null;
    offLabel?: string | null;
}

export interface DatePickerSchema extends BaseFieldSchema {
    component: 'DatePicker';
    withTime: boolean;
    range: boolean;
    months: number;
    firstDayOfWeek: number;
    minDate: string | null;
    maxDate: string | null;
}

export interface TimePickerSchema extends BaseFieldSchema {
    component: 'TimePicker';
    withSeconds: boolean;
    minTime: string | null;
    maxTime: string | null;
    minuteStep: number;
}

export interface ColorPickerSchema extends BaseFieldSchema {
    component: 'ColorPicker';
    swatches: string[];
}

export interface SliderSchema extends BaseFieldSchema {
    component: 'Slider';
    min: number;
    max: number;
    step: number;
    showValue: boolean;
    suffix: string | null;
}

export interface FileUploadSchema extends BaseFieldSchema {
    component: 'FileUpload';
    multiple: boolean;
    image: boolean;
    accept: string | null;
    maxSize: number | null;
    maxFiles: number | null;
}

export interface TagsInputSchema extends BaseFieldSchema {
    component: 'TagsInput';
    suggestions: string[];
    maxTags: number | null;
    maxTagLength: number | null;
    reorderable: boolean;
}

export interface KeyValueSchema extends BaseFieldSchema {
    component: 'KeyValue';
    keyLabel: string;
    valueLabel: string;
    keyPlaceholder: string | null;
    valuePlaceholder: string | null;
    addActionLabel: string;
    reorderable: boolean;
    addable: boolean;
    deletable: boolean;
    editableKeys: boolean;
    maxItems: number | null;
}

export interface BlockSchema {
    name: string;
    label: string;
    description: string | null;
    icon: string;
    columns: number;
    titleFrom: string | null;
    fields: FieldSchema[];
    defaults: Record<string, unknown>;
}

/** Blocks (content blocks) and Repeater (one block type, plain rows) share this shape. */
export interface BlocksSchema extends BaseFieldSchema {
    component: 'Blocks' | 'Repeater';
    blocks: BlockSchema[];
    addActionLabel: string;
    reorderable: boolean;
    addable: boolean;
    deletable: boolean;
    collapsible: boolean;
    collapsed: boolean;
    minItems: number | null;
    maxItems: number | null;
}

/** One item of a Blocks field. */
export interface BlockItem {
    type: string;
    data: Record<string, unknown>;
}

/** One row of a KeyValue field. */
export interface KeyValueRow {
    key: string;
    value: string;
}

export interface DateRangeValue {
    start: string;
    end: string;
}

export type SubmitVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
export type SubmitSize = 'sm' | 'md' | 'lg';

export interface SubmitSchema extends BaseFieldSchema {
    component: 'Submit';
    processingLabel: string | null;
    variant?: SubmitVariant;
    size?: SubmitSize;
    fullWidth?: boolean;
    icon?: string | null;
    iconPosition?: 'left' | 'right';
    /** SVG markup for icons the frontend doesn't draw itself (set by Laravel). */
    iconSvg?: string | null;
    /** Sent with the form as `key=value` when this button is clicked. */
    intent?: { key: string; value: string } | null;
    /** Keep the button disabled until the user changes a value. */
    disableUntilDirty?: boolean;
}

export interface LinkValue {
    url: string;
    label?: string;
    target?: '' | '_self' | '_blank';
}

export interface LinkSchema extends BaseFieldSchema {
    component: 'Link';
    structured: boolean;
    withLabel: boolean;
    withTarget: boolean;
    requireScheme: boolean;
    allowedSchemes: string[];
    labelPlaceholder: string | null;
}

export interface SlugSchema extends BaseFieldSchema {
    component: 'Slug';
    from: string | null;
    separator: '-' | '_';
    lowercase: boolean;
    maxLength: number | null;
    prefix: string | null;
}

export interface OtpInputSchema extends BaseFieldSchema {
    component: 'OtpInput';
    length: number;
    alphanumeric: boolean;
    masked: boolean;
    groupSize: number | null;
    autoSubmit: boolean;
}

export interface ComposerValue {
    message: string;
    attachments: File[];
}

export interface ComposerSchema extends BaseFieldSchema {
    component: 'Composer';
    attachments: boolean;
    accept: string[];
    maxFiles: number | null;
    maxSize: number | null;
    maxLength: number | null;
    submitOnEnter: boolean;
    sendLabel: string;
    rows: number;
    quickReplies: string[];
}

export type CalloutTone = 'info' | 'success' | 'warning' | 'danger';

/** Heading, Text, Html, Separator and Callout: shown in the form, no value. */
export interface DisplayFieldSchema extends BaseFieldSchema {
    component: 'Heading' | 'Text' | 'Html' | 'Separator' | 'Callout';
    text?: string;
    level?: 1 | 2 | 3 | 4;
    html?: string;
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    title?: string;
    body?: string | null;
    tone?: CalloutTone;
    icon?: string | null;
    /** SVG markup for icons the frontend doesn't draw itself (set by Laravel). */
    iconSvg?: string | null;
}

export type FieldSchema =
    | BaseFieldSchema
    | TextInputSchema
    | TextareaSchema
    | SelectSchema
    | ChoiceListSchema
    | BooleanFieldSchema
    | DatePickerSchema
    | TimePickerSchema
    | ColorPickerSchema
    | SliderSchema
    | FileUploadSchema
    | TagsInputSchema
    | KeyValueSchema
    | BlocksSchema
    | LinkSchema
    | SlugSchema
    | OtpInputSchema
    | ComposerSchema
    | DisplayFieldSchema
    | SubmitSchema;

export interface FieldsetSchema {
    id: string | null;
    legend: string | null;
    description: string | null;
    columns: number;
    class: string | null;
    visibility: VisibilityCondition[] | null;
    /** Step icon in a wizard. */
    icon?: string | null;
    /** SVG markup for icons the frontend doesn't draw itself (set by Laravel). */
    iconSvg?: string | null;
    fields: FieldSchema[];
}

export interface WizardSettings {
    nextLabel: string;
    backLabel: string;
    /** Package endpoint that checks one step. `null` skips the server check. */
    validateUrl: string | null;
    token: string | null;
}

/**
 * The payload produced by `Form::toArray()` on the Laravel side.
 */
export interface FormSchema {
    action: string | null;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    fieldsets: FieldsetSchema[];
    data: Record<string, unknown>;
    hasFiles: boolean;
    scrollToFirstError: boolean;
    resetOnSuccess: boolean;
    class: string | null;
    accent: string | null;
    wizard?: WizardSettings | null;
}

export type FormErrors = Record<string, string>;

/** The form state passed to the `<Form>` children (slot props in Vue, snippet args in Svelte). */
export interface FormState {
    /** True when any value differs from what the form started with (or last saved). */
    isDirty: boolean;
    /** True while the request is being sent. */
    processing: boolean;
}
