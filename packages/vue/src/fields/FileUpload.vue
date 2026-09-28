<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import {
    classes,
    cx,
    fileUploadHint,
    formatFileSize,
    type FileUploadSchema,
} from '../../../core/src';
import Icon from '../Icon.vue';
import type { FieldComponentEmits, FieldComponentProps } from '../types';

const props = defineProps<FieldComponentProps<FileUploadSchema>>();
const emit = defineEmits<FieldComponentEmits>();

const input = ref<HTMLInputElement | null>(null);
const dragging = ref(false);
const files = computed(() =>
    (props.field.multiple
        ? Array.isArray(props.modelValue)
            ? props.modelValue
            : []
        : props.modelValue
          ? [props.modelValue]
          : []
    ).filter((item): item is File => item instanceof File),
);
const previews = computed(() =>
    files.value.map((file) =>
        props.field.image && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    ),
);
const locked = computed(() => props.disabled || props.field.readonly);
const hint = computed(() => fileUploadHint(props.field));

watchEffect((onCleanup) => {
    const urls = previews.value;
    onCleanup(() => urls.forEach((url) => url && URL.revokeObjectURL(url)));
});

function add(list: FileList | null | undefined) {
    const picked = Array.from(list ?? []);
    if (!picked.length) return;
    if (!props.field.multiple) {
        emit('update:modelValue', picked[0]);
    } else {
        const next = [...files.value, ...picked];
        emit(
            'update:modelValue',
            props.field.maxFiles ? next.slice(0, props.field.maxFiles) : next,
        );
    }
    if (input.value) input.value.value = '';
}

function remove(index: number) {
    emit(
        'update:modelValue',
        props.field.multiple ? files.value.filter((_, position) => position !== index) : null,
    );
}

function browse() {
    if (!locked.value) input.value?.click();
}

function keydown(event: KeyboardEvent) {
    if (!locked.value && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        input.value?.click();
    }
}

function dragover(event: DragEvent) {
    event.preventDefault();
    if (!locked.value) dragging.value = true;
}

function drop(event: DragEvent) {
    event.preventDefault();
    dragging.value = false;
    if (!locked.value) add(event.dataTransfer?.files);
}
</script>

<template>
    <div class="grid gap-3">
        <div
            role="button"
            :tabindex="locked ? -1 : 0"
            :aria-disabled="locked || undefined"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="describedBy"
            :class="cx(classes.dropzone, dragging && classes.dropzoneActive)"
            @click="browse"
            @keydown="keydown"
            @dragover="dragover"
            @dragleave="dragging = false"
            @drop="drop"
        >
            <Icon name="upload" :class="classes.dropzoneIcon" />
            <span :class="classes.dropzoneTitle"
                ><template v-if="field.placeholder !== null && field.placeholder !== undefined">{{
                    field.placeholder
                }}</template
                ><template v-else
                    ><span :class="classes.dropzoneLink">Click to upload</span> or drag and
                    drop</template
                ></span
            >
            <span v-if="hint" :class="classes.dropzoneHint">{{ hint }}</span>
        </div>
        <input
            :id="id"
            ref="input"
            :name="field.multiple ? `${field.name}[]` : field.name"
            type="file"
            class="sr-only"
            :tabindex="-1"
            :multiple="field.multiple"
            :accept="field.accept ?? undefined"
            :disabled="locked"
            @change="add(($event.target as HTMLInputElement).files)"
        />
        <div role="list" v-if="files.length > 0" :class="classes.fileList">
            <div
                role="listitem"
                v-for="(file, index) in files"
                :key="`${file.name}-${index}`"
                :class="classes.fileItem"
            >
                <img
                    v-if="previews[index]"
                    :src="previews[index]!"
                    alt=""
                    :class="classes.filePreview"
                />
                <span :class="classes.fileName">{{ file.name }}</span>
                <span :class="classes.fileSize">{{ formatFileSize(file.size) }}</span>
                <!-- prettier-ignore -->
                <button
                    v-if="!locked"
                    type="button"
                    :class="classes.fileRemove"
                    @click="remove(index)"
                >Remove</button>
            </div>
        </div>
    </div>
</template>
