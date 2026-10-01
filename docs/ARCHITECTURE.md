# 架构设计：One Key, One Contract, Many Hosts（v1）

> 2026-10-01。用户口径：无论用户在 dsh（我们的插件）、WorkBuddy、Codex 还是任何 agent 平台上使用，
> 调的都是**同一把钥匙（PAT）、同一套接口（契约）**——功能与权限原则上一致，差异只在实现方式与体验形态。
> 本文档与 PRODUCT-PLAN.md 互为姊妹篇：PRODUCT-PLAN 讲产品与体验，本文讲能力架构与一致性。

## 1. 三层架构

```
┌─────────────────── 宿主适配层（只加工效，不加能力） ───────────────────┐
│ dsh 插件（MCP+工作台面板+剧本 skills+卡片动线）                          │
│ WorkBuddy / Codex / 千问 / 豆包（SKILL.md 文档流程——文档就是它们的插件）  │
│ 任意 MCP 客户端（tools/list 自动发现）                                   │
└──────────────────────────────┬───────────────────────────────┘
                               │ 同一把 PAT（Bearer）
┌──────────────────────────────▼───────────────────────────────┐
│ 能力层（平台，唯一实现）                                        │
│  · 工具执行：GET /api/co-pilot/tools（发现）+ POST apply-skill（执行）│
│  · AI 异步：POST /api/ai-tasks + GET /api/jobs/{id}              │
│  · 数据读写：/api/documents、/api/brain/*、/api/workbench/*        │
│  · 身份：PAT → RBAC ∩ scope，全通道一致；审计逐调用留痕              │
└──────────────────────────────┬───────────────────────────────┘
                               │ 契约先行
┌──────────────────────────────▼───────────────────────────────┐
│ 契约层（唯一事实源）                                            │
│  .trae/skills/ai-fde-api/SKILL.md（+ references/api.md）          │
│  经 GET /api/skill-doc（Bearer）分发；版本化；新能力先改契约再实现   │
└───────────────────────────────────────────────────────────────┘
```

## 2. 契约层纪律（单一事实源）

1. **契约先行**：任何新能力（如 workbench 端点、草稿、me）先写入 SKILL.md（scope 语义、端点、参数、审计口径），再实现——文档不是部署后的附带品，是 spec。
2. **版本化**：SKILL.md frontmatter 加 `version`；破坏性变更升主版本并在文档内标注迁移说明；宿主按文档自举（agents 被要求先 GET /api/skill-doc 再干活，天然拿到最新版）。
3. **同步即分发**：契约文件在仓库内更新 → /api/skill-doc 即时分发 → 所有宿主的 agent 下次自举自动对齐，无需逐宿主升级。
4. **与现状对齐**：SKILL.md 已定义 read/ai/tool/write scope、工具码白名单（PROJ-BRIEF-01 等 14 个）、审计与限流红线——它是既成事实的标准，我们要做的是让所有实现向它收敛，并随功能演进迭代它。

## 3. 能力层收敛（消除双轨实现）

当前偏差：MCP 通道（lib/agent/tools-mcp.ts 精选 14 工具）与 apply-skill 通道（co-pilot 工具注册表）是**两套清单**——违背"功能一致"原则。收敛方案：

1. **tools/list 动态镜像**：MCP 的 tools/list 不再硬编码，改为实时映射 co-pilot 工具注册表（`GET /api/co-pilot/tools` 同源数据：code/description/inputSchema），工具名 `fde_<code>`（或保留 toolCode 原名）。**平台新增工具，dsh 侧零改动自动可见**（GitHub MCP toolsets 同款做法）。
2. **tools/call 同源执行**：MCP 调用统一路由到 apply-skill 同一实现（runServerTool 链路：Skill 表审批校验 + 连接器授权 + fdeId 强制覆盖 + EventLog 留痕），禁止旁路。
3. **归属口径修正**：canonical agent 面的权限 = **RBAC ∩ scope**（与 apply-skill 完全一致）；智驾 personal-scope（名下客户）只属于应用内智驾助手，不再作为 MCP 全局边界。`get_my_*` 类工具保留，但语义是"调用者身份派生"而非独立权限体系。
4. **UI 数据端点**（/api/workbench/*）与工具共用同一领域实现（已做），仅作为面板投影，不构成第二能力面。

## 4. 宿主适配层（各宿主做什么、不做什么）

| 宿主 | 载体 | 体验形态 | 明确不做 |
|------|------|---------|---------|
| **dsh 插件** | MCP + 面板 + 剧本 skills + 卡片动线 | 最佳体验：态势面板、一键问 AI、结构化工具卡片、六剧本 skills | 不新增契约外能力 |
| **WorkBuddy/Codex/千问/豆包** | SKILL.md 文档 + Bearer | 文档自举四步（读手册→验连通→封装→守红线），已在线运行 | 同上 |
| **任意 MCP 客户端** | 动态 tools/list | 接上即用 | 同上 |

适配层允许的"差异"：UI 呈现、快捷动线、本地缓存。不允许的"差异"：工具集裁剪/扩写、权限放宽、绕过审计。

## 5. 实施变更清单（随 Sprint 统一部署）

- [ ] MCP tools/list 动态镜像 co-pilot 注册表；tools/call 桥接 apply-skill 同源链路（tools-mcp.ts 重构）
- [ ] 契约回写：把 workbench 端点（me/actions/clients/projects/drafts）、草稿入箱、（规划中）通知/合同回款/文档读写补进 SKILL.md + references/api.md，frontmatter 加 version
- [ ] 插件 skills 策略：剧本六套打包；"ai-fde-api" 契约技能改为运行时从 /api/skill-doc 拉取（或构建时同步生成），杜绝双源漂移
- [ ] systemPrompt 工作规范引用契约版本号
- [ ] 富卡片依赖的 structured output（MCP 规范 2025-06-18）随 MCP 层重做一起上

## 6. 行业对齐自查

- 契约先行 + 单一事实源：对齐 API-first / spec-driven 惯例；
- 动态工具发现：对齐 GitHub MCP server 的 toolsets 模式；
- 方法论与工具分离（skills 讲"何时怎么用"，tools 讲"能做什么"）：对齐 Anthropic skills 设计；
- 宿主适配器模式：对齐 SaaS remote-MCP + 官方 skill 包的组合打法（CloudBase/GitHub/Notion 同款）。
