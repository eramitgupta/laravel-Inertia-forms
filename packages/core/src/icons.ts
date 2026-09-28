import { wizardIcons } from './features/wizard';
import { submitIcons } from './features/submit';
import { displayIcons } from './features/display';
import { linkIcons } from './features/link';
import { slugIcons } from './features/slug';
import { otpIcons } from './features/otp';
import { composerIcons } from './features/composer';

/**
 * Stroke icon paths (24×24, stroke = currentColor). Each framework renders
 * them with its own tiny `Icon` component, so no icon library is needed.
 */
export const icons = {
    x: 'M6 6l12 12M18 6 6 18',
    chevronDown: 'm6 9 6 6 6-6',
    chevronUp: 'm18 15-6-6-6 6',
    chevronLeft: 'm15 18-6-6 6-6',
    chevronRight: 'm9 18 6-6-6-6',
    chevronsLeft: 'm11 17-5-5 5-5M18 17l-5-5 5-5',
    chevronsRight: 'm13 17 5-5-5-5M6 17l5-5-5-5',
    check: 'M20 6 9 17l-5-5',
    calendar:
        'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
    grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
    upload: 'M12 13v8M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M8 17l4-4 4 4',
    plus: 'M12 5v14M5 12h14',
    trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
    eyedropper:
        'M3 21l2-.5L15 10.5M13.5 9l1.5 1.5M12 7.5l4.5 4.5M14.5 5l2-2a2.1 2.1 0 0 1 3 3l-2 2M5 20.5 3.5 19l9.5-9.5',
    copy: 'M9 9h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V9ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    ...wizardIcons,
    ...submitIcons,
    ...displayIcons,
    ...linkIcons,
    ...slugIcons,
    ...otpIcons,
    ...composerIcons,
} as const;

export type IconName = keyof typeof icons;
