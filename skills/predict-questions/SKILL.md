---
name: predict-questions
description: "基于行业、ANC 阶段和客户画像，预测客户最可能问的 10 个问题并预生成答复草稿。Use for pre-meeting preparation and Q&A rehearsal."
version: 1.0.0
when-to-use: 会前/提案前准备：基于客户行业、ANC 阶段、画像预测最可能被问的 10 个问题并预生成答复包
avoid-when: 客户已发问需要现场起草答复（用 prepare-reply / enterprise-qa）；仅列会议议程用 meeting-notes
output: 10 个预测问题 + 预生成答复包 + 风险提示
risk-level: low
---

# Predict Questions

Predict the 10 most likely questions a client will ask, with pre-generated answer drafts for each.

## When to Use

- Preparing for an upcoming client meeting
- Building a Q&A rehearsal document
- Identifying knowledge gaps before a pitch

## How It Works

1. Analyze client industry, company size, and ANC stage
2. Match against scenario patterns and historical project data
3. Generate 10 predicted questions ranked by likelihood
4. Pre-generate answer drafts for each question

## Execution

This skill wraps server tool `PREDICT-QUESTIONS`. Invoke via `run_tool` with `toolCode: "PREDICT-QUESTIONS"`.

## Guardrails

- Predictions are for preparation only; adjust based on actual client questions
- Answers are drafts requiring FDE revision
