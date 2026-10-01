// 构建：host → lib/index.js（ESM）；client → lib/client.js（closure-factory 格式）。
// 宿主只 serve 构建产物（dsh-client-modules）：bundle 必须调用
// window.__ModuleLoader__.load({ id, factory(require) })，external 仅平台冻结基线。
// 参照 dsh packages/client/tsdown.client.ts 的输出契约。
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import esbuild from 'esbuild'

// dsh 冻结基线模块表（packages/client/web/src/platform.ts）——升级 dsh 后先核对此表
const PLATFORM_MODULES = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
]

await mkdir('lib', { recursive: true })

// host 半：ESM，node 平台；只依赖 node builtins 与全局 fetch，无外部包
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outfile: 'lib/index.js',
  logLevel: 'warning',
})

// client 半：先打 CJS（基线 external），再包 closure-factory
await esbuild.build({
  entryPoints: ['src/client/index.tsx'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  external: PLATFORM_MODULES,
  outfile: 'lib/client.cjs',
  logLevel: 'warning',
})

const cjs = await readFile('lib/client.cjs', 'utf8')
const wrapped = `window.__ModuleLoader__.load({
  id: 'dsh-hyrealai-fde',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
${cjs}
    return module.exports;
  },
});
`
await writeFile('lib/client.js', wrapped)
await rm('lib/client.cjs')

console.log('built: lib/index.js (host, esm) + lib/client.js (client, closure-factory)')
