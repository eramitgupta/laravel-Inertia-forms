import { headingClass, headingLevel } from '../../../core/src/features/display';
import type { DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

/** A heading inside the form: a real `h1`–`h4` element. */
export function Heading({ field }: FieldComponentProps<DisplayFieldSchema>) {
    const Tag = `h${headingLevel(field)}` as const;
    return <Tag className={headingClass(field)}>{field.text}</Tag>;
}
