import { classes, type DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

/** Trusted HTML from the server, rendered as is. Never pass user input to `Html::make()`. */
export function Html({ field }: FieldComponentProps<DisplayFieldSchema>) {
    return (
        <div
            className={classes.displayHtml}
            dangerouslySetInnerHTML={{ __html: field.html ?? '' }}
        />
    );
}
