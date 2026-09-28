<?php

namespace Erag\InertiaForms\Concerns;

use Erag\InertiaForms\Support\Condition;

trait HasVisibility
{
    /** @var array<int, Condition> */
    protected array $visibilityConditions = [];

    /**
     * Show only when another field matches. Pass a value, or an operator and value.
     */
    public function visibleWhen(string $field, mixed ...$arguments): static
    {
        $this->visibilityConditions[] = Condition::fromArguments($field, $arguments);

        return $this;
    }

    /**
     * Hide when another field matches. Pass a value, or an operator and value.
     */
    public function hiddenWhen(string $field, mixed ...$arguments): static
    {
        $this->visibilityConditions[] = Condition::fromArguments($field, $arguments, negate: true);

        return $this;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function isVisibleFor(array $data): bool
    {
        foreach ($this->visibilityConditions as $condition) {
            if (! $condition->passes($data)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array<int, Condition>|null
     */
    protected function serializeVisibility(): ?array
    {
        return $this->visibilityConditions === [] ? null : $this->visibilityConditions;
    }
}
