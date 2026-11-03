import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';

// ============================================================================
// Dada Todo · 思源笔记插件构建（库模式）
// ----------------------------------------------------------------------------
// 技术栈与 Obsidian 版 DadaTodo 一致：Vite + Vue 3 + 纯 JS，方便 src/core 直接移植。
// 产物写入 siyuan-DadaTodoList/（目录名即插件 id，可直接整目录部署）：
//   index.js（CJS，思源要求）+ index.css + plugin.json + i18n/ + README*.md
// external：siyuan 由思源宿主提供，不打包。
//
// 部署：测试库插件目录软链到本产物目录
//   /Users/plover/Documents/myLife_demo_siyuan/data/plugins/siyuan-DadaTodoList
//     -> /Users/plover/Documents/Projects/DadaTodo-Siyuan/siyuan-DadaTodoList
// 开发循环：pnpm run dev 触发 watch 构建，思源重载插件即可生效。
// ============================================================================

const root = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(root, 'plugin.json'), 'utf-8'));
const OUT_DIR = manifest.name; // 产物目录名 = 插件 id
const isDev = process.env.DADA_DEV === '1';

// 需要拷进产物目录的静态资源
const staticTargets = [
  { src: 'plugin.json', dest: '.' },
  { src: 'README*.md', dest: '.' },
  { src: 'src/i18n/*.json', dest: 'i18n' },
];
for (const img of ['icon.png', 'preview.png']) {
  if (existsSync(resolve(root, img))) {
    staticTargets.push({ src: img, dest: '.' });
  }
}

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({ targets: staticTargets }),
    // 仅生产构建打 package.zip（集市 Release 附件）
    ...(isDev ? [] : [zipPack({ inDir: OUT_DIR, outDir: '.', outFileName: 'package.zip' })]),
  ],
  // 编译期注入 dev 标志 + 兜底无 process 全局的环境（浏览器端）
  define: {
    __DADA_DEV__: JSON.stringify(isDev),
    'process.env': JSON.stringify({ NODE_ENV: isDev ? 'development' : 'production' })
  },
  build: {
    outDir: OUT_DIR,
    // 开发 watch 模式不清空 dist：避免文件「删除-重建」瞬间被误判
    //（产物文件名固定，无残留哈希文件风险）
    emptyOutDir: !isDev,
    lib: {
      entry: 'src/index.js',
      formats: ['cjs'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['siyuan'],
      output: {
        // 无 process 全局的环境（浏览器端）兜底（仅不存在时注入）
        banner: `try{if(typeof process==='undefined'){globalThis.process={env:{NODE_ENV:${JSON.stringify(isDev ? 'development' : 'production')}}};}}catch(e){}`,
        // 思源约定样式文件名为 index.css
        assetFileNames: (info) => (info.name && info.name.endsWith('.css') ? 'index.[ext]' : '[name].[ext]')
      }
    },
    cssCodeSplit: false,
    // 思源桌面端为 Electron（Chromium 较新），无需转译降级
    target: 'chrome108'
  }
});
