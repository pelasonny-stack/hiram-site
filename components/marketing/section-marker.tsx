import { cn } from "@/lib/utils";

export function SectionMarker({
  num,
  label,
  className,
}: {
  num: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-xs text-foreground-subtle",
        className,
      )}
    >
      <span className="text-accent">[{num}]</span>
      {label && (
        <>
          <span className="h-px w-8 bg-border-strong" />
          <span className="uppercase tracking-wider">{label}</span>
        </>
      )}
    </div>
  );
}
