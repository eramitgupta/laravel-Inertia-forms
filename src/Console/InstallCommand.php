<?php

namespace Erag\InertiaForms\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'erag:install-inertia-forms')]
class InstallCommand extends Command
{
    protected $signature = 'erag:install-inertia-forms
        {--force : Overwrite the config if it was already published}';

    protected $description = 'Publish the Inertia Forms config and show the frontend setup';

    public function handle(): int
    {
        $this->components->info('Installing Inertia Forms.');

        $this->publish('inertia-forms-config', config_path('inertia-forms.php'));

        $this->showNextSteps();

        return self::SUCCESS;
    }

    /**
     * Publish one tag and report whether its file was written or kept.
     */
    protected function publish(string $tag, string $path): void
    {
        $existed = file_exists($path);

        $this->callSilently('vendor:publish', [
            '--tag' => $tag,
            '--force' => (bool) $this->option('force'),
        ]);

        $status = $existed && ! $this->option('force')
            ? '<fg=yellow;options=bold>SKIPPED</> (already exists, use --force to replace it)'
            : '<fg=green;options=bold>PUBLISHED</>';

        $this->components->twoColumnDetail(str_replace(base_path().DIRECTORY_SEPARATOR, '', $path), $status);
    }

    protected function showNextSteps(): void
    {
        $this->newLine();
        $this->components->info('Next steps');

        $this->line('  1. Install the frontend package for your stack:');
        $this->newLine();
        $this->line('     <fg=gray>npm install @erag/inertia-forms-vue</>     <fg=gray;options=bold># Vue</>');
        $this->line('     <fg=gray>npm install @erag/inertia-forms-react</>   <fg=gray;options=bold># React</>');
        $this->line('     <fg=gray>npm install @erag/inertia-forms-svelte</>  <fg=gray;options=bold># Svelte</>');

        $this->newLine();
        $this->line('  2. Let Tailwind scan it, in <fg=cyan>resources/css/app.css</> (use the package you installed):');
        $this->newLine();
        $this->line('     <fg=gray>@source "../../node_modules/@erag/inertia-forms-vue/dist";</>');

        $this->newLine();
        $this->line('  3. Create your first form:');
        $this->newLine();
        $this->line('     <fg=gray>php artisan make:form CreateUserForm</>');

        $this->newLine();
        $this->line('  Docs: <fg=cyan>https://erag.in/laravel-inertia-forms/</>');
        $this->newLine();
    }
}
