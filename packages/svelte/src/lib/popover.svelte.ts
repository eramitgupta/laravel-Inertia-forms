import { classes, cx } from './core';

/**
 * Open/close state for a dropdown panel: closes on outside click, focus
 * moving outside (Tab), and Escape,
 * and flips above or to the right edge when there is no room.
 *
 * Call it during component initialisation, then bind the anchor and panel:
 *
 *     const popover = createPopover();
 *     <div bind:this={popover.root}> … <div bind:this={popover.panel} class={popover.panelClass()}>
 */
export function createPopover() {
    let root = $state<HTMLElement | null>(null);
    let panel = $state<HTMLElement | null>(null);
    let open = $state(false);
    let placement = $state({ top: false, end: false });

    function setOpen(next: boolean) {
        open = next;
        if (!next) placement = { top: false, end: false };
    }

    $effect(() => {
        if (!open) return;
        function outside(event: Event) {
            if (!root?.contains(event.target as Node)) setOpen(false);
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
    });

    $effect(() => {
        if (!open || !root || !panel) return;
        const anchor = root.getBoundingClientRect();
        const box = panel.getBoundingClientRect();
        placement = {
            top:
                anchor.bottom + box.height + 12 > window.innerHeight &&
                anchor.top > box.height + 12,
            end: anchor.left + box.width > window.innerWidth - 8 && anchor.right - box.width >= 8,
        };
    });

    return {
        get root() {
            return root;
        },
        set root(element: HTMLElement | null) {
            root = element;
        },
        get panel() {
            return panel;
        },
        set panel(element: HTMLElement | null) {
            panel = element;
        },
        get open() {
            return open;
        },
        setOpen,
        panelClass(base: string = classes.popover): string {
            return cx(
                base,
                placement.top && classes.popoverTop,
                placement.end && classes.popoverEnd,
            );
        },
    };
}
