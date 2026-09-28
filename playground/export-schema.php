<?php

use Orchestra\Testbench\Foundation\Application;

require __DIR__.'/../vendor/autoload.php';

$app = Application::create(basePath: Orchestra\Testbench\default_skeleton_path());
require __DIR__.'/DemoForm.php';

file_put_contents(__DIR__.'/schema.json', json_encode(DemoForm::make(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "Wrote playground/schema.json\n";
