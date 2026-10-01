# dsh-hyrealai-fde

**Hyreal FDE 工作台的 [DeepSeek Harness（dsh）](https://github.com/deepseek-ai/deepseek-harness) 原生插件** —— 把企业工作台长进 dsh 界面：侧边栏入口、结构化首页、工具结果卡片、设置分区；Agent 在会话里直接调用平台能力。数据经 **MCP（工具通道）**与**同源代理（页面通道）**取自 Hyreal FDE 平台。

> 设计文档：[docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md)（产品与体验）· [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)（One Key, One Contract, Many Hosts 能力架构）

## 它解决什么问题

FDE（Forward Deployed Engineer）的日常——客户拜访准备、项目把脉、售前评估、交付产出、知识沉淀——不再需要登录网页平台：**打开 dsh 就是工作台，会话里说一句话，Agent 按剧本调用平台工具干活**。网页平台退居管理后台。

## 功能

**工作台面板**（dsh 打开即落，首页融合）
- 问候 hero + KPI 数字块（今日行动 / 客户 / 项目 / 草稿）
- 左列：今日行动 → 合同与回款 → 名下客户 → 名下项目 → 草稿箱（行内 ✓/✗ 接受或驳回）
- 右栏：工作汇报（近 N 天六格）+ 通知中心
- 客户行「打开 ↗」深链平台详情页

**Agent 能力**（`mcp__fde__*`，与平台接入契约同源同权）
- 注册表镜像：平台 server_tool 全量动态可见（PROJ-BRIEF-01 / PSF-EVAL-01 / KB-SEARCH-01 …），执行走 apply-skill 同一链路
- 工作台专属：名下客户/项目/今日行动/通知/合同回款/交付物/沟通记录/学习进度/周报汇总、四库检索、草稿入箱与 accept/dismiss 闭环、个人知识库上传

**FDE 方法论技能**：启动时自动同步领域技能包（PSF 评估、ANC 诊断、客户调研、答复包、成员诊断……）到 dsh 技能目录——Agent 按 FDE 剧本干活，而不是等指令。

## 快速开始

```bash
# 1) 装入 dsh
dsh plugin --profile web add /path/to/dsh-hyrealai-fde

# 2) 打开 dsh，完成接入
dsh web                     # http://127.0.0.1:3080
# Settings → Hyreal FDE → 粘贴平台访问令牌（PAT）→ Save & Connect
```

- 令牌在 Hyreal FDE 平台「设置 → 访问令牌」签发，scope 勾选 `read + tool`
- 保存即生效（写 `~/.dsh/dsh-hyrealai-fde.json`，0600）；**AI 工具通道需重启 dsh 后生效**（页面数据即时）
- 环境变量 `FDE_BASE_URL` / `FDE_PAT` 仅作运维覆盖

## 架构

```
dsh（每个 FDE 本地）
└─ dsh-hyrealai-fde（host + client 双半插件）
   ├─ host 半（Node，持 PAT，一切对外 IO）
   │   ├─ /fde/* 同源代理 → 平台 API（白名单前缀 + 428 引导）
   │   ├─ /fde/meta、/fde/config 本地端点（接入配置与迁移）
   │   ├─ 斜杠命令 /fde-today、/fde-drafts
   │   ├─ systemPrompt 注入 FDE 工作规范
   │   └─ 启动同步 FDE 技能包到 ~/.dsh/skills
   ├─ client 半（React 18，主题 token，zh/en）
   │   ├─ sidebar.panellist 入口 + 启动落位工作台
   │   ├─ main 页：hero + KPI + 六分区
   │   ├─ settings.section：接入配置与状态
   │   └─ tool.call.toolview：mcp__fde__* 结果卡片
   └─ cordis.patch.yml：host 条目 + @deepseek-ai/dsh-mcp-client 注入
```

安全模型：**PAT 只存在于 host 半（Node）**，浏览器只打同源 `/fde/*`；代理白名单收敛开放面；服务端按 PAT 归属执行个人边界（RBAC ∩ scope）并全量审计。

## 开发

```bash
pnpm install
pnpm build        # lib/index.js（host ESM）+ lib/client.js（closure-factory）
pnpm typecheck
pnpm smoke        # host 冒烟：模块形状 + 代理 428/403/回源 + 命令 + 配置存取
pnpm sync:skills  # 从 ai-fde 仓库同步技能包（.agents/skills + .trae/skills 契约技能）
```

改完 `src/` 后：`pnpm build` → **重启 dsh**（client bundle 在启动时缓存）→ 刷新页面。

## 约束（dsh 官方规范）

- client 半 external 仅平台冻结基线 9 模块（React 18 在列）；禁止 require `ui-primitives`
- 样式只用主题 token（`--dsw-*`）；语义色集中在 `src/client/ui.tsx` 的 palette
- 可见文案走 `ctx.locale` 词典（zh/en 键集一致）；**client 半禁止 `process.*`**
- PAT 只在 host 半；工具卡片视图绝不抛错

## License

[MIT](LICENSE)
