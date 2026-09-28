<?php

namespace Erag\InertiaForms\Fields;

use Erag\InertiaForms\Support\Icon;
use InvalidArgumentException;

/**
 * The submit button. `Submit::make('Save')` sets the button text.
 */
class Submit extends Field
{
    public const array VARIANTS = ['primary', 'secondary', 'danger', 'outline', 'ghost', 'link'];

    public const array SIZES = ['sm', 'md', 'lg'];

    protected ?string $processingLabel = null;

    protected string $variant = 'primary';

    protected string $size = 'md';

    protected bool $fullWidth = false;

    protected ?string $icon = null;

    protected string $iconPosition = 'left';

    protected ?string $intentKey = null;

    protected ?string $intentValue = null;

    protected bool $disableUntilDirty = false;

    public function component(): string
    {
        return 'Submit';
    }

    public function getLabel(): string
    {
        return $this->label ?? $this->name;
    }

    /**
     * Button text while the form is submitting.
     */
    public function processingLabel(?string $label): static
    {
        $this->processingLabel = $label;

        return $this;
    }

    /**
     * Visual style: primary, secondary, danger, outline, ghost or link.
     */
    public function variant(string $variant): static
    {
        if (! in_array($variant, self::VARIANTS, true)) {
            throw new InvalidArgumentException("Unknown submit variant [{$variant}].");
        }

        $this->variant = $variant;

        return $this;
    }

    public function primary(): static
    {
        return $this->variant('primary');
    }

    public function secondary(): static
    {
        return $this->variant('secondary');
    }

    public function danger(): static
    {
        return $this->variant('danger');
    }

    public function outline(): static
    {
        return $this->variant('outline');
    }

    public function ghost(): static
    {
        return $this->variant('ghost');
    }

    public function link(): static
    {
        return $this->variant('link');
    }

    /**
     * Button size: sm, md or lg.
     */
    public function size(string $size): static
    {
        if (! in_array($size, self::SIZES, true)) {
            throw new InvalidArgumentException("Unknown submit size [{$size}].");
        }

        $this->size = $size;

        return $this;
    }

    public function small(): static
    {
        return $this->size('sm');
    }

    public function large(): static
    {
        return $this->size('lg');
    }

    /**
     * Stretch the button across its container.
     */
    public function fullWidth(bool $fullWidth = true): static
    {
        $this->fullWidth = $fullWidth;

        return $this;
    }

    /**
     * An icon name, e.g. `user`, `check`, `send`, `arrowRight` or `rocket`.
     */
    public function icon(?string $icon, string $position = 'left'): static
    {
        $this->icon = $icon;
        $this->iconPosition = $position === 'right' ? 'right' : 'left';

        return $this;
    }

    /**
     * Send `$key => $value` with the form when this button is clicked, so a
     * form can have several actions, e.g. "Save draft" and "Publish".
     */
    public function intent(string $value, string $key = 'intent'): static
    {
        $this->intentKey = $key;
        $this->intentValue = $value;

        return $this;
    }

    /**
     * Keep the button disabled until the user changes a value, e.g. a
     * "Save changes" button on an edit form.
     */
    public function disableUntilDirty(bool $disable = true): static
    {
        $this->disableUntilDirty = $disable;

        return $this;
    }

    /**
     * @return array{key: string, value: string}|null
     */
    public function getIntent(): ?array
    {
        return $this->intentKey === null || $this->intentValue === null
            ? null
            : ['key' => $this->intentKey, 'value' => $this->intentValue];
    }

    public function hasValue(): bool
    {
        return false;
    }

    public function validationRules(): array
    {
        return [];
    }

    protected function props(): array
    {
        return [
            'processingLabel' => $this->processingLabel,
            'variant' => $this->variant,
            'size' => $this->size,
            'fullWidth' => $this->fullWidth,
            'icon' => $this->icon,
            'iconPosition' => $this->iconPosition,
            'iconSvg' => Icon::svg($this->icon),
            'intent' => $this->getIntent(),
            'disableUntilDirty' => $this->disableUntilDirty,
        ];
    }
}
