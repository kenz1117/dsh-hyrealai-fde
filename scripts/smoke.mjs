// host 半冒烟（不起 dsh）：模块形状 + 代理路由 428/403/回源 + 命令错误路径 + 配置存取。
// 运行前需先 pnpm build。
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'

// 配置文件写到临时 DSH_HOME，绝不污染真实 ~/.dsh
process.env.DSH_HOME = mkdtempSync(join(tmpdir(), 'dsh-hyrealai-fde-smoke-'))

const mod = await import('../lib/index.js')

// 1) 模块形状（Cordis 插件契约：name / inject / apply）
assert.equal(mod.name, 'dsh-hyrealai-fde')
assert.deepEqual(mod.inject, ['webServer', 'commands', 'systemPrompt'])
assert.equal(typeof mod.apply, 'function')

// 2) apply 注册捕获
const routes = []
const commands = []
const sections = []
const ctx = {
  webServer: { register: (r) => (routes.push(r), () => {}) },
  commands: { register: (d) => (commands.push(d), () => {}) },
  systemPrompt: { section: (s) => (sections.push(s), () => {}) },
}
mod.apply(ctx)
assert.equal(routes.length, 1)
assert.equal(routes[0].kind, 'prefix')
assert.equal(routes[0].path, '/fde')
assert.deepEqual(commands.map((c) => c.name).sort(), ['fde-drafts', 'fde-today'])
assert.equal(sections.length, 1)
assert.match(sections[0].text, /草稿/)

// 3) 代理行为
function mockReq(pathname, method = 'GET', body) {
  let pending = body ?? null
  const req = new Readable({
    read() {
      if (pending !== null) { this.push(pending); pending = null }
      this.push(null)
    },
  })
  req.url = pathname
  req.method = method
  return req
}
function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k] = v },
    end(b) { this.body = b ?? '' },
  }
}

delete process.env.FDE_PAT
{
  // /fde/meta 无 PAT 也应本地应答（供页面展示配置状态）
  const res = mockRes()
  await routes[0].handler(mockReq('/fde/meta'), res)
  assert.equal(res.statusCode, 200)
  const meta = JSON.parse(res.body)
  assert.equal(meta.name, 'dsh-hyrealai-fde')
  assert.equal(meta.hasPat, false)
}
{
  // 无 PAT → 428（引导配置，不裸转发）
  const res = mockRes()
  await routes[0].handler(mockReq('/fde/api/workbench/actions'), res)
  assert.equal(res.statusCode, 428)
}
process.env.FDE_PAT = 'fde_pat_smoke'
{
  // 白名单外路径 → 403
  const res = mockRes()
  await routes[0].handler(mockReq('/fde/api/brain/steward'), res)
  assert.equal(res.statusCode, 403)
}
{
  // 白名单路径 → 触发回源（占位域名不可达时 502；真实环境可能 200/401/404）
  const res = mockRes()
  await routes[0].handler(mockReq('/fde/api/public/health'), res)
  assert.ok([200, 401, 404, 502].includes(res.statusCode), `unexpected status ${res.statusCode}`)
}
delete process.env.FDE_PAT
{
  // 命令：无 PAT → error result
  const cmd = commands.find((c) => c.name === 'fde-today')
  const result = await cmd.handler({ rawInput: '', signal: new AbortController().signal })
  assert.equal(result.kind, 'error')
}
{
  // 配置存取（写临时 DSH_HOME）：合法令牌 → 200 + meta.hasPat=true；坏前缀 → 400
  const res = mockRes()
  await routes[0].handler(mockReq('/fde/config', 'POST', JSON.stringify({ baseUrl: 'https://fde.goodpoint.top', pat: 'fde_pat_smoke' })), res)
  assert.equal(res.statusCode, 200)
  assert.equal(JSON.parse(res.body).ok, true)
  const res2 = mockRes()
  await routes[0].handler(mockReq('/fde/meta'), res2)
  assert.equal(JSON.parse(res2.body).hasPat, true)
  const res3 = mockRes()
  await routes[0].handler(mockReq('/fde/config', 'POST', JSON.stringify({ pat: 'not-a-pat' })), res3)
  assert.equal(res3.statusCode, 400)
}

console.log('smoke ok: module shape + proxy 428/403/upstream + command error path + config roundtrip')
