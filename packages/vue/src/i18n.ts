import { shallowRef } from 'vue';
import { subscribeTranslations, translate, translationsVersion } from '../../core/src';

/**
 * Goes up whenever `setTranslations()` or `resetTranslations()` runs. Reading
 * it inside a render or `computed` makes that re-run when the text changes.
 */
const version = shallowRef(translationsVersion());

subscribeTranslations(() => {
    version.value = translationsVersion();
});

function track(): void {
    void version.value;
}

const t: typeof translate = (key, params) => {
    track();
    return translate(key, params);
};

/**
 * `translate`, re-rendering the component when `setTranslations()` or
 * `resetTranslations()` switches the text at runtime.
 */
export function useTranslate(): typeof translate {
    return t;
}

/**
 * Wrap a core helper that calls `translate()` (like `builderAddLabel` or
 * `monthLabel`) so templates and computeds using it update on a change too.
 */
export function translated<Args extends unknown[], Result>(
    helper: (...args: Args) => Result,
): (...args: Args) => Result {
    return (...args) => {
        track();
        return helper(...args);
    };
}
