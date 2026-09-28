<script lang="ts">
    import { headingClass, headingLevel } from '../core/features/display';
    import type { DisplayFieldSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    /** A heading inside the form: a real `h1`–`h4` element. */
    let { field }: FieldComponentProps<DisplayFieldSchema> = $props();
</script>

<svelte:element this={`h${headingLevel(field)}`} class={headingClass(field)}
    >{field.text}</svelte:element
>
