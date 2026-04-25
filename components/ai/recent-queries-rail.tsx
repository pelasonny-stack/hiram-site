"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function RecentQueriesRail({
  onPick,
  className,
}: {
  onPick: (prompt: string) => void;
  className?: string;
}) {
  const t = useTranslations("Demo.recentQueries");
  const items = t.raw("items") as { prompt: string; ago: string }[];

  return (
    <aside
      className={cn(
        "sticky top-24 overflow-hidden rounded-md border border-border bg-background-elev/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-background-elev/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
        <span>{t("title")}</span>
        <span className="text-foreground-muted normal-case tracking-normal text-[10px]">
          {t("subtitle")}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onPick(it.prompt)}
              className="group flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-background-elev/60"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                {it.ago}
              </span>
              <span className="text-sm leading-snug text-foreground-muted group-hover:text-foreground">
                {it.prompt}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
