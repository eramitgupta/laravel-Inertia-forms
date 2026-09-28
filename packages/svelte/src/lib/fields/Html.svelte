<script lang="ts">
    import { classes, type DisplayFieldSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    /** Trusted HTML from the server, rendered as is. Never pass user input to `Html::make()`. */
    let { field }: FieldComponentProps<DisplayFieldSchema> = $props();
</script>

<div class={classes.displayHtml}>{@html field.html ?? ''}</div>
