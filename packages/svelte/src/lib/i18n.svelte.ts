import {
    blockTitle as coreBlockTitle,
    builderAddLabel as coreBuilderAddLabel,
    calendarDayLabel as coreCalendarDayLabel,
    composerSendLabel as coreComposerSendLabel,
    fileUploadHint as coreFileUploadHint,
    formatDisplayDate as coreFormatDisplayDate,
    formatFileSize as coreFormatFileSize,
    keyValueLabels as coreKeyValueLabels,
    linkSchemeHint as coreLinkSchemeHint,
    monthLabel as coreMonthLabel,
    subscribeTranslations,
    translate,
    translateParts as coreTranslateParts,
    translationsVersion,
    weekdayLabels as coreWeekdayLabels,
    wizardBackLabel as coreWizardBackLabel,
    wizardNextLabel as coreWizardNextLabel,
    wizardProgressText as coreWizardProgressText,
    wizardStepLabel as coreWizardStepLabel,
} from './core';

// Bumped from `subscribeTranslations`, so every template expression or
// `$derived` that reads it re-runs after `setTranslations()` / `resetTranslations()`.
let version = $state(translationsVersion());

subscribeTranslations(() => {
    version = translationsVersion();
});

/**
 * Wrap a function that renders translated text so calling it inside markup or
 * a `$derived` also tracks the translations, and re-runs when they change.
 */
function localized<Args extends unknown[], Result>(
    fn: (...args: Args) => Result,
): (...args: Args) => Result {
    return (...args) => {
        void version;
        return fn(...args);
    };
}

const reactiveTranslate: typeof translate = localized(translate);

/**
 * `translate`, reading the translations reactively: markup and `$derived`
 * values that call it update when `setTranslations()` or `resetTranslations()`
 * switches the text at runtime. The Svelte twin of React's `useTranslate()`.
 *
 *     const t = useTranslate();
 *     <button>{t('action_clear')}</button>
 */
export function useTranslate(): typeof translate {
    return reactiveTranslate;
}

// Reactive versions of the core helpers that translate their text. Components
// import these instead of the core ones so the text follows the translations.
export const translateParts = localized(coreTranslateParts);
export const formatFileSize = localized(coreFormatFileSize);
export const fileUploadHint = localized(coreFileUploadHint);
export const formatDisplayDate = localized(coreFormatDisplayDate);
export const monthLabel = localized(coreMonthLabel);
export const weekdayLabels = localized(coreWeekdayLabels);
export const calendarDayLabel = localized(coreCalendarDayLabel);
export const wizardStepLabel = localized(coreWizardStepLabel);
export const wizardProgressText = localized(coreWizardProgressText);
export const wizardNextLabel = localized(coreWizardNextLabel);
export const wizardBackLabel = localized(coreWizardBackLabel);
export const builderAddLabel = localized(coreBuilderAddLabel);
export const keyValueLabels = localized(coreKeyValueLabels);
export const blockTitle = localized(coreBlockTitle);
export const linkSchemeHint = localized(coreLinkSchemeHint);
export const composerSendLabel = localized(coreComposerSendLabel);
