// 平台取数通道（host 半专用）：PAT 只存在于 Node 侧，从不下发到浏览器。
//
// 两个地址不要混（用户 2026-10-01 明确纠正）：
//   - API 基址（baseUrl）：https://fde.goodpoint.top —— /api/* 都挂在这
//   - 网页入口（webUrl）：https://fde.goodpoint.top/brain —— "打开平台"链接的去处
// 配置来源（优先级：环境变量 > 配置文件）：
//   - 环境变量 FDE_BASE_URL / FDE_PAT（运维/CI 覆盖用）
//   - 配置文件 $DSH_HOME/hyreal-fde-ai.json（默认 ~/.dsh/），由工作台页的「接入配置」卡写入
// 保存时同步桥接回环境变量：cordis.patch.yml 里 mcp-client 的 !!js 读 env，重启 dsh 后工具通道生效。
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const DEFAULT_BASE_URL = 'https://fde.goodpoint.top'
export const DEFAULT_WEB_URL = 'https://fde.goodpoint.top/brain'

export interface FdeConfig {
  baseUrl?: string
  webUrl?: string
  pat?: string
  /** 保存时自动计算（不留存原值）：fde_pat_<前4字符>·<sha256 头 6 位> */
  patFingerprint?: string
  /** 保存时自动落 ISO 时间戳 */
  patUpdatedAt?: string
}

function configPath(): string {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'hyreal-fde-ai.json')
}

export function readFdeConfig(): FdeConfig {
  try {
    return JSON.parse(readFileSync(configPath(), 'utf8')) as FdeConfig
  } catch {
    return {}
  }
}

export function saveFdeConfig(next: FdeConfig): FdeConfig {
  const merged = { ...readFdeConfig(), ...next }
  if (merged.baseUrl) merged.baseUrl = merged.baseUrl.replace(/\/+$/, '')
  mkdirSync(dirname(configPath()), { recursive: true })
  // 保存时同时落指纹（不存明文还原凭证）：token 前 4 字符 + sha256 头 6 位；下次面板展示"已接入"
  const writeTo: FdeConfig & { patFingerprint?: string; patUpdatedAt?: string } = { ...merged }
  if (writeTo.pat) {
    const head = writeTo.pat.startsWith("fde_pat_") ? writeTo.pat.slice(7, 11) : writeTo.pat.slice(0, 4)
    const hash = createHash("sha256").update(writeTo.pat).digest("hex").slice(0, 6)
    writeTo.patFingerprint = `fde_pat_${head}\u00b7${hash}`
    writeTo.patUpdatedAt = new Date().toISOString()
  }
  writeFileSync(configPath(), JSON.stringify(writeTo, null, 2), { mode: 0o600 })
  bridgeEnv(merged)
  return writeTo
}

/** 文件 → 环境变量桥接（插件加载时与保存时各调用一次） */
export function bridgeEnv(config?: FdeConfig): void {
  const c = config ?? readFdeConfig()
  if (c.baseUrl && !process.env.FDE_BASE_URL) process.env.FDE_BASE_URL = c.baseUrl
  if (c.pat && !process.env.FDE_PAT) process.env.FDE_PAT = c.pat
}

export function fdeBaseUrl(): string {
  return (process.env.FDE_BASE_URL || readFdeConfig().baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

/** 网页入口（"打开平台"链接）：默认在 API 基址上拼 /brain */
export function fdeWebUrl(): string {
  return (readFdeConfig().webUrl || `${fdeBaseUrl()}/brain`).replace(/\/+$/, '')
}

/** 已保存令牌指纹（仅用于面板展示，不参与鉴权） */
export function patFingerprint(): string | null {
  return readFdeConfig().patFingerprint ?? null
}

/** 上次保存时间（仅用于面板展示） */
export function patUpdatedAt(): string | null {
  return readFdeConfig().patUpdatedAt ?? null
}

export function fdePat(): string {
  return process.env.FDE_PAT || readFdeConfig().pat || ''
}

export const PAT_MISSING_HINT =
  '未配置接入令牌：点右上角「接入配置」，粘贴 Hyreal FDE 平台「设置 → 访问令牌」页签发的令牌（scope 勾选 read + tool）'

export interface FdeFetchResult {
  ok: boolean
  status: number
  contentType: string
  text: string
}

/** 请求平台 API；PAT 缺失返回 428（引导配置），网络失败返回 502（平台不可达） */
export async function fdeFetch(
  path: string,
  init?: { method?: string; body?: string },
): Promise<FdeFetchResult> {
  const pat = fdePat()
  if (!pat) return { ok: false, status: 428, contentType: 'application/json', text: PAT_MISSING_HINT }
  try {
    const res = await fetch(`${fdeBaseUrl()}${path}`, {
      method: init?.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${pat}`,
        ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init?.body,
    })
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get('content-type') ?? 'application/json',
      text: await res.text(),
    }
  } catch (err) {
    return {
      ok: false,
      status: 502,
      contentType: 'application/json',
      text: `平台不可达：${err instanceof Error ? err.message : String(err)}（${fdeBaseUrl()}）`,
    }
  }
}
