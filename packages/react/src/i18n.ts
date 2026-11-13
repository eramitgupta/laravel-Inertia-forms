import { useSyncExternalStore } from 'react';
import { subscribeTranslations, translate, translationsVersion } from '../../core/src';

/**
 * `translate`, re-rendering the component when `setTranslations()` or
 * `resetTranslations()` switches the text at runtime.
 */
export function useTranslate(): typeof translate {
    useSyncExternalStore(subscribeTranslations, translationsVersion, translationsVersion);
    return translate;
}
