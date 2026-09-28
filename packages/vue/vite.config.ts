import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: fileURLToPath(new URL('..', import.meta.url)),
            include: ['src', '../core/src'],
            exclude: ['../core/tests'],
            compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true },
        }),
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: 'inertia-forms-vue',
        },
        rollupOptions: {
            external: ['vue', '@inertiajs/vue3'],
        },
        sourcemap: true,
    },
});
