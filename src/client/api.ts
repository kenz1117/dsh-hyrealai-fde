// client 半取数：只打同源 /fde/*（host 半代理附 PAT），浏览器永远不直接接触 PAT。
export type FdeLoadState<T> =
  | { status: 'loading' }
  | { status: 'need-pat'; hint: string }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T }

export async function fdeGet<T = unknown>(path: string): Promise<FdeLoadState<T>> {
  try {
    const res = await fetch(`/fde${path}`)
    if (res.status === 428) {
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      return { status: 'need-pat', hint: body.error ?? '' }
    }
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` }
    return { status: 'ready', data: (await res.json()) as T }
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : String(err) }
  }
}

/** /fde/meta 由 host 半本地应答（不回源）：平台地址与配置状态 */
export interface FdeMeta {
  name: string;
  /** API 基址（/api/* 挂在这） */
  baseUrl: string;
  /** 网页入口（"打开平台"链接） */
  webUrl: string;
  defaultBaseUrl: string;
  defaultWebUrl: string;
  hasPat: boolean;
  mcpReady: boolean;
  /** 已保存令牌的指纹（前 4 字符 + sha256 头 6 位）；从未保存为 null */
  patFingerprint: string | null;
  /** ISO 时间戳；从未保存为 null */
  patUpdatedAt: string | null;
}

export async function fdeMeta(): Promise<FdeMeta | null> {
  try {
    const res = await fetch('/fde/meta')
    return res.ok ? ((await res.json()) as FdeMeta) : null
  } catch {
    return null
  }
}

export interface FdeSaveResult {
  ok: boolean
  baseUrl?: string
  reachable?: boolean
  healthStatus?: number
  error?: string
}

/** 保存接入配置（host 半写入 ~/.dsh/hyreal-fde-ai.json 并桥接 env），并做平台可达性测试 */
export async function fdeSaveConfig(input: { baseUrl?: string; pat?: string }): Promise<FdeSaveResult> {
  try {
    const res = await fetch('/fde/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    return (await res.json()) as FdeSaveResult
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
