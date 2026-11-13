<script setup lang="ts">
import {
    classes,
    wizardCircleClass,
    wizardProgress,
    wizardProgressText,
    wizardStepIcon,
    wizardStepLabel,
    wizardStepState,
    type FieldsetSchema,
} from '../../core/src';
import { translated, useTranslate } from './i18n';
import Icon from './Icon.vue';

/**
 * The stepper above a wizard form. Completed steps are buttons that go back;
 * narrow screens only show the current step.
 */
defineProps<{
    steps: FieldsetSchema[];
    current: number;
}>();

const emit = defineEmits<{
    /** Go back to a completed step. */
    select: [index: number];
}>();

const t = useTranslate();
const progressText = translated(wizardProgressText);
const stepLabel = translated(wizardStepLabel);
</script>

<template>
    <nav :aria-label="t('wizard_progress_label')" :class="classes.wizardNav">
        <div v-if="steps[current]" :class="classes.wizardCompact">
            <p :class="classes.wizardCompactCount">
                {{ progressText(current, steps.length) }}
            </p>
            <p :class="classes.wizardCompactTitle">
                {{ stepLabel(steps[current]!, current) }}
            </p>
            <div :class="classes.wizardCompactTrack" aria-hidden="true">
                <span
                    :class="classes.wizardCompactBar"
                    :style="{ width: wizardProgress(current, steps.length) }"
                />
            </div>
        </div>
        <ol :class="classes.wizardList">
            <li
                v-for="(fieldset, index) in steps"
                :key="fieldset.id ?? index"
                :class="classes.wizardItem"
                :aria-current="index === current ? 'step' : undefined"
            >
                <component
                    :is="index < current ? 'button' : 'div'"
                    v-bind="index < current ? { type: 'button' } : {}"
                    :class="index < current ? classes.wizardStepButton : classes.wizardStepStatic"
                    @click="index < current && emit('select', index)"
                >
                    <span
                        :class="wizardCircleClass(wizardStepState(index, current))"
                        aria-hidden="true"
                    >
                        <Icon
                            v-if="index < current"
                            name="check"
                            :class="classes.wizardCircleIcon"
                        />
                        <Icon
                            v-else-if="wizardStepIcon(fieldset) || fieldset.iconSvg"
                            :name="wizardStepIcon(fieldset)"
                            :svg="fieldset.iconSvg"
                            :class="classes.wizardCircleIcon"
                        />
                        <template v-else>{{ index + 1 }}</template>
                    </span>
                    <span :class="classes.wizardStepText">
                        <span
                            :class="
                                index > current
                                    ? classes.wizardStepTitleUpcoming
                                    : classes.wizardStepTitle
                            "
                        >
                            {{ stepLabel(fieldset, index) }}
                        </span>
                        <span v-if="fieldset.description" :class="classes.wizardStepDescription">
                            {{ fieldset.description }}
                        </span>
                    </span>
                </component>
                <span
                    v-if="index < steps.length - 1"
                    aria-hidden="true"
                    :class="
                        index < current ? classes.wizardConnectorComplete : classes.wizardConnector
                    "
                />
            </li>
        </ol>
    </nav>
</template>
