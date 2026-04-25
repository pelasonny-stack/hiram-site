import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function CommandHint({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  return (
    <span
      aria-hidden
      className={cn(
        "hidden lg:inline-flex select-none items-center rounded-md border border-border-strong bg-background-elev/40 px-2 py-1 font-mono text-[10px] tracking-wider text-foreground-subtle",
        className,
      )}
    >
      {t("commandHint")}
    </span>
  );
}
