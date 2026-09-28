import { classes } from '../../../core/src';
import { Icon } from '../Icon';

export function ClearButton({ label, onClear }: { label: string; onClear: () => void }) {
    return (
        <button
            type="button"
            className={classes.iconButton}
            aria-label={`Clear ${label}`}
            onClick={(event) => {
                event.stopPropagation();
                onClear();
            }}
        >
            <Icon name="x" className="size-4" />
        </button>
    );
}
