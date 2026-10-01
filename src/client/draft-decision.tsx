// 草稿行内决策：待修订草稿在行尾直接 ✓/✗（POST /fde/api/communication-draft-decide 走 host 代理）。
import { useState, type ReactNode } from "react";
import { palette } from "./ui";

interface Props {
  draftId: string;
  title: string;
  kind: string;
  clientName?: string;
  updatedAt?: string;
  onResolved: () => void;
}

function formatDay(value: unknown): string {
  const d = new Date(String(value ?? ""));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

export function DraftDecisionCard(props: Props) {
  const [busy, setBusy] = useState<"accept" | "dismiss" | null>(null);
  const [done, setDone] = useState<"accept" | "dismiss" | null>(null);
  const [err, setErr] = useState("");

  async function decide(decision: "accept" | "dismiss") {
    setBusy(decision);
    setErr("");
    try {
      const r = await fetch("/fde/api/communication-draft-decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: props.draftId, decision }),
      });
      const j = await r.json().catch(() => ({}));
      if (j.ok) {
        setDone(decision);
        setTimeout(() => props.onResolved(), 600);
      } else {
        setErr(j.error ?? `HTTP ${r.status}`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  const iconBtn = (decision: "accept" | "dismiss", glyph: string, color: string, label: string): ReactNode => (
    <button
      type="button"
      title={label}
      onClick={() => void decide(decision)}
      disabled={!!busy}
      style={{
        cursor: busy ? "not-allowed" : "pointer", fontSize: 12, lineHeight: 1,
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        border: `1px solid ${color}55`, background: `${color}14`, color,
        opacity: busy && busy !== decision ? 0.4 : 1,
      }}
    >
      {glyph}
    </button>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 2px", fontSize: 13, minWidth: 0 }}>
      <span style={{
        display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500,
        color: palette.amber, background: `${palette.amber}1f`, border: `1px solid ${palette.amber}40`, flexShrink: 0,
      }}>
        待修订
      </span>
      <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
        {props.title}
      </span>
      {done ? (
        <span style={{ fontSize: 11, color: done === "accept" ? palette.green : palette.gray, flexShrink: 0 }}>
          {done === "accept" ? "已接受 ✓" : "已驳回"}
        </span>
      ) : (
        <>
          {iconBtn("accept", "✓", palette.green, "接受（转正式）")}
          {iconBtn("dismiss", "✗", palette.red, "驳回")}
        </>
      )}
      {err ? <span style={{ fontSize: 11, color: palette.red, flexShrink: 0 }}>{err}</span> : (
        <span style={{ fontSize: 11, opacity: 0.5, flexShrink: 0 }}>{formatDay(props.updatedAt)}</span>
      )}
    </div>
  );
}