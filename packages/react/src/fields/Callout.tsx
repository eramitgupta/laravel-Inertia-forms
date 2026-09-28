import { calloutParts } from '../../../core/src/features/display';
import { classes, icons, type DisplayFieldSchema, type IconName } from '../../../core/src';
import { Icon } from '../Icon';
import type { FieldComponentProps } from '../types';

/** A notice inside the form, tinted by its tone (info, success, warning, danger). */
export function Callout({ field }: FieldComponentProps<DisplayFieldSchema>) {
    const callout = calloutParts(field, icons);
    return (
        <div role={callout.role} data-tone={callout.tone} className={callout.className}>
            <Icon name={callout.icon as IconName} svg={callout.svg} className={callout.iconClass} />
            <div className={classes.calloutContent}>
                {field.title && <p className={classes.calloutTitle}>{field.title}</p>}
                {field.body && <p className={classes.calloutBody}>{field.body}</p>}
            </div>
        </div>
    );
}
