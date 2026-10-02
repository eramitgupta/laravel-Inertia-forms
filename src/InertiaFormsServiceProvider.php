<?php

namespace Erag\InertiaForms;

use Erag\InertiaForms\Console\InstallCommand;
use Erag\InertiaForms\Console\MakeFormCommand;
use Erag\InertiaForms\Http\Controllers\SearchOptionsController;
use Erag\InertiaForms\Http\Controllers\ValidateStepController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class InertiaFormsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/inertia-forms.php', 'inertia-forms');
    }

    public function boot(): void
    {
        Route::middleware(config('inertia-forms.search.middleware', ['web', 'throttle:60,1']))
            ->post(config('inertia-forms.search.uri', '_inertia-forms/search'), SearchOptionsController::class)
            ->name('inertia-forms.search');

        Route::middleware(config('inertia-forms.wizard.middleware', ['web', 'throttle:60,1']))
            ->post(config('inertia-forms.wizard.uri', '_inertia-forms/validate-step'), ValidateStepController::class)
            ->name('inertia-forms.validate-step');

        if ($this->app->runningInConsole()) {
            $this->commands([InstallCommand::class, MakeFormCommand::class]);

            $this->publishes([
                __DIR__.'/../config/inertia-forms.php' => config_path('inertia-forms.php'),
            ], 'inertia-forms-config');
        }
    }
}
