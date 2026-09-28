<?php

namespace Erag\InertiaForms\Http\Controllers;

use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Form;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

/**
 * Returns options for a `Combobox::searchUsing()` field as the user types.
 */
class SearchOptionsController
{
    public function __invoke(Request $request): JsonResponse
    {
        $input = $request->validate([
            'form' => ['required', 'string'],
            'field' => ['required', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $class = Crypt::decryptString($input['form']);
        } catch (DecryptException) {
            abort(404);
        }

        abort_unless(is_string($class) && is_subclass_of($class, Form::class), 404);

        /** @var Form $form */
        $form = $class::make();

        abort_unless($form->isAuthorized(), 403);

        $field = $form->getField($input['field']);

        abort_unless($field instanceof Combobox && $field->isRemote(), 404);

        return response()->json([
            'options' => $field->getSearchResults((string) ($input['search'] ?? '')),
        ]);
    }
}
