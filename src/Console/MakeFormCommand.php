<?php

namespace Erag\InertiaForms\Console;

use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'make:form')]
class MakeFormCommand extends GeneratorCommand
{
    protected $name = 'make:form';

    protected $description = 'Create a new Inertia form class';

    protected $type = 'Form';

    protected function getStub(): string
    {
        $published = $this->laravel->basePath('stubs/inertia-form.stub');

        return file_exists($published) ? $published : __DIR__.'/../../stubs/inertia-form.stub';
    }

    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace.'\Forms';
    }
}
