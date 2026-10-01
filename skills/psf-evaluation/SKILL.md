---
name: psf-evaluation
description: "根据客户画像从 586 个 AI 原子场景库和 100 个落地理由库中推荐最匹配的场景和理由。Use for consulting-phase positioning and pitch preparation."
version: 1.0.0
when-to-use: 售前准备或咨询期向决策人提案时，需要从 586 场景/100 理由库匹配客户画像
avoid-when: 仅查询单个客户字段；已有明确推荐方案只需落库（用 create_* 工具）
risk-level: low
output: Top 推荐场景列表 + 落地理由 + 三关评分明细 + go/no-go 建议
---

# PSF Evaluation

Recommend the most relevant AI landing scenarios and persuasive reasons based on client profile (industry, size, tier, pain points).

## When to Use

- Preparing for a consulting pitch to enterprise leadership
- Identifying which AI scenarios are most relevant for a specific client
- Building a business case with evidence-backed reasons

## How It Works

1. Provide the client ID; the system reads industry, size, and tier from the profile
2. Optionally add pain point descriptions and opportunity card text for precision
3. Returns top recommended scenarios (from 586-scenario library) and reasons (from 100-reason library)

## Execution

Two agent tools work together:

- `recommend_scenarios` with `{ "clientId": "..." }` returns relevant AI scenarios
- `recommend_reasons` with `{ "clientId": "..." }` returns persuasive landing reasons

需要不带客户记录的三关评估时，改用 server tool（经 `run_tool`）：

- `PSF-EVAL-01` with `{ "industry", "scale", "painPoints" }` 输出 PSF 总分、三关明细、Top 风险与 go/no-go 建议
- `SCEN-MATCH-01` with `{ "industry", "scale", "painPoints" }` 输出场景候选与匹配度

场景匹配口径：规则评分（行业/关键词/规模）+ 向量语义检索（pgvector 余弦）混合，双侧命中加权、
单侧命中折价；未配置向量 Key 或检索失败时自动降级为纯规则评分（fail-open），不报错。

## Guardrails

- Recommendations are data-driven from the scenario/reason libraries; do not fabricate
- Always validate recommendations against actual client context before presenting
