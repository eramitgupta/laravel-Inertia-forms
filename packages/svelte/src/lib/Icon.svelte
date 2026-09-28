<script lang="ts">
    import { icons, type IconName } from './core';

    interface Props {
        /** A built-in icon. */
        name?: IconName | null;
        /** SVG markup sent by Laravel for other icons, used instead of `name`. */
        svg?: string | null;
        class?: string | undefined;
    }

    let { name, svg, class: className }: Props = $props();
</script>

<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width={2}
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class={className}
>
    {#if svg}
        <g>{@html svg}</g>
    {:else if name}
        <path d={icons[name]} />
    {/if}
</svg>
