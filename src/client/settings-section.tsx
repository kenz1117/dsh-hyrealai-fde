// dsh 设置面板的「Hyreal FDE」分区 v6：
// hero（品牌+接入状态）→ 插件信息卡（版本+检查更新）→ 平台地址 → 接入配置表单。
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { fdeMeta, type FdeMeta } from "./api";
import { ConnectionForm } from "./connection-form";
import { zh, type HyrealFdeLocaleKey } from "./i18n";
import { ActionButton, palette } from "./ui";

type Translate = (key: HyrealFdeLocaleKey) => string;

const cardStyle: CSSProperties = {
  borderRadius: "var(--dsw-radius-lg, 16px)",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))",
  padding: 18,
};

const heroStyle: CSSProperties = {
  borderRadius: "var(--dsw-radius-lg, 16px)",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))",
  background: `linear-gradient(160deg, ${palette.brand}14, transparent 60%), var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))`,
  padding: 18,
};

const sectionLabel: CSSProperties = {
  fontSize: 11, fontWeight: 600, opacity: 0.6, letterSpacing: 0.6, textTransform: "uppercase" as const, marginBottom: 10, display: "block",
};

const rowGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 16px", alignItems: "center", fontSize: 13,
};

const codeStyle: CSSProperties = {
  background: "var(--dsw-alias-bg-layer-3, rgba(127,127,127,0.12))",
  padding: "1px 6px", borderRadius: 4, fontSize: 12,
};

function Dot({ ok }: { ok: boolean }) {
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, marginRight: 6, background: ok ? palette.green : palette.amber }} />;
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const min = Math.round((Date.now() - d.getTime()) / 60_000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

/** 语义化版本比较：latest 是否比 current 新 */
function isNewer(latest?: string | null, current?: string | null): boolean {
  if (!latest || !current) return false;
  const a = latest.split(".").map(Number);
  const b = current.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

export function HyrealFdeSettingsPage(props: { t?: Translate }): ReactNode {
  const t: Translate = props.t ?? ((key) => zh[key]);
  const [meta, setMeta] = useState<FdeMeta | null>(null);
  const [checking, setChecking] = useState(false);
  useEffect(() => { void fdeMeta().then(setMeta); }, []);
  const recheck = () => {
    setChecking(true);
    void fdeMeta().then((m) => { setMeta(m); setChecking(false); });
  };

  const hasUpdate = isNewer(meta?.latestVersion, meta?.currentVersion);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 2px 20px", width: "100%", maxWidth: 760 }}>
      {/* hero */}
      <div style={heroStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, opacity: 0.65, letterSpacing: 0.6 }}>{t("settingsNav")}</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{t("connTitle")}</div>
        </div>
        {meta?.webUrl ? (
          <a href={meta.webUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: palette.brand, textDecoration: "none" }}>
            {t("openPlatform")}
          </a>
        ) : null}
      </div>

      {/* 插件信息卡 */}
      <div style={cardStyle}>
        <span style={sectionLabel}>{t("pluginInfo")}</span>
        <div style={rowGrid}>
          <span style={{ opacity: 0.65 }}>{t("currentVersionLabel")}</span>
          <span><code style={codeStyle}>v{meta?.currentVersion ?? "—"}</code>{hasUpdate ? <span style={{ marginLeft: 8, color: palette.amber, fontWeight: 500 }}>↑ {t("newVersionAvailable")} v{meta?.latestVersion}</span> : null}</span>
          <span style={{ opacity: 0.65 }}>{t("patFingerprint")}</span>
          <span><code style={codeStyle}>{meta?.patFingerprint ?? t("patNever")}</code></span>
          <span style={{ opacity: 0.65 }}>{t("patUpdatedAt")}</span>
          <span>{formatTime(meta?.patUpdatedAt ?? null)}</span>
          <span style={{ opacity: 0.65 }}>{t("mcpToolsLabel")}</span>
          <span><Dot ok={!!meta?.mcpReady} />{meta?.mcpReady ? t("mcpReadyOk") : t("mcpReadyHint")}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <ActionButton small accent icon={null} label={checking ? t("checking") : t("checkUpdate")} onClick={recheck} />
        </div>
      </div>

      {/* 平台地址卡 */}
      <div style={cardStyle}>
        <span style={sectionLabel}>{t("platformLabel")}</span>
        <div style={rowGrid}>
          <span style={{ opacity: 0.65 }}>{t("webUrlLabel")}</span>
          {meta?.webUrl ? <a href={meta.webUrl} target="_blank" rel="noreferrer" style={{ color: palette.brand }}>{meta.webUrl}</a> : <span>—</span>}
          <span style={{ opacity: 0.65 }}>{t("baseUrlLabel")}</span>
          <span><code style={codeStyle}>{meta?.baseUrl ?? "—"}</code></span>
        </div>
      </div>

      {/* 接入配置卡 */}
      <div style={cardStyle}>
        <span style={sectionLabel}>{t("connTitle")}</span>
        <div style={{ marginBottom: 10, fontSize: 13 }}>
          <Dot ok={!!meta?.hasPat} />
          {meta?.hasPat
            ? <>{t("configured")} · {t("patUpdatedAt")} {formatTime(meta.patUpdatedAt)}</>
            : <span style={{ color: palette.amber }}>{t("notConfigured")}</span>}
        </div>
        <ConnectionForm meta={meta} t={t} onSaved={() => void fdeMeta().then(setMeta)} />
      </div>
    </div>
  );
}