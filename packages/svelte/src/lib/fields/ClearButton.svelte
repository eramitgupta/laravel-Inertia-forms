<script lang="ts">
    import { classes } from '../core';
    import { useTranslate } from '../i18n.svelte';
    import Icon from '../Icon.svelte';

    interface Props {
        label: string;
        onClear: () => void;
    }

    let { label, onClear }: Props = $props();
    const t = useTranslate();
</script>

<button
    type="button"
    class={classes.iconButton}
    aria-label={t('action_clear_field', { label })}
    onclick={(event) => {
        event.stopPropagation();
        onClear();
    }}
>
    <Icon name="x" class="size-4" />
</button>
