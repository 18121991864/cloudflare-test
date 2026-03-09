import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = dotenv.config().parsed;
// https://vitejs.dev/config/

export default defineConfig({
    base: env.VITE_PUBLIC_PATH,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue'],
                },
            },
        },
        outDir: path.resolve(__dirname, env.VITE_APP_PASS),
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    plugins: [
        vue(),
        VueI18nPlugin({
            compositionOnly: false,
        }),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'pinia',
                'vue-i18n',
                {
                    dayjs: [
                        ['default', 'dayjs'], // 添加 dayjs 的默认导入
                    ],
                },
            ],
            dirs: ['./src/config-overall/hook'],
            dts: './auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false,
                }),
            ],
            dirs: [
                './src/components', // 这里指定了你的组件目录
                './src/config-overall/views',
            ],
            dts: './components.d.ts',
        }),
    ],
    define: {
        'process.env': process.env,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    server: {
        port: 5001,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                // target: 'http://43.199.161.111:10002/',
                target: 'http://8.218.199.96:10002/',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
