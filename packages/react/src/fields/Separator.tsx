import { separatorClass } from '../../../core/src/features/display';
import type { DisplayFieldSchema } from '../../../core/src';
import type { FieldComponentProps } from '../types';

/** A horizontal line between parts of the form. */
export function Separator({ field }: FieldComponentProps<DisplayFieldSchema>) {
    return <hr className={separatorClass(field)} />;
}
