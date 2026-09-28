import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
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
            fileName: 'inertia-forms-react',
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '@inertiajs/react'],
        },
        sourcemap: true,
    },
});
