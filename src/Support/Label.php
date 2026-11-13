<?php

namespace Erag\InertiaForms\Support;

use Illuminate\Support\Str;

final class Label
{
    /**
     * The label for a field that has none: the app's translated attribute name
     * from `validation.attributes` when there is one, otherwise the name made
     * readable, like `billing.first_name` into `First name`.
     */
    public static function fromName(string $name): string
    {
        return self::fromAttributes($name) ?? self::headline($name);
    }

    /**
     * Turn a name like `billing.first_name` into `First name`.
     */
    public static function headline(string $name): string
    {
        $segment = Str::afterLast($name, '.');

        return Str::ucfirst(Str::lower(Str::headline($segment)));
    }

    /**
     * The name from the app's `validation.attributes` translations, matched on
     * the full name first and then on its last segment.
     */
    private static function fromAttributes(string $name): ?string
    {
        if (! function_exists('app') || ! app()->bound('translator')) {
            return null;
        }

        $attributes = app('translator')->get('validation.attributes');

        if (! is_array($attributes)) {
            return null;
        }

        foreach (array_unique([$name, Str::afterLast($name, '.')]) as $key) {
            if (isset($attributes[$key]) && is_string($attributes[$key]) && $attributes[$key] !== '') {
                return $attributes[$key];
            }
        }

        return null;
    }
}
