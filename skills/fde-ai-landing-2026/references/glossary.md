---
title: 企业 AI 落地与 FDE 驻场方法论五件套 — 术语词典
summary: 59 条关键术语（阶段3定稿版），含 6 处跨文档口径冲突标注
read_when: 需要确认某个术语在本书中的作者定义或跨文档差异时
---

# 关键概念词典（glossary）— 企业 AI 落地与 FDE 驻场方法论五件套

> 阶段 1 产出 · glossary-extractor。
> 收录标准：在 ≥1 份素材中有作者特定定义、且对理解这套方法论必需的术语。
> 出处约定：`station-guide` = sources/daren-fde-station-guide-76p.txt（页码为文中 `===== 第N页 =====` 标记）；`manufacturing` = sources/daren-fde-manufacturing-141p.txt；`tiqiao` = sources/tiqiao-framework-2.0.md；`aliyun` = sources/aliyun-ai-native-dev.md；`anc` = sources/anc-architecture.md（行号）。
> 同一概念在多份文档用法有差异的，在 `key_distinction` 中显式标注。

---

## A. 岗位与角色

```yaml
- id: g01
  term: FDE（前沿部署工程师）
  en: Forward Deployed Engineer
  source_chapter: station-guide 附录D（第64页）+ manufacturing 附录A（第120页）+ 两书第1章
  author_definition: |
    station-guide：「进驻客户现场，将 AI 平台能力与真实业务场景结合并交付价值的复合型工程师岗位，
    由 Palantir 于 2003 年前后开创。」
    manufacturing：「Palantir 提出的职业角色：驻场客户一线，将技术能力与业务场景深度融合，
    对交付结果负责的建造者。」
  key_distinction: |
    ≠ 驻场实施工程师／会写代码的售前——station-guide 第1章给了对比矩阵：实施工程师"对部署完成负责"、
    售前"签单后退出"、咨询顾问"不对执行结果负责"；FDE 对业务结果兜底（产能真提升才算完）。
    七成以上时间在现场开发调试，有需求决策权。
  why_it_matters: 全套方法论的主角。所有 skill 中 FDE 一词必须按"对结果负责的驻场建造者"使用，
    不能滑向"高级外包实施"的常识义。
  tags: [term, core-concept]

- id: g02
  term: 中国式 FDE
  en: Chinese-style FDE
  source_chapter: station-guide 附录D（第64页）+ §1.5（第12-13页）
  author_definition: |
    「中国式 FDE 结合中国制造业语境与服务体系形成的 FDE 本土化实践体系，以『四重九式』方法论、
    工具表系统与能力晋级体系为特征。」
  key_distinction: |
    ≠ 硅谷 FDE 的直接翻译：本土特征为"进场先补数据课"、决策链条长、国企合规刚性、
    需"轻驻场＋远程陪跑"的弹性成本组合。大任智库以此为培训认证体系的总品牌词。
  why_it_matters: 区分"模式本身"与"本土化作业体系"两个层次；引用时需指明指哪一层。
  tags: [term, core-concept]

- id: g03
  term: FDR（前沿部署研究员）
  en: Frontier Deployment Researcher
  source_chapter: manufacturing 附录A（第120页）+ 第3章（第41-58页）
  author_definition: |
    「上海交大团队提出：负责 FDE 部署后的模型持续迭代优化，让工业 AI 从『一次性部署』
    走向『动态进化』。」第3章展开为 FDE 的「下半场」：技术反馈平台承接返修与迭代。
  key_distinction: |
    ≠ 运维：不是保持系统可用，而是让模型随工艺/订单/设备老化持续进化。
    ≠ FDE 的下级：是协同体系中的另一半——FDE 管"交付"，FDR 管"交付之后"。
  why_it_matters: |
    只出现在 manufacturing 白皮书，station-guide 通篇无此词（已核验 0 命中）。
    引用 FDE+FDR 协同时必须注明出处，不可混入 station-guide 的九式流程语境。
  tags: [term, core-concept]

- id: g04
  term: 三栖模型（20-30-50）
  en: Three-Habitat Capability Model
  source_chapter: station-guide §1.4（第12页，行278）+ 行1348（Bob McGrew 口径）
  author_definition: |
    「FDE 的能力结构可概括为『三栖模型』：约 20% 销售能力（理解客户、建立信任、推动决策）、
    30% 产品能力（需求分析、方案设计、价值测算）、50% 工程能力（开发、集成、部署、排障）。」
    选拔培养口诀：「工程打底、业务加码、产品点睛」。
  key_distinction: |
    ≠ manufacturing 白皮书的"三懂"（懂业务/懂场景/懂AI，见 g18）：同书系两种能力表述并存，
    三栖是 station-guide 的口径，三懂是 manufacturing 的口径，不可互相替换。
  why_it_matters: 下游做 FDE 能力模型/课程设计类 skill 时，须按所选白皮书选口径，不能拼接。
  tags: [term, core-concept]

- id: g05
  term: 真FDE五条鉴别标准
  en: Five Criteria of a Genuine FDE
  source_chapter: station-guide §1.4（行283-287）
  author_definition: |
    「一看薪酬结构（底薪+绩效+股权，无销售提成）；二看工作内容（七成以上时间现场开发与调试）；
    三看产品回流通道（把现场经验沉淀为产品通用能力）；四看进场时机（签单后进场、对落地兜底）；
    五看需求决策权（可自主研判、优化乃至拒绝无效需求）。」
  key_distinction: |
    是鉴别标准而非岗位说明书——用于识别市场上"换皮"包装的假 FDE（实为实施/售前）。
  why_it_matters: 是批判视角（BOOK_OVERVIEW 第3节"高级外包"反对意见）的直接回应材料。
  tags: [term, checklist]

- id: g06
  term: FDE能力晋级体系
  en: FDE Capability Levels
  source_chapter: manufacturing 附录A（第122页）+ station-guide §1.5（第12-13页）
  author_definition: |
    manufacturing：「FDE 三级能力体系（L1 应用级 / L2 技能级 / L3 架构级）」，能力靠"做出作品"
    测评，不是笔试。
    station-guide：晋级路径为「初级场景工程师—中级场景专家—高级首席场景官」。
  key_distinction: |
    ★同一书系两份白皮书表述不同：manufacturing 用 L1/L2/L3 三级，
    station-guide 用场景工程师/专家/首席场景官。层级意涵相近但命名与测评口径不同。
  why_it_matters: 任何涉及 FDE 分级的 skill 必须先声明采用哪套口径。
  tags: [term, naming-conflict]

- id: g07
  term: 三懂人才观
  en: Three-Understandings Talent View
  source_chapter: manufacturing 附录A（第123页）
  author_definition: |
    大任智库提出：「懂业务、懂场景、懂AI」（2026年6月"培育中国式FDE"研讨会提出）。
  key_distinction: ≠ 常识的"复合型人才"：三者有确定次序——业务第一、AI 第三，与纯技术岗相反。
  why_it_matters: manufacturing 白皮书的 FDE 能力口径（对应 station-guide 的三栖模型，见 g04 差异注）。
  tags: [term]

- id: g08
  term: 四步教练法
  en: Four-Step Coaching Method
  source_chapter: manufacturing 附录A（第123页）
  author_definition: 大任智库"中国式FDE"教练营教学法：「应知→应会→应做→应成」。
  key_distinction: ≠ 常见"讲-练-评"培训法：终点是"应成"（做出结果），不是"应会"（掌握技能）。
  why_it_matters: 培训类 skill 引用教学法时的固定四段结构。
  tags: [term]

- id: g09
  term: OPC（一人公司）
  en: One Person Company
  source_chapter: manufacturing §1.8（第26页）+ 附录A（第120页）
  author_definition: |
    「AI 时代个人借助 AI 工具独立完成全链路商业闭环的新型创业形态，法律上为一人有限责任公司。」
    §1.8：OPC 回答的是"怎么存在"——法律/商业实体选择。
  key_distinction: |
    ≠ OPT（能力形态）≠ FDE（职业角色）：三者不互斥，典型超级个体画像 =
    OPT 模式作战 + OPC 注册实体 + FDE 核心能力。
  why_it_matters: 三词极易混淆，下游 skill 引用前必须先分清问的是哪一层。
  tags: [term, core-concept]

- id: g10
  term: OPT（一人团队／单人作战单元）
  en: One Person Team
  source_chapter: manufacturing §1.8（第26页）+ 附录A（第120页）
  author_definition: |
    「一个人借助 AI 军团发挥整支团队效能的能力形态。」§1.8：OPT 回答"怎么作战"——能力放大方式。
  key_distinction: ≠ OPC：OPT 是能力形态不是法律实体；≠ 字面义的"一人小队"：强调 AI 军团放大。
  why_it_matters: 与 g09 配对使用，是"超级个体"论述的精确化。
  tags: [term]

- id: g11
  term: 超级个体
  en: Super Individual
  source_chapter: aliyun §1.2 案例二（行~55-70）+ tiqiao §1.3 L3
  author_definition: |
    aliyun：「1 人×3～5 个会话。产能锁在个人电脑与单个会话」——数字员工组织演进的第一期。
    tiqiao：L3 个人提效阶段的产物，「员工将 AI 深度融入个人工作流，形成一批超级个体」。
  key_distinction: |
    ≠ 泛义的"高效能个人"：五件套中特指产能仍锁在个人会话、无法团队化的阶段——
    它是演进起点而非终点，aliyun 明确列出其尴尬（协作靠人肉、夜间长任务无人接管）。
  why_it_matters: 在组织演进类 skill 中是"阶段一"的术语，不能当褒义词滥用。
  tags: [term, core-concept]

- id: g12
  term: 数字员工
  en: Digital Employee
  source_chapter: aliyun §1.2（行~60）+ station-guide 附录D（第65页）
  author_definition: |
    aliyun：「固定岗位·云上运行。需求分析、开发实现、测试验证。产能团队化，但协作与质量仍靠人兜底」
    ——演进第二期，"员工有了，但卡在协作上，人更多是传令兵"。
    station-guide 附录D：「以大模型与 RPA 等技术执行规则化业务流程的软件机器人」（= RPA 语境）。
  key_distinction: |
    ★用法差异：aliyun 指"云上运行的 Agent 岗位形态"（组织演进概念），
    station-guide 指 RPA 软件机器人（技术形态）。同词不同物，须按语境取义。
  why_it_matters: 混用会导致组织演进叙事与 RPA 自动化叙事错接。
  tags: [term, naming-conflict, core-concept]

- id: g13
  term: 云上 Scrum
  en: Cloud-based Scrum
  source_chapter: aliyun §1.2 案例二（行~62、行154-159）
  author_definition: |
    「数字员工小队·共同工程协议。计划、执行、验证、回顾。交付闭环自组织，人负责目标与验收。」
    具体化为两条供给线：经验 Loop + 手脚 Loop。
  key_distinction: |
    ≠ 敏捷开发改名：排期会/日会/总结会全部消失——因为 Agent 来活即起线程、卡点随时沟通、
    任务自带反思。人只保留两件事：Loop 维护（环境与验证）、寻找真需求（业务增长卡点）。
  why_it_matters: 组织演进第三期的核心概念；误当敏捷口号会丢失"自组织闭环+协议交接"的要义。
  tags: [term, core-concept]

- id: g14
  term: Loop（经验 Loop / 手脚 Loop / Loop 维护）
  en: Loop
  source_chapter: aliyun §1.2 案例二（行156-159、行~95）
  author_definition: |
    经验 Loop：策略挖掘与策略生产拆给两个数字员工，经结构化契约交接，交付周期 10 天→2 天。
    手脚 Loop：线上失败轨迹直接转化为能力建设需求（聚类→定位根因→补能力→回归评测→人工发布），
    约 80% 核心能力 Skill 化。人的职责："Loop 维护"集中于环境与验证问题。
  key_distinction: |
    ≠ 泛义的"闭环"：特指数字员工间以结构化契约为交接的供给线，且失败轨迹是输入而非废料。
  why_it_matters: 云上 Scrum 的具体机制载体，与"智能积木从失败轨迹 Skill 化而来"同构。
  tags: [term, core-concept]

## B. 驻场作业体系（station-guide 专用）

- id: g15
  term: 四重九式
  en: Four Stages × Nine Practices
  source_chapter: station-guide 第2章（行327-360）+ 附录D（第64页）
  author_definition: |
    「本白皮书方法论总纲：进场期、共创期、运营期、沉淀期四重阶段，九式（起手、听风、破译、
    合璧、试剑、镇场、传剑、归鞘、剑阵）依次展开。」四重分别解决：进得了场／干得成事／
    驻得住场／复制得开。九式即：第一式进场准备、第二式驻场观察、第三式需求确认、第四式方案共建、
    第五式原型验证、第六式交付运营、第七式协同开发、第八式复盘沉淀、第九式规模复制。
  key_distinction: |
    ≠ 项目管理阶段划分：「有门禁、有交付、有沉淀」的作业标准；九式首尾相衔成
    「观察—验证—交付—复盘—再出发」循环，"每走完一圈，下一圈都应当更快"。
    每式有武侠别名（起手式…剑阵式），引用时中文名与别名等价。
  why_it_matters: 项目级主流程骨架；skill 化时的最高频术语，各式名与门禁号必须配对准确。
  tags: [term, core-concept]

- id: g16
  term: 质量门禁（Gate）
  en: Quality Gate
  source_chapter: station-guide 附录D（第64页）+ §2.3（行477-486）+ 各式门禁 G1-G9（行584-1155）
  author_definition: |
    「阶段间放行机制：由交付项、签署凭证、检查清单三类要件构成，全项通过方可进入下一阶段。」
    九个门禁：G1 进场放行／G2 观察放行／G3 立项放行／G4 方案放行／G5 上线授权／G6 常态运营放行／
    G7 能力转移放行／G8 离场放行／G9 复制放行。
  key_distinction: |
    ≠ 柔性 checklist：阻断性关卡——"到通过门禁方可进入下一阶段"，且需客户签署凭证，
    不只是自检表。
  why_it_matters: "门禁"是四重九式区别于普通流程图的关键；下游引用时必须保留阻断语义。
  tags: [term, core-concept]

- id: g17
  term: 双闭环
  en: Dual Loop
  source_chapter: station-guide 第2章（行70、315-317、477、487）+ 附录D（第64页）
  author_definition: |
    「服务闭环（查对→执行→记录→优化，对客户负责）与能力闭环（实践→复盘→沉淀→晋级，
    对自己与组织负责）的合称。」服务闭环日常形态是 PDCA 现场化（日课三时为微循环）；
    能力闭环载体是 FJ-26《FDE 个人能力评估与成长档案》。
  key_distinction: |
    ≠ 单一 PDCA：两环同时运行且对象不同（客户/组织）；"验只属于个人，沉淀进资产库的经验
    才属于组织"（行1050）。
  why_it_matters: 解释个人经验如何变成组织资产；与 ANC 知识飞轮（g38）是同一问题的两代方案。
  tags: [term, core-concept]

- id: g18
  term: 铁三角
  en: Iron Triangle
  source_chapter: station-guide 附录D（第64页）
  author_definition: |
    「驻场服务的最小作战单元：客户方业务接口人、FDE（驻场主理人）、派遣机构行业顾问三方协同。」
  key_distinction: |
    ≠ 华为"铁三角"（客户经理+方案经理+交付经理）：三方构成不同，FDE 是驻场主理人而非客户经理。
  why_it_matters: 同名异构术语，引用时必须写明三方成分，防止套用华为口径。
  tags: [term, naming-conflict]

- id: g19
  term: 日课三时
  en: Daily Three Slots
  source_chapter: station-guide 附录D（第64页）+ §2.5
  author_definition: |
    「驻场每日节奏：上午听（晨会旁听、访谈）、下午做（原型推进、增量验证）、
    晚上校准（站会复盘、纪要留痕）。」
  key_distinction: ≠ 泛义时间管理：是服务闭环的"微循环"固定结构，听/做/校准与 PDCA 对应。
  why_it_matters: 驻场作业类 skill 的日级节拍器。
  tags: [term]

- id: g20
  term: 留痕三原则
  en: Three Traceability Principles
  source_chapter: station-guide 附录D（第64页）
  author_definition: 「所有沟通有纪要、所有决策有确认、所有变更有签字。」
  key_distinction: ≠ "多记录"的工作习惯：三原则分别对应沟通/决策/变更三类对象，后者要求客户签字。
  why_it_matters: 质量门禁的凭证基础；门禁"签署凭证"要件由此而来。
  tags: [term]

- id: g21
  term: 场景翻译（场景六要素卡）
  en: Scene Translation
  source_chapter: station-guide 附录D（第64页）+ 行503、645-653
  author_definition: |
    「将业务语言表述的问题翻译为 AI 任务类型、数据要求、模型能力与验证指标的过程，载体为 FJ-05。」
    候选场景以 FJ-04 驻场观察报告评审，验证有效的沉淀为"场景六要素卡"入场景库。
  key_distinction: |
    ≠ 需求分析：输出是四元组（AI任务类型/数据要求/模型能力/验证指标），重点是"可验证指标"先行。
  why_it_matters: SLP 的 Scene 环节与第三式"破译式"的核心动作；场景库是资产库的第一类。
  tags: [term, core-concept]

- id: g22
  term: 组织资产库（四类）
  en: Asset Repository
  source_chapter: station-guide 行503、1064、1116-1135
  author_definition: |
    第八式沉淀四类资产库：场景库（场景定义与翻译卡）、模板库（方案、话术、SOP）、
    负面清单库（立项否决经验）、数据与知识库（脱敏后数据与知识）。
  key_distinction: |
    ≠ 项目文档归档：「沉淀必须是可复用资产，而非项目文档归档」（BOOK_OVERVIEW 命题13）；
    负面清单库（什么不该做）是最反常识的一类。
  why_it_matters: 能力闭环的终点、第九式复制包的原料；skill 化"沉淀"动作时按四类对号入座。
  tags: [term, core-concept]

- id: g23
  term: 复制包（标准件/适配件）
  en: Replication Package
  source_chapter: station-guide 附录D（第64页）+ 第九式（行1116-1160）
  author_definition: |
    「第九式从资产库组装的可复用交付组合，含标准件（直接复用）与适配件（按现场定制）两类资产。」
    组装后标注每项资产的"标准件/适配件"属性；复制 = 「标准件量产+适配件定制」。
  key_distinction: |
    ≠ 模板套用：「复制时丢弃现场判断」列为失误——资产库替代不了 FDE，
    复制项目仍需按九式走压缩版。
  why_it_matters: 规模复制的操作性概念；标准件/适配件二分是判断"什么能复用"的工具。
  tags: [term]

- id: g24
  term: GenAI 鸿沟
  en: GenAI Divide
  source_chapter: station-guide §1.1（行178-194）+ 附录D（第64页）
  author_definition: |
    「MIT NANDA 2025 年研究提出的概念：企业在生成式 AI 上投入巨大但绝大多数未获可衡量损益
    影响的现象。」数据：投入 300-400 亿美元、95% 组织无可衡量 P&L 影响，仅约 5%
    "场景聚焦、深度嵌入工作流"的项目创造显著财务价值。
  key_distinction: |
    ≠ 技术成熟度问题：报告的诊断是鸿沟的根因不是基础设施、监管或人才（见 g25）。
  why_it_matters: 全书问题诊断的起点数据；skill 引用时作为"为什么需要驻场"的论据。
  tags: [term, core-concept]

- id: g25
  term: 学习鸿沟
  en: Learning Gap
  source_chapter: station-guide §1.1（行186-188）
  author_definition: |
    MIT NANDA 报告的诊断：「阻碍 AI 规模化的核心不是基础设施、监管或人才，而是『学习鸿沟』
    （Learning Gap）——多数 AI 系统上线后不保留反馈、不适配业务上下文、不随业务变化而进化，
    部署即静止，随即被业务甩在身后。」
  key_distinction: |
    ≠ GenAI 鸿沟（现象级投入-产出落差）：学习鸿沟是其技术根因——三特征为
    不保留反馈、不适配上下文、不随业务进化。
  why_it_matters: 直接连接 FDR（持续迭代）与 ANC 知识飞轮（反馈回流）两个解法；
    引用"瓶颈在学习而非模型"的论断时以此为原文锚点。
  tags: [term, core-concept]

## C. 制造业落地路径（manufacturing 专用）

- id: g26
  term: SLP 方法
  en: Scene-Link-Pilot
  source_chapter: manufacturing 附录A（第121-122页）+ 第4章
  author_definition: |
    「FDE 制造业落地路径：场景锁定（Scene）→ 跨界链接（Link）→ 试点验证（Pilot）。」
    场景锁定选"小、可度量、有权限"的场景；链接工艺工程师/操作员/管理者使隐性知识显性化；
    试点 2-4 周、现场演示、数据说话。
  key_distinction: |
    ≠ PoC 方法论：「现场本位」倒转「技术本位」——模型与现场不符时，错的是模型不是现场。
  why_it_matters: 单场景切入的标准路径，与 SME 客户最匹配（BOOK_OVERVIEW 优先级第2）。
  tags: [term, core-concept]

- id: g27
  term: 一锤子买卖困局
  en: One-shot Deal Dilemma
  source_chapter: manufacturing 第3章 §3.1（第41页起）+ 序言（行63-68）
  author_definition: |
    「工业 AI 一锤子买卖困局：做 AI 的不懂工厂，做工厂的不懂 AI，中间缺一个能驻场翻译的人；
    更麻烦的是，即便第一次部署成了，模型会随工艺、订单、设备老化而漂移，
    没有『下半场』的持续反馈，效果很快衰减。」
  key_distinction: |
    ≠ 交付质量问题：是结构问题——两层难：现场没人（FDE 解），交付之后没人管（FDR 解）。
  why_it_matters: FDE+FDR 体系的存在理由；反例提取器的重要素材来源。
  tags: [term, core-concept]

- id: g28
  term: 智能积木
  en: Smart Building Blocks
  source_chapter: manufacturing 附录A（第121页）+ §3.5（第49页）
  author_definition: |
    上海交大团队提出：「将跨域验证的核心算法封装为可复用模块，『一次优化、多域复用』。」
    序言：持续收益来自"智能积木体系（一次优化、多域复用）"；新场景适配成本约为全新设计的 20%。
  key_distinction: |
    ≠ 组件库：来源是失败轨迹的 Skill 化（与 aliyun 手脚 Loop 同构）；
    是"蒸馏"（g29）的产物之一，不是预先设计的通用件。
  why_it_matters: FDE 从人力服务升级为可复用商业模式的关键载体。
  tags: [term, core-concept]

- id: g29
  term: 蒸馏
  en: Distillation
  source_chapter: manufacturing 附录A（第121页）
  author_definition: |
    「把 FDE 现场经验沉淀为可复用知识库、Skill 或智能积木的过程；能否蒸馏出可复用资产，
    是 FDE 从人力服务升级为商业模式的分水岭（腾讯研究院『AI 透镜』圆桌，2026年7月）。」
  key_distinction: |
    ≠ 模型蒸馏（knowledge distillation 技术术语）：这里是组织经验资产化的动作，
    与 ML 压缩模型的技术同名不同义。
  why_it_matters: 与 ANC 知识飞轮、aliyun 上下文资产构成同一命题（经验→资产）的三种工程化表述。
  tags: [term, naming-conflict]

- id: g30
  term: 小样本迭代
  en: Few-shot Iteration
  source_chapter: manufacturing 附录A（第121页）+ §3.6
  author_definition: |
    「FDR 开发的算法：仅需 50-100 组新场景数据即可完成模型优化，解决制造业数据稀缺问题。」
  key_distinction: ≠ 通用 few-shot learning（提示词层面）：这里是 FDR 返修环节的模型再训练工程能力。
  why_it_matters: "2-4 周见效"承诺的技术支撑；FDR 叙事中区别于 LLM 提示工程的实证点。
  tags: [term]

- id: g31
  term: 数据漂移
  en: Data Drift
  source_chapter: manufacturing 附录A（第121页）
  author_definition: |
    「模型训练数据分布与运行时真实分布发生偏移，工业 AI 模型退化的技术根因，
    含协变量、先验概率、概念、时间漂移四类。」例：输入分布变化（更换原料供应商）／
    输入输出关系变化（同一温度在不同季节设备响应不同）／数据随时间周期变化（昼夜温差）。
  key_distinction: ≠ 泛义"模型变旧"：四类漂移各有判别特征，是 FDR 返修的诊断框架。
  why_it_matters: "为什么交付后必须有人管"的技术论据；模型漂移类 skill 的分类学基础。
  tags: [term]

- id: g32
  term: 黄金三角
  en: Golden Triangle
  source_chapter: manufacturing 附录A（第120页）+ §1.2.2（行~330）
  author_definition: |
    「OpenClaw（执行之手）+ RAG（知识之脑）+ Agent（决策之心），中国 FDE 的技术底座。」
    （OpenClaw+RAG+Agent 智能体实操工作坊，2026年6月重庆云宇宙科技版权登记。）
  key_distinction: |
    ≠ Palantir 技术栈（Ontology/OAG）：是中国本土化的替代底座——用 RAG+Agent 近似
    Palantir 语义层的功能。
  why_it_matters: "中国式 FDE"的技术栈声明；与本体论路线（g33/g34）构成两条技术路线对比。
  tags: [term, core-concept]

- id: g33
  term: 本体论
  en: Ontology
  source_chapter: manufacturing 附录A（第120页）+ §1.2.2
  author_definition: |
    「企业数据资产之上的业务语义运营层：把数据映射为业务对象、关系与行动，构成组织的
    『数字孪生』；Palantir Foundry/AIP 的核心，FDE 现场工作的底层界面。」
  key_distinction: |
    ≠ 哲学本体论 ≠ 普通数据模型：是"可运营的业务语义层"，数据直接映射为对象/关系/行动
    而非表结构。
  why_it_matters: 理解 Palantir 模式与中国式替代路线（黄金三角/五层蛋糕）差异的基准概念。
  tags: [term, core-concept]

- id: g34
  term: 本体增强生成
  en: Ontology-Augmented Generation (OAG)
  source_chapter: manufacturing 附录A（第120页）
  author_definition: |
    「将本体对象本身（而非文本片段）注入大模型上下文的生成方式，推理确定性更强、幻觉更低，
    Palantir 官方路线。」
  key_distinction: ≠ RAG：RAG 注入文本片段，OAG 注入结构化业务对象——"每句话有出处"升级为
    "每个对象可执行"。
  why_it_matters: RAG（黄金三角）与 OAG（Palantir）是两条生成路线的分水岭概念。
  tags: [term]

- id: g35
  term: 五层蛋糕模型
  en: Five-Layer Cake Model
  source_chapter: manufacturing 附录A（第121页）+ §3（行345）
  author_definition: |
    大任智库提出的 AI 本体论模型：主体价值观（灵魂层）、运营驾驶舱（洞察层）、
    智能协作体（大脑层）、数据关系网（血脉层）、基础设施平台（基座层）。
  key_distinction: |
    ≠ Palantir Ontology：多建模了「价值与规则」层（主体价值观+运营驾驶舱）——
    BOOK_OVERVIEW 判定为"技术驱动型 AI 项目缺失的前提"。
  why_it_matters: "中国式本体论"的正面主张；本体论相关 skill 的中国方案基准。
  tags: [term, core-concept]

- id: g36
  term: 三体架构
  en: Three-Body Architecture
  source_chapter: manufacturing 附录A（第121页）
  author_definition: |
    大任智库提出：「主体（人：价值主张·规则·激励）、数体（物：关系·数据·知识）、
    智体（事：模型·智能·行动）三体协同，驱动企业从『经验运营』迈向『自主智能』。」
  key_distinction: |
    ≠ 五层蛋糕的层级视角：三体是要素视角（人/物/事），两者互为表里构成"中国式本体论"完整叙事。
    ≠ 刘慈欣《三体》：纯借用名号，无小说语义。
  why_it_matters: 与五层蛋糕成对出现，引用时须说明是"层视角"还是"体视角"。
  tags: [term, core-concept]

- id: g37
  term: 时间链理论
  en: Time Chain Theory
  source_chapter: manufacturing 附录A（第122页）+ §3.9
  author_definition: |
    王甲佳（场景学社）提出，核心观点「数据要跑得比机器快」，与 FDE+FDR 模式深度暗合。
  key_distinction: ≠ 区块链"timechain"：与分布式账本无关，是生产数据实时性主张。
  why_it_matters: 场景学社一脉的理论根基；区分素材内两大学术来源（大任智库 vs 场景学社）。
  tags: [term]

- id: g38
  term: 主权AI
  en: Sovereign AI
  source_chapter: manufacturing 附录A（第122页）
  author_definition: |
    「以开源模型+自研软件封装+本地部署，把数据与模型能力留在企业自有环境的技术路线，
    适用于数据敏感度极高的场景（David Sacks，All-In 播客，2026年7月）。」
  key_distinction: ≠ 私有化部署：强调"自研封装"能力留企业，不只是模型放在本地。
  why_it_matters: 制造业合规/IP 主权章节（六大现实障碍之一）的技术路线选项。
  tags: [term]

- id: g39
  term: 知识织体
  en: Knowledge Fabric
  source_chapter: manufacturing 附录A（第122页）
  author_definition: |
    Unframe AI 提出的企业上下文平台概念：「主张以能内在理解企业上下文的平台替代驻场 FDE」（2026年3月）。
  key_distinction: 是 FDE 模式的"反命题"——平台替代人的路线，用于对照论证"为什么仍需要人驻场"。
  why_it_matters: 反例/边界讨论的素材；引用 FDE 必要性论辩时应带上这个对手方。
  tags: [term, counter-position]

- id: g40
  term: 物理可解释AI
  en: Physically Explainable AI
  source_chapter: manufacturing 附录A（第123页）
  author_definition: |
    「将物理规律（如微生物代谢方程、建筑结构力学）嵌入 AI 模型，让 AI 决策可解释、可追溯。」
  key_distinction: ≠ 通用 XAI（事后解释）：是把物理方程作为先验嵌入模型本身。
  why_it_matters: 制造业"老师傅手感可否显性化"争论的第三条路（规律先验补偿数据不足）。
  tags: [term]

## D. 组织级框架（tiqiao-framework 专用）

- id: g41
  term: 五层级框架（含 12 题诊断、两条横切轴）
  en: Five-Level Maturity Framework
  source_chapter: tiqiao §1.1-§2.3
  author_definition: |
    「框架由五个层级和两条横切轴组成」：L1 战略对齐→L2 认知普及→L3 个人提效→L4 组织提效→
    L5 智能原生；横切轴 A 数据基础（决定天花板）、轴 B 治理与安全（决定能不能走下去）。
    配 12 题自诊断（每题 1-4 分，满分 48，按总分区间判定层级）。
  key_distinction: |
    ≠ 通用成熟度模型：核心不是分级而是「L3→L4 鸿沟」（g42）；"数据中台不是 L4 的可选基础设施，
    而是 L4 的入场券"。
  why_it_matters: 组织级诊断类 skill 的骨架；12 题区间本质是启发式自查表（BOOK_OVERVIEW 批判），
    使用时须声明信度局限。
  tags: [term, core-concept]

- id: g42
  term: L3→L4 鸿沟
  en: L3-to-L4 Chasm
  source_chapter: tiqiao §1.4 + §3.5
  author_definition: |
    「这是整个框架中最难的一跳」：从能人驱动/工具账号/局部数据/不触动利益，
    跨到制度驱动/平台建设/企业级数据/权力再分配。三个关键动作：选对切入点（高重复、低风险、
    数据基础好）、建平台而非建单点、同步调整组织和考核。
  key_distinction: |
    核心命题「个人提效 ≠ 组织提效」——"把个人省时间等同于组织提效，省下来的时间可能被摸鱼吃掉"。
    跨越判据：AI 成为流程默认路径＋业务指标可量化改善＋离开 AI 流程无法正常运转。
  why_it_matters: 全五件套中最痛的企业问题（BOOK_OVERVIEW 优先级第4）；"默认路径"判据是硬标准。
  tags: [term, core-concept]

- id: g43
  term: 90 天 L4 Playbook
  en: 90-Day L4 Playbook
  source_chapter: tiqiao §3
  author_definition: |
    L3→L4 的 90 天行动路线，四阶段：诊断与切入点选择（第1-2周，含基线测量）→
    平台底座搭建（第3-5周，LLM 网关+数据访问层+工作流引擎+监控）→ 首个流程 AI 化
    （第6-9周，灰度 10%→30%→50%→80%）→ 组织适配与规模化（第10-12周起，JD/KPI/转岗/复制）。
  key_distinction: |
    §3.5 三个判断：不是"上线了 AI 系统"就算 L4；业务指标是唯一验收标准；
    组织适配（3-6个月）比技术实现（4-6周）更难，必须业务负责人牵头、一把手推动。
  why_it_matters: 可直接 skill 化的交付型方法论；时间盒与灰度比例是其区别于泛泛建议的硬结构。
  tags: [term, core-concept]

## E. AI Native 研发基础设施（aliyun 专用）

- id: g44
  term: 上下文资产
  en: Context Assets
  source_chapter: aliyun §1.2 案例二「一个需求、一组事实」
  author_definition: |
    「一个研发任务被拆成三个相互依赖的部分：上下文资产用于说明本次任务要解决什么问题，
    工程执行环境决定具体修改发生在哪里，验证证据用于证明最终结果是否成立。……验证过程中
    发现的新事实，会继续沉淀回文档、代码、测试和规则中。」组成：产品文档+技术文档+真实工程
    +测试证据（含 Skill、MCP、Markdown、Spec、Code Docs、Code Graph）。
  key_distinction: |
    ≠ 知识库文档堆：是"一个需求、一组事实"的任务级供给，且必须闭环回写——
    新事实不回写就不算资产。
  why_it_matters: aliyun 手册的核心机制词；与 ANC 四类数据、station-guide 资产库同题异构。
  tags: [term, core-concept]

- id: g45
  term: 可靠交付四环节
  en: Four Links of Reliable Delivery
  source_chapter: aliyun §1.2 案例二「实现可靠交付」（行199-214）
  author_definition: |
    「将 AI Coding 的工程能力聚焦到四个环节：项目理解、需求理解、可靠编码和线上排障。」
    项目理解=Code Docs+Code Graph+Rules；需求理解=前置追问沉淀为可追溯 Spec 和 Tasks；
    可靠编码=TDD 链路幂等；线上排障=TraceId 统一证据链。
  key_distinction: |
    ≠ 提升代码生成速度：「目标不再只是提升代码生成速度，而是让 AI 能够基于真实项目上下文、
    明确需求和可验证反馈，持续完成复杂研发任务。」成效：交付周期减半、千行缺陷率降 70%、
    变更失败率降 90%+。
  why_it_matters: AI Native 研发类 skill 的主框架；四环节各自有独立工程实践，不可合并为"用好 AI"。
  tags: [term, core-concept]

- id: g46
  term: Code Docs
  en: Code Docs
  source_chapter: aliyun 行203
  author_definition: |
    「用于解释模块职责、设计背景和使用方式」的项目文档——解决「为什么这样设计、应该如何寻找」，
    由 Agent 按需读取以降低每次新会话的启动成本。
  key_distinction: ≠ API 文档：面向 Agent 消费而非人；回答"为什么"，与 Code Graph 的"在哪里"分工。
  why_it_matters: 上下文资产的最小可落地件之一；与 Rules（团队经验固化为可执行约束）配套。
  tags: [term]

- id: g47
  term: Code Graph
  en: Code Graph
  source_chapter: aliyun 行203
  author_definition: |
    「用于精确查询代码定义、调用关系和影响范围」的代码知识图谱——解决「具体在哪里、谁调用谁、
    改动会影响什么」；与 Code Docs 结合「使 Agent 能够从业务语义快速定位到具体代码」。
  key_distinction: ≠ 向量检索代码片段：图结构支持精确的影响面分析，是确定性查询而非相似度召回。
  why_it_matters: "从业务语义到具体代码"桥接件；排障与可靠编码环节的基础设施。
  tags: [term]

- id: g48
  term: Spec（约束 vs 假设）
  en: Spec
  source_chapter: aliyun 行~930（挑战二§3）+ 行205
  author_definition: |
    「区分『约束』与『假设』。数据不能出域、接口必须向后兼容、延迟不能超过阈值——这些是约束，
    要长期保存并尽可能自动检查；微服务还是单体、用哪种缓存策略——这些是有待验证的假设，
    应允许 AI 根据实现和运行中的反馈自己调整。Spec 负责划定『什么算对』的边界，不负责规定实现路径。」
  key_distinction: |
    ≠ 传统设计文档：传统 Spec 规定实现路径；这里 Spec 只守边界，路径交给 AI 试错。
  why_it_matters: AI 时代研发范式迁移（写代码→问题定义/边界设计/验证）的代表性论断。
  tags: [term, core-concept]

- id: g49
  term: Harness（企业级 Agent Harness）
  en: Agent Harness
  source_chapter: aliyun §3.1（行843-966）+ anc §4.2/§8.2
  author_definition: |
    aliyun：企业级 Agent 基础设施——Agent 运行的核心框架层，含核心运行机制、企业知识库、
    工具体系（MCP、Skill 与 CLI）；"从模型及 Harness 框架的能力，到大型企业的研发效能 10x 提升，
    中间存在非常大的 gap"。anc：Harness 负责 agent loop，与 ANC（公司事实）、派遣（平台事实）
    三分职责——"推理、工具、上下文都留在 Harness 层，ANC adapter 保持很薄"。
  key_distinction: |
    ≠ Agent 框架（LangChain 等）：aliyun 语境指企业级生产运行时（含安全、可观测、知识接入）；
    anc 语境指 agent loop 的归属边界。
  why_it_matters: 两文档共用词但职责划法不同；治理类 skill 引用时必须声明取哪个口径。
  tags: [term, naming-conflict, core-concept]

- id: g50
  term: Sandbox
  en: Sandbox
  source_chapter: aliyun §3.2.1（行970-987）
  author_definition: |
    「为 Agent 提供一块可执行、可丢弃、受约束的工作空间，让模型获得完成任务所需的能力，
    同时把错误和风险限制在明确边界内。」必须回答：镜像/资源/销毁时机、可执行命令与读写范围、
    出站网络策略、凭据不交付给 Agent、暂停恢复与快照重建、出错信息保留。
  key_distinction: |
    ≠ "把 Agent 放进容器"：「把 Agent 放进一个容器，只解决了『在哪里运行』的问题」——
    生产级 Sandbox 是声明式边界（输入/环境/权限/产物/结束条件全部可声明和记录）。
  why_it_matters: Agent 从"回答问题"到"完成任务"的前提设施；判断方案成熟度的试金石。
  tags: [term, core-concept]

- id: g51
  term: Guardrail
  en: Guardrail
  source_chapter: aliyun §3.3.2（行1334-1346）+ 行813
  author_definition: |
    「我们为此建设的生产安全基础设施」：把高风险动作需要遵守的规则、当前变更事实和观测
    Evidence 纳入统一协议；「Agent 按规则提交完整结果和所需 Evidence，且运行状态合法时，
    可以继续推进；信息不足或者生产现场已经变化，系统会拒绝自动执行。」
    与 Identity、Policy 构成完整控制链（谁在行动、代表谁、能操作什么）。
  key_distinction: |
    ≠ Prompt 层安全约束：「不是依赖模型自行遵守提示」——是执行前的协议化硬门控；
    核心机制是"事实-证据-动作绑定"，状态变化则原结论失效。
  why_it_matters: 与 station-guide 质量门禁（g16）形成"人侧门禁/机器侧门禁"对照，
    治理类 skill 可对称引用。
  tags: [term, core-concept]

## F. 治理架构（anc-architecture 专用）

- id: g52
  term: 四种数据分类
  en: Blob Staging / Event Ledger / Candidate Ledger / Git Vault
  source_chapter: anc §5（行142-183）+ §8.1
  author_definition: |
    「raw conversation ≠ personal memory ≠ company knowledge ≠ executable Skill。
    四类数据绝不允许互相冒充，每类有独立的存储、治理和分发规则。」
    ① Blob Staging：原始素材暂存，内容寻址+不可变，Git 之外独立管理；
    ② Event/Transcript Ledger：追加式操作证据账本，记录 source/consent/scope/timestamp，游标确定性重放；
    ③ Candidate Ledger：候选变更账本（knowledge/skill/correction），开放循环等审批，每个候选绑定
    source hashes + target revision，生命周期 proposal→validation→decision→rollback；
    ④ Git Vault + Published Skills：已评审的公司真相，经 PR/checks/merge/versioned release 发布。
    流转：Blob → Event → Candidate → Git Vault，每步有来源哈希和审批记录。
  key_distinction: |
    ≠ 统一数据湖：核心主张是分类隔离且"绝不互相冒充"——尤其是"对话记录≠公司知识"这一条，
    反对把聊天历史直接当知识沉淀。
  why_it_matters: 知识治理类 skill 的数据分类学基础；四类间的单向流转是设计约束而非建议。
  tags: [term, core-concept]

- id: g53
  term: Git 唯一真相源（Git Vault）
  en: Git as Single Source of Truth
  source_chapter: anc §2.1/§5.4/§8.3
  author_definition: |
    「Git 为唯一真相源：所有公司知识和 Skill 以 Git 为 canonical，全流程可追溯。」
    Git Vault 存放"已评审的公司真相（reviewed company truths）+可验证的行为（verifiable behavior）"，
    只读分发到 local + hosted runtimes。
  key_distinction: |
    ≠ Git 代码仓库：vault 里放的是公司事实与 Skill，代码只是其中一类；主 Vault clone 只读，
    写入只能走隔离的 diff/branch/PR。
  why_it_matters: ANC 架构三信条之一（确定性治理／只提候选不改真相／Git 真相源），
    引用治理原则时的锚点。
  tags: [term, core-concept]

- id: g54
  term: 知识飞轮
  en: Knowledge Flywheel
  source_chapter: anc §6（行187-227）
  author_definition: |
    八步闭环：CAPTURE → NORMALIZE → NIGHTLY CURSOR → PROPOSE → VALIDATE → APPROVE →
    MERGE+PUBLISH → USE+EVAL，评估/纠错/失败/未使用回流为下一轮观察。
    设计原则：「自动化只到『提出候选』为止，合并发布必须有人工审批，绝不自动改写公司真相」；
    基于 cursor 增量、幂等可重跑；全流程可逆。
    信条：「每晚只『提出候选』，不『改写公司真相』」。
  key_distinction: |
    ≠ 自动知识库：自动化止步于 PROPOSE——"候选绑定来源哈希，可拒绝、可回滚"，
    与"AI 自动整理知识"的常识用法相反。
  why_it_matters: BOOK_OVERVIEW 判定的治理级解法核心；skill 化时"人工审批门"必须保留。
  tags: [term, core-concept]

- id: g55
  term: 候选状态机
  en: Candidate State Machine
  source_chapter: anc §6.2（行212-219）
  author_definition: |
    「observed → proposed → validated → approved → merged → evaluated」，
    审批节点可分支至 rejected / stale / rolled_back。
  key_distinction: |
    ≠ 工作流状态字段：是知识资产的信任分级——只有走到 merged/evaluated 的才是"公司真相"，
    其余永远是候选。
  why_it_matters: 判断任何"沉淀经验"类功能的成熟度：经验处于哪个状态决定其可引用性。
  tags: [term]

- id: g56
  term: Work Object
  en: Work Object
  source_chapter: anc §3.3（行83-93）
  author_definition: |
    「统一的任务建模，不再都叫『长任务』。五种 Work Object：TURN（即时交互轮次）、
    ASYNC_JOB（异步任务）、GOAL（目标驱动任务）、SCHEDULE（定时任务）、INGEST（数据摄取）。」
  key_distinction: |
    ≠ "任务/task"的笼统用法：强制先分型再调度——不同型对应不同执行模式
    （interactive/async/goal/ingest）与治理策略。
  why_it_matters: ANC 控制面五大模块之一；治理类 skill 设计任务模型时的类型学基础。
  tags: [term]

- id: g57
  term: Event Journal
  en: Event Journal
  source_chapter: anc §3.2（行76-81）
  author_definition: |
    「追加式（append-only）操作证据账本：记录来源、授权、范围、时间戳；支持游标（cursor）
    确定性重放；是整个系统的审计基础。」（数据层同名物为 Event/Transcript Ledger，见 g52。）
  key_distinction: ≠ 操作日志：append-only + 可重放 + 绑定授权范围，使其成为知识提炼的合规数据源。
  why_it_matters: "审计与提炼同源"——飞轮 CAPTURE 的原料与安全审计的证据是同一份账本。
  tags: [term]

- id: g58
  term: Candidate Ledger
  en: Candidate Ledger
  source_chapter: anc §5.3（行162-167）
  author_definition: |
    「管理 knowledge、skill、correction 的候选变更：开放循环（open loop）等待审批；
    每个候选绑定 source hashes + target revision；完整生命周期 proposal → validation →
    decision → rollback。」
  key_distinction: |
    ≠ staging 区：不是发布前的暂存，而是知识治理的常设层——被拒绝的候选也是被治理的记录。
  why_it_matters: "不改写公司真相"原则的物理载体；与 Git Vault 的读写边界是配套约束。
  tags: [term, core-concept]

- id: g59
  term: Token 驱动型（FDE）
  en: Token-driven FDE
  source_chapter: manufacturing 附录A（第122页）
  author_definition: |
    「大模型处理文本的基本计量与计费单位；模型公司 FDE 被称为『Token 驱动型』，
    因其商业目标在于扩大 token 消耗（腾讯研究院『AI 透镜』圆桌，2026年7月）。」
  key_distinction: |
    ≠ 咨询/交付型 FDE 的激励结构：模型公司 FDE 的成功指标是 token 消耗增长，
    与客户价值可能错位——是区分 FDE 雇主类型的关键判词。
  why_it_matters: 批判视角素材：解释"卖水人写水源报告"式的利益结构差异。
  tags: [term, counter-position]
```

---

## 自检（extractor checklist）

- [x] `author_definition` 全部使用素材原文或近原文片段
- [x] `key_distinction` 每条标注与常识/相邻概念的差异（含 5 处 naming-conflict：g04/g06/g12/g18/g29/g49）
- [x] `why_it_matters` 面向下游 skill 说明误用后果
- [x] 出处含文件别名 + 页码/行号，均经回原文核验
- [x] 用户点名术语核对：FDE✓ FDR✓ FJ工具表（FJ-01～26 见 g15/g16/g21/g22 出处）✓ 四重九式各式名✓ SLP✓ OPT✓ OPC✓ Ontology✓ 五层蛋糕✓ 三体架构✓ 智能积木✓ 质量门禁✓ 双闭环✓ 铁三角✓ 云上Scrum✓ 数字员工✓ 超级个体✓ 上下文资产✓ Code Docs✓ Code Graph✓ Harness✓ Sandbox✓ Guardrail✓ Work Object✓ Event Journal✓ Candidate Ledger✓ Git Vault✓ 知识飞轮✓ 候选状态机✓ 学习鸿沟✓ GenAI鸿沟✓ 三栖模型✓
- 覆盖率说明：两份官方附录术语表（station-guide 附录D 22条 / manufacturing 附录A 29条）已全量比对，凡属方法论必需者全部收录或有归属合并；学习鸿沟与一锤子买卖为正文定义词（附录未收），已补入。FJ 工具表为编号体系（FJ-01～FJ-26），未逐条成词，按用途挂靠于相关术语出处。
