/**
 * Translations for the text the form components render themselves: button
 * text, placeholders, aria labels, empty states, calendar names and so on.
 * Labels and other copy that come from Laravel are translated there.
 *
 *     setTranslations({ action_clear: 'Wissen', repeater_add: ':name toevoegen' })
 *
 * Placeholders work like Laravel's: `:name` is replaced as is, `:Name` with
 * the first letter upper-cased and `:NAME` fully upper-cased. A value can also
 * be a function that receives the parameters and returns the text.
 */
export const defaultTranslations = {
    // Generic actions
    action_add: 'Add',
    action_cancel: 'Cancel',
    action_clear: 'Clear',
    action_clear_field: 'Clear :label',
    action_close: 'Close',
    action_copy: 'Copy',
    action_copied: 'Copied',
    action_delete: 'Delete',
    action_delete_field: 'Delete :name',
    action_done: 'Done',
    action_remove: 'Remove',

    // Form
    form_submit: 'Submit',
    form_character_count: ':count / :max',

    // Select / Combobox
    option_placeholder: 'Select an option',
    option_search: 'Search…',
    option_searching: 'Searching…',
    option_no_results: 'No results',
    option_selected_count: ':count selected',
    option_remove: 'Remove :name',

    // FileUpload
    file_upload_click_to_upload: 'Click to upload',
    file_upload_drop_prompt: ':action or drag and drop',
    file_upload_images: 'Images',
    file_upload_max_size: 'up to :size',
    file_upload_max_files: 'max :count files',

    // File sizes (FileUpload and Composer)
    file_size_bytes: ':size B',
    file_size_kb: ':size KB',
    file_size_mb: ':size MB',

    // DatePicker
    date_placeholder: 'Select a date',
    date_range_placeholder: 'Select dates',
    date_today: 'Today',
    date_range: ':start – :end',
    date_display: ':month :day, :year',
    date_time: ':date, :time',

    // Calendar
    calendar_previous_year: 'Previous year',
    calendar_previous_month: 'Previous month',
    calendar_next_month: 'Next month',
    calendar_next_year: 'Next year',
    calendar_month_year: ':month :year',
    calendar_day_label: ':weekday, :month :day, :year',
    calendar_month_january: 'January',
    calendar_month_february: 'February',
    calendar_month_march: 'March',
    calendar_month_april: 'April',
    calendar_month_may: 'May',
    calendar_month_june: 'June',
    calendar_month_july: 'July',
    calendar_month_august: 'August',
    calendar_month_september: 'September',
    calendar_month_october: 'October',
    calendar_month_november: 'November',
    calendar_month_december: 'December',
    calendar_month_short_january: 'Jan',
    calendar_month_short_february: 'Feb',
    calendar_month_short_march: 'Mar',
    calendar_month_short_april: 'Apr',
    calendar_month_short_may: 'May',
    calendar_month_short_june: 'Jun',
    calendar_month_short_july: 'Jul',
    calendar_month_short_august: 'Aug',
    calendar_month_short_september: 'Sep',
    calendar_month_short_october: 'Oct',
    calendar_month_short_november: 'Nov',
    calendar_month_short_december: 'Dec',
    calendar_weekday_sunday: 'Sunday',
    calendar_weekday_monday: 'Monday',
    calendar_weekday_tuesday: 'Tuesday',
    calendar_weekday_wednesday: 'Wednesday',
    calendar_weekday_thursday: 'Thursday',
    calendar_weekday_friday: 'Friday',
    calendar_weekday_saturday: 'Saturday',
    calendar_weekday_short_sunday: 'Su',
    calendar_weekday_short_monday: 'Mo',
    calendar_weekday_short_tuesday: 'Tu',
    calendar_weekday_short_wednesday: 'We',
    calendar_weekday_short_thursday: 'Th',
    calendar_weekday_short_friday: 'Fr',
    calendar_weekday_short_saturday: 'Sa',

    // TimePicker
    time_now: 'Now',
    time_hour: 'Hour',
    time_minute: 'Min',
    time_second: 'Sec',

    // ColorPicker
    color_placeholder: 'Pick a color',
    color_hue: 'Hue',
    color_saturation: 'Saturation',
    color_lightness: 'Lightness',
    color_hex_code: ':label hex code',
    color_eyedropper: 'Pick a color from the screen',
    color_copy_hex: 'Copy hex code',

    // TagsInput
    tags_placeholder: 'Type and press Enter',
    tags_list: ':label tags',
    tags_suggestions: ':label suggestions',
    tags_remove: 'Remove :name',

    // KeyValue
    key_value_key: 'Key',
    key_value_value: 'Value',
    key_value_add: 'Add row',
    key_value_empty: 'No entries yet.',
    key_value_cell: ':label :number',
    key_value_row: 'row :number',

    // Shared by Repeater, Blocks and KeyValue
    collection_expand_all: 'Expand all',
    collection_collapse_all: 'Collapse all',
    collection_move_up: 'Move :name up',
    collection_move_down: 'Move :name down',
    collection_item: ':label :number',

    // Blocks
    blocks_add: 'Add block',
    blocks_empty: 'No blocks yet.',

    // Repeater
    repeater_add: 'Add :name',
    repeater_empty: 'No items yet.',

    // Link
    link_url_placeholder: 'https://example.com',
    link_text_placeholder: 'Link text',
    link_text_label: ':label text',
    link_target_label: 'Open :label in',
    link_same_tab: 'Same tab',
    link_new_tab: 'New tab',
    link_scheme_hint: 'Start with :scheme',

    // Slug
    slug_regenerate: 'Regenerate :label',

    // OtpInput
    otp_digit: 'Digit :number of :total',
    otp_character: 'Character :number of :total',

    // Composer
    composer_send: 'Send',
    composer_attach: 'Attach files',
    composer_attachments: 'Attachments',
    composer_quick_replies: 'Quick replies',
    composer_remove_attachment: 'Remove :name',
    composer_hint: 'Press :enter to send, :newline for new line',
    composer_key_enter: 'Enter',
    composer_key_newline: 'Shift + Enter',

    // Wizard
    wizard_next: 'Continue',
    wizard_back: 'Back',
    wizard_progress: 'Step :current of :total',
    wizard_progress_label: 'Progress',
    wizard_step: 'Step :number',
} satisfies Record<string, string>;

export type TranslationParams = Record<string, string | number>;

export type TranslationValue = string | ((params: TranslationParams) => string);

export type TranslationKey = keyof typeof defaultTranslations;

export type Translations = Partial<Record<TranslationKey, TranslationValue>>;

/** A piece of translated text, or a slot the component fills with an element. */
export type TranslationPart = string | { slot: string };

let current: Record<string, TranslationValue> = { ...defaultTranslations };
let version = 0;
const listeners = new Set<() => void>();

function changed(): void {
    version += 1;
    listeners.forEach((listener) => listener());
}

/**
 * Merge translations over the current ones. Call it again (for example with
 * another language) to switch; rendered forms update.
 */
export function setTranslations(translations: Translations): void {
    const next = { ...current };
    for (const [key, value] of Object.entries(translations)) {
        if (typeof value === 'string' || typeof value === 'function') next[key] = value;
    }
    current = next;
    changed();
}

/** Back to the English defaults. */
export function resetTranslations(): void {
    current = { ...defaultTranslations };
    changed();
}

/** The translations in use: the defaults merged with everything set so far. */
export function getTranslations(): Record<TranslationKey, TranslationValue> {
    return { ...current } as Record<TranslationKey, TranslationValue>;
}

/** Call `listener` whenever the translations change. Returns the unsubscribe function. */
export function subscribeTranslations(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** A counter that goes up on every change, for `useSyncExternalStore` and friends. */
export function translationsVersion(): number {
    return version;
}

function upperFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace `:param`, `:Param` and `:PARAM` in one pass, longest names first,
 * so `:count_total` is not read as `:count` and replaced text is left alone.
 */
function replacePlaceholders(text: string, params: TranslationParams): string {
    const replacements = new Map<string, string>();
    for (const [name, raw] of Object.entries(params)) {
        const value = String(raw);
        replacements.set(`:${upperFirst(name)}`, upperFirst(value));
        replacements.set(`:${name.toUpperCase()}`, value.toUpperCase());
        replacements.set(`:${name}`, value);
    }
    if (!replacements.size) return text;
    const tokens = [...replacements.keys()].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(tokens.map(escapeRegExp).join('|'), 'g');
    return text.replace(pattern, (token) => replacements.get(token) ?? token);
}

function resolve(value: TranslationValue | undefined, params: TranslationParams): string | null {
    if (typeof value === 'function') {
        try {
            return String(value(params));
        } catch (error) {
            console.warn('[inertia-forms] A translation function threw.', error);
            return null;
        }
    }
    return typeof value === 'string' ? replacePlaceholders(value, params) : null;
}

/**
 * The text for `key` with its placeholders filled in. Falls back to the
 * English default, then to the key itself.
 */
export function translate(
    key: TranslationKey | (string & {}),
    params: TranslationParams = {},
): string {
    return (
        resolve(current[key], params) ??
        resolve((defaultTranslations as Record<string, TranslationValue>)[key], params) ??
        key
    );
}

export { translate as t };

/**
 * Translate text that has elements inside it, like `Press :enter to send`
 * with a `<kbd>` for `:enter`. Returns text pieces and `{ slot }` markers in
 * order, so each framework can render the slots as its own elements.
 */
export function translateParts(
    key: TranslationKey | (string & {}),
    slots: readonly string[],
    params: TranslationParams = {},
): TranslationPart[] {
    const markers: TranslationParams = { ...params };
    slots.forEach((slot, index) => {
        markers[slot] = `\u0000${index}\u0000`;
    });
    return translate(key, markers)
        .split(/\u0000(\d+)\u0000/)
        .map((piece, index): TranslationPart => {
            if (index % 2 === 0) return piece;
            return { slot: slots[Number(piece)] ?? '' };
        })
        .filter((piece) => piece !== '');
}
