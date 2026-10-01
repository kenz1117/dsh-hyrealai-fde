# hyreal-fde-ai

**Hyreal FDE工作台**的 dsh（DeepSeek Harness）原生插件：在 dsh 界面里长出企业工作台——侧边栏入口、结构化页面、工具结果卡片；数据经 **MCP（工具通道）**与**同源代理（页面通道）**取自 Hyreal FDE 平台。

> 设计依据：`../ai-fde/docs/DSH-WORKBENCH-PROPOSAL.md`（v2，含自我审计记录）。
> dsh 源码克隆（API 签名核对基准）：`/tmp/dsh-research/deepseek-harness`。

## 平台地址（两个，不要混）

| 地址 | 值 | 用途 |
|------|-----|------|
| **API 基址** | `https://fde.goodpoint.top` | `/api/*` 都挂在这（与平台接入文档 `GET /api/skill-doc` 的 `AI_FDE_BASE_URL` 口径一致） |
| **网页入口** | `https://fde.goodpoint.top/brain` | "打开平台"链接的去处（智脑页） |

令牌签发页：`https://fde.goodpoint.top/settings/tokens`（网页与应用同域根挂载）。

## 架构

```
dsh（每个 FDE 本地）
└─ hyreal-fde-ai（双半插件）
   ├─ host 半（Node，持 PAT，一切对外 IO）
   │   ├─ /fde/* 同源代理 → 平台 API（白名单前缀 + 428 引导）
   │   ├─ /fde/meta、/fde/config 本地端点（接入配置）
   │   ├─ 斜杠命令 /fde-today /fde-drafts
   │   └─ systemPrompt 注入 FDE 工作规范
   ├─ client 半（浏览器，React 18 基线）
   │   ├─ sidebar.panellist「Hyreal FDE工作台」图标
   │   ├─ main 页：接入配置卡 + 今日行动 / 名下客户 / 名下项目 / 草稿箱
   │   └─ tool.call.toolview：mcp__fde__* 工具结果卡片
   └─ cordis.patch.yml：host 半条目 + @deepseek-ai/dsh-mcp-client 连接注入
```

## 用户配置（零环境变量）

接入配置在 **dsh 设置面板 →「Hyreal FDE」分区**（`settings.section` 插槽注册，不在工作台页上）：
状态一览（双地址 / PAT / AI 工具就绪度）+ 平台地址与令牌表单，保存即生效。
令牌在平台「设置 → 访问令牌」页签发（scope 勾选 `read` + `tool`）。
配置写入 `~/.dsh/hyreal-fde-ai.json`（0600 权限）；环境变量 `FDE_BASE_URL` / `FDE_PAT` 仅作运维/CI 覆盖通道。

> 注：MCP 工具通道（`mcp__fde__*`）的配置在 dsh 启动时读取；首次保存令牌后**重启 dsh** 工具才生效（页面数据即时生效）。

## 开发

```bash
pnpm install
pnpm build        # → lib/index.js（host ESM）+ lib/client.js（closure-factory）
pnpm smoke        # host 半冒烟：模块形状 + 代理 428/403/回源 + 命令错误路径 + 配置存取
pnpm typecheck
pnpm sync:skills  # 从 ../ai-fde/.agents/skills 同步技能包到 skills/
```

本地装入 dsh 调试：

```bash
pnpm build
dsh plugin --profile web add /path/to/hyreal-fde-ai
dsh web   # http://127.0.0.1:3080
```

验证工具卡片 wire 名（MCP 工具有 64 字符归一化规则）：会话内用 `cordis_inspect_query`
查 `mcp__fde__*` 实际注册名，再校对 `src/client/index.tsx` 的 toolview key。

## 约束（dsh 官方规范，违反会被宿主拒绝或样式崩坏）

- client 半 external 仅限平台冻结基线 9 模块（React 18 在列）；**禁止 require `ui-primitives`**，自绘控件；
- 样式只用主题 token（`--dsw-alias-*` / `--dsw-radius-*`）；语义色集中在 `src/client/ui.tsx` 的 palette；
- 可见文案一律走 `ctx.locale.register` 的 zh/en 词典（键集必须一致）；
- PAT 只在 host 半（Node）使用，浏览器只打同源 `/fde/*`。

## 发布（Phase 2 落地时）

私有 registry（verdaccio，随平台 docker-compose）发布后，用户侧两步：
`dsh plugin add hyreal-fde-ai` → 打开「Hyreal FDE工作台」完成接入配置卡。
