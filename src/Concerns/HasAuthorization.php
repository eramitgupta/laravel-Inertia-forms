<?php

namespace Erag\InertiaForms\Concerns;

use Closure;

trait HasAuthorization
{
    /** @var array<int, bool|Closure> */
    protected array $authorizationChecks = [];

    /**
     * Include this item only when the check passes.
     */
    public function authorize(bool|Closure $check): static
    {
        $this->authorizationChecks[] = $check;

        return $this;
    }

    public function authorizedWhen(bool|Closure $check): static
    {
        return $this->authorize($check);
    }

    public function authorizedUnless(bool|Closure $check): static
    {
        return $this->authorize(
            $check instanceof Closure ? fn (mixed ...$arguments): bool => ! $check(...$arguments) : ! $check,
        );
    }

    public function isAuthorized(): bool
    {
        foreach ($this->authorizationChecks as $check) {
            if (! (bool) value($check, $this)) {
                return false;
            }
        }

        return true;
    }
}
