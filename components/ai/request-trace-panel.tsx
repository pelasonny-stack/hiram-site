"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface TraceState {
  promptTokens: number;
  cachedTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: "idle" | "streaming" | "done" | "error";
}

export const initialTrace: TraceState = {
  promptTokens: 0,
  cachedTokens: 0,
  outputTokens: 0,
  latencyMs: 0,
  status: "idle",
};

const PRICING = {
  inputPerMTok: 1,
  outputPerMTok: 5,
  cachedPerMTok: 0.1,
};

function computeCost(t: TraceState): number {
  const liveInput = Math.max(0, t.promptTokens - t.cachedTokens);
  return (
    (liveInput / 1_000_000) * PRICING.inputPerMTok +
    (t.cachedTokens / 1_000_000) * PRICING.cachedPerMTok +
    (t.outputTokens / 1_000_000) * PRICING.outputPerMTok
  );
}

function fmtCost(usd: number): string {
  if (usd === 0) return "$0.0000";
  if (usd < 0.0001) return `$${usd.toFixed(6)}`;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(3)}`;
}

export function RequestTracePanel({
  trace,
  className,
}: {
  trace: TraceState;
  className?: string;
}) {
  const t = useTranslations("Demo.requestTrace");
  const cost = computeCost(trace);
  const isActive = trace.status === "streaming" || trace.status === "done";

  return (
    <div
      className={cn(
        "sticky top-24 overflow-hidden rounded-md border border-border bg-background-elev/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-background-elev/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider">
        <span
          className={cn(
            "flex items-center gap-2",
            trace.status === "streaming" && "pulse-dot text-info",
            trace.status === "done" && "text-accent",
            trace.status === "idle" && "text-foreground-subtle",
            trace.status === "error" && "text-danger",
          )}
        >
          <span>{t("title")}</span>
        </span>
        <span className="text-foreground-muted">{t("endpoint")}</span>
      </div>

      <dl className="divide-y divide-border">
        <Row label={t("model")} value={t("modelValue")} mono />
        <Row label={t("promptTokens")} value={isActive ? trace.promptTokens.toLocaleString() : "—"} mono accent={isActive} />
        <Row label={t("cachedTokens")} value={isActive ? trace.cachedTokens.toLocaleString() : "—"} mono warning={isActive && trace.cachedTokens > 0} />
        <Row label={t("outputTokens")} value={isActive ? trace.outputTokens.toLocaleString() : "—"} mono accent={isActive} />
        <Row label={t("latency")} value={isActive ? trace.latencyMs.toLocaleString() : "—"} mono accent={isActive} />
        <Row label={t("cost")} value={isActive ? fmtCost(cost) : "—"} mono accent={isActive} />
      </dl>

      <div className="border-t border-border bg-background-elev/60 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
        {trace.status === "idle" ? t("idleHint") : t("estimatedHint")}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  accent,
  warning,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-3 px-4 py-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
        {label}
      </dt>
      <dd
        className={cn(
          "text-right",
          mono && "font-mono text-xs",
          accent ? "text-accent" : warning ? "text-warning" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
