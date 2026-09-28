<script setup lang="ts">
import { computed } from 'vue';
import {
    classes,
    linkParts,
    linkSchemeHint,
    linkValue,
    type LinkParts,
    type LinkSchema,
} from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

/**
 * A URL with a link icon. `structured` fields add an optional link text box
 * and a "Same tab / New tab" choice and store `{ url, label?, target? }`.
 */
const props = defineProps<FieldComponentProps<LinkSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const TARGETS = [
    { value: '_self', label: 'Same tab' },
    { value: '_blank', label: 'New tab' },
] as const;

const parts = computed(() => linkParts(props.modelValue));
const hint = computed(() => linkSchemeHint(props.field, parts.value.url));
const hintId = computed(() => `${props.id}-hint`);
const locked = computed(() => props.disabled || props.field.readonly);
const urlDescribedBy = computed(() =>
    [props.describedBy, hint.value ? hintId.value : null].filter(Boolean).join(' '),
);

function update(changes: Partial<LinkParts>) {
    emit('update:modelValue', linkValue(props.field, { ...parts.value, ...changes }));
}

function blur(event: Event) {
    const trimmed = (event.target as HTMLInputElement).value.trim();
    if (trimmed !== parts.value.url) update({ url: trimmed });
}
</script>

<template>
    <div :class="classes.link">
        <div :class="classes.inputGroup">
            <span :class="classes.linkIcon">
                <Icon name="linkChain" class="size-4" />
            </span>
            <input
                :id="id"
                :name="field.structured ? `${field.name}[url]` : field.name"
                type="url"
                inputmode="url"
                autocomplete="url"
                :value="parts.url"
                :placeholder="field.placeholder ?? 'https://example.com'"
                :required="field.required"
                :disabled="disabled"
                :readonly="field.readonly"
                :autofocus="field.autofocus"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="urlDescribedBy || undefined"
                :class="classes.inputGroupInput"
                @input="update({ url: ($event.target as HTMLInputElement).value })"
                @blur="blur"
            />
        </div>
        <div
            v-if="field.structured && (field.withLabel || field.withTarget)"
            :class="classes.linkOptions"
        >
            <div v-if="field.withLabel" :class="classes.linkText">
                <input
                    :id="`${id}-text`"
                    :name="`${field.name}[label]`"
                    type="text"
                    :value="parts.label"
                    :placeholder="field.labelPlaceholder ?? 'Link text'"
                    :disabled="disabled"
                    :readonly="field.readonly"
                    :aria-label="`${field.label} text`"
                    :aria-invalid="error ? true : undefined"
                    :class="classes.input"
                    @input="update({ label: ($event.target as HTMLInputElement).value })"
                />
            </div>
            <div
                v-if="field.withTarget"
                role="radiogroup"
                :aria-label="`Open ${field.label} in`"
                :class="classes.segmented"
            >
                <label v-for="target in TARGETS" :key="target.value" :class="classes.segment">
                    <input
                        :id="`${id}-target${target.value}`"
                        type="radio"
                        :name="`${field.name}[target]`"
                        :value="target.value"
                        :checked="
                            target.value === '_blank'
                                ? parts.target === '_blank'
                                : parts.target !== '_blank'
                        "
                        :disabled="locked"
                        :class="classes.visuallyHidden"
                        @change="update({ target: target.value })"
                    />{{ target.label }}
                </label>
            </div>
        </div>
        <p v-if="hint" :id="hintId" :class="classes.linkHint">{{ hint }}</p>
    </div>
</template>
