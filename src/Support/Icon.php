<?php

namespace Erag\InertiaForms\Support;

use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * Resolves the icon names used by `icon()`.
 *
 * The frontend packages draw the built-in icons themselves. Every other icon,
 * from the package's icon set or registered by the app, is sent with the form
 * as SVG markup, so it adds nothing to the JavaScript bundle.
 */
final class Icon
{
    /**
     * Icons the frontend packages draw themselves.
     *
     * @var list<string>
     */
    public const array BUILT_IN = [
        'x', 'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight', 'chevronsLeft', 'chevronsRight',
        'check', 'calendar', 'clock', 'grip', 'upload', 'plus', 'trash', 'eyedropper', 'copy',
        'composerPaperclip', 'composerFile', 'composerSend', 'circleInfo', 'circleCheck', 'triangleAlert',
        'circleX', 'linkChain', 'slugRegenerate', 'send', 'arrowRight', 'arrowLeft', 'save', 'user',
        'briefcase', 'shield', 'mail', 'lock', 'mapPin', 'creditCard', 'sliders', 'fileText', 'home', 'flag',
    ];

    /**
     * @var array<string, string>|null
     */
    private static ?array $set = null;

    /**
     * @var array<string, string>
     */
    private static array $registered = [];

    /**
     * Add an icon, or replace one, for every form. `$svg` is the inside of a
     * 24×24 stroke icon (`<path d="…"/>…`), a bare path `d` value, or a full
     * `<svg>` element whose inner markup is used.
     *
     *     Icon::register('bolt', '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>');
     */
    public static function register(string $name, string $svg): void
    {
        self::$registered[self::normalize($name)] = self::markup($svg);
    }

    /**
     * The SVG markup to send for an icon name, or `null` when the frontend
     * draws it itself or the name is unknown.
     */
    public static function svg(?string $name): ?string
    {
        if ($name === null || trim($name) === '') {
            return null;
        }

        $key = self::normalize($name);
        $configured = config('inertia-forms.icons', []);

        if (isset(self::$registered[$key])) {
            return self::$registered[$key];
        }

        foreach (is_array($configured) ? $configured : [] as $configuredName => $svg) {
            if (is_string($configuredName) && is_string($svg) && self::normalize($configuredName) === $key) {
                return self::markup($svg);
            }
        }

        if (in_array($key, self::BUILT_IN, true)) {
            return null;
        }

        $path = self::set()[$key] ?? null;

        return $path === null ? null : '<path d="'.e($path).'"/>';
    }

    /**
     * Whether `icon($name)` shows an icon.
     */
    public static function exists(string $name): bool
    {
        $key = self::normalize($name);

        return in_array($key, self::BUILT_IN, true) || self::svg($name) !== null;
    }

    /**
     * Every icon name available to `icon()`, built-in and registered ones included.
     *
     * @return list<string>
     */
    public static function names(): array
    {
        $configured = array_map(self::normalize(...), array_filter(
            array_keys((array) config('inertia-forms.icons', [])),
            is_string(...),
        ));

        return array_values(array_unique([
            ...self::BUILT_IN,
            ...array_keys(self::set()),
            ...$configured,
            ...array_keys(self::$registered),
        ]));
    }

    /**
     * Forget the icons added with `register()`.
     */
    public static function flushRegistered(): void
    {
        self::$registered = [];
    }

    /**
     * `map-pin`, `map_pin` and `MapPin` all mean `mapPin`.
     */
    private static function normalize(string $name): string
    {
        return Str::camel(trim($name));
    }

    /**
     * The icon set shipped with the package, as name => path `d` value. The
     * file groups the icons by category for the docs; the groups are merged.
     *
     * @return array<string, string>
     */
    private static function set(): array
    {
        return self::$set ??= array_merge(...array_values(json_decode(
            (string) file_get_contents(__DIR__.'/../../resources/icons/icons.json'),
            true,
            flags: JSON_THROW_ON_ERROR,
        )));
    }

    private static function markup(string $svg): string
    {
        $svg = trim($svg);

        if (! str_contains($svg, '<')) {
            return '<path d="'.e($svg).'"/>';
        }

        if (preg_match('/^<svg\b[^>]*>(.*)<\/svg>$/is', $svg, $match) === 1) {
            $svg = trim($match[1]);
        }

        if (preg_match('/<\s*(script|foreignObject|iframe|image|use)\b|\son\w+\s*=|javascript:/i', $svg) === 1) {
            throw new InvalidArgumentException('Icons may only contain plain SVG shapes, without scripts, event handlers or external references.');
        }

        return $svg;
    }
}
