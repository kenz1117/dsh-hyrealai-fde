// /fde/* 同源数据代理：client 半 fetch('/fde/...') → 本路由 → 平台 API（自动附 PAT）。
// 设计要点（设计文档 5.2/5.5/S9）：
//   - 同源免 CORS（平台 CORS 是有意关闭的，浏览器直连不可行也不允许）
//   - dsh webserver 强制 127.0.0.1，本路由仅本机可达；但仍以白名单收敛开放面
//   - /fde/meta 与 /fde/config 是本地端点（不回源），供「接入配置」卡使用
//   - PAT 未配置时 API 代理返回 428 + 引导文案，绝不裸转发
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { HostContext } from '../dsh-types'
import {
  DEFAULT_BASE_URL, DEFAULT_WEB_URL, fdeBaseUrl, fdeFetch, fdePat, fdeWebUrl, PAT_MISSING_HINT,
  patFingerprint, patUpdatedAt, saveFdeConfig, latestNpmVersion, localPluginVersion,
} from './platform'

/** 允许代理的平台路径前缀（最小开放面；新增必须显式登记于此） */
export const PROXY_ALLOWED_PREFIXES = ['/api/workbench/', '/api/public/health', '/api/communication-draft-decide'] as const

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** 保存接入配置并做平台可达性测试（/api/public/health 免鉴权；PAT 有效性由平台 Phase 1 后真正校验） */
async function handleSaveConfig(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let body: { baseUrl?: unknown; pat?: unknown }
  try {
    body = JSON.parse(await readBody(req)) as typeof body
  } catch {
    return sendJson(res, 400, { error: '请求体不是合法 JSON' })
  }
  const baseUrl = typeof body.baseUrl === 'string' && body.baseUrl.trim() ? body.baseUrl.trim() : undefined
  const pat = typeof body.pat === 'string' && body.pat.trim() ? body.pat.trim() : undefined
  if (!baseUrl && !pat) return sendJson(res, 400, { error: 'baseUrl 与 pat 至少提供一项' })
  if (pat && !pat.startsWith('fde_pat_')) {
    return sendJson(res, 400, { error: '令牌格式不正确（应以 fde_pat_ 开头，请在平台「设置 → 访问令牌」重新签发）' })
  }
  saveFdeConfig({ baseUrl, pat })
  const health = await fdeFetch('/api/public/health')
  sendJson(res, 200, {
    ok: true,
    baseUrl: fdeBaseUrl(),
    reachable: health.status !== 502,
    healthStatus: health.status,
  })
}

export function registerFdeProxy(ctx: HostContext): void {
  ctx.webServer.register({
    kind: 'prefix',
    path: '/fde',
    handler: async (req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1')

      // 本地端点（不回源、不需要 PAT）
      if (url.pathname === '/fde/meta') {

        const fingerprint = patFingerprint()
        const updatedAt = patUpdatedAt()
        const currentVersion = localPluginVersion()
        const latestVersion = await latestNpmVersion()
        return sendJson(res, 200, {
          name: 'dsh-hyrealai-fde',
          baseUrl: fdeBaseUrl(),
          webUrl: fdeWebUrl(),
          defaultBaseUrl: DEFAULT_BASE_URL,
          defaultWebUrl: DEFAULT_WEB_URL,
          hasPat: Boolean(fdePat()),
          mcpReady: Boolean(process.env.FDE_PAT),
          patFingerprint: fingerprint,
          patUpdatedAt: updatedAt,
          currentVersion,
          latestVersion,
        })
      }
      if (url.pathname === '/fde/config') {
        if ((req.method ?? 'GET').toUpperCase() !== 'POST') return sendJson(res, 405, { error: '仅支持 POST' })
        return handleSaveConfig(req, res)
      }

      if (!fdePat()) return sendJson(res, 428, { error: PAT_MISSING_HINT })

      // /fde/api/workbench/actions → /api/workbench/actions
      const upstreamPath = url.pathname.slice('/fde'.length) || '/'
      if (!PROXY_ALLOWED_PREFIXES.some((p) => upstreamPath.startsWith(p))) {
        return sendJson(res, 403, { error: '路径不在 dsh-hyrealai-fde 代理白名单内', path: upstreamPath })
      }

      const method = (req.method ?? 'GET').toUpperCase()
      const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(req)
      const upstream = await fdeFetch(`${upstreamPath}${url.search}`, { method, body })
      res.statusCode = upstream.status
      res.setHeader('Content-Type', upstream.contentType)
      res.end(upstream.text)
    },
  })
}
