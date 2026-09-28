<script lang="ts">
    import { separatorClass } from '../core/features/display';
    import type { DisplayFieldSchema } from '../core';
    import type { FieldComponentProps } from '../types';

    /** A horizontal line between parts of the form. */
    let { field }: FieldComponentProps<DisplayFieldSchema> = $props();
</script>

<hr class={separatorClass(field)} />
