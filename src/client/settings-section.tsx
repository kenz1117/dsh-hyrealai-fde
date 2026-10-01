// dsh 设置面板的「Hyreal FDE」分区 v5：一张大卡（hero + 字段表 + 表单），不再分栏。
// 与工作台同语言：渐变品牌底、统一圆角/间距/字阶；表单紧贴字段下方，不再横排碎片。
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { fdeMeta, type FdeMeta } from "./api";
import { ConnectionForm } from "./connection-form";
import { zh, type HyrealFdeLocaleKey } from "./i18n";
import { palette } from "./ui";

type Translate = (key: HyrealFdeLocaleKey) => string;

const cardStyle: CSSProperties = {
  borderRadius: "var(--dsw-radius-lg, 16px)",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))",
  background: `linear-gradient(160deg, ${palette.brand}14, transparent 60%), var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))`,
  padding: 24,
  display: "flex", flexDirection: "column", gap: 18,
  maxWidth: 720,
};

const bigWord: CSSProperties = { fontSize: 30, fontWeight: 600, lineHeight: 1.1 };

const labelStyle: CSSProperties = {
  fontSize: 11, fontWeight: 600, opacity: 0.6, letterSpacing: 0.6, textTransform: "uppercase" as const,
  marginBottom: 4, display: "block",
};

const linkStyle: CSSProperties = { color: palette.brand, textDecoration: "none", fontSize: 13 };

const fieldGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px 16px", alignItems: "start",
};

const divider: CSSProperties = {
  height: 1, background: "var(--dsw-alias-border-l4, rgba(127,127,127,0.18))",
  margin: "4px 0",
};

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: 999, marginRight: 6,
      background: ok ? palette.green : palette.amber,
    }} />
  );
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const min = Math.round(diffMs / 60_000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

export function HyrealFdeSettingsPage(props: { t?: Translate }): ReactNode {
  const t: Translate = props.t ?? ((key) => zh[key]);
  const [meta, setMeta] = useState<FdeMeta | null>(null);
  useEffect(() => { void fdeMeta().then(setMeta); }, []);
  const connected = !!meta?.hasPat;
  const updated = formatTime(meta?.patUpdatedAt ?? null);

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, opacity: 0.65, letterSpacing: 0.6 }}>{t("settingsNav")}</div>
          <div style={{ marginTop: 6, ...bigWord }}>
            <StatusDot ok={connected} />{connected ? t("connectionOk") : t("neverConnected")}
          </div>
        </div>
        {meta?.webUrl ? (
          <a href={meta.webUrl} target="_blank" rel="noreferrer" style={linkStyle}>{t("openPlatform")} ↗</a>
        ) : null}
      </div>

      <div style={divider} />

      <div style={fieldGrid}>
        <Field label={t("webUrlLabel")} value={meta?.webUrl} link={meta?.webUrl} />
        <Field label={t("patFingerprint")} value={meta?.patFingerprint} code />
        <Field label={t("patUpdatedAt")} value={updated} />
        <Field
          label={t("mcpToolsLabel")}
          value={meta?.mcpReady ? t("mcpReadyOk") : t("mcpReadyHint")}
          indicator={<StatusDot ok={!!meta?.mcpReady} />}
        />
      </div>

      <div style={divider} />

      <ConnectionForm meta={meta} t={t} onSaved={() => void fdeMeta().then(setMeta)} />
    </div>
  );
}

function Field({
  label, value, link, code, indicator,
}: { label: string; value: ReactNode; link?: string; code?: boolean; indicator?: ReactNode }) {
  return (
    <>
      <span style={labelStyle}>{label}</span>
      {indicator ? (
        <span style={{ display: "flex", alignItems: "center", fontSize: 13 }}>{indicator}<span>{value}</span></span>
      ) : code ? (
        <code style={{
          background: "var(--dsw-alias-bg-layer-3, rgba(127,127,127,0.12))",
          padding: "2px 8px", borderRadius: 4, fontSize: 12, overflow: "hidden",
          textOverflow: "ellipsis", display: "inline-block", whiteSpace: "nowrap", maxWidth: "100%",
        }}>{value ?? "—"}</code>
      ) : link ? (
        <a href={link} target="_blank" rel="noreferrer" style={linkStyle}>{value}</a>
      ) : (
        <span style={{ fontSize: 13 }}>{value ?? "—"}</span>
      )}
    </>
  );
}