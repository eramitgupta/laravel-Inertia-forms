<?php

use Erag\InertiaForms\Tests\Fixtures\OnboardingForm;

it('serializes wizard settings and step icons', function () {
    $schema = OnboardingForm::make()->toArray();

    expect($schema['wizard'])->toMatchArray([
        'nextLabel' => 'Continue',
        'backLabel' => 'Back',
        'validateUrl' => route('inertia-forms.validate-step'),
    ])
        ->and($schema['fieldsets'][0]['icon'])->toBe('user')
        ->and(OnboardingForm::make()->wizard(false)->toArray()['wizard'])->toBeNull();
});

it('uses visible fieldsets with fields as steps', function () {
    $form = OnboardingForm::make();

    expect(array_map(fn ($fieldset) => $fieldset->toArray()['legend'], $form->wizardSteps([])))->toBe(['Account', 'Profile'])
        ->and(count($form->wizardSteps(['company' => 'Acme'])))->toBe(3);
});

it('validates one step at a time through the endpoint', function () {
    $token = OnboardingForm::make()->formToken();
    $url = route('inertia-forms.validate-step');

    $this->postJson($url, ['form' => $token, 'step' => 0, 'data' => ['name' => 'Jane']])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email'])
        ->assertJsonMissingValidationErrors(['company']);

    $this->postJson($url, ['form' => $token, 'step' => 0, 'data' => ['name' => 'Jane', 'email' => 'jane@example.test']])
        ->assertNoContent();

    // File fields wait for the final submit.
    $this->postJson($url, ['form' => $token, 'step' => 1, 'data' => ['company' => 'Acme']])->assertNoContent();

    $this->postJson($url, ['form' => $token, 'step' => 2, 'data' => ['company' => 'Acme', 'bio' => str_repeat('x', 30)]])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['bio']);

    $this->postJson($url, ['form' => 'tampered', 'step' => 0])->assertNotFound();
});
