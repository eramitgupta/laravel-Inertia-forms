<script lang="ts">
    import { classes } from '../core';
    import Icon from '../Icon.svelte';

    interface Props {
        label: string;
        onClear: () => void;
    }

    let { label, onClear }: Props = $props();
</script>

<button
    type="button"
    class={classes.iconButton}
    aria-label={`Clear ${label}`}
    onclick={(event) => {
        event.stopPropagation();
        onClear();
    }}
>
    <Icon name="x" class="size-4" />
</button>
