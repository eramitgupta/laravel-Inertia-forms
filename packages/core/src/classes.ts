import { wizardClasses } from './features/wizard';
import { submitClasses } from './features/submit';
import { displayClasses } from './features/display';
import { linkClasses } from './features/link';
import { slugClasses } from './features/slug';
import { otpClasses } from './features/otp';
import { composerClasses } from './features/composer';

/**
 * Tailwind CSS 4 class strings shared by the Vue, React, and Svelte packages.
 * Keep every class literal so Tailwind can detect it in the built output.
 *
 * The accent color comes from the `--erag-form-accent` CSS variable (indigo by
 * default). Set it on any parent element, or use the Form `accent` option.
 */
export const classes = {
    form: 'erag-form flex flex-col gap-8',
    fieldset: 'min-w-0 space-y-5',
    legend: 'text-base font-semibold text-zinc-900 dark:text-zinc-100',
    fieldsetDescription: '-mt-3 text-sm text-zinc-500 dark:text-zinc-400',
    field: 'flex min-w-0 flex-col gap-1.5',
    label: 'block text-sm font-medium text-zinc-800 dark:text-zinc-200',
    required: 'ml-0.5 text-red-500',
    help: 'text-sm text-zinc-500 dark:text-zinc-400',
    error: 'text-sm font-medium text-red-600 dark:text-red-400',

    input: 'block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs placeholder:text-zinc-400 focus:border-[var(--erag-form-accent,#4f46e5)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:disabled:bg-zinc-800 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    inputGroup:
        'flex w-full items-stretch overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xs focus-within:border-[var(--erag-form-accent,#4f46e5)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] has-aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900',
    inputGroupInput:
        'block w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:text-zinc-500 dark:text-zinc-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    addon: 'flex items-center bg-zinc-50 px-3 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
    addonEnd: 'flex items-center gap-1 pr-2 text-zinc-400',

    /** A button or div that looks like an input, used by pickers and selects. */
    trigger:
        'flex min-h-[2.375rem] w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-left text-sm text-zinc-900 shadow-xs focus-within:border-[var(--erag-form-accent,#4f46e5)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] aria-disabled:cursor-not-allowed aria-disabled:bg-zinc-50 aria-disabled:text-zinc-500 aria-invalid:border-red-500 data-open:border-[var(--erag-form-accent,#4f46e5)] data-open:ring-2 data-open:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:aria-disabled:bg-zinc-800',
    triggerButton:
        'flex min-w-0 flex-1 items-center gap-2 self-stretch text-left focus:outline-none disabled:cursor-not-allowed',
    triggerValue: 'min-w-0 flex-1 truncate',
    triggerPlaceholder: 'min-w-0 flex-1 truncate text-zinc-400 dark:text-zinc-500',
    triggerSearch:
        'min-w-16 flex-1 border-0 bg-transparent p-0 py-0.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none dark:text-zinc-100',
    iconButton:
        'inline-flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
    icon: 'size-4 shrink-0 text-zinc-400',

    popoverAnchor: 'relative',
    popover:
        'absolute left-0 z-30 mt-1.5 w-max max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white p-2 text-sm shadow-lg ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-white/5',
    /** Added when the popover opens above the trigger. */
    popoverTop: 'top-auto bottom-full mt-0 mb-1.5',
    /** Added when the popover is aligned to the right edge of the trigger. */
    popoverEnd: 'left-auto right-0',
    popoverFooter:
        'mt-2 flex items-center gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-800',
    popoverAction:
        'rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800',

    calendar: 'w-max p-1',
    calendarHeader: 'mb-2 flex items-center justify-between gap-2 px-1',
    calendarTitle: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    calendarNav:
        'inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    calendarMonths: 'flex flex-col gap-4 sm:flex-row',
    calendarMonthTitle: 'mb-1 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    calendarGrid: 'grid grid-cols-7 gap-y-1',
    calendarWeekday: 'flex h-8 w-9 items-center justify-center text-xs font-medium text-zinc-500',
    calendarDay:
        'relative flex h-9 w-9 items-center justify-center rounded-full text-sm text-zinc-800 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent data-outside:text-zinc-400 data-today:ring-1 data-today:ring-[var(--erag-form-accent,#4f46e5)] data-in-range:rounded-none data-in-range:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_12%,transparent)] data-selected:bg-[var(--erag-form-accent,#4f46e5)] data-selected:font-semibold data-selected:text-white data-selected:hover:bg-[var(--erag-form-accent,#4f46e5)] dark:text-zinc-200 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600',

    timeColumns: 'flex divide-x divide-zinc-100 dark:divide-zinc-800',
    timeColumn: 'flex w-16 flex-col',
    timeColumnTitle: 'pb-1 text-center text-xs font-semibold text-zinc-500',
    timeList: 'max-h-52 overflow-y-auto overscroll-contain px-1 [scrollbar-width:thin]',
    timeOption:
        'my-0.5 w-full rounded-lg py-1.5 text-center text-sm text-zinc-700 tabular-nums hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 aria-selected:bg-[var(--erag-form-accent,#4f46e5)] aria-selected:font-semibold aria-selected:text-white dark:text-zinc-200 dark:hover:bg-zinc-800',

    textarea: 'min-h-20 resize-y',
    counter: 'text-right text-xs text-zinc-400 tabular-nums',

    choiceList: 'grid gap-2',
    choiceListInline: 'flex flex-wrap gap-x-6 gap-y-2',
    choice: 'flex items-start gap-3',
    choiceCard:
        'flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-3 has-checked:border-[var(--erag-form-accent,#4f46e5)] has-checked:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_7%,transparent)] has-disabled:cursor-not-allowed has-disabled:opacity-60 dark:border-zinc-700',
    choiceText: 'grid gap-0.5 text-sm',
    choiceLabel: 'font-medium text-zinc-800 dark:text-zinc-200',
    choiceDescription: 'text-zinc-500 dark:text-zinc-400',
    radio: 'mt-0.5 size-4 shrink-0 border-zinc-300 accent-[var(--erag-form-accent,#4f46e5)] dark:border-zinc-600',
    checkbox:
        'mt-0.5 size-4 shrink-0 rounded border-zinc-300 accent-[var(--erag-form-accent,#4f46e5)] dark:border-zinc-600',

    /** Radio::buttons() — a segmented control. */
    segmented:
        'inline-flex max-w-full flex-wrap self-start overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xs has-aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900',
    segment:
        'relative cursor-pointer border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 not-first:border-l hover:bg-zinc-50 has-checked:bg-[var(--erag-form-accent,#4f46e5)] has-checked:text-white has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-[var(--erag-form-accent,#4f46e5)] has-focus-visible:ring-inset dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800',
    /** CheckboxGroup::buttons() — toggleable pills. */
    pills: 'flex flex-wrap gap-2',
    pill: 'relative cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 has-checked:border-[var(--erag-form-accent,#4f46e5)] has-checked:bg-[var(--erag-form-accent,#4f46e5)] has-checked:text-white has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_35%,transparent)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
    visuallyHidden: 'sr-only',

    toggleRow: 'flex items-center gap-3',
    toggleTrack:
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-zinc-300 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-checked:bg-[var(--erag-form-accent,#4f46e5)] dark:bg-zinc-700 dark:focus-visible:ring-offset-zinc-900',
    toggleThumb:
        'inline-block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform',
    toggleThumbOn: 'translate-x-5.5',
    toggleText: 'text-sm text-zinc-700 dark:text-zinc-300',

    colorChip: 'size-5 shrink-0 rounded-md border border-black/10 dark:border-white/10',
    colorPanel: 'grid w-64 gap-3 p-1',
    colorSliderGroup: 'grid gap-1.5',
    colorSliderLabel: 'text-xs font-medium text-zinc-500 dark:text-zinc-400',
    /** Range input with a gradient track (set inline) and a round white thumb. */
    colorSlider:
        'h-3 w-full cursor-pointer appearance-none rounded-full border border-black/5 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-offset-2 focus-visible:outline-none dark:border-white/10 dark:focus-visible:ring-offset-zinc-900 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgb(0_0_0/0.15),0_1px_3px_rgb(0_0_0/0.3)] [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(0_0_0/0.15),0_1px_3px_rgb(0_0_0/0.3)]',
    colorFooter: 'flex items-center gap-2 pt-1',
    colorPreview: 'size-10 shrink-0 rounded-lg border border-black/10 dark:border-white/10',
    colorHex:
        'block w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 uppercase shadow-xs focus:border-[var(--erag-form-accent,#4f46e5)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
    colorTool:
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    swatches: 'flex flex-wrap gap-2',
    swatch: 'size-7 rounded-md border border-black/10 ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-[var(--erag-form-accent,#4f46e5)] dark:ring-offset-zinc-900',

    sliderRow: 'flex items-center gap-4',
    slider: 'h-2 w-full cursor-pointer accent-[var(--erag-form-accent,#4f46e5)] disabled:cursor-not-allowed',
    sliderValue:
        'w-16 shrink-0 text-right text-sm font-medium text-zinc-700 tabular-nums dark:text-zinc-300',

    dropzone:
        'flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-300 px-6 py-8 text-center transition-colors hover:border-[var(--erag-form-accent,#4f46e5)] hover:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_4%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60 dark:border-zinc-700',
    dropzoneActive:
        'border-[var(--erag-form-accent,#4f46e5)] bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_8%,transparent)]',
    dropzoneIcon: 'size-7 text-zinc-400',
    dropzoneTitle: 'text-sm text-zinc-600 dark:text-zinc-300',
    dropzoneLink: 'font-semibold text-[var(--erag-form-accent,#4f46e5)]',
    dropzoneHint: 'text-xs text-zinc-500 dark:text-zinc-400',
    fileList: 'grid gap-2',
    fileItem:
        'flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700',
    filePreview: 'size-10 shrink-0 rounded-md object-cover',
    fileName: 'min-w-0 flex-1 truncate text-zinc-800 dark:text-zinc-200',
    fileSize: 'shrink-0 text-xs text-zinc-500 tabular-nums',
    fileRemove:
        'shrink-0 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800',

    combobox: 'relative',
    comboboxList:
        'absolute left-0 z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-zinc-200 bg-white p-1 text-sm shadow-lg ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900',
    comboboxOption:
        'group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-active:bg-zinc-100 dark:text-zinc-200 dark:data-active:bg-zinc-800',
    optionText: 'grid min-w-0 gap-0.5',
    optionLabel: 'truncate',
    optionDescription:
        'truncate text-xs text-zinc-500 group-aria-selected:text-[var(--erag-form-accent,#4f46e5)] dark:text-zinc-400',
    optionCheck: 'size-4 shrink-0 text-[var(--erag-form-accent,#4f46e5)]',
    comboboxEmpty: 'px-3 py-2 text-zinc-500',
    chips: 'flex min-w-0 flex-1 flex-wrap items-center gap-1.5',
    chip: 'inline-flex max-w-full items-center gap-1 rounded-md bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_10%,transparent)] px-2 py-0.5 text-sm font-medium text-[var(--erag-form-accent,#4f46e5)] data-dragging:opacity-40',
    chipHandle:
        'cursor-grab text-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_60%,transparent)] active:cursor-grabbing',
    chipRemove:
        'inline-flex size-4 items-center justify-center rounded text-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_70%,transparent)] hover:text-[var(--erag-form-accent,#4f46e5)]',

    /** KeyValue: a bordered table of key / value rows. */
    kvTable:
        'overflow-hidden rounded-xl border border-zinc-200 bg-white data-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900',
    kvGrid: 'grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-3',
    kvGridPlain: 'grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-3',
    kvHeader:
        'bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400',
    kvRow: 'border-t border-zinc-100 px-3 py-2.5 transition-colors data-dragging:opacity-40 data-drop:bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_6%,transparent)] dark:border-zinc-800',
    kvControls: 'flex items-center gap-0.5',
    kvHandle:
        'inline-flex size-7 cursor-grab items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:cursor-grabbing dark:hover:bg-zinc-800 [&_svg]:stroke-[3.5]',
    kvButton:
        'inline-flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    kvRemove:
        'inline-flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-red-500/10',
    kvEmpty:
        'border-t border-zinc-100 px-3 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400',
    kvAdd: 'mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 shadow-xs transition hover:border-[var(--erag-form-accent,#4f46e5)] hover:text-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',

    /** Builder: a list of collapsible block cards and an add menu. */
    builder: 'relative flex flex-col gap-3',
    builderCollapseAll:
        'absolute -top-[1.625rem] right-0 rounded-md px-1.5 py-0.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none dark:text-zinc-400 dark:hover:text-zinc-100',
    block: 'overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition data-dragging:opacity-40 data-invalid:border-red-300 dark:border-zinc-700 dark:bg-zinc-900 dark:data-invalid:border-red-500/60',
    blockHeader: 'flex items-center gap-1 px-2 py-2 sm:px-3',
    blockHeaderOpen: 'border-b border-zinc-100 dark:border-zinc-800',
    blockToggle:
        'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-default',
    blockChevron:
        'inline-flex shrink-0 text-zinc-500 transition-transform data-collapsed:-rotate-90 dark:text-zinc-400',
    blockHeading: 'min-w-0 flex-1',
    blockTitleRow: 'flex min-w-0 items-center gap-2',
    blockTitle: 'truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    blockBadge:
        'shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    blockDescription: 'block truncate text-xs text-zinc-500 dark:text-zinc-400',
    blockActions: 'flex shrink-0 items-center gap-0.5',
    blockBody: 'p-4',
    builderEmpty:
        'rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400',
    builderAddAnchor: 'relative',
    builderAdd:
        'flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:border-[var(--erag-form-accent,#4f46e5)] hover:text-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-300 disabled:hover:text-zinc-600 data-open:border-[var(--erag-form-accent,#4f46e5)] data-open:text-[var(--erag-form-accent,#4f46e5)] dark:border-zinc-600 dark:text-zinc-300',
    builderMenu:
        'absolute left-0 z-30 mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-white/5',
    builderMenuItem:
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-50 focus-visible:bg-zinc-100 focus-visible:outline-none data-active:bg-zinc-50 dark:hover:bg-zinc-800 dark:data-active:bg-zinc-800',
    builderMenuIcon:
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_35%,transparent)] bg-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_8%,transparent)] text-sm font-bold text-[var(--erag-form-accent,#4f46e5)]',
    builderMenuLabel: 'block text-sm font-semibold text-zinc-900 dark:text-zinc-100',
    builderMenuDescription: 'block text-xs text-zinc-500 dark:text-zinc-400',

    submitRow: 'flex items-center gap-3',
    submit: 'inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--erag-form-accent,#4f46e5)] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-zinc-900',
    spinner: 'size-4 animate-spin rounded-full border-2 border-white/40 border-t-white',
    ...wizardClasses,
    ...submitClasses,
    ...displayClasses,
    ...linkClasses,
    ...slugClasses,
    ...otpClasses,
    ...composerClasses,
} as const;

/**
 * Inline style that applies a form's accent color to everything inside it.
 */
export function accentStyle(accent: string | null | undefined): Record<string, string> | undefined {
    return accent ? { '--erag-form-accent': accent } : undefined;
}

const GRID_COLUMNS: Record<number, string> = {
    1: 'grid grid-cols-1 gap-5',
    2: 'grid grid-cols-1 gap-5 sm:grid-cols-2',
    3: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-6',
};

const COLUMN_SPANS: Record<number, string> = {
    1: '',
    2: 'sm:col-span-2',
    3: 'sm:col-span-2 lg:col-span-3',
    4: 'sm:col-span-2 lg:col-span-4',
    5: 'sm:col-span-2 lg:col-span-5',
    6: 'sm:col-span-3 lg:col-span-6',
};

const CHOICE_COLUMNS: Record<number, string> = {
    1: 'grid gap-2',
    2: 'grid gap-2 sm:grid-cols-2',
    3: 'grid gap-2 sm:grid-cols-3',
    4: 'grid gap-2 sm:grid-cols-2 lg:grid-cols-4',
};

export function gridClass(columns: number): string {
    return GRID_COLUMNS[Math.min(Math.max(columns, 1), 6)] ?? GRID_COLUMNS[1]!;
}

/**
 * Span a field across the fieldset grid. A span wider than the grid fills the row.
 */
export function columnSpanClass(span: number | null, columns: number): string {
    if (!span || span <= 1) return '';
    if (span >= columns) return 'col-span-full';
    return COLUMN_SPANS[Math.min(span, 6)] ?? '';
}

export function choiceListClass(inline: boolean, columns: number | null): string {
    if (inline) return classes.choiceListInline;
    return CHOICE_COLUMNS[Math.min(Math.max(columns ?? 1, 1), 4)] ?? classes.choiceList;
}

export function cx(...values: Array<string | false | null | undefined>): string {
    return values.filter(Boolean).join(' ');
}
