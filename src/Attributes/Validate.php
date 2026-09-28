<?php

namespace Erag\InertiaForms\Attributes;

use Attribute;
use Erag\InertiaForms\Form;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Container\ContextualAttribute;
use InvalidArgumentException;
use ReflectionNamedType;
use ReflectionParameter;

/**
 * Resolve a form from the container and validate the current request with it.
 *
 *     public function store(#[Validate] CreateUserForm $form)
 */
#[Attribute(Attribute::TARGET_PARAMETER)]
final class Validate implements ContextualAttribute
{
    public function resolve(self $attribute, Container $container, ReflectionParameter $parameter): Form
    {
        $type = $parameter->getType();

        if (! $type instanceof ReflectionNamedType || ! is_subclass_of($type->getName(), Form::class)) {
            throw new InvalidArgumentException('#[Validate] can only be used on a parameter typed as a Form class.');
        }

        /** @var Form $form */
        $form = $container->make($type->getName());
        $form->validate($container->make('request'));

        return $form;
    }
}
