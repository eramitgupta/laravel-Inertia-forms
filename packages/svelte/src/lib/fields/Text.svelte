<script lang="ts">
    import { classes, type DisplayFieldSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    /** A paragraph of plain (escaped) text inside the form. */
    let { field }: FieldComponentProps<DisplayFieldSchema> = $props();
</script>

<p class={classes.displayText}>{field.text}</p>
