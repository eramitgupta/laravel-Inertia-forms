import { createContext } from 'react';

/**
 * The button that submitted the form, so only that button shows its
 * processing state. `null` means any button may show it.
 */
export const SubmitterContext = createContext<HTMLElement | null>(null);
