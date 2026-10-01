---
name: organize-draft
description: "把 FDE 的意图、项目产物和双源知识整理为三段式沟通草稿。Use when FDE wants to structure a client message using diagnosis and training context."
version: 1.0.0
when-to-use: FDE 手上只有零散笔记/口述意图，需要拉诊断/培训/项目上下文整合成三段式沟通稿时
avoid-when: 客户原话已知，需要直接起草对外答复（用 prepare-reply）；纯会议纪要走 meeting-notes
output: 三段式沟通草稿（背景共识 / 关键信息 / 行动建议）
risk-level: low
---

# Organize Draft

Take the FDE's rough intent or notes and organize them into a structured three-section client communication draft.

## When to Use

- FDE has a rough idea of what to say but needs structure
- Combining diagnosis reports, PSF evaluations, or training materials into a message
- Drafting follow-up communications after a meeting

## How It Works

1. Accept FDE's raw input and optional context (diagnosis drafts, PSF evaluation, training lecture)
2. Pull relevant project deliverables and dual-source knowledge
3. Organize into three sections: opening, core argument, next steps
4. Output a polished draft with watermark and source references

## Execution

This skill wraps server tool `ORGANIZE-DRAFT`. Invoke via `run_tool` with `toolCode: "ORGANIZE-DRAFT"`.

## Guardrails

- Output is a draft for FDE review; must be revised before external use
- Watermark and source references must be preserved
