import { onBeforeUnmount, ref, watch } from 'vue';
import { classes, cx } from '../../core/src';

/**
 * Open/close state for a dropdown panel: closes on outside click, focus
 * moving outside (Tab), and Escape,
 * and flips above or to the right edge when there is no room.
 */
export function usePopover() {
    const root = ref<HTMLElement | null>(null);
    const panel = ref<HTMLElement | null>(null);
    const open = ref(false);
    const placement = ref({ top: false, end: false });

    function setOpen(next: boolean) {
        open.value = next;
        if (!next) placement.value = { top: false, end: false };
    }

    function outside(event: Event) {
        if (!root.value?.contains(event.target as Node)) setOpen(false);
    }

    function escape(event: KeyboardEvent) {
        if (event.key === 'Escape') setOpen(false);
    }

    function detach() {
        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('focusin', outside);
        document.removeEventListener('keydown', escape);
    }

    watch(
        open,
        (isOpen) => {
            if (!isOpen) {
                detach();
                return;
            }
            document.addEventListener('pointerdown', outside);
            document.addEventListener('focusin', outside);
            document.addEventListener('keydown', escape);
            if (!root.value || !panel.value) return;
            const anchor = root.value.getBoundingClientRect();
            const box = panel.value.getBoundingClientRect();
            placement.value = {
                top:
                    anchor.bottom + box.height + 12 > window.innerHeight &&
                    anchor.top > box.height + 12,
                end:
                    anchor.left + box.width > window.innerWidth - 8 &&
                    anchor.right - box.width >= 8,
            };
        },
        { flush: 'post' },
    );

    onBeforeUnmount(detach);

    const panelClass = (base: string = classes.popover) =>
        cx(
            base,
            placement.value.top && classes.popoverTop,
            placement.value.end && classes.popoverEnd,
        );

    return { root, panel, open, setOpen, panelClass };
}
