<?php

namespace Erag\InertiaForms\Http\Controllers;

use Erag\InertiaForms\Form;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Crypt;

/**
 * Checks one wizard step before the user moves on. Returns 204 when the step
 * is valid, or the usual 422 JSON validation errors.
 */
class ValidateStepController
{
    public function __invoke(Request $request): Response
    {
        $input = $request->validate([
            'form' => ['required', 'string'],
            'step' => ['required', 'integer', 'min:0'],
            'data' => ['nullable', 'array'],
        ]);

        try {
            $class = Crypt::decryptString($input['form']);
        } catch (DecryptException) {
            abort(404);
        }

        abort_unless(is_string($class) && is_subclass_of($class, Form::class), 404);

        /** @var Form $form */
        $form = $class::make();

        abort_unless($form->isWizard(), 404);
        abort_unless($form->isAuthorized(), 403);

        $form->validateStep((int) $input['step'], $input['data'] ?? []);

        return response()->noContent();
    }
}
