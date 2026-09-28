<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { classes, slugify, slugSource, type SlugSchema } from '../../../core/src';
import { useFormContext } from '../context';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/**
 * A URL-safe slug that follows the `from` field until it is edited by hand.
 * Clearing it follows the source again; the button regenerates it on demand.
 */
const props = defineProps<FieldComponentProps<SlugSchema>>();
const emit = defineEmits<FieldComponentEmits>();
const form = useFormContext();

const text = computed(() =>
    typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
        ? String(props.modelValue)
        : '',
);
const options = computed(() => ({
    separator: props.field.separator,
    lowercase: props.field.lowercase,
    maxLength: props.field.maxLength,
}));
const follows = computed(() => Boolean(form && props.field.from));
const generated = computed(() =>
    follows.value
        ? slugify(slugSource(form?.data, props.field.name, props.field.from), options.value)
        : '',
);
const manual = ref(follows.value && text.value !== '' && text.value !== generated.value);
const syncing = computed(() => follows.value && !manual.value && !props.disabled);

function sync() {
    if (syncing.value && text.value !== generated.value) {
        emit('update:modelValue', generated.value);
    }
}

onMounted(sync);
watch([syncing, generated, text], sync);

function input(event: Event) {
    const next = (event.target as HTMLInputElement).value;
    manual.value = follows.value && next !== '';
    emit('update:modelValue', next);
}

function blur(event: Event) {
    const typed = (event.target as HTMLInputElement).value;
    const slug = slugify(typed, options.value);
    manual.value = follows.value && slug !== '' && slug !== generated.value;
    if (slug !== typed) emit('update:modelValue', slug);
}

function regenerate() {
    manual.value = false;
    if (text.value !== generated.value) emit('update:modelValue', generated.value);
}
</script>

<template>
    <div :class="classes.inputGroup">
        <span v-if="field.prefix" :class="classes.slugPrefix">{{ field.prefix }}</span>
        <input
            :id="id"
            :name="field.name"
            type="text"
            :value="text"
            :placeholder="field.placeholder ?? undefined"
            :required="field.required"
            :disabled="disabled"
            :readonly="field.readonly"
            :autofocus="field.autofocus"
            autocomplete="off"
            autocapitalize="off"
            :spellcheck="false"
            :maxlength="field.maxLength ?? undefined"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :class="classes.inputGroupInput"
            @input="input"
            @blur="blur"
        />
        <span
            v-if="follows && manual && generated !== '' && !disabled && !field.readonly"
            :class="classes.addonEnd"
        >
            <button
                type="button"
                :class="classes.iconButton"
                :aria-label="`Regenerate ${field.label}`"
                :title="`Regenerate ${field.label}`"
                @click="regenerate"
            >
                <Icon name="slugRegenerate" class="size-4" />
            </button>
        </span>
    </div>
</template>
