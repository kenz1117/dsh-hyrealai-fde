// 平台接入表单 v2：PAT 字段与保存按钮同行紧凑布局；保存后显示指纹与时间。
import { useState, type CSSProperties, type ReactNode } from "react";
import { fdeSaveConfig, type FdeMeta } from "./api";
import type { HyrealFdeLocaleKey } from "./i18n";
import { palette } from "./ui";

type Translate = (key: HyrealFdeLocaleKey) => string;

const inputStyle: CSSProperties = {
  flex: 1, minWidth: 0, padding: "9px 12px", fontSize: 13,
  borderRadius: "var(--dsw-radius-sm, 8px)",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.35))",
  background: "var(--dsw-alias-bg-layer-1, transparent)", color: "inherit", outline: "none",
};

const labelStyle: CSSProperties = {
  fontSize: 11, fontWeight: 600, opacity: 0.6, letterSpacing: 0.5, textTransform: "uppercase" as const,
  marginBottom: 6, display: "block",
};

export function ConnectionForm(props: { meta: FdeMeta | null; t: Translate; onSaved: () => void }): ReactNode {
  const { t } = props;
  const [pat, setPat] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    setBusy(true);
    setResult(null);
    const r = await fdeSaveConfig({ pat: pat.trim() });
    setBusy(false);
    if (!r.ok) {
      setResult({ ok: false, text: r.error ?? "保存失败" });
      return;
    }
    setResult({ ok: !!r.reachable, text: r.reachable ? t("connectedOk") : `${t("connectedFail")}（HTTP ${r.healthStatus ?? "—"}）` });
    if (r.reachable) {
      setPat("");
      props.onSaved();
    }
  }

  const fp = props.meta?.patFingerprint;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -2 }}>
        <span style={{ fontSize: 11, opacity: 0.55 }}>
          {fp ? <code style={{ background: "var(--dsw-alias-bg-layer-3, rgba(127,127,127,0.12))", padding: "1px 6px", borderRadius: 4 }}>{fp}</code> : t("patNever")}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          style={inputStyle}
          type="password"
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          placeholder="fde_pat_…"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy || !pat.trim()}
          style={{
            flexShrink: 0, cursor: busy || !pat.trim() ? "not-allowed" : "pointer",
            border: "none", borderRadius: "var(--dsw-radius-sm, 8px)",
            background: palette.brand, color: "#fff", padding: "0 18px", fontSize: 13, fontWeight: 600,
            opacity: busy || !pat.trim() ? 0.5 : 1,
          }}
        >
          {busy ? t("saving") : t("saveUpdate")}
        </button>
      </div>
      <div style={{ padding: "0 4px", fontSize: 12, opacity: 0.6, display: "flex", alignItems: "center", gap: 8 }}>
        <span>{t("patHelp")}：<a href="https://fde.goodpoint.top/settings/tokens" target="_blank" rel="noreferrer" style={{ color: palette.brand }}>fde.goodpoint.top/settings/tokens</a></span>
        {result ? (
          <span style={{ marginLeft: "auto", color: result.ok ? palette.green : palette.amber }}>{result.text}</span>
        ) : null}
      </div>
      {props.meta && !props.meta.mcpReady ? (
        <div style={{ fontSize: 12, opacity: 0.6, padding: "0 4px" }}>{t("mcpRestartHint")}</div>
      ) : null}
    </div>
  );
}