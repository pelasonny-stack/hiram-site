"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Verdict = "approve" | "review" | "reject";

function verdictFor(threshold: number): Verdict {
  if (threshold < 30) return "approve";
  if (threshold < 70) return "review";
  return "reject";
}

const VERDICT_STYLES: Record<Verdict, string> = {
  approve: "bg-accent/10 border-accent/40 text-accent",
  review: "bg-warning/10 border-warning/40 text-warning",
  reject: "bg-danger/10 border-danger/40 text-danger",
};

const EVENT_PAYLOAD = `{
  amount: 4200,
  country: "BR",
  risk_signals: 3,
  hour_local: 23
}`;

export function MiniRuleEvaluator() {
  const t = useTranslations("Capabilities.miniRuleEvaluator");
  const [threshold, setThreshold] = React.useState(50);
  const verdict = verdictFor(threshold);

  return (
    <div className="corner-accent border border-border bg-background-elev/40 rounded-md p-5 space-y-4">
      <div className="text-eyebrow text-accent">{t("title")}</div>

      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
          {t("eventLabel")}
        </div>
        <pre className="overflow-x-auto rounded-md border border-code-border bg-code-bg p-3 text-xs font-mono leading-relaxed text-foreground-muted">
          {EVENT_PAYLOAD}
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
            {t("thresholdLabel")}
          </span>
          <span className="font-mono text-sm text-accent tabular-nums">
            {threshold.toString().padStart(3, "0")}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          aria-label={t("thresholdLabel")}
          className="accent-accent w-full h-1 bg-border-strong rounded appearance-none cursor-pointer"
        />
        <div className="flex justify-between font-mono text-[10px] text-foreground-subtle">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
          {t("verdictLabel")}
        </div>
        <div
          className={cn(
            "rounded-md border px-4 py-3 text-center font-mono text-base uppercase tracking-wider transition-colors",
            VERDICT_STYLES[verdict],
          )}
          aria-live="polite"
        >
          {t(`verdicts.${verdict}`)}
        </div>
      </div>

      <p className="font-mono text-[10px] text-foreground-subtle leading-relaxed">
        {t("hint")}
      </p>
    </div>
  );
}
