<?php

namespace Erag\InertiaForms\Tests\Fixtures;

use Erag\InertiaForms\Fields\Select;
use Erag\InertiaForms\Form;

class AuthorForm extends Form
{
    public static bool $allowed = true;

    /** @var array<int, array{id: int, name: string, email: string}> */
    public const AUTHORS = [
        ['id' => 1, 'name' => 'Avery Stone', 'email' => 'avery@example.test'],
        ['id' => 2, 'name' => 'Rowan Example', 'email' => 'rowan@example.test'],
        ['id' => 3, 'name' => 'Morgan Vale', 'email' => 'morgan@example.test'],
    ];

    protected ?string $actionUrl = '/articles';

    public function fields(): array
    {
        $option = fn (array $author): array => ['value' => $author['id'], 'label' => $author['name'], 'description' => $author['email']];

        return [
            Select::make('author_id')
                ->label('Author')
                ->required()
                ->searchUsing(fn (string $search): array => array_map($option, array_values(array_filter(
                    self::AUTHORS,
                    fn (array $author): bool => $search === '' || str_contains(strtolower($author['name']), strtolower($search)),
                ))))
                ->selectedOptionsUsing(fn (array $ids): array => array_map($option, array_values(array_filter(
                    self::AUTHORS,
                    fn (array $author): bool => in_array((string) $author['id'], array_map('strval', $ids), true),
                )))),
            Select::make('reviewers')->multiple()->searchUsing(fn (string $search): array => []),
        ];
    }

    public function isAuthorized(): bool
    {
        return self::$allowed && parent::isAuthorized();
    }
}
