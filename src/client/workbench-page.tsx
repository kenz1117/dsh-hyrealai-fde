// 工作台主页面 v2（main 插槽）：全宽响应式栅格 + 问候 hero + KPI 数字块 + 四分区。
// 视觉规范（PRODUCT-PLAN §4）：8pt 间距、字阶 20/15/13/12、卡片 hover 抬升、
// 品牌渐变仅用于 hero（artwork 例外）、三态（骨架/空/错误）统一。
// 数据端点 /api/workbench/*（平台侧）；结构不符时兜底为格式化文本。
import { useCallback, useEffect, useMemo, useState, Component, type CSSProperties, type ReactNode } from "react";
import { fdeGet, fdeMeta, type FdeLoadState, type FdeMeta } from "./api";
import { zh, type HyrealFdeLocaleKey } from "./i18n";
import { DraftDecisionCard } from "./draft-decision";
import {
  chipColors, Chip, EmptyState, ErrorState, formatDay, IconBolt, IconClients, IconDraft, IconProject, IconRefresh,
  PULSE_CSS, Row, RowMeta, RowTitle, SectionCard, SkeletonRows, ActionButton, palette,
} from "./ui";

type Translate = (key: HyrealFdeLocaleKey) => string;

type SectionKind = "actions" | "clients" | "projects" | "drafts" | "notifications" | "contracts" | "learning" | "report";

const SECTION_DEFS: Array<{ kind: SectionKind; titleKey: HyrealFdeLocaleKey; path: string; icon: ReactNode }> = [
  { kind: "actions", titleKey: "actionsTitle", path: "/api/workbench/actions", icon: <IconBolt size={16} /> },
  { kind: "contracts", titleKey: "contractsTitle", path: "/api/workbench/contracts", icon: <IconBolt size={16} /> },
  { kind: "clients", titleKey: "clientsTitle", path: "/api/workbench/clients", icon: <IconClients size={16} /> },
  { kind: "projects", titleKey: "projectsTitle", path: "/api/workbench/projects", icon: <IconProject size={16} /> },
  { kind: "drafts", titleKey: "draftsTitle", path: "/api/workbench/drafts", icon: <IconDraft size={16} /> },
];
const LEARNING_DEF = { kind: "learning" as SectionKind, titleKey: "learningTitle" as HyrealFdeLocaleKey, path: "/api/workbench/learning", icon: <IconBolt size={16} /> };
const NOTIFICATIONS_DEF = { kind: "notifications" as SectionKind, titleKey: "notificationsTitle" as HyrealFdeLocaleKey, path: "/api/workbench/notifications", icon: <IconDraft size={16} /> };
const REPORT_DEF = { kind: "report" as SectionKind, titleKey: "reportTitle" as HyrealFdeLocaleKey, path: "/api/workbench/report?days=7", icon: <IconBolt size={16} /> };

// ---------- 布局 ----------

const pageStyle: CSSProperties = {
  padding: "20px 28px 28px",
  display: "flex", flexDirection: "column", gap: 18,
  overflowY: "auto", height: "100%", boxSizing: "border-box", width: "100%",
};

const heroStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 16,
  padding: "18px 22px",
  borderRadius: "var(--dsw-radius-lg, 16px)",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.22))",
  background: `linear-gradient(120deg, ${palette.brand}14, transparent 55%)`,
};

const kpiRowStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12,
};

const kpiStyle: CSSProperties = {
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.06))",
  border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.18))",
  borderRadius: "var(--dsw-radius-md, 12px)",
  padding: "12px 16px",
};

const gridStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 14,
  alignItems: "start", width: "100%",
};

const ghostBtn = (accent = false): CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontWeight: 500,
  border: `1px solid ${accent ? `${palette.brand}55` : "var(--dsw-alias-border-l4, rgba(127,127,127,0.25))"}`,
  background: accent ? `${palette.brand}14` : "transparent",
  color: accent ? palette.brand : "inherit",
  borderRadius: "var(--dsw-radius-sm, 8px)", padding: "5px 12px",
});

// ---------- 数据 ----------

function useFdeData<T>(path: string, nonce: number): FdeLoadState<T> {
  const [state, setState] = useState<FdeLoadState<T>>({ status: "loading" });
  const load = useCallback(() => {
    setState({ status: "loading" });
    void fdeGet<T>(path).then(setState);
  }, [path]);
  useEffect(load, [load, nonce]);
  return state;
}

function asArray(data: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    for (const key of ["rows", "items", "list", "actions", "clients", "projects", "drafts"]) {
      const v = (data as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
  }
  return null;
}

function countOf(state: FdeLoadState<unknown>): number | undefined {
  if (state.status !== "ready") return undefined;
  if (typeof state.data === "object" && state.data !== null && Array.isArray((state.data as { actions?: unknown }).actions)) {
    return ((state.data as { actions: unknown[] }).actions).length;
  }
  const rows = asArray(state.data);
  return rows ? rows.length : undefined;
}

// ---------- 行渲染 ----------

const CLIENT_STATUS_TONE: Record<string, keyof typeof palette> = {
  商机: "brand", 洽谈中: "brand", 服务中: "green", 已结项: "gray", 流失: "red",
};
const PRIORITY_TONE: Record<string, keyof typeof palette> = {
  critical: "red", high: "red", medium: "amber", low: "gray",
};
const KIND_LABEL: Record<string, HyrealFdeLocaleKey> = {
  prepare_reply: "kindPrepareReply", predict_questions: "kindPredictQuestions",
  organize_draft: "kindOrganizeDraft", freeform: "kindFreeform",
};

function healthTone(score: unknown): keyof typeof palette {
  const n = Number(score);
  if (!Number.isFinite(n)) return "gray";
  return n >= 80 ? "green" : n >= 60 ? "amber" : "red";
}

function renderSummary(text: string): ReactNode {
  return <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13, lineHeight: 1.7, fontFamily: "inherit" }}>{text}</pre>;
}

function ClientRows({ rows, platformBase }: { rows: Record<string, unknown>[]; platformBase: string }) {
  return (
    <div>
      {rows.slice(0, 20).map((c, i) => (
        <Row key={i}>
          <RowTitle>{String(c.name ?? "—")}</RowTitle>
          {c.status ? <Chip tone={CLIENT_STATUS_TONE[String(c.status)] ?? "gray"}>{String(c.status)}</Chip> : null}
          {c.tier ? <Chip tone="brand">{String(c.tier)}</Chip> : null}
          {c.locust && String(c.locust) !== "正常" ? <Chip tone="amber">{String(c.locust)}</Chip> : null}
          <RowMeta>{formatDay(c.updatedAt)}</RowMeta>
          {platformBase ? (
            <a href={`${platformBase}/clients/${c.id}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: palette.brand, textDecoration: "none", marginLeft: 4 }}>
              打开 ↗
            </a>
          ) : null}
        </Row>
      ))}
    </div>
  );
}

function ProjectRows({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <div>
      {rows.slice(0, 20).map((p, i) => {
        const clientName = (p.client as Record<string, unknown> | undefined)?.name;
        return (
          <Row key={i}>
            <span style={{ width: 8, height: 8, borderRadius: 999, flexShrink: 0, background: palette[healthTone(p.healthScore)] }} />
            <RowTitle>{String(p.name ?? "—")}</RowTitle>
            {p.stage ? <Chip tone="brand">{String(p.stage)}</Chip> : null}
            <RowMeta>{clientName ? `${String(clientName)} · ` : ""}{formatDay(p.updatedAt)}</RowMeta>
          </Row>
        );
      })}
    </div>
  );
}

function DraftRows({ rows, t, onResolved }: { rows: Record<string, unknown>[]; t: Translate; onResolved: () => void }) {
  if (rows.length === 0) return <EmptyState text={t("emptyDrafts")} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.slice(0, 20).map((d, i) => {
        const id = String(d.id ?? "");
        const status = String(d.status ?? "");
        const isPending = status === "pending_review";
        const title = String(d.title ?? "—");
        const created = d.createdAt;
if (isPending && id) {
          return (
            <DraftDecisionCard
              key={id}
              draftId={id}
              title={title}
              kind={String(d.kind ?? "")}
              updatedAt={created ? String(created) : undefined}
              onResolved={onResolved}
            />
          );
        }
        return (
          <Row key={id || i}>
            <IconDraft size={14} color={palette.amber} />
            <RowTitle>{title}</RowTitle>
            {d.kind ? <Chip tone="brand">{t(KIND_LABEL[String(d.kind)] ?? "kindFreeform")}</Chip> : null}
            {status === "accepted" ? <Chip tone="green">已接受</Chip> :
             status === "dismissed" ? <Chip tone="gray">已驳回</Chip> : null}
            <RowMeta>{formatDay(created)}</RowMeta>
          </Row>
        );
      })}
    </div>
  );
}

function LearningRows({ rows, t, platformBase }: { rows: Record<string, unknown>[]; t: Translate; platformBase: string }) {
  if (rows.length === 0) return <EmptyState text={t("empty")} />;
  return (
    <div>
      {rows.slice(0, 20).map((r, i) => {
        const slug = String(r.lessonSlug ?? "");
        const href = platformBase ? `${platformBase}/learning/course/${slug}` : "#";
        return (
          <Row key={i}>
            <span style={{ width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: palette.green }} />
            <RowTitle>
              <a href={href} target={"_blank"} rel={"noreferrer"} style={{ color: "inherit", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = palette.brand; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "inherit"; }}>
                {String(r.title ?? slug ?? "—")}
              </a>
            </RowTitle>
            <RowMeta>{formatDay(r.completedAt)}</RowMeta>
          </Row>
        );
      })}
    </div>
  );
}

function ReportBody({ summary, days }: { summary: Record<string, unknown>; days: number }) {
  const cells: Array<[string, number | undefined]> = [
    ["客户", Number(summary.clients ?? 0)],
    ["项目", Number(summary.projects ?? 0)],
    ["沟通", Number(summary.communications ?? 0)],
    ["交付物", Number(summary.deliverables ?? 0)],
    ["草稿", Number(summary.drafts ?? 0)],
    ["通知", Number(summary.notifications ?? 0)],
  ];
  return (
    <div>
      <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>近 {days} 天（{String(summary.since ?? "").slice(0, 10)} 起）</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
        {cells.map(([label, n]) => (
          <div key={label} style={{
            padding: "10px 12px",
            borderRadius: "var(--dsw-radius-md, 12px)",
            border: "1px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.18))",
            background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.05))",
          }}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{Number.isFinite(n) ? n : "—"}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionRows({ data }: { data: unknown }) {
  if (typeof data === "string") return renderSummary(data);
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const summary = (data as { summary?: unknown }).summary;
    if (typeof summary === "string" && summary) return renderSummary(summary);
  }
  const rows = asArray(data);
  if (!rows) return null;
  return (
    <div>
      {rows.slice(0, 20).map((a, i) => (
        <Row key={i}>
          {a.priority ? <Chip tone={PRIORITY_TONE[String(a.priority)] ?? "amber"}>{String(a.priority)}</Chip> : null}
          <RowTitle>{String(a.title ?? a.text ?? "—")}</RowTitle>
          <RowMeta>{a.clientName ? String(a.clientName) : formatDay(a.dueDate ?? a.updatedAt)}</RowMeta>
        </Row>
      ))}
    </div>
  );
}

function ContractRows({ data, t }: { data: unknown; t: Translate }) {
  const d = data as { contracts?: Record<string, unknown>[]; paymentsDue?: Record<string, unknown>[] };
  const due = d.paymentsDue ?? [];
  const contracts = d.contracts ?? [];
  if (due.length === 0 && contracts.length === 0) return <EmptyState text={t("empty")} />;
  return (
    <div>
      {due.map((p, i) => (
        <Row key={"p" + i}>
          <Chip tone="red">{t("paymentDue")}</Chip>
          <RowTitle>{String(p.label ?? "—")}</RowTitle>
          <RowMeta>{String((p.contract as { client?: { name?: unknown } })?.client?.name ?? "")} · {formatDay(p.dueDate)}</RowMeta>
        </Row>
      ))}
      {contracts.map((c, i) => (
        <Row key={"c" + i}>
          <RowTitle>{String(c.contractNo ?? c.type ?? "—")}</RowTitle>
          {c.status ? <Chip tone={String(c.status) === "履约中" ? "green" : "gray"}>{String(c.status)}</Chip> : null}
          <RowMeta>{String((c.client as { name?: unknown })?.name ?? "")} · {formatDay(c.createdAt)}</RowMeta>
        </Row>
      ))}
    </div>
  );
}

function NotificationRows({ rows, t }: { rows: Record<string, unknown>[]; t: Translate }) {
  if (rows.length === 0) return <EmptyState text={t("empty")} />;
  // 聚合重复项（如后台任务失败刷屏）：同标题合并为一条 + ×N
  const groups = new Map<string, { row: Record<string, unknown>; n: number }>();
  for (const r of rows) {
    const key = String(r.title ?? "—");
    const g = groups.get(key);
    if (g) g.n += 1; else groups.set(key, { row: r, n: 1 });
  }
  return (
    <div>
      {[...groups.values()].slice(0, 20).map(({ row, n }, i) => (
        <Row key={i}>
          {row.readAt ? null : <span style={{ width: 7, height: 7, borderRadius: 999, flexShrink: 0, background: palette.brand }} />}
          <RowTitle>{String(row.title ?? "—")}</RowTitle>
          {n > 1 ? <Chip tone={"gray"}>{"×" + n}</Chip> : null}
          <RowMeta>{formatDay(row.createdAt)}</RowMeta>
        </Row>
      ))}
    </div>
  );
}

// ---------- 组装 ----------

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "夜深了";
  if (h < 12) return "早上好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  return "晚上好";
}

/** 错误边界：渲染抛错时把堆栈显示在页面上（自诊断），而不是整页空白 */
class PageBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: palette.red, whiteSpace: "pre-wrap", fontSize: 12, fontFamily: "monospace" }}>
          {"Workbench render error:\n" + String(this.state.error?.stack || this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

export function WorkbenchPage(props: { t?: Translate }): ReactNode {
  const t: Translate = props.t ?? ((key) => zh[key]);
  const [meta, setMeta] = useState<FdeMeta | null>(null);
  const [meName, setMeName] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    void fdeMeta().then(setMeta);
  }, []);
  const actions = useFdeData<unknown>("/api/workbench/actions", nonce);
  const clients = useFdeData<unknown>("/api/workbench/clients", nonce);
  const projects = useFdeData<unknown>("/api/workbench/projects", nonce);
  const drafts = useFdeData<unknown>("/api/workbench/drafts", nonce);
  const learning = useFdeData<unknown>("/api/workbench/learning", nonce);
  const report = useFdeData<unknown>("/api/workbench/report?days=7", nonce);
  const notifications = useFdeData<unknown>("/api/workbench/notifications", nonce);
  const contracts = useFdeData<unknown>("/api/workbench/contracts", nonce);
  // 身份问候（/api/workbench/me 平台侧已实现，未部署前静默降级）
  useEffect(() => {
    void fdeGet<{ name?: string }>("/api/workbench/me").then((s) => {
      if (s.status === "ready" && s.data?.name) setMeName(s.data.name);
    });
  }, [nonce]);
  const states: Record<SectionKind, FdeLoadState<unknown>> = { actions, clients, projects, drafts, notifications, contracts, learning, report };
  const kpis: Array<{ key: HyrealFdeLocaleKey; n: number | undefined }> = [
    { key: "actionsTitle", n: countOf(actions) },
    { key: "clientsTitle", n: countOf(clients) },
    { key: "projectsTitle", n: countOf(projects) },
    { key: "draftsTitle", n: countOf(drafts) },
  ];
  const dateLine = new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });

  const platformBase = meta?.baseUrl ?? "";
  const renderBody = (kind: SectionKind, state: FdeLoadState<unknown>, platformBase: string): ReactNode => {
    void 0;
    if (state.status === "loading") return <SkeletonRows />;
    if (state.status === "need-pat") return <ErrorState title={t("needPat")} detail={state.hint} />;
    if (state.status === "error") return <ErrorState title={t("loadFailed")} detail={state.message} />;
    const rows = asArray(state.data);
    if (rows && rows.length === 0 && kind !== "drafts" && kind !== "learning" && kind !== "report") return <EmptyState text={t("empty")} />;
    if (kind === "clients") return rows ? <ClientRows rows={rows} platformBase={platformBase} /> : null;
    if (kind === "projects") return rows ? <ProjectRows rows={rows} /> : null;
    if (kind === "drafts") return rows ? <DraftRows rows={rows} t={t} onResolved={() => setNonce((n) => n + 1)} /> : null;
    if (kind === "notifications") {
      const r = state.data as { rows?: Record<string, unknown>[] } | null;
      return <NotificationRows rows={r?.rows ?? []} t={t} />;
    }
    if (kind === "contracts") return <ContractRows data={state.data} t={t} />;
    if (kind === "learning") { const r = (state.data as { recent?: Record<string, unknown>[] } | null)?.recent ?? []; return <LearningRows rows={r} t={t} platformBase={platformBase} />; }
    if (kind === "report") {
      const d = (state.data ?? {}) as Record<string, unknown>;
      const days = typeof d.days === "number" ? d.days : 7;
      return <ReportBody summary={d} days={days} />;
    }
    return <ActionRows data={state.data} />;
  };

  return (
    <PageBoundary>
      <div style={pageStyle}>
      <style>{PULSE_CSS}</style>
      <div style={heroStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {greeting()}
            {meName ? `，${meName}` : ""}
          </div>
          <div style={{ marginTop: 4, fontSize: 12, opacity: 0.65 }}>
            {dateLine}
            {meta?.hasPat ? " · 已接入" : ` · ${t("needPatBanner")}`}
          </div>
        </div>
        {meta?.webUrl ? (
          <a href={meta.webUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: palette.brand, textDecoration: "none" }}>
            {t("openPlatform")}
          </a>
        ) : null}
        <ActionButton accent icon={<IconRefresh size={12} />} label={t("refreshAll")} onClick={() => setNonce((n) => n + 1)} />
      </div>

      <div style={kpiRowStyle}>
        {kpis.map((k) => (
          <div key={k.key} style={kpiStyle}>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{k.n ?? "—"}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{t(k.key)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", width: "100%", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          {SECTION_DEFS.map((def) => {
            const state = states[def.kind];
            return (
              <SectionCard
                key={def.kind}
                icon={def.icon}
                title={t(def.titleKey)}
                count={countOf(state)}
                onReload={() => setNonce((n) => n + 1)}
              >
                {renderBody(def.kind, state, platformBase)}
              </SectionCard>
            );
          })}
        </div>
        <aside style={{ width: 400, flexShrink: 0, position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard
            icon={REPORT_DEF.icon}
            title={t(REPORT_DEF.titleKey)}
            onReload={() => setNonce((n) => n + 1)}
          >
            {renderBody("report", report, platformBase)}
          </SectionCard>
          <SectionCard
            icon={LEARNING_DEF.icon}
            title={t(LEARNING_DEF.titleKey)}
            count={learning.status === "ready" && learning.data && typeof learning.data === "object" ? Number((learning.data as { completed?: number }).completed ?? 0) : undefined}
            onReload={() => setNonce((n) => n + 1)}
          >
            {renderBody("learning", learning, platformBase)}
          </SectionCard>
          <SectionCard
            icon={NOTIFICATIONS_DEF.icon}
            title={t(NOTIFICATIONS_DEF.titleKey)}
            count={notifications.status === "ready" && notifications.data && typeof notifications.data === "object" ? Number((notifications.data as { unread?: number }).unread ?? 0) : undefined}
            onReload={() => setNonce((n) => n + 1)}
          >
            {renderBody("notifications", notifications, platformBase)}
          </SectionCard>
        </aside>
      </div>
      </div>
    </PageBoundary>
  );
}
