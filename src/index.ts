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

  // 专家套件：一个入口，按参数分支（避免命令菜单杂乱）
  ctx.commands.register({
    name: "fde",
    description: "Hyreal FDE 专家套件：/fde 查看全部剧本与数据，/fde now 今日行动，/fde drafts 草稿箱，/fde visit|project|deliver|qa|psf|member 对应剧本",
    input: { hint: "[now|drafts|visit|project|deliver|qa|psf|member]" },
    handler: (invocation) => {
      const sub = (invocation.rawInput || "").trim().toLowerCase();
      if (sub === "now") return fetchCommand("/api/workbench/actions");
      if (sub === "drafts") return fetchCommand("/api/workbench/drafts");
      if (sub) {
        const plays: Record<string, string> = {
          visit: "剧本A·客户拜访准备：向 Agent 说「帮我准备明天见 XX 客户」——预测问题+答复包+打法手册（技能 prepare-reply/predict-questions）",
          project: "剧本B·项目现状把脉：说「XX 项目最近怎么样」——全貌+洞察+行动推荐+阶段诊断（技能 anc-diagnosis）",
          deliver: "剧本C·阶段交付产出：说「帮我把这阶段交付做出来」——诊断底稿+讲义+RAG 论证（技能 deliverable-generation）",
          qa: "剧本D·答疑与知识弹药：说「客户问的 XX 我没把握」——三源检索+手册+RAG 分析（技能 knowledge-retrieval）",
          psf: "剧本E·售前评估：说「这个单子该不该接」——PSF 三关+场景匹配（技能 psf-evaluation）",
          member: "剧本F·成员能力评估：说「帮我评估一下 XX 的能力」——1444 模型行为证据评估（技能 member-diagnostic）",
        };
        return { kind: "success", text: plays[sub] ?? "未知子命令：now/drafts/visit/project/deliver/qa/psf/member" };
      }
      return { kind: "success", text: "Hyreal FDE 专家套件。六套剧本——visit 拜访准备 / project 项目把脉 / deliver 交付产出 / qa 答疑弹药 / psf 售前评估 / member 成员评估；数据——now 今日行动 / drafts 草稿箱。更可以直接向 Agent 说出需求，它会按剧本自动调用平台工具。" };
    },
  });

  ctx.systemPrompt.section({
    name: 'hyreal-fde:work-rules',
    order: 80,
    text: FDE_WORK_RULES,
    interpolate: false,
  })
}
