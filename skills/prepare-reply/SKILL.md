---
name: prepare-reply
description: "基于客户原话、双源知识库和最近沟通，生成 FDE 专用答复草稿。Use when FDE needs to draft a reply to a client message using knowledge base context."
version: 1.0.0
when-to-use: FDE 拿到一段客户原话（IM/邮件/电话），需要快速整合公共知识、企业档案与最近沟通形成可发答复草稿时
avoid-when: 仅列会议可能提问（predict-questions）；FDE 暂无明确客户原话（organize-draft）
output: 三段式答复草稿（推荐回复 + 补充说明 + 风险提示）
risk-level: write
---

# Prepare Reply

Generate a structured reply draft for a client message by combining public knowledge, enterprise knowledge, and recent communication history.

## When to Use

- FDE pastes a client message and needs a structured reply draft
- Preparing for a client call or email
- Responding to client questions using organizational knowledge

## How It Works

1. Collect the client's original message
2. Search dual-source knowledge base (public + enterprise) for relevant context
3. Retrieve recent communication history for the client
4. Generate a three-section structured draft: recommended reply, supplement notes, risk flags

## Execution

This skill wraps server tool `PREPARE-REPLY`. Invoke via `run_tool` with `toolCode: "PREPARE-REPLY"`.

## Guardrails

- Output is a draft for FDE review only; AI must never send directly to clients
- FDE must revise before external use
