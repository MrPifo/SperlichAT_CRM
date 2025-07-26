import handlebars from 'vite-plugin-handlebars';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import path from 'path';
import { entityProcessesPlugin } from './plugins/entity-compiler';
import { autoLoadEntitiesPlugin } from './plugins/entity-compiler';

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
            '@models': path.resolve(__dirname, './src/models'),
            '@views': path.resolve(__dirname, './src/views'),
            '@entities': path.resolve(__dirname, './src/entities'),
            '@sqlBuilder': path.resolve(__dirname, './src/libraries/sqlbuilder'),
            '@libraries': path.resolve(__dirname, './src/libraries'),
            '@datamodels': path.resolve(__dirname, './src/models/data'),
            '@datatable': path.resolve(__dirname, './src/libraries/datatable'),
            '@component': path.resolve(__dirname, './src/components')
        }
    },
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html')
            }
        }
    },
    plugins: [
        entityProcessesPlugin(),
        autoLoadEntitiesPlugin(),
        handlebars({
            partialDirectory: resolve(__dirname, 'partials'),
            reloadOnPartialChange: true
        }),
        {
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (!req.url.includes('.') && req.headers.accept?.includes('text/html')) {
                        req.url = '/index.html';
                    }
                    next();
                });
            }
        }
    ]
});