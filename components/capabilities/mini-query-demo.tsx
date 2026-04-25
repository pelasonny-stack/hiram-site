"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESPONSES: Record<number, unknown> = {
  0: {
    rows: [
      { method: "pix", fail_rate: 0.18, p95_ms: 3120 },
      { method: "boleto", fail_rate: 0.07, p95_ms: 1840 },
      { method: "card", fail_rate: 0.04, p95_ms: 920 },
    ],
  },
  1: {
    count: 247,
    high_risk: 89,
    median_score: 0.71,
    drivers: ["support_tickets", "usage_drop", "billing_friction"],
  },
  2: {
    queue_size: 1432,
    avg_age_min: 14,
    p99_age_min: 87,
    auto_resolvable: 0.62,
  },
  3: {
    cohorts: [
      { q: "2024Q3", arr_usd: 1240000, delta_qoq: 0.18 },
      { q: "2025Q4", arr_usd: 1820000, delta_qoq: 0.12 },
    ],
  },
};

export function MiniQueryDemo() {
  const t = useTranslations("Capabilities.miniQueryDemo");
  const queries = t.raw("queries") as string[];
  const [index, setIndex] = React.useState(0);
  const output = RESPONSES[index] ?? {};
  const json = JSON.stringify(output, null, 2);

  return (
    <div className="corner-accent border border-border bg-background-elev/40 rounded-md p-5 space-y-4">
      <div className="text-eyebrow text-accent">{t("title")}</div>

      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
          {t("selectLabel")}
        </div>
        <Select
          value={String(index)}
          onValueChange={(v) => setIndex(Number(v))}
        >
          <SelectTrigger
            className="w-full font-mono text-xs"
            aria-label={t("selectLabel")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {queries.map((q, i) => (
              <SelectItem key={i} value={String(i)} className="font-mono text-xs">
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
          {t("outputLabel")}
        </div>
        <pre
          className="overflow-auto rounded-md border border-code-border bg-code-bg p-3 text-xs font-mono leading-relaxed text-foreground-muted max-h-48"
          aria-live="polite"
        >
          {json}
        </pre>
      </div>

      <p className="font-mono text-[10px] text-foreground-subtle leading-relaxed">
        {t("hint")}
      </p>
    </div>
  );
}
