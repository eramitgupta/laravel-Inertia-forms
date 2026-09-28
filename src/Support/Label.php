<?php

namespace Erag\InertiaForms\Support;

use Illuminate\Support\Str;

final class Label
{
    /**
     * Turn a field name like `billing.first_name` into `First name`.
     */
    public static function fromName(string $name): string
    {
        $segment = Str::afterLast($name, '.');

        return Str::ucfirst(Str::lower(Str::headline($segment)));
    }
}
