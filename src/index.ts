// dsh-hyrealai-fde host 半入口：一切对外 IO 都在 Node 侧（PAT 不下发到浏览器）。
// 职责（设计文档 5.2）：/fde/* 同源代理 + 斜杠命令 + FDE 工作规范注入。
// MCP 连接由 cordis.patch.yml 以 @deepseek-ai/dsh-mcp-client 条目注入，不在本模块。
import type { CommandResult, HostContext } from './dsh-types'
import { bridgeEnv, fdeFetch } from './host/platform'
import { registerFdeProxy } from './host/proxy'
import { ensureSkillsSynced } from './host/skills'
import { FDE_WORK_RULES } from './host/work-rules'

export const name = 'dsh-hyrealai-fde'
export const inject = ['webServer', 'commands', 'systemPrompt']

async function fetchCommand(path: string): Promise<CommandResult> {
  const r = await fdeFetch(path)
  if (!r.ok) return { kind: 'error', text: r.text }
  return { kind: 'success', text: r.text }
}

export function apply(ctx: HostContext): void {
  // 配置文件 → env 桥接：本插件在 cordis.patch.yml 中排在 mcp-client 之前，
  // 若加载顺序与配置求值时机如预期，mcp 工具首轮即可拿到令牌；否则重启 dsh 后生效。
  bridgeEnv()
  // 技能包 → ~/.dsh/skills 同步：FDE 方法论（16 个领域技能）对 dsh 会话技能目录可见
  ensureSkillsSynced()
  registerFdeProxy(ctx)

  ctx.commands.register({
    name: 'fde-today',
    description: '查看 Hyreal 平台今日行动（名下客户 / 项目健康 / 合同回款风险）',
    handler: () => fetchCommand('/api/workbench/actions'),
  })
  ctx.commands.register({
    name: 'fde-drafts',
    description: '列出 Hyreal 平台待修订草稿（dsh 侧生成，FDE 确认后才可对客）',
    handler: () => fetchCommand('/api/workbench/drafts'),
  })

  ctx.systemPrompt.section({
    name: 'hyreal-fde:work-rules',
    order: 80,
    text: FDE_WORK_RULES,
    interpolate: false,
  })
}
