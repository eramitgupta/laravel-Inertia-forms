<?php

use Illuminate\Support\Facades\File;

beforeEach(function () {
    File::delete([config_path('inertia-forms.php'), base_path('stubs/inertia-form.stub')]);
});

afterEach(function () {
    File::delete([config_path('inertia-forms.php'), base_path('stubs/inertia-form.stub')]);
});

it('publishes only the config', function () {
    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('PUBLISHED')
        ->assertSuccessful();

    expect(config_path('inertia-forms.php'))->toBeFile()
        ->and(base_path('stubs/inertia-form.stub'))->not->toBeFile();
});

it('keeps the published config unless forced', function () {
    File::ensureDirectoryExists(config_path());
    File::put(config_path('inertia-forms.php'), '<?php return [];');

    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('SKIPPED')
        ->assertSuccessful();

    expect(File::get(config_path('inertia-forms.php')))->toBe('<?php return [];');

    $this->artisan('erag:install-inertia-forms', ['--force' => true])->assertSuccessful();

    expect(File::get(config_path('inertia-forms.php')))->toContain("'search'");
});

it('shows the frontend packages and the next steps', function () {
    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('npm install @erag/inertia-forms-vue')
        ->expectsOutputToContain('npm install @erag/inertia-forms-react')
        ->expectsOutputToContain('npm install @erag/inertia-forms-svelte')
        ->expectsOutputToContain('php artisan make:form CreateUserForm')
        ->assertSuccessful();
});

it('has no stub publish tag', function () {
    $this->artisan('vendor:publish', ['--tag' => 'inertia-forms-stubs'])->assertSuccessful();

    expect(base_path('stubs/inertia-form.stub'))->not->toBeFile();
});
