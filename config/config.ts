import { defineConfig } from 'umi';
import proxy from './proxy';
import routes from './routes';
import theme from './theme';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    hash: true,
    history: {
        type: 'hash',
    },
    locale: {
        default: 'zh-CN',
        antd: true,
    },
    publicPath: isProd ? './' : '/',
    outputPath: './release/app/dist/renderer',
    extraBabelPlugins: [isProd ? 'transform-remove-console' : ''],
    antd: {},
    dva: {
        immer: true,
        hmr: false,
    },
    dynamicImport: {
        loading: '@/loading',
    },
    access: {},
    request: {},
    ignoreMomentLocale: true,
    manifest: {
        basePath: '/',
    },
    fastRefresh: {},
    mfsu: {},
    routes,
    theme,
    proxy: proxy['dev'],
});
