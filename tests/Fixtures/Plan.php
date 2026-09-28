<?php

namespace Erag\InertiaForms\Tests\Fixtures;

enum Plan: string
{
    case Free = 'free';
    case Team = 'team';

    public function label(): string
    {
        return ucfirst($this->value).' plan';
    }
}
