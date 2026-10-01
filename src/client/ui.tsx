// 共享 UI 元件：图标（自绘 SVG，不用 ui-primitives）、Chip、SectionCard、状态视图。
// 样式约束：结构/背景/边框一律 --dsw-* 主题 token；语义色（状态/优先级）用「实心文字 + 半透明底」，
// 深浅色主题下都可读——这是官方规则中 "literal colors are for artwork only" 的边界用法，集中在 palette 一处。
import type { CSSProperties, ReactNode } from 'react'

// ---------- 语义色板（仅状态/优先级语义使用） ----------
export const palette = {
  brand: '#247bbf',
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
  gray: '#6b7280',
} as const

export function chipColors(tone: keyof typeof palette): CSSProperties {
  const c = palette[tone]
  return { color: c, background: `${c}1f`, border: `1px solid ${c}40` }
}

// ---------- 图标 ----------
type IconProps = { size?: number; color?: string }

function Svg({ size = 16, color = 'currentColor', children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      {children}
    </svg>
  )
}

export const IconBolt = (p: IconProps) => <Svg {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></Svg>
export const IconClients = (p: IconProps) => <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.6c2.6.3 4.4 1.9 5 4.4" /></Svg>
export const IconProject = (p: IconProps) => <Svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></Svg>
export const IconDraft = (p: IconProps) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></Svg>
export const IconRefresh = (p: IconProps) => <Svg {...p}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></Svg>

// ---------- Chip ----------
export function Chip({ tone, children }: { tone: keyof typeof palette; children: ReactNode }) {
  return (
    <span style={{
      ...chipColors(tone),
      display: 'inline-block', padding: '1px 8px', borderRadius: 'var(--dsw-radius-sm, 8px)',
      fontSize: 12, lineHeight: '18px', fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// ---------- 区块卡片 ----------
const sectionCardStyle: CSSProperties = {
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))',
  border: '1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))',
  borderRadius: 'var(--dsw-radius-lg, 16px)',
  padding: '14px 16px',
  display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0,
}

export function SectionCard(props: {
  icon: ReactNode
  title: string
  count?: number
  onReload: () => void
  children: ReactNode
}) {
  return (
    <section style={sectionCardStyle}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: palette.brand, display: 'flex' }}>{props.icon}</span>
        <strong style={{ fontSize: 14 }}>{props.title}</strong>
        {props.count !== undefined && (
          <span style={{
            fontSize: 12, padding: '0 8px', borderRadius: 999,
            background: 'var(--dsw-alias-bg-layer-3, rgba(127,127,127,0.12))', opacity: 0.85,
          }}>
            {props.count}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <button type="button" onClick={props.onReload} title="Refresh"
          style={{
            display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
            border: '1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.25))',
            background: 'transparent', borderRadius: 'var(--dsw-radius-sm, 8px)',
            padding: '3px 8px', fontSize: 12, color: 'inherit', opacity: 0.8,
          }}>
          <IconRefresh size={12} />
        </button>
      </header>
      {props.children}
    </section>
  )
}

// ---------- 状态视图 ----------
export const PULSE_CSS = `@keyframes hyrealPulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }`

export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 34, borderRadius: 'var(--dsw-radius-sm, 8px)',
          background: 'var(--dsw-alias-bg-layer-3, rgba(127,127,127,0.12))',
          animation: 'hyrealPulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <div style={{ padding: '18px 0', textAlign: 'center', opacity: 0.55, fontSize: 13 }}>{text}</div>
}

export function ErrorState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div style={{
      padding: '10px 12px', fontSize: 13, lineHeight: 1.6,
      borderRadius: 'var(--dsw-radius-sm, 8px)', ...chipColors('red'),
    }}>
      <strong>{title}</strong>
      {detail ? <div style={{ opacity: 0.9, marginTop: 2 }}>{detail}</div> : null}
    </div>
  )
}

// ---------- 行容器 ----------
export function Row({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 2px',
      borderTop: '1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.15))',
      fontSize: 13, minWidth: 0,
    }}>
      {children}
    </div>
  )
}

export function RowTitle({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
}

export function RowMeta({ children }: { children: ReactNode }) {
  return <span style={{ marginLeft: 'auto', opacity: 0.55, fontSize: 12, whiteSpace: 'nowrap' }}>{children}</span>
}

export function formatDay(value: unknown): string {
  const d = new Date(String(value ?? ""));
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const dayMs = 86_400_000;
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / dayMs);
  const md = d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
  if (diffDays <= 0) return `今天 ${d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return `昨天`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return md;
}
