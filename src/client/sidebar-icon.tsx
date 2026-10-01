// 侧边栏磁贴：sidebar 托管按钮/标签/选中态（见 dsh ui-plugin-manager），组件只渲染图形。
// 设计：品牌渐变应用磁贴（圆角 + 高光 + 窗格意象），选中态白描边——入口即应用卡位。
interface Props {
  size?: number
  selected?: boolean
}

export function HyrealPanelIcon({ size = 20, selected = false }: Props) {
  const s = size
  return (
    <svg viewBox={"0 0 64 64"} width={s} height={s} aria-hidden style={{ display: "block" }}>
      <defs>
        <linearGradient id={"hyrealTile"} x1={"0"} y1={"0"} x2={"1"} y2={"1"}>
          <stop offset={"0%"} stopColor={"#3b8fd4"} />
          <stop offset={"100%"} stopColor={"#1c5fa8"} />
        </linearGradient>
      </defs>
      <rect x={"4"} y={"4"} width={"56"} height={"56"} rx={"14"} fill={"url(#hyrealTile)"} />
      <rect x={"4"} y={"4"} width={"56"} height={"26"} rx={"14"} fill={"#ffffff"} opacity={"0.14"} />
      <rect x={"14"} y={"16"} width={"16"} height={"12"} rx={"3"} fill={"#ffffff"} opacity={"0.95"} />
      <rect x={"34"} y={"16"} width={"16"} height={"12"} rx={"3"} fill={"#ffffff"} opacity={"0.55"} />
      <rect x={"14"} y={"32"} width={"16"} height={"12"} rx={"3"} fill={"#ffffff"} opacity={"0.55"} />
      <rect x={"34"} y={"32"} width={"16"} height={"12"} rx={"3"} fill={"#ffffff"} opacity={"0.8"} />
      {selected ? <rect x={"2"} y={"2"} width={"60"} height={"60"} rx={"16"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3"} opacity={"0.9"} /> : null}
    </svg>
  )
}
