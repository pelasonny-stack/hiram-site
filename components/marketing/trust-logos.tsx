import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function TrustLogos({ className }: { className?: string }) {
  const t = useTranslations("TrustLogos");
  const items = t.raw("items") as string[];

  return (
    <section
      className={cn(
        "border-y border-border bg-background-elev/20",
        className,
      )}
    >
      <div className="container-shell py-7">
        {/* Top row: label + live indicator */}
        <div className="flex items-center justify-between">
          <span className="text-eyebrow text-foreground-subtle">
            {t("label")}
          </span>
          <span className="pulse-dot font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
            live
          </span>
        </div>

        {/* Middle row: wordmarks */}
        <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-4">
          {items.map((item) => (
            <span
              key={item}
              className="font-mono text-sm tracking-[0.18em] text-foreground-subtle hover:text-foreground transition-colors uppercase"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Bottom row: footnote */}
        <p className="mt-3 font-mono text-xs italic text-foreground-subtle">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
}
