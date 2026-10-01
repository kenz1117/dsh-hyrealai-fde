// 侧边栏图标：sidebar 托管按钮/标签/选中态（见 dsh ui-plugin-manager），组件只渲染图形。
// 官方禁令：不 require @deepseek-ai/dsh-client-ui-primitives，自绘匹配宿主风格。
interface Props {
  size?: number
}

export function HyrealPanelIcon({ size = 20 }: Props) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#247bbf" />
      <text x="32" y="43" textAnchor="middle" fontSize="30" fill="#ffffff" fontFamily="system-ui, sans-serif">
        H
      </text>
    </svg>
  )
}
