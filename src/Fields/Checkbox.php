<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Fields\Concerns\HasBooleanValues;

class Checkbox extends Field
{
    use HasBooleanValues;

    public function component(): string
    {
        return 'Checkbox';
    }

    protected function props(): array
    {
        return $this->booleanProps();
    }
}
