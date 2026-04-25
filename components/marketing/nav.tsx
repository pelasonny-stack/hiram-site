"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { CommandHint } from "./command-hint";
import { ScrollProgressLine } from "./scroll-progress-line";
import { cn } from "@/lib/utils";

const NAV_KEYS = ["capabilities", "caseStudies", "demo", "pricing", "blog", "about"] as const;
const HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  capabilities: "/capabilities",
  caseStudies: "/case-studies",
  demo: "/demo",
  pricing: "/pricing",
  blog: "/blog",
  about: "/about",
};

export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <ScrollProgressLine />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-16 transition-[background,border] duration-200",
          scrolled
            ? "border-b border-border bg-background/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-shell flex h-full items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_KEYS.map((key) => {
            const href = HREFS[key];
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <CommandHint />
          <LocaleSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/contact">{t("contact")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
            aria-label={t("toggleMenu")}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open && (
          <div className="border-b border-border bg-background md:hidden">
            <div className="container-shell flex flex-col gap-1 py-4">
              {NAV_KEYS.map((key) => (
                <Link
                  key={key}
                  href={HREFS[key]}
                  className="rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-background-elev hover:text-foreground"
                >
                  {t(key)}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
