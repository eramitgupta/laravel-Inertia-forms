import type { InjectionKey, Ref } from 'vue';

/**
 * The button that submitted the form, so only that button shows its
 * processing state. `null` means any button may show it.
 */
export const submitterKey: InjectionKey<Readonly<Ref<HTMLElement | null>>> = Symbol(
    'erag-inertia-forms-submitter',
);
