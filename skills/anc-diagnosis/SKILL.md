---
name: anc-diagnosis
description: "基于 PSF 评估 + 项目状态 + 客户档案，自动生成 ANC 阶段诊断草稿。Use when starting a new ANC stage or generating a diagnosis skeleton for a project."
version: 1.0.0
when-to-use: 启动新 ANC 阶段（咨询/诊断/培训/管理/实施）需要生成诊断草稿、或在客户访谈前搭骨架时
avoid-when: 仅查询单个诊断字段；已有诊断结论只需落库（用 get_diagnosis / update_diagnosis）；psf-evaluation 未先跑
output: 四段式诊断草稿（客户画像 + PSF 三关 + 风险 + 下一步）
risk-level: low
---

# ANC Diagnosis

Generate a structured ANC stage diagnosis skeleton by combining PSF evaluation, project status, and client profile.

## When to Use

- Starting a new ANC stage (咨询/诊断/培训/管理/实施)
- Generating a diagnosis draft before client interviews
- Structuring pain points, economics, and feasibility assessment

## How It Works

1. Accept a project ID and optional stage context
2. Generate a four-section skeleton: client profile, PSF three-gate assessment, risks, next actions
3. FDE must fill in actual interview data; the skeleton is a structural guide only

## Execution

Invoke via `run_tool` with `toolCode: "ANC-DIAG-01"` and input `{ "projectId": "..." }`.

## Guardrails

- Output is a skeleton, not a completed diagnosis; FDE must supplement with real interview data
- Do not fabricate pain points, economics, or feasibility conclusions
