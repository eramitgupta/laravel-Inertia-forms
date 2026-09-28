import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
    // Strip TypeScript so the published `.svelte` files are plain JavaScript.
    preprocess: vitePreprocess({ script: true }),
};
