"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StreamedSectionState = "idle" | "streaming" | "done" | "error";

export function StreamedSection({
  title,
  state,
  isPresent,
  children,
  skeletonLines = 3,
  icon: Icon,
  className,
}: {
  title: string;
  state: StreamedSectionState;
  isPresent: boolean;
  children?: React.ReactNode;
  skeletonLines?: number;
  icon?: LucideIcon;
  className?: string;
}) {
  const t = useTranslations("StreamedSection");
  const reduce = useReducedMotion();

  const showSkeleton = state === "streaming" && !isPresent;
  const showContent = isPresent;
  const showError = state === "error";

  return (
    <motion.section
      layout={!reduce}
      transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.25, 1, 0.35, 1] }}
      className={cn(
        "relative rounded-lg border bg-background-elev/40 px-5 py-5 transition-colors",
        state === "idle" && "border-dashed border-border",
        state === "streaming" && !isPresent && "border-border",
        state === "streaming" && isPresent && "border-accent-muted shadow-[inset_3px_0_0_var(--accent)]",
        state === "done" && "border-border",
        showError && "border-danger shadow-[inset_3px_0_0_var(--danger)]",
        className,
      )}
    >
      <header className="mb-3 flex items-center gap-2">
        {Icon && (
          <Icon
            className={cn(
              "h-3.5 w-3.5",
              showContent ? "text-accent" : "text-foreground-subtle",
            )}
          />
        )}
        <h3
          className={cn(
            "text-eyebrow",
            showContent ? "text-foreground" : "text-foreground-subtle",
          )}
        >
          {title}
        </h3>
        {state === "streaming" && isPresent && (
          <span className="ml-auto inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        )}
      </header>

      {showError && (
        <p className="text-sm text-danger">{t("validationError")}</p>
      )}

      {showSkeleton && !showError && (
        <div className="space-y-2">
          {Array.from({ length: skeletonLines }).map((_, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-background-muted"
              style={{ width: `${[100, 92, 78][i % 3]}%` }}
            />
          ))}
        </div>
      )}

      {showContent && !showError && (
        <div className="space-y-3 text-sm leading-relaxed text-foreground-muted">
          {children}
        </div>
      )}

      {state === "idle" && !showSkeleton && (
        <p className="text-sm text-foreground-subtle">{t("waiting")}</p>
      )}
    </motion.section>
  );
}
