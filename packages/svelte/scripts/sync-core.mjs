/**
 * Copy the shared core sources into `src/lib/core` so they ship inside the package.
 * The copied folder is generated and gitignored; edit `packages/core/src` instead.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '..', 'core', 'src');
const target = join(root, 'src', 'lib', 'core');

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

const files = readdirSync(source, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith('.ts'));

for (const file of files) {
    mkdirSync(dirname(join(target, file)), { recursive: true });
    copyFileSync(join(source, file), join(target, file));
}

console.log(`[inertia-forms] Synced ${files.length} core files into src/lib/core.`);
