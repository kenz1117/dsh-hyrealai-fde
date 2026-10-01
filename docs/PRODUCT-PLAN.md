# Hyreal FDE × dsh：完整产品方案（v1 草案，待评审）

> 2026-10-01。定位声明（用户原话校准）：**即使 FDE 永远不登录网页平台，也能在 dsh 里完整完成系统内的绝大部分操作——插件的目标是替代平台的前台部分，而不是给平台配一个看板。**

## 1. 产品定位与原则

1. **对话优先**：一切能力 = Agent 工具（mcp__fde__*）+ 方法论技能（剧本 skills）；界面是"态势面板 + 行动入口"，不是数据截图。
2. **看板每格可行动**：面板上每个卡片/行都有"喂给 Agent"的动作，看板负责发现，Agent 负责执行。
3. **零平台登录**：PAT 即身份；日常操作全部 in-dsh。治理红线不放宽（AI 产出须 FDE 确认才对客），但**确认动作本身也要 agent 化**，而不是把用户踢回网页。
4. **网页退位**：平台网页降级为管理后台（管理员功能、审批台、复杂表单的兜底）。

## 2. 页面策略：单独页面 vs 重构 dsh 首页（结论：做成"主页"，不劫持会话）

- 事实：dsh 的 main 是 keyed 插槽，`conversation` 是保留键（会话首页）；我们目前注册的是**并列面板**（hyreal-fde-ai 键），没有动人家首页。
- **推荐：工作台升级为 dsh 的默认落地页**——启动/新开时默认选中工作台面板，会话仍是 Agent 工作区（左右互达）。
  - 落地手段（按优先级验证）：① dsh profile/插件是否支持注册 defaultPanel（查 boot/profile 配置面）；② sidebar 排序第一 + `settings.onboarding` 首次引导"把 Hyreal 工作台设为主页"；③ 最保守：保持现状但把工作台做成全功能页。
  - **不做**：覆盖 `conversation` 键或替换 app root（官方明令禁止，且会话是 Agent 的容器，不能自断）。
- 布局：**废除 maxWidth 居中细条**，改全宽响应式 12 栅格：宽屏三区（左 KPI+今日行动 / 中 客户+项目 / 右 草稿+快捷动作），中屏两区，窄屏单列。

## 3. 功能覆盖地图（替代前台的范围盘点，来源：平台 app/ 路由）

用户侧路由：clients、projects、diagnosis、deliverables、contracts、payments、knowledge、wiki、playbooks、learning、people、team、coaching、communication、notifications、data-hub、dashboard。

| 期 | 能力 | 形态 | 依赖 |
|----|------|------|------|
| P0（已上线） | 名下客户/项目/今日行动/四库检索/草稿入箱 | MCP 工具 + 面板 | 已部署 |
| P1（Agent 化主力） | 六套场景剧本（拜访/把脉/交付/答疑/售前/成员） | **skills 真正加载进 dsh**（spike 遗留项，最高优先） | skill 路径验证 |
| P1 | 诊断草稿（ANC-DIAG）、售前评估（PSF/场景匹配） | 已是 co-pilot 工具，挂 MCP + 富卡片 | structured output |
| P1 | 通知中心（列表/已读）、合同与回款只读 | 新端点 + 面板区块 | 平台侧小改 |
| P1 | 文档读/写（含个人库上传，write scope 已有接口） | MCP 工具 + 面板入口 | 平台已有 /api/documents |
| P2 | 草稿修订→转正式的闭环（accept/dismiss） | 平台端点 + agent 确认流 | 新端点 |
| P2 | 交付物生成（generate_deliverable，长任务） | MCP 工具（轮询/任务化） | 长超时通道 |
| P2 | 知识候选审批的 agent 内确认 | 平台开 agent 审批通道（安全设计专项） | 治理评审 |
| 不做 | 管理面（成员管理/渠道凭证/系统设置） | PAT 永久 403，符合平台安全设计 | — |

验收口径：列出 FDE 一周日常操作清单，P1 结束时 **≥80% 可全程 in-dsh 完成**；剩余项明确标注"回平台"。

## 4. 视觉重做（回应"真的很丑"+"中间一细条"）

- **全宽栅格**（见 §2），内容贴边利用工作区，不再居中细条。
- **层次**：问候 hero（"早上好，{姓名}" + 日期 + 平台状态点）→ KPI 数字块 4 枚（大数字小标签：今日行动/客户/项目/待修订）→ 分区卡片。
- **规范**：8pt 间距体系；字阶 20/15/13/12；卡片 hover 抬升（elevation token）；统一 chip/空态/加载骨架/错误三态；品牌色仅用于 hero 渐变与强调（官方规则允许 artwork 用字面色）。
- 每行/卡两个动作位：「问 AI」（预填 composer）+「打开」（平台深链，逐步减少）。

## 5. 关键技术缺口（平台侧，随 Sprint 统一部署）

1. **skills 加载验证**（①号硬点）：bundle 内 skills 的 customSkillDirs 相对路径 or 安装脚本拷贝到 ~/.dsh/skills——打通后六剧本即刻生效。
2. **composer 预填接口**（②号硬点）：卡片"问 AI"→ 预填会话输入（查 ui-conversation 的 composer store/command 面；不行则用斜杠命令带参兜底）。
3. structured output（工具富卡片数据）、通知/合同/回款只读端点、me 端点（已写好未部署）。
4. 草稿 accept/dismiss 端点（P2）。

## 6. 执行计划（统一部署，中途不单独上线）

- **Sprint 1**：skills 打通 → 首页视觉重做（全宽栅格+KPI+问候）→ composer 动线验证。验收：dsh 里说"帮我准备明天见大连圣亚"，agent 按剧本跑完并出结构化卡片；面板全宽不丑。
- **Sprint 2**：六剧本 skills 化 + structured output 富卡片 + 通知/合同/回款面板 + 文档读写工具。
- **Sprint 3**：诊断/交付物流 + 草稿闭环 + 默认主页落位 + 覆盖率验收（≥80% in-dsh）。
- 每个 Sprint 末统一部署一次；me 端点等存量提交随 Sprint 1 一起上。

## 7. 功能差距清单（2026-10-01 核查，回应"功能单薄"）

已覆盖（registry 同源自动可见）：项目速览/行动推荐/ANC 诊断/PSF 三关/场景匹配/打法手册/三源知识检索/知识反哺/培训讲义/成员查找与诊断上下文/答复包/问题预测/沟通草稿/AI 异步任务 + 面板（客户/项目/行动/草稿箱）+ 数据中台连接器（run_tool 经授权）。

| # | 缺口 | 补齐形态 | 优先级 |
|---|------|---------|--------|
| G-1 | 通知中心（列表/未读数/已读） | 端点 + 面板区块 + 工具 `list_my_notifications` | P1 |
| G-2 | 合同与回款明细（名下合同/到期回款） | 端点 + 工具 `list_my_contracts` / `list_due_payments` | P1 |
| G-3 | 沟通记录历史（按客户） | 工具 `list_client_communications`（只读） | P1 |
| G-4 | 交付物全量列表与读取 | 工具 `list_deliverables` / `read_deliverable` | P1 |
| G-5 | 文档创建/更新/删除（write scope） | MCP 包装 /api/documents 三方法 | P1 |
| G-6 | 学习中心（课程/进度，guest 白名单已有 API） | 工具 + 面板入口 | P2 |
| G-7 | 草稿修订闭环（accept/dismiss 转正式） | 端点 + 工具 + 治理流 | P2 |
| G-8 | 面板行深链平台页（过渡期） | 行级"打开"链接 | P2 |
| G-9 | 汇报/周报生成（progress-report 技能已有，缺数据工具支撑） | 随 G-2/G-4 自然补齐 | P2 |

实施顺序：P1 五项一个端点批次（/api/workbench 扩展 + MCP 本地工具追加）一次部署；P2 随治理评审。
