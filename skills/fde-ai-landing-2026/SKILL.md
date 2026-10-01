---
name: fde-ai-landing-2026
description: "企业 AI 落地与 FDE 驻场方法论（21 能力卡 + 7 Playbook）：驻场流程、POC 验收、成熟度诊断、90 天 L4、FDE 能力模型、经验蒸馏、Agent 治理与知识飞轮。Use when advising on AI delivery methodology, maturity diagnostics, or agent governance."
version: 1.0.0
when-to-use: 咨询驻场交付流程/质量门禁/POC 验收标准、企业 AI 成熟度诊断、L3→L4 组织提效与 90 天计划、FDE 能力培养、经验沉淀与知识飞轮治理、Agent 权限/护栏/可控性设计、制造业 AI 试点选场景时
avoid-when: 需要检索企业内部客户数据时走 enterprise-qa；纯模型选型/微调技术问题、与 AI 落地无关的一般软件工程或管理咨询不适用
output: 按意图路由的方法论解答（核心原则 + 按需加载能力卡/Playbook 的结构化执行指引）
risk-level: low
---
# 企业 AI 落地与 FDE 驻场方法论五件套 — 来源路由入口（compact pack）

## 触发与不触发

**适用**：与本书能力域相关的咨询与任务（见下方路由表的意图列）。
**不适用**：
- 纯模型选型/微调技术问题（无落地场景语境）
- Palantir 公司史、薪酬行情等背景八卦类查询
- 与 AI 落地无关的一般软件工程或管理咨询

## 核心原则（常驻速览，概览类问题读到这里即可回答）

1. AI 落地失败极少败于模型不够强，多败于最后一公里断裂——需求被误读、数据不可用、系统接不进、现场没人管、价值没人算。
2. 业务指标是唯一验收标准；技术指标只是过程监控，AI 必须成为流程的默认路径才算组织级落地。
3. 现场本位高于技术本位：模型与现场不符时，错的是模型；一次优化必须沉淀为可复用资产，否则就是高级外包。
4. 一次性部署已死——没有部署后持续迭代机制（FDR 式下半场）的 AI 产品是不合格产品。
5. 经验必须经候选→验证→审批→合并→评估才能成为公司资产；自动化止步于提案，真相只由人改写。
6. 个人省时间 ≠ 组织提效；L3→L4 的鸿沟靠选对切入点、建平台而非单点、组织与 KPI 同步调整来跨越。
7. 确定性的部分交给工程，推理只发生在可控空间内；护栏先于信任到位，才能外移执行权。

## 能力路由（先读本表，按意图加载 1 张能力卡）

| 用户意图 | 先读 | 补读/备注 |
|---|---|---|
| 驻场交付怎么标准化；FDE 进场前后各阶段该做什么；项目质量门禁怎么设；客户需求说不清怎么挖；POC 验收标准怎么定；项目 ROI 怎么核算；驻场复盘怎么沉淀资产 | references/playbooks/four-nines-station-playbook.md（完整 Playbook） | 快速浏览可用 references/capabilities/four-nines-station-playbook.md 卡片 |
| 制造业 AI 怎么落地；想试点 AI 从哪个场景切入；候选场景太多怎么选；只有几百条数据能不能做模型；企业想低成本试 AI 怎么入场；AI 项目为什么总失败 | references/playbooks/slp-scene-link-pilot.md（完整 Playbook） | 快速浏览可用 references/capabilities/slp-scene-link-pilot.md 卡片 |
| 我们企业 AI 用到什么水平了；企业 AI 成熟度怎么评估；为什么全员用 Copilot 却没见业务改善；这个 AI 项目该不该接 | references/playbooks/ai-maturity-diagnostic.md（完整 Playbook） | 快速浏览可用 references/capabilities/ai-maturity-diagnostic.md 卡片 |
| 怎么从个人提效走到组织提效；L4 达标怎么验收；AI 转型 90 天计划怎么排；AI 提效怎么度量才算数 | references/playbooks/ninety-day-l4-playbook.md（完整 Playbook） | 快速浏览可用 references/capabilities/ninety-day-l4-playbook.md 卡片 |
| 怎么鉴别真 FDE 还是换皮岗位；FDE 能力怎么分级定级；FDE 培训课程怎么设计；复合型 AI 人才怎么培养 | references/playbooks/fde-competency-model.md（完整 Playbook） | 快速浏览可用 references/capabilities/fde-competency-model.md 卡片 |
| 项目经验怎么沉淀成可复用资产；服务商怎么避免沦为高级外包；跨客户复用怎么防泄密；能力积木/组件库怎么建 | references/playbooks/experience-distillation.md（完整 Playbook） | 快速浏览可用 references/capabilities/experience-distillation.md 卡片 |
| AI 产出怎么治理才不污染公司知识；知识飞轮怎么建；AI 经验怎么变成可审计的公司资产；自动化与人工审批的边界怎么划 | references/playbooks/knowledge-flywheel-governance.md（完整 Playbook） | 快速浏览可用 references/capabilities/knowledge-flywheel-governance.md 卡片 |
| 企业 AI 架构怎么分层；本体论 Ontology 怎么建；AI 项目总从技术出发怎么办 | references/capabilities/chinese-ontology-cake-triad.md | references/capabilities/slp-scene-link-pilot.md、references/capabilities/localization-risk-matrix.md |
| 模型上线后效果衰减怎么诊断；持续迭代机制怎么设计；供应商说重新训练另收费怎么办 | references/capabilities/fde-fdr-loop.md | references/capabilities/four-nines-station-playbook.md、references/capabilities/experience-distillation.md |
| 一人公司怎么起步；超级个体概念怎么拆解；要不要注册公司独立接单 | references/capabilities/fde-opc-opt-trio.md | references/capabilities/fde-competency-model.md |
| FDE 落地有什么风险；行业障碍/信任税怎么归因；人才缺口怎么解 | references/capabilities/localization-risk-matrix.md | references/capabilities/experience-distillation.md、references/capabilities/fde-competency-model.md |
| 数字员工怎么建；团队用 AI 但质量不稳卡在哪；云上 Scrum 是什么 | references/capabilities/digital-employee-evolution.md | references/capabilities/ninety-day-l4-playbook.md、references/capabilities/trust-boundary-shift.md |
| Agent 不可控乱操作怎么收口；高确定性场景 Agent 怎么设计；别用纯 ReAct 怎么替代 | references/capabilities/agent-controllability-four-components.md | references/capabilities/guardrail-tri-state.md、references/capabilities/data-loop-dual-supply.md、references/capabilities/agent-permission-principles.md |
| bad case 怎么归因；产品效果停滞怎么找杠杆；失败轨迹怎么变能力 | references/capabilities/data-loop-dual-supply.md | references/capabilities/agent-controllability-four-components.md、references/capabilities/knowledge-flywheel-governance.md |
| AI Coding 体系怎么建；AI 写代码不可靠怎么治；接入 AI 工具后还缺什么 | references/capabilities/ai-native-reliable-delivery.md | references/capabilities/context-assets-trio.md、references/capabilities/env-verification-driven.md |
| AI 友好知识库怎么建；Agent 重复踩坑怎么治；新事实要不要回写 | references/capabilities/context-assets-trio.md | references/capabilities/ai-native-reliable-delivery.md、references/capabilities/knowledge-flywheel-governance.md |
| 换强模型但成功率没涨怎么决策；Spec 该规定多细；研发平台投资优先级怎么排 | references/capabilities/env-verification-driven.md | references/capabilities/ai-native-reliable-delivery.md |
| 哪些能交给 Agent 做；什么时候能放手让 Agent 动生产环境；人机分工怎么划 | references/capabilities/trust-boundary-shift.md | references/capabilities/agent-permission-principles.md、references/capabilities/digital-employee-evolution.md |
| Agent 权限怎么管；子 Agent 权限怎么给；Agent 请求被拒怎么返回 | references/capabilities/agent-permission-principles.md | references/capabilities/secrets-never-materialize.md、references/capabilities/guardrail-tri-state.md、references/capabilities/trust-boundary-shift.md、references/capabilities/knowledge-flywheel-governance.md |
| Agent 自动发布的安全门禁怎么设计；Agent 自报检查都通过能不能放行；质量门禁怎么自动化 | references/capabilities/guardrail-tri-state.md | references/capabilities/agent-permission-principles.md、references/capabilities/agent-controllability-four-components.md、references/capabilities/knowledge-flywheel-governance.md |
| API key 能不能给 Agent；沙箱环境变量安全吗；凭证注入点怎么设计 | references/capabilities/secrets-never-materialize.md | references/capabilities/agent-permission-principles.md、references/capabilities/knowledge-flywheel-governance.md |

**非能力类查询**：
- 书名/作者/章节/整书概览 → references/overview.md
- 术语解释 → references/glossary.md
- 决策规则速查（不需要原文依据时） → references/cheatsheet.md
- 完整意图与关键词索引（本表未覆盖的意图先查这里） → references/capability-index.md

## 加载规则

- 每次任务先读本文件，再按路由表加载 **1** 张能力卡；任务明确跨域时最多加载 2 张。
- 需要深度执行（完整步骤、工具表、门禁细节）时，读对应 references/playbooks/ 下的完整 Playbook，卡片只作快速索引。
- 概览/书名类问题不加载能力卡，用「核心原则」与 overview.md 回答。
- 路由表与 capability-index.md 都无法命中的意图，明确告知超出本书范围，不要硬套。

## 边界与判停

- 用户问的是与本能力域无关的通用问题——不加载能力卡，如实说明超出范围。
- 需要具体企业内部数据才能回答且用户无法提供——给出方法论框架即可，不编造数据。
- 案例数字仅来自服务商口径，给结论时必须标注这一局限，不得当作独立审计事实。
