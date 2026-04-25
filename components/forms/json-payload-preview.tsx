"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface PayloadPreviewProps {
  data: Record<string, unknown>;
  className?: string;
  endpoint?: string;
}

export function JsonPayloadPreview({
  data,
  className,
  endpoint = "POST /api/contact",
}: PayloadPreviewProps) {
  const t = useTranslations("Contact.form");

  const cleaned = React.useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (k === "honeypot") continue;
      if (v === undefined || v === null || v === "") continue;
      out[k] = v;
    }
    return out;
  }, [data]);

  const lineCount = Object.keys(cleaned).length;

  return (
    <div
      className={cn(
        "sticky top-24 overflow-hidden rounded-md border border-border bg-background-elev/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-background-elev/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
        <span className="flex items-center gap-2">
          <span className="pulse-dot text-accent" aria-hidden />
          {t("payloadHeader")}
        </span>
        <span className="text-foreground-muted">{endpoint}</span>
      </div>
      <div className="max-h-[60vh] overflow-auto px-4 py-4">
        <pre className="font-mono text-xs leading-relaxed text-foreground">
{lineCount === 0 ? <span className="text-foreground-subtle">{`{ }`}</span> : <RenderPayload value={cleaned} />}
        </pre>
      </div>
      <div className="border-t border-border bg-background-elev/60 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
        {t("payloadFooter", { default: "Updates as you type" })}
      </div>
    </div>
  );
}

function RenderPayload({ value, indent = 0 }: { value: unknown; indent?: number }): React.ReactElement {
  const pad = "  ".repeat(indent);
  const padNext = "  ".repeat(indent + 1);

  if (value === null) return <span className="text-foreground-subtle">null</span>;
  if (typeof value === "string")
    return <span className="text-accent">{`"${value}"`}</span>;
  if (typeof value === "number" || typeof value === "boolean")
    return <span className="text-warning">{String(value)}</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>;
    return (
      <>
        <span>{"["}</span>
        {value.map((v, i) => (
          <React.Fragment key={i}>
            {"\n"}
            {padNext}
            <RenderPayload value={v} indent={indent + 1} />
            {i < value.length - 1 ? "," : ""}
          </React.Fragment>
        ))}
        {"\n"}
        {pad}
        <span>{"]"}</span>
      </>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span>{`{ }`}</span>;
    return (
      <>
        <span>{"{"}</span>
        {entries.map(([k, v], i) => (
          <React.Fragment key={k}>
            {"\n"}
            {padNext}
            <span className="text-foreground-muted">{`"${k}"`}</span>
            <span>: </span>
            <RenderPayload value={v} indent={indent + 1} />
            {i < entries.length - 1 ? "," : ""}
          </React.Fragment>
        ))}
        {"\n"}
        {pad}
        <span>{"}"}</span>
      </>
    );
  }

  return <span>{String(value)}</span>;
}
