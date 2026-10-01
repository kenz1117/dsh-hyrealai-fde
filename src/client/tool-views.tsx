// 工具结果结构化卡片（tool.call.toolview，keyed by wire 工具名——对 MCP 工具同样生效，
// 见 dsh packages/client/ui-tool/src/client/tool/ToolCallTree.tsx 按名分发逻辑）。
//
// props 结构在 developer preview 期可能调整，这里做防御性提取：
// 优先读 MCP content blocks（[{type:'text',text}]），拿不到再退到字符串字段，
// 都拿不到显示原始 JSON 摘要——绝不抛错（视图抛错会炸会话渲染）。
// 平台 Phase 1 上线 structured output 后，在此按 outputSchema 渲染真正的卡片字段。
import type { CSSProperties, ReactNode } from 'react'
import { palette } from './ui'

const cardStyle: CSSProperties = {
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))',
  border: '1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))',
  borderRadius: 'var(--dsw-radius-md, 12px)',
  padding: '10px 14px',
  fontSize: 13,
  lineHeight: 1.7,
}

const titleStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontWeight: 600, fontSize: 12, color: palette.brand, marginBottom: 6,
}

function extractText(props: unknown): string {
  const p = props as Record<string, unknown> | null
  const block = (p?.phase as Record<string, unknown> | undefined)?.block ?? p?.block ?? p?.result ?? p
  const b = block as Record<string, unknown> | null
  const content = (b?.result as Record<string, unknown> | undefined)?.content ?? b?.content ?? b?.result
  if (Array.isArray(content)) {
    return content
      .map((c) => (c && typeof c === 'object' && (c as { type?: string }).type === 'text' ? String((c as { text?: unknown }).text ?? '') : ''))
      .filter(Boolean)
      .join('\n')
  }
  if (typeof content === 'string') return content
  if (typeof b?.text === 'string') return b.text
  return ''
}

function ToolResultCard(title: string) {
  return function View(props: unknown): ReactNode {
    const text = extractText(props)
    return (
      <div style={cardStyle}>
        <div style={titleStyle}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: palette.brand }} />
          {title}
        </div>
        {text ? (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>{text}</pre>
        ) : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', opacity: 0.7 }}>{JSON.stringify(props, null, 2)?.slice(0, 2000)}</pre>
        )}
      </div>
    )
  }
}

// wire 名以 dsh 侧 cordis_inspect_query 实测为准（MCP 工具有 64 字符归一化规则，见 spike 5.7-5）
export const MyActionsToolView = ToolResultCard('今日行动')
export const MyClientsToolView = ToolResultCard('名下客户')
export const DraftCommunicationToolView = ToolResultCard('沟通草稿（待 FDE 修订后对客）')
