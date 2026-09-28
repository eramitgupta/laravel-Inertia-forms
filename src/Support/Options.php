<?php

namespace Erag\InertiaForms\Support;

use BackedEnum;
use Illuminate\Contracts\Support\Arrayable;
use UnitEnum;

final class Options
{
    /**
     * Normalize every supported option source into a list of
     * `['value' => ..., 'label' => ..., 'description' => ..., 'disabled' => ...]`.
     *
     * Accepts `['a' => 'Label']`, `['a', 'b']`, a list of option arrays,
     * a Collection, or a backed enum class name.
     *
     * @return array<int, array{value: mixed, label: string, description: ?string, disabled: bool}>
     */
    public static function normalize(mixed $source): array
    {
        if (is_string($source) && enum_exists($source)) {
            return array_map(self::fromEnum(...), $source::cases());
        }

        if ($source instanceof Arrayable) {
            $source = $source->toArray();
        }

        $source = (array) $source;
        $isList = array_is_list($source);
        $options = [];

        foreach ($source as $key => $option) {
            $options[] = match (true) {
                $option instanceof UnitEnum => self::fromEnum($option),
                is_array($option) => [
                    'value' => $option['value'] ?? $option['id'] ?? $key,
                    'label' => (string) ($option['label'] ?? $option['name'] ?? $option['value'] ?? $key),
                    'description' => $option['description'] ?? null,
                    'disabled' => (bool) ($option['disabled'] ?? false),
                ],
                $isList => ['value' => $option, 'label' => (string) $option, 'description' => null, 'disabled' => false],
                default => ['value' => $key, 'label' => (string) $option, 'description' => null, 'disabled' => false],
            };
        }

        return $options;
    }

    /**
     * @return array{value: mixed, label: string, description: ?string, disabled: bool}
     */
    private static function fromEnum(UnitEnum $case): array
    {
        return [
            'value' => $case instanceof BackedEnum ? $case->value : $case->name,
            'label' => method_exists($case, 'label') ? (string) $case->label() : Label::fromName($case->name),
            'description' => method_exists($case, 'description') ? $case->description() : null,
            'disabled' => false,
        ];
    }
}
