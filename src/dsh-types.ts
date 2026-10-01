// dsh 宿主/浏览器服务的最小结构化类型垫片。
// 签名均对照 dsh 源码核实（/tmp/dsh-research/deepseek-harness）：
//   packages/host/webserver/src/index.ts     WebRoute / register
//   packages/interaction/commands/src/*      CommandDefinition / CommandInvocation / CommandResult
//   packages/core/system-prompt/src/index.ts PromptSection / section()
//   packages/client/locale/src/client        locale.register / bind
// developer preview 期这些面可能调整——类型集中在这一个文件，升级时先对这里。
import type { IncomingMessage, ServerResponse } from 'node:http'

// ---------- host 半 ----------

export interface WebRoute {
  kind: 'exact' | 'prefix'
  /** 绝对路径，无尾斜杠 */
  path: string
  handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
}

export type CommandResult =
  | { readonly kind: 'success'; readonly text?: string }
  | { readonly kind: 'error'; readonly text: string }

export interface CommandInvocation {
  readonly rawInput: string
  readonly signal: AbortSignal
}

export interface CommandDefinition {
  /** 小写命令名，不含斜杠 */
  readonly name: string
  readonly description: string
  readonly input?: { hint?: string; attachments?: boolean }
  readonly recordInput?: boolean
  readonly handler: (invocation: CommandInvocation) => CommandResult | Promise<CommandResult>
}

export interface PromptSection {
  readonly name: string
  /** 段按 order 升序拼接；任意有限数 */
  readonly order: number
  readonly text: string
  readonly interpolate?: boolean
}

export interface HostContext {
  webServer: { register(route: WebRoute): () => void }
  commands: { register(definition: CommandDefinition): () => void }
  systemPrompt: { section(section: PromptSection): () => void }
}

// ---------- client 半 ----------

export interface SlotRegistrationOptions {
  name: string
  id?: string
  /** keyed 插槽（main / tool.call.toolview）的分发键 */
  key?: string
  order?: number
  label?: () => string
  locale?: string
}

export interface SlotsService {
  inject(slot: string, contribution: () => unknown): void
  register(options: SlotRegistrationOptions, component: unknown): () => void
}

export interface LocaleService {
  register(ns: string, dicts: Record<string, Record<string, string>>): () => void
  bind(ns: string): (key: string) => string
}

export interface LayoutService {
  selectPanel(panelId: string | null): void
}

export interface ClientContext {
  slots: SlotsService
  locale: LocaleService
  layout: LayoutService
}
