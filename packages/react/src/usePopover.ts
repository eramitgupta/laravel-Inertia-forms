import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classes, cx } from '../../core/src';

/**
 * Open/close state for a dropdown panel: closes on outside click, focus
 * moving outside (Tab), and Escape,
 * and flips above or to the right edge when there is no room.
 */
export function usePopover() {
    const root = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const [open, setOpenState] = useState(false);
    const [placement, setPlacement] = useState({ top: false, end: false });

    const setOpen = useCallback((next: boolean) => {
        setOpenState(next);
        if (!next) setPlacement({ top: false, end: false });
    }, []);

    useEffect(() => {
        if (!open) return;
        function outside(event: Event) {
            if (!root.current?.contains(event.target as Node)) setOpen(false);
        }
        function escape(event: KeyboardEvent) {
            if (event.key === 'Escape') setOpen(false);
        }
        document.addEventListener('pointerdown', outside);
        document.addEventListener('focusin', outside);
        document.addEventListener('keydown', escape);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('focusin', outside);
            document.removeEventListener('keydown', escape);
        };
    }, [open, setOpen]);

    useLayoutEffect(() => {
        if (!open || !root.current || !panel.current) return;
        const anchor = root.current.getBoundingClientRect();
        const box = panel.current.getBoundingClientRect();
        setPlacement({
            top:
                anchor.bottom + box.height + 12 > window.innerHeight &&
                anchor.top > box.height + 12,
            end: anchor.left + box.width > window.innerWidth - 8 && anchor.right - box.width >= 8,
        });
    }, [open]);

    const panelClass = (base: string = classes.popover) =>
        cx(base, placement.top && classes.popoverTop, placement.end && classes.popoverEnd);

    return { root, panel, open, setOpen, panelClass };
}
