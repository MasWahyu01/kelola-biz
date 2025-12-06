import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.scss',
                'resources/js/app.js',
                'resources/js/login.js',
                'resources/js/clients.js',
                'resources/js/services.js',
                'resources/js/interactions.js',
                'resources/js/dashboard.js',
            ],
            refresh: true,
        }),
    ],
});