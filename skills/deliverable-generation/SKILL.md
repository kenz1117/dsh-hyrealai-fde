---
name: deliverable-generation
description: "生成项目交付物草稿，自动引用上游阶段已发布交付物作为上下文。Use when drafting consulting reports, diagnosis reports, training lectures, or implementation plans."
version: 1.0.0
when-to-use: 需要根据 ANC 阶段自动拉取上游交付物作为上下文、产出可发布的项目阶段交付物时
avoid-when: 仅查询历史交付物版本（用 list_deliverables / get_deliverable）；单纯模板生成走 deliverable-template
output: 阶段交付物草稿（引用上游 + 本阶段章节 + 复核项）
risk-level: write
---

# Deliverable Generation

Draft a project deliverable for the current ANC stage, automatically pulling upstream stage conclusions as context.

## When to Use

- Writing a consulting proposal (咨询阶段)
- Drafting a diagnosis report (诊断阶段)
- Assembling training lectures (培训阶段)
- Creating implementation plans (管理/实施阶段)

## How It Works

1. Use `get_upstream_deliverables` to read published deliverables from previous stages
2. Use `generate_deliverable` to draft the current stage deliverable, citing upstream conclusions
3. The draft must maintain the deliverable chain: 咨询 → 诊断 → 培训 → 管理 → 实施

## Execution

Two agent tools work together:

- `get_upstream_deliverables` with `{ "projectId": "...", "stage": "..." }` returns upstream context
- `generate_deliverable` with `{ "projectId": "...", "stage": "..." }` generates the draft
  （仅这两个参数：标题与大纲由生成器按阶段模板产出，不接受调用方传入）

## Guardrails

- Always read upstream deliverables before generating; conclusions must be consistent
- Output is a draft requiring FDE review and revision
