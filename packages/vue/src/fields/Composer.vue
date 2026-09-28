<script setup lang="ts">
import { computed, ref, watchPostEffect } from 'vue';
import {
    addComposerAttachments,
    classes,
    composerAccept,
    composerHasRoom,
    composerValue,
    dragHasFiles,
    formatFileSize,
    type ComposerSchema,
    type ComposerValue,
} from '../../../core/src';
import { useFormContext } from '../context';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<ComposerSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const form = useFormContext();
const textarea = ref<HTMLTextAreaElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const sendButton = ref<HTMLButtonElement | null>(null);
const dragging = ref(false);
const current = computed(() => composerValue(props.modelValue));
const processing = computed(() => form?.processing ?? false);
const locked = computed(() => props.disabled || props.field.readonly);
const canAttach = computed(
    () =>
        props.field.attachments &&
        !locked.value &&
        composerHasRoom(props.field, current.value.attachments.length),
);
const showHint = computed(() => props.field.submitOnEnter && !locked.value);
const hintId = computed(() => `${props.id}-hint`);
const ariaDescribedBy = computed(
    () =>
        [props.describedBy, showHint.value ? hintId.value : null].filter(Boolean).join(' ') ||
        undefined,
);

watchPostEffect(() => {
    const element = textarea.value;
    // Track the message so the height follows every change.
    void current.value.message;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
});

function update(next: Partial<ComposerValue>) {
    emit('update:modelValue', { ...current.value, ...next });
}

function addFiles(list: FileList | null | undefined) {
    const picked = Array.from(list ?? []);
    if (fileInput.value) fileInput.value.value = '';
    if (!picked.length || !canAttach.value) return;
    update({
        attachments: addComposerAttachments(current.value.attachments, picked, props.field),
    });
}

function removeFile(index: number) {
    update({
        attachments: current.value.attachments.filter((_, position) => position !== index),
    });
}

function pickReply(reply: string) {
    update({ message: reply });
    textarea.value?.focus();
}

function send() {
    const button = sendButton.value;
    if (!button || button.disabled || !button.form) return;
    if (typeof button.form.requestSubmit === 'function') button.form.requestSubmit(button);
    else button.click();
}

function keydown(event: KeyboardEvent) {
    if (
        event.key !== 'Enter' ||
        event.shiftKey ||
        event.isComposing ||
        event.keyCode === 229 ||
        !props.field.submitOnEnter ||
        locked.value
    )
        return;
    event.preventDefault();
    send();
}

function dragover(event: DragEvent) {
    if (!props.field.attachments || locked.value || !dragHasFiles(event.dataTransfer)) return;
    event.preventDefault();
    dragging.value = true;
}

function drop(event: DragEvent) {
    if (!props.field.attachments || locked.value || !dragHasFiles(event.dataTransfer)) return;
    event.preventDefault();
    dragging.value = false;
    addFiles(event.dataTransfer?.files);
}
</script>

<template>
    <div :class="classes.composer">
        <div
            v-if="field.quickReplies.length > 0"
            role="group"
            aria-label="Quick replies"
            :class="classes.composerReplies"
        >
            <!-- prettier-ignore -->
            <button
                v-for="(reply, index) in field.quickReplies"
                :key="`${reply}-${index}`"
                type="button"
                :class="classes.composerReply"
                :disabled="locked"
                @click="pickReply(reply)"
            >{{ reply }}</button>
        </div>
        <div
            :class="classes.composerBox"
            :data-dragging="dragging ? '' : undefined"
            :data-disabled="locked ? '' : undefined"
            @dragover="dragover"
            @dragleave="dragging = false"
            @drop="drop"
        >
            <textarea
                :id="id"
                ref="textarea"
                :name="`${field.name}[message]`"
                :rows="field.rows"
                :value="current.message"
                :placeholder="field.placeholder ?? undefined"
                :disabled="disabled"
                :readonly="field.readonly"
                :autofocus="field.autofocus"
                :maxlength="field.maxLength ?? undefined"
                :aria-required="field.required || undefined"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="ariaDescribedBy"
                :class="classes.composerInput"
                @input="update({ message: ($event.target as HTMLTextAreaElement).value })"
                @keydown="keydown"
            />
            <div
                v-if="current.attachments.length > 0"
                role="list"
                aria-label="Attachments"
                :class="classes.composerFiles"
            >
                <div
                    v-for="(file, index) in current.attachments"
                    :key="`${file.name}-${index}`"
                    role="listitem"
                    :class="classes.composerFile"
                >
                    <span :class="classes.composerFileIcon" aria-hidden="true">
                        <Icon name="composerFile" :class="classes.composerFileGlyph" />
                    </span>
                    <span :class="classes.composerFileText">
                        <span :class="classes.composerFileName" :title="file.name">{{
                            file.name
                        }}</span>
                        <span :class="classes.composerFileSize">{{
                            formatFileSize(file.size)
                        }}</span>
                    </span>
                    <button
                        v-if="!locked"
                        type="button"
                        :class="classes.composerFileRemove"
                        :aria-label="`Remove ${file.name}`"
                        @click="removeFile(index)"
                    >
                        <Icon name="x" :class="classes.composerRemoveIcon" />
                    </button>
                </div>
            </div>
            <div :class="classes.composerFooter">
                <template v-if="field.attachments">
                    <button
                        type="button"
                        :class="classes.composerAttach"
                        title="Attach files"
                        aria-label="Attach files"
                        :aria-controls="`${id}-files`"
                        :disabled="!canAttach"
                        @click="fileInput?.click()"
                    >
                        <Icon name="composerPaperclip" :class="classes.composerAttachIcon" />
                    </button>
                    <input
                        :id="`${id}-files`"
                        ref="fileInput"
                        :name="`${field.name}[attachments][]`"
                        type="file"
                        :class="classes.visuallyHidden"
                        :tabindex="-1"
                        aria-hidden="true"
                        multiple
                        :accept="composerAccept(field.accept)"
                        :disabled="!canAttach"
                        @change="addFiles(($event.target as HTMLInputElement).files)"
                    />
                </template>
                <div :class="classes.composerActions">
                    <span v-if="field.maxLength !== null" :class="classes.composerCounter">{{
                        `${current.message.length} / ${field.maxLength}`
                    }}</span>
                    <button
                        ref="sendButton"
                        type="submit"
                        :class="classes.composerSend"
                        :disabled="locked || processing"
                        :aria-busy="processing || undefined"
                    >
                        {{ field.sendLabel }}
                        <span v-if="processing" :class="classes.spinner" aria-hidden="true" />
                        <Icon v-else name="composerSend" :class="classes.composerSendIcon" />
                    </button>
                </div>
            </div>
        </div>
        <p v-if="showHint" :id="hintId" :class="classes.composerHint">
            Press <kbd :class="classes.composerKbd">Enter</kbd> to send,
            <kbd :class="classes.composerKbd">Shift + Enter</kbd> for new line
        </p>
    </div>
</template>
