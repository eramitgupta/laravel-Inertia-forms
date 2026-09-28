<?php

namespace Erag\InertiaForms\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'erag:install-inertia-forms')]
class InstallCommand extends Command
{
    /**
     * Inertia adapters mapped to the matching frontend package.
     *
     * @var array<string, string>
     */
    public const array FRONTEND_PACKAGES = [
        '@inertiajs/vue3' => '@erag/inertia-forms-vue',
        '@inertiajs/react' => '@erag/inertia-forms-react',
        '@inertiajs/svelte' => '@erag/inertia-forms-svelte',
    ];

    protected $signature = 'erag:install-inertia-forms
        {--force : Overwrite files that were already published}';

    protected $description = 'Publish the Inertia Forms config and stub, and show the frontend setup';

    public function handle(): int
    {
        $this->components->info('Installing Inertia Forms.');

        $this->publish('inertia-forms-config', config_path('inertia-forms.php'));
        $this->publish('inertia-forms-stubs', base_path('stubs/inertia-form.stub'));

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
        $packages = $this->frontendPackages();

        $this->newLine();
        $this->components->info('Next steps');

        $this->line('  1. Install the frontend package:');
        $this->newLine();
        foreach ($packages as $package) {
            $this->line("     <fg=gray>npm install {$package}</>");
        }

        $this->newLine();
        $this->line('  2. Let Tailwind scan it, in <fg=cyan>resources/css/app.css</>:');
        $this->newLine();
        foreach ($packages as $package) {
            $this->line("     <fg=gray>@source \"../../node_modules/{$package}/dist\";</>");
        }

        $this->newLine();
        $this->line('  3. Create your first form:');
        $this->newLine();
        $this->line('     <fg=gray>php artisan make:form CreateUserForm</>');
        $this->newLine();
    }

    /**
     * The frontend package for the Inertia adapter in package.json, or all of
     * them when none is found.
     *
     * @return list<string>
     */
    protected function frontendPackages(): array
    {
        $manifest = base_path('package.json');
        $json = file_exists($manifest) ? json_decode((string) file_get_contents($manifest), true) : null;

        $installed = array_merge(
            is_array($json['dependencies'] ?? null) ? $json['dependencies'] : [],
            is_array($json['devDependencies'] ?? null) ? $json['devDependencies'] : [],
        );

        $found = array_values(array_intersect_key(self::FRONTEND_PACKAGES, $installed));

        return $found !== [] ? $found : array_values(self::FRONTEND_PACKAGES);
    }
}
