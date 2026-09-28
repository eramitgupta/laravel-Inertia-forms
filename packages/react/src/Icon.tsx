import { icons, type IconName } from '../../core/src';

interface IconProps {
    /** A built-in icon. */
    name?: IconName | null;
    /** SVG markup sent by Laravel for other icons, used instead of `name`. */
    svg?: string | null;
    className?: string;
}

export function Icon({ name, svg, className }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            {svg ? (
                <g dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
                name && <path d={icons[name]} />
            )}
        </svg>
    );
}
