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
        "group inline-flex items-center gap-2.5 font-mono font-medium tracking-tight",
        className,
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden
        className="text-accent transition-transform duration-300 group-hover:rotate-[8deg]"
      >
        {/* row 1 — input layer */}
        <rect x="2" y="3" width="18" height="2.5" rx="0.5" fill="currentColor" />
        {/* row 2 — processing (offset right, suggests motion) */}
        <rect x="5" y="9.5" width="13" height="2.5" rx="0.5" fill="currentColor" opacity="0.55" />
        {/* row 3 — output */}
        <rect x="2" y="16" width="18" height="2.5" rx="0.5" fill="currentColor" opacity="0.28" />
        {/* live indicator on middle row */}
        <circle cx="20" cy="10.75" r="1.4" fill="currentColor" />
      </svg>
      <span className="text-foreground">Hiram</span>
    </Link>
  );
}
