import { useContext, useState } from 'react';
import {
    classes,
    cx,
    submitButtonClass,
    submitIconClass,
    submitIconName,
    type SubmitSize,
    type SubmitVariant,
} from '../../../core/src';
import { Icon } from '../Icon';
import { useFormContext } from '../context';
import { SubmitterContext } from '../submitter';

interface SubmitButtonProps {
    label: string;
    processingLabel?: string | null;
    processing: boolean;
    disabled?: boolean;
    className?: string | null;
    variant?: SubmitVariant;
    size?: SubmitSize;
    /** Stretch the button across its row. */
    fullWidth?: boolean;
    /** A package icon name shown next to the label. */
    icon?: string | null;
    iconPosition?: 'left' | 'right';
    /** SVG markup for an icon the package doesn't draw itself; used instead of `icon`. */
    iconSvg?: string | null;
    /** Sent with the form as `key=value` when this button submits it. */
    intent?: { key: string; value: string } | null;
    /** Stay disabled until the surrounding `<Form>` has unsaved changes. */
    disableUntilDirty?: boolean;
}

export function SubmitButton({
    label,
    processingLabel,
    processing,
    disabled,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    iconSvg,
    intent,
    disableUntilDirty = false,
}: SubmitButtonProps) {
    const form = useFormContext();
    // Outside a <Form> there is no dirty state, so the option has no effect.
    const clean = disableUntilDirty && form !== null && !form.isDirty;
    const [button, setButton] = useState<HTMLButtonElement | null>(null);
    const submitter = useContext(SubmitterContext);
    // Only the button that submitted the form shows the processing state.
    const busy = processing && (!submitter || submitter === button);
    const svg = busy ? null : (iconSvg ?? null);
    const iconName = busy || svg ? null : submitIconName(icon);
    const iconElement = (iconName || svg) && (
        <Icon name={iconName} svg={svg} className={submitIconClass(size)} />
    );

    return (
        <div className={cx(classes.submitRow, fullWidth && classes.submitRowFull, className)}>
            <button
                ref={setButton}
                type="submit"
                name={intent?.key}
                value={intent?.value}
                className={submitButtonClass(variant, size, fullWidth)}
                disabled={processing || disabled || clean}
                aria-busy={busy || undefined}
            >
                {busy && <span className={classes.submitSpinner} aria-hidden="true" />}
                {iconPosition !== 'right' && iconElement}
                {busy && processingLabel ? processingLabel : label}
                {iconPosition === 'right' && iconElement}
            </button>
        </div>
    );
}
