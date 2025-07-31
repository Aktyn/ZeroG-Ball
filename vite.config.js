import {defineConfig} from 'vite'
import legacy from '@vitejs/plugin-legacy'
import {resolve} from 'path'

export default defineConfig({
    // Entry point
    root: 'src',

    // Build configuration
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html')
            }
        },
        // Asset handling
        assetsDir: 'static',
        // Source maps for development
        sourcemap: process.env.NODE_ENV !== 'production'
    },

    // Development server
    server: {
        port: 3000,
        open: true,
        host: true
    },

    // CSS preprocessing
    css: {
        preprocessorOptions: {
            scss: {
                // Add any global SCSS variables or mixins here if needed
            }
        }
    },

    // Plugins
    plugins: [
        // Legacy browser support
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],

    // Asset handling
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ttf', '**/*.json']
})