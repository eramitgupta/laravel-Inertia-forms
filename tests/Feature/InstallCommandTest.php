<?php

use Illuminate\Support\Facades\File;

beforeEach(function () {
    File::delete([config_path('inertia-forms.php'), base_path('stubs/inertia-form.stub'), base_path('package.json')]);
});

afterEach(function () {
    File::delete([config_path('inertia-forms.php'), base_path('stubs/inertia-form.stub'), base_path('package.json')]);
});

it('publishes the config and the stub', function () {
    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('PUBLISHED')
        ->assertSuccessful();

    expect(config_path('inertia-forms.php'))->toBeFile()
        ->and(base_path('stubs/inertia-form.stub'))->toBeFile();
});

it('keeps published files unless forced', function () {
    File::ensureDirectoryExists(config_path());
    File::put(config_path('inertia-forms.php'), '<?php return [];');

    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('SKIPPED')
        ->assertSuccessful();

    expect(File::get(config_path('inertia-forms.php')))->toBe('<?php return [];');

    $this->artisan('erag:install-inertia-forms', ['--force' => true])->assertSuccessful();

    expect(File::get(config_path('inertia-forms.php')))->toContain("'search'");
});

it('suggests the frontend package for the installed Inertia adapter', function () {
    File::put(base_path('package.json'), json_encode(['dependencies' => ['@inertiajs/react' => '^3.0']]));

    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('npm install @erag/inertia-forms-react')
        ->doesntExpectOutputToContain('npm install @erag/inertia-forms-vue')
        ->assertSuccessful();
});

it('lists every frontend package when no adapter is found', function () {
    $this->artisan('erag:install-inertia-forms')
        ->expectsOutputToContain('npm install @erag/inertia-forms-vue')
        ->expectsOutputToContain('npm install @erag/inertia-forms-react')
        ->expectsOutputToContain('npm install @erag/inertia-forms-svelte')
        ->assertSuccessful();
});
