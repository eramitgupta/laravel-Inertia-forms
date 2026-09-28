import {
    classes,
    wizardCircleClass,
    wizardProgress,
    wizardStepIcon,
    wizardStepLabel,
    wizardStepState,
    type FieldsetSchema,
} from '../../core/src';
import { Icon } from './Icon';

interface WizardStepsProps {
    steps: FieldsetSchema[];
    current: number;
    /** Go back to a completed step. */
    onSelect: (index: number) => void;
}

/**
 * The stepper above a wizard form. Completed steps are buttons that go back;
 * narrow screens only show the current step.
 */
export function WizardSteps({ steps, current, onSelect }: WizardStepsProps) {
    const currentStep = steps[current];

    return (
        <nav aria-label="Progress" className={classes.wizardNav}>
            {currentStep && (
                <div className={classes.wizardCompact}>
                    <p className={classes.wizardCompactCount}>
                        {`Step ${current + 1} of ${steps.length}`}
                    </p>
                    <p className={classes.wizardCompactTitle}>
                        {wizardStepLabel(currentStep, current)}
                    </p>
                    <div className={classes.wizardCompactTrack} aria-hidden="true">
                        <span
                            className={classes.wizardCompactBar}
                            style={{ width: wizardProgress(current, steps.length) }}
                        />
                    </div>
                </div>
            )}
            <ol className={classes.wizardList}>
                {steps.map((fieldset, index) => {
                    const state = wizardStepState(index, current);
                    const icon = wizardStepIcon(fieldset);
                    const content = (
                        <>
                            <span className={wizardCircleClass(state)} aria-hidden="true">
                                {state === 'complete' ? (
                                    <Icon name="check" className={classes.wizardCircleIcon} />
                                ) : icon || fieldset.iconSvg ? (
                                    <Icon
                                        name={icon}
                                        svg={fieldset.iconSvg}
                                        className={classes.wizardCircleIcon}
                                    />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span className={classes.wizardStepText}>
                                <span
                                    className={
                                        state === 'upcoming'
                                            ? classes.wizardStepTitleUpcoming
                                            : classes.wizardStepTitle
                                    }
                                >
                                    {wizardStepLabel(fieldset, index)}
                                </span>
                                {fieldset.description && (
                                    <span className={classes.wizardStepDescription}>
                                        {fieldset.description}
                                    </span>
                                )}
                            </span>
                        </>
                    );

                    return (
                        <li
                            key={fieldset.id ?? index}
                            className={classes.wizardItem}
                            aria-current={state === 'current' ? 'step' : undefined}
                        >
                            {state === 'complete' ? (
                                <button
                                    type="button"
                                    className={classes.wizardStepButton}
                                    onClick={() => onSelect(index)}
                                >
                                    {content}
                                </button>
                            ) : (
                                <div className={classes.wizardStepStatic}>{content}</div>
                            )}
                            {index < steps.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className={
                                        index < current
                                            ? classes.wizardConnectorComplete
                                            : classes.wizardConnector
                                    }
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
