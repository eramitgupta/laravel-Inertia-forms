import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    blockTitle,
    builderAddLabel,
    calendarDayLabel,
    defaultTranslations,
    fileUploadHint,
    formatDisplayDate,
    formatFileSize,
    getTranslations,
    keyValueLabels,
    linkSchemeHint,
    monthLabel,
    resetTranslations,
    setTranslations,
    subscribeTranslations,
    t,
    translate,
    translateParts,
    translationsVersion,
    weekdayLabels,
    wizardProgressText,
    wizardStepLabel,
    type TranslationValue,
} from '../src';

afterEach(() => {
    resetTranslations();
});

describe('translate', () => {
    it('returns the English default', () => {
        expect(translate('action_cancel')).toBe('Cancel');
        expect(t('option_no_results')).toBe('No results');
    });

    it('replaces placeholders Laravel-style', () => {
        expect(translate('repeater_add', { name: 'link' })).toBe('Add link');
        expect(translate('wizard_progress', { current: 2, total: 5 })).toBe('Step 2 of 5');

        setTranslations({ repeater_add: ':Name toevoegen', action_delete_field: 'DELETE :NAME' });
        expect(translate('repeater_add', { name: 'link' })).toBe('Link toevoegen');
        expect(translate('action_delete_field', { name: 'row 1' })).toBe('DELETE ROW 1');
    });

    it('replaces the longest placeholder first and does not re-replace values', () => {
        setTranslations({ form_character_count: ':count of :count_max (:max)' });
        expect(translate('form_character_count', { count: ':max', count_max: 10, max: 3 })).toBe(
            ':max of 10 (3)',
        );
    });

    it('leaves placeholders without a value as they are', () => {
        expect(translate('wizard_progress', { current: 1 })).toBe('Step 1 of :total');
    });

    it('calls function values with the parameters', () => {
        const wizardProgress: TranslationValue = ({ current, total }) => {
            const number = new Intl.NumberFormat('nl-NL');
            return `Stap ${number.format(Number(current))} van ${number.format(Number(total))}`;
        };
        setTranslations({ wizard_progress: wizardProgress });
        expect(translate('wizard_progress', { current: 1000, total: 2000 })).toBe(
            'Stap 1.000 van 2.000',
        );
        expect(wizardProgressText(0, 3)).toBe('Stap 1 van 3');
    });

    it('falls back to the default when a function throws', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        setTranslations({
            action_clear: () => {
                throw new Error('nope');
            },
        });
        expect(translate('action_clear')).toBe('Clear');
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('shows the key itself when no translation exists', () => {
        expect(translate('custom_unknown_key')).toBe('custom_unknown_key');
    });
});

describe('setTranslations', () => {
    it('merges over the current translations', () => {
        setTranslations({ action_cancel: 'Annuleren' });
        setTranslations({ action_delete: 'Verwijderen' });
        expect(translate('action_cancel')).toBe('Annuleren');
        expect(translate('action_delete')).toBe('Verwijderen');
        expect(translate('action_clear')).toBe('Clear');
        expect(getTranslations().action_delete).toBe('Verwijderen');
    });

    it('ignores undefined values', () => {
        setTranslations({ action_cancel: undefined });
        expect(translate('action_cancel')).toBe('Cancel');
    });

    it('resets to the defaults', () => {
        setTranslations({ action_cancel: 'Annuleren' });
        resetTranslations();
        expect(translate('action_cancel')).toBe('Cancel');
        expect(getTranslations()).toEqual(defaultTranslations);
    });

    it('does not let getTranslations() change the registry', () => {
        const copy = getTranslations();
        copy.action_cancel = 'Changed';
        expect(translate('action_cancel')).toBe('Cancel');
    });
});

describe('change notification', () => {
    it('notifies listeners and bumps the version', () => {
        const listener = vi.fn();
        const unsubscribe = subscribeTranslations(listener);
        const before = translationsVersion();

        setTranslations({ action_cancel: 'Annuleren' });
        expect(listener).toHaveBeenCalledTimes(1);
        expect(translationsVersion()).toBe(before + 1);

        resetTranslations();
        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
        setTranslations({ action_cancel: 'Abbrechen' });
        expect(listener).toHaveBeenCalledTimes(2);
    });
});

describe('translateParts', () => {
    it('splits text around slots', () => {
        expect(translateParts('composer_hint', ['enter', 'newline'])).toEqual([
            'Press ',
            { slot: 'enter' },
            ' to send, ',
            { slot: 'newline' },
            ' for new line',
        ]);
    });

    it('follows the translated word order', () => {
        setTranslations({ file_upload_drop_prompt: 'Sleep hierheen of :action' });
        expect(translateParts('file_upload_drop_prompt', ['action'])).toEqual([
            'Sleep hierheen of ',
            { slot: 'action' },
        ]);
    });
});

describe('core helpers', () => {
    it('use translated calendar names', () => {
        expect(monthLabel(new Date(2026, 9, 1))).toBe('October 2026');
        expect(weekdayLabels(1)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
        expect(calendarDayLabel('2026-10-04')).toBe('Sunday, October 4, 2026');

        setTranslations({
            calendar_month_october: 'oktober',
            calendar_month_short_october: 'okt',
            calendar_weekday_short_monday: 'ma',
            date_display: ':day :month :year',
        });
        expect(monthLabel(new Date(2026, 9, 1))).toBe('oktober 2026');
        expect(weekdayLabels(1)[0]).toBe('ma');
        expect(formatDisplayDate('2026-10-04T09:15')).toBe('4 okt 2026, 09:15');
    });

    it('use translated file text', () => {
        setTranslations({
            file_size_kb: ':size kB',
            file_upload_max_files: 'max. :count bestanden',
        });
        expect(formatFileSize(2048)).toBe('2 kB');
        expect(
            fileUploadHint({
                accept: null,
                image: false,
                maxSize: 2,
                multiple: true,
                maxFiles: 3,
            }),
        ).toBe('up to 2 kB · max. 3 bestanden');
    });

    it('use translated fallbacks for labels Laravel leaves empty', () => {
        expect(
            builderAddLabel({
                component: 'Repeater',
                addActionLabel: null,
                blocks: [{ label: 'Link' } as never],
            }),
        ).toBe('Add link');
        expect(builderAddLabel({ component: 'Blocks', addActionLabel: null, blocks: [] })).toBe(
            'Add block',
        );
        expect(
            builderAddLabel({ component: 'Blocks', addActionLabel: 'Add section', blocks: [] }),
        ).toBe('Add section');
        expect(
            keyValueLabels({ keyLabel: null, valueLabel: 'Waarde', addActionLabel: null }),
        ).toEqual({ key: 'Key', value: 'Waarde', add: 'Add row' });
        expect(wizardStepLabel({ legend: null } as never, 1)).toBe('Step 2');
        expect(
            blockTitle(
                { label: 'Section', titleFrom: null } as never,
                { type: 'section', data: {} },
                2,
            ),
        ).toBe('Section 3');
        expect(
            linkSchemeHint({ requireScheme: true, allowedSchemes: ['https'] }, 'example.com'),
        ).toBe('Start with https://');
    });
});
