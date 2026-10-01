# AGENTS.md

本仓库是 dsh 原生插件（hyreal-fde-ai）。给 agent 的开发约定：

1. **宿主只认构建产物**：改完 `src/` 必须 `pnpm build` 后再在 dsh 里验证；`lib/` 不入库。
2. **类型垫片单一来源**：dsh 服务签名都在 `src/dsh-types.ts`（对照 dsh 源码核实）——dsh 升级先核对这个文件，不要在业务代码里散落结构假设。
3. **PAT 只在 host 半**：浏览器代码禁止接触令牌；新增平台取数一律走 `/fde/*` 代理，并在 `src/host/proxy.ts` 的 `PROXY_ALLOWED_PREFIXES` 显式登记前缀（最小开放面）。
4. **client 半依赖纪律**：external 仅 `scripts/build.mjs` 里 `PLATFORM_MODULES` 9 项；禁止 require `@deepseek-ai/dsh-client-ui-primitives`；第三方依赖可以打进 bundle。
5. **样式**：只用 `--dsw-*` 主题 token；**文案**：一律进 `src/client/i18n.ts` 词典（zh/en 键集一致）。
6. **工具卡片**：`tool.call.toolview` 的 key 是 wire 名（`mcp__fde__*`），改名/新增工具后以 `cordis_inspect_query` 实测为准；视图组件必须防御性取数，绝不抛错。
7. **技能包**：`skills/` 由 `pnpm sync:skills` 生成（源：`../ai-fde/.agents/skills`），不要手改生成物。
8. **验证**：`pnpm smoke`（host 冒烟）+ `pnpm typecheck` 必须全绿再提交。
