# AI-FDE API 详细参考

供 agent 在需要字段级细节时查阅。所有示例变量：`$AI_FDE_BASE_URL` 为系统地址，`$AI_FDE_PAT` 为访问令牌。

## 认证

```bash
curl "$AI_FDE_BASE_URL/api/ai-tasks" \
  -H "Authorization: Bearer $AI_FDE_PAT"
```

- 令牌格式：`fde_pat_` + 64 位十六进制字符
- 服务端按「用户 RBAC ∩ 令牌 scope」鉴权：viewer 用户的令牌即使带 ai scope 也不能提交任务；
  admin/superadmin 专属接口（审批、用户管理）对一切令牌关闭
- 每次 PAT 认证成功会更新令牌的 `lastUsedAt`（60 秒节流），可在系统内审计使用情况

## 错误响应格式

统一 JSON：`{"error": "中文原因"}`。令牌相关错误：

| 状态码 | error 示例 | agent 应对 |
|--------|-----------|-----------|
| 401 | 访问令牌无效、已撤销或已过期 | 停止调用，请用户重建令牌 |
| 403 | 访问令牌 scope 不足，无权执行该写操作 | 属权限设计，勿重试 |
| 403 | 访问令牌无权访问管理接口 | 该接口对 PAT 关闭，勿重试 |
| 403 | 只读成员的访问令牌无权执行写操作 | 该账号为 viewer，请用户换账号或改为只读用法 |
| 429 | 请求过于频繁，请 N 秒后重试 | 等待 Retry-After 指示的秒数 |

## read scope 接口响应结构

### GET /api/skill-doc

返回本文档（SKILL.md）的最新版 Markdown 原文（`Content-Type: text/markdown`，非 JSON）。
用途：只拿到「文档链接 + 令牌」两个值时，先 GET 此端点读取调用规范，再按规范接入。

### GET /api/ai-tasks

```json
{ "jobs": [ { "id", "status", "title", "receipt", "error", "createdAt", "completedAt" } ] }
```

status 取值：`queued`（排队）/ `running`（执行中）/ `succeeded`（成功）/ `failed`（失败）。

### GET /api/jobs/{jobId}

```json
{ "id", "status", "handler", "result", "error", "receipt", "createdAt", "updatedAt" }
```

- 归属校验：只能查自己提交的任务（发起人或管理员）
- `result` 为任务产出 JSON：`ai_chat` 返回 `{"text"}`，`predict_questions` 返回 `{"questions"}`，
  `organize_draft` 返回 `{"draft"}`，`prepare_reply` 返回 `{"reply"}`
- 404 表示任务不存在或无权查看

### GET /api/documents

参数：`scope`（默认 org）、`clientId`、`projectId`（后两者为硬性隔离条件）。

```json
{ "docs": [ { "id", "title", "docType", "summary", "chunkCount", "vectorDim", "indexed" } ] }
```

### GET /api/documents/{id}

返回单文档全量：`id`、`title`、`docType`、`summary`、`rawText`（正文）、`library`、`scope`、
`chunkCount`、`entityExtractStatus`、时间戳。

### GET /api/brain/insights

参数：`projectId` 或 `clientId`（二选一）、`limit`（1-100，默认 20）、`severity`。

```json
{ "insights": [ { "id", "entityType", "entityId", "severity", "title", "content", "createdAt" } ] }
```

### GET /api/co-pilot/recommendations

参数：`projectId` 或 `clientId`、`limit`（1-100，默认 10）。

```json
{ "ok": true, "recommendations": [ ... ] }
```

### GET /api/wiki/playbook

参数：`industry`、`ancStage`、`scenarioCode`（数字）、`includeStale=true`。

```json
{ "ok": true, "links": [ { "title", "url", "scenarioCode", "lastReviewedAt", "createdAt" } ] }
```

## ai scope：POST /api/ai-tasks

### 请求

```bash
curl -X POST "$AI_FDE_BASE_URL/api/ai-tasks" \
  -H "Authorization: Bearer $AI_FDE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "predict_questions",
    "payload": {
      "industry": "金融",
      "scale": "大型",
      "ancStage": "P5-交付",
      "clientId": "可选，注入客户上下文"
    }
  }'
```

payload 字段约束（服务端校验）：

- 字符串字段非空、默认截断 80000 字符（`industry` 100、`scale` 20、`ancStage` 50）
- `projectId` / `clientId` 若提供必须真实存在，否则 500 校验失败
- `ai_chat` 可用 `ragQuery` 触发知识库向量检索，把相关文档注入模型上下文

### 响应

```json
{ "ok": true, "jobId": "clxxx", "created": true, "status": "queued", "title": "客户问题预测" }
```

`created: false` 表示已有完全相同的任务在排队/执行中（幂等去重），直接用返回的 `jobId` 轮询即可。

### 轮询示例

```bash
# 提交后轮询；queued/running 每 5 秒一次，建议最多等待 10 分钟
curl "$AI_FDE_BASE_URL/api/jobs/$JOB_ID" -H "Authorization: Bearer $AI_FDE_PAT"
```

`succeeded` 时从 `result` 取产出；`failed` 时 `error` 字段为失败原因（截断至 2000 字符）。
AI 任务依赖系统配置的模型服务，排队时长取决于 worker 负载。

## tool scope：执行技能工具

### GET /api/co-pilot/tools（工具发现，read scope 即可）

```bash
curl "$AI_FDE_BASE_URL/api/co-pilot/tools" -H "Authorization: Bearer $AI_FDE_PAT"
```

```json
{
  "ok": true,
  "tools": [
    {
      "code": "PROJ-BRIEF-01",
      "name": "项目速览",
      "domain": "project",
      "description": "一条指令拿到项目全貌：基础信息、健康分、诊断摘要、最近动态",
      "inputSchema": { "type": "object", "properties": { ... }, "required": [ ... ] }
    },
    {
      "code": "PSF-EVAL-01",
      "name": "PSF 三关评估",
      "domain": "client",
      "description": "对任意客户画像跑痛点/经济性/可行性三关评估",
      "inputSchema": { "type": "object", "properties": { ... }, "required": ["industry", "scale", "painPoints"] }
    }
  ]
}
```

- 清单 = 内置工具（14 个以上，含副驾答复包/问题预测/场景匹配/打法检索/三源检索/成员查找与诊断装配等）+ 系统中 `enabled=true` 的自定义技能工具，动态变化
- `inputSchema` 为 JSON Schema 风格：`required` 是必填参数名列表，`properties` 描述每个参数类型

### POST /api/co-pilot/apply-skill（同步执行，需 tool scope）

```bash
curl -X POST "$AI_FDE_BASE_URL/api/co-pilot/apply-skill" \
  -H "Authorization: Bearer $AI_FDE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "toolCode": "ANC-DIAG-01",
    "projectId": "clxxx",
    "clientId": "可选",
    "input": { "toolCode 要求的自定义参数" }
  }'
```

成功响应：

```json
{ "ok": true, "result": { "该工具的产出 JSON" } }
```

错误响应（`{"ok": false, "error": "中文原因"}`）：

| 状态码 | 场景 | agent 应对 |
|--------|------|-----------|
| 400 | toolCode/projectId 缺失、input 非对象、参数不符合该工具 inputSchema | 按 error 修正请求体 |
| 401 | 令牌无效/撤销/过期 | 停止，请用户重建令牌 |
| 403 | 令牌无 tool scope 或账号为 viewer | 属权限设计，勿重试 |
| 404 | 工具未注册或未启用 | 重新拉取工具清单，勿猜测 toolCode |
| 500 | 工具内部执行异常 | 最多重试 1 次，仍失败则报告用户 |

约定：

- 执行是**同步**的（区别于 ai scope 的异步任务），响应即产出
- `projectId` 必填：工具产出与项目关联并留痕；`input` 中的 `projectId`/`clientId`/`fdeId` 会被系统字段覆盖，传入无效
- 每次执行自动写入使用记录与事件日志（SkillApplication / EventLog），可在系统内审计

成员域两步联动（先查找定位，再装配诊断上下文；`clientId` 仅作留痕归属，与成员本身无关）：

```bash
# 第 1 步：查找成员拿 memberId（管理员可按 keyword 模糊检索；普通成员令牌仅返回本人档案）
curl -X POST "$AI_FDE_BASE_URL/api/co-pilot/apply-skill" \
  -H "Authorization: Bearer $AI_FDE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "toolCode": "MEMBER-SEARCH-01",
    "clientId": "clxxx",
    "input": { "keyword": "张三", "limit": 5 }
  }'
# 成功响应 result 示例：
# { "count": 1, "members": [{ "id": "usr_xxx", "name": "张三", "jobRole": "顾问",
#   "assessedLevel": "L2", "compositeScore": 72.5, "diagnosedAt": "...", "notes": "备注摘要（截 120 字）" }] }

# 第 2 步：用 memberId 装配 1444 诊断上下文（basePrompt 可省略，缺省用内置评估引导语）
curl -X POST "$AI_FDE_BASE_URL/api/co-pilot/apply-skill" \
  -H "Authorization: Bearer $AI_FDE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "toolCode": "MEMBER-DIAG-12",
    "clientId": "clxxx",
    "input": { "memberId": "usr_xxx" }
  }'
# 成功响应 result 为提示词文本字符串（含成员档案、真实行为证据、缺口追踪与 1444 评分锚点），
# 直接作为后续访谈/评估对话的 system 上下文使用
```

[注意] 成员域权限边界：除管理员（admin/superadmin）外，其他人只能查找并评估本人档案。
普通成员令牌调用 MEMBER-SEARCH-01 仅返回本人；用 memberId 评估他人时 MEMBER-DIAG-12 返回
`{"ok": false, "error": "权限边界：普通成员仅可评估本人；..."}` —— 此时停止并如实告知用户，勿换路径重试。

## 令牌管理（仅浏览器会话可用，PAT 不能调用）

- `GET /api/pat`：列出我的令牌（只含 prefix、scopes、时间与撤销状态，无明文）
- `POST /api/pat`：创建，body `{"name", "scopes", "expiresInDays"}`，响应含唯一一次明文 `token`；
  `scopes` 可用值：`read` / `ai` / `tool` / `write`（业务资源写入，见 SKILL.md 附录 D）
- `DELETE /api/pat/{id}`：撤销（软删除，保留审计记录），非本人令牌返回 404
- `DELETE /api/pat/{id}?permanent=true`：永久删除（硬删除，仅限已撤销或已过期的令牌；
  生效中的令牌返回 400 要求先撤销）
