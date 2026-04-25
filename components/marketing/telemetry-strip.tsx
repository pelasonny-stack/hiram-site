import { cn } from "@/lib/utils";

export interface TelemetryItem {
  label: string;
  value: string;
  live?: boolean;
}

export function TelemetryStrip({
  items,
  className,
}: {
  items: TelemetryItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border bg-background-elev/30 px-1 py-2 font-mono text-[11px] uppercase tracking-wider",
        className,
      )}
    >
      {items.map((it, i) => (
        <div
          key={`${it.label}-${i}`}
          className={cn(
            "flex items-center gap-2",
            it.live && "pulse-dot text-foreground",
          )}
        >
          <span className="text-foreground-subtle">{it.label}</span>
          <span className={cn("text-foreground", it.live && "text-accent")}>
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
