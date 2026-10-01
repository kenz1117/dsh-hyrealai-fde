---
name: knowledge-retrieval
description: "从四源知识库（公共 + 企业 + 个人 + 案例）语义检索相关文档和知识片段。Use when FDE needs methodology, scenario references, benchmark cases, or historical project assets."
version: 1.1.0
when-to-use: FDE 需要查方法论、场景库、历史项目资产、同行业标杆案例、或为某客户做知识匹配提示时
avoid-when: 仅查单条客户档案字段（用 get_client）；需要直接回答客户问题走 enterprise-qa
output: 语义检索 top-k 片段 + 四库命中标记 + 知识匹配提示
risk-level: low
---

# Knowledge Retrieval

Search the multi-source knowledge base (public wiki + enterprise nebula + personal notes + case library) for relevant documents, methodology, benchmark cases, and historical project assets.

## When to Use

- Looking up consulting methodology or best practices
- Finding similar project cases or deliverables
- Retrieving industry-specific knowledge for a client engagement
- **Finding benchmark cases**（「同行/别家怎么做」「有没有行业案例」→ `library: "case"`）
- Checking what knowledge has been matched but not yet pushed to a client

## How It Works

1. Use `search_knowledge` with a natural-language query
2. Optionally scope to a `projectId` (project library) or `clientId` (enterprise library)
3. **Case library（案例知识库）**：`library: "case"` 检索全局标杆案例（外部快照 127+ 条 + 内部沉淀），
   可加 `caseIndustry`（行业组，如「制造与工业」）与 `caseMaturity`（验证阶段/已上线/规模化）精确过滤；
   问「XX 行业怎么落地」时优先 `library: "case"` + `caseIndustry`
4. Returns top-k most relevant document chunks
5. For knowledge match suggestions, invoke `run_tool` with `toolCode: "KB-HINT-01"` and `{ "clientId": "..." }`

## Execution

- `search_knowledge` with `{ "query": "...", "clientId": "..." }` returns semantic search results
- `search_knowledge` with `{ "query": "...", "library": "case", "caseIndustry": "制造与工业" }` returns benchmark cases
- `run_tool` with `toolCode: "KB-HINT-01"` returns knowledge match hints for a specific client

## Guardrails

- Results are knowledge assets; always verify currency and applicability before citing
- Do not present retrieved content as your own analysis without attribution
- **案例引用边界**：案例知识库内容整理自公开材料，含基于公开信息的编辑分析；效果数字为来源方披露、
  未经独立审计。引用案例时必须标注为「外部标杆案例」，不得表述为客户事实或本方承诺
