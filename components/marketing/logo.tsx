import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  return (
    <Link
      href="/"
      aria-label={t("homeLabel")}
      className={cn(
        "group inline-flex items-center gap-2 font-mono font-medium tracking-tight",
        className,
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
        className="text-accent transition-transform group-hover:rotate-12"
      >
        <rect x="2" y="3" width="16" height="3" rx="1" fill="currentColor" />
        <rect x="2" y="8.5" width="16" height="3" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="2" y="14" width="16" height="3" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
      <span className="text-foreground">Hiram</span>
    </Link>
  );
}
