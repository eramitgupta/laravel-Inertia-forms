import { classes, type DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

/** A paragraph of plain (escaped) text inside the form. */
export function Text({ field }: FieldComponentProps<DisplayFieldSchema>) {
    return <p className={classes.displayText}>{field.text}</p>;
}
