import handlebars from 'vite-plugin-handlebars';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import path from 'path';
import inject from '@rollup/plugin-inject';

export default defineConfig({
    root: 'src',
    base: process.env.NODE_ENV === 'production' ? '/crm/' : '/',
    optimizeDeps: {
        include: ['vanillajs-datepicker']
    },
    server: {
        port: 5174
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@core': path.resolve(__dirname, './src/core'),
            '@types': path.resolve(__dirname, './src/types')
        }
    },
    input: {
        main: resolve(__dirname, 'src/index.html'),
        contacts: resolve(__dirname, 'src/pages/kontakt.html'),
        login: resolve(__dirname, 'src/pages/loginPage.html'),
        editPage:resolve(__dirname, 'src/pages/edit.html')
    },
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                contacts: resolve(__dirname, 'src/pages/kontakt.html'),
                loginPage: resolve(__dirname, 'src/pages/loginPage.html'),
                editPAge: resolve(__dirname,'src/pages/edit.html' )
            }
        }
    },
    plugins: [
        inject({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        handlebars({
            partialDirectory: resolve(__dirname, 'partials'),
            reloadOnPartialChange: true
        })
    ]
});