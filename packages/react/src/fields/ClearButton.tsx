import { classes } from '../../../core/src';
import { useTranslate } from '../i18n';
import { Icon } from '../Icon';

export function ClearButton({ label, onClear }: { label: string; onClear: () => void }) {
    const t = useTranslate();
    return (
        <button
            type="button"
            className={classes.iconButton}
            aria-label={t('action_clear_field', { label })}
            onClick={(event) => {
                event.stopPropagation();
                onClear();
            }}
        >
            <Icon name="x" className="size-4" />
        </button>
    );
}
