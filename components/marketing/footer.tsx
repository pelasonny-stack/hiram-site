"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-shell py-16 lg:py-20">
        {/* Row A — display section */}
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="font-mono uppercase text-display-massive text-foreground select-none leading-none">
              HIRAM
            </div>
            <p className="mt-4 text-sm text-foreground-muted max-w-[40ch]">
              {t("tagline")}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-6">
              <FooterCol
                title={t("product")}
                links={[
                  {
                    href: "/capabilities#decision-engines",
                    label: t("decisionEngines"),
                  },
                  {
                    href: "/capabilities#ai-query-layer",
                    label: t("aiQueryLayer"),
                  },
                  {
                    href: "/capabilities#event-infrastructure",
                    label: t("eventInfrastructure"),
                  },
                  { href: "/demo", label: t("interactiveDemo") },
                ]}
              />
              <FooterCol
                title={t("company")}
                links={[
                  { href: "/case-studies", label: tn("caseStudies") },
                  { href: "/about", label: tn("about") },
                  { href: "/contact", label: tn("contact") },
                ]}
              />
              <FooterCol
                title={t("connect")}
                links={[
                  {
                    href: "mailto:hello@hiram.systems",
                    label: "hello@hiram.systems",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Row B — terminal status line */}
        <div className="mt-12 lg:mt-16">
          <div className="hairline-rule" aria-hidden />
          <div className="mt-5 flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-foreground-subtle md:flex-row md:items-center md:justify-between">
            <span className="pulse-dot inline-flex items-center">
              <span>
                {t("statusPrefix")}: {t("statusValue")}
              </span>
              <span className="mx-2 text-border-strong">·</span>
              <span>{t("version")}</span>
              <span className="mx-2 text-border-strong">·</span>
              <span>
                {t("utcLabel")} <UtcClock />
              </span>
              <span className="mx-2 text-border-strong">·</span>
              <span>© {new Date().getFullYear()} HIRAM</span>
            </span>
            <span className="italic normal-case tracking-normal text-foreground-subtle md:text-right">
              {t("signOff")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-eyebrow text-foreground-subtle">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => {
          const isExternal =
            l.href.startsWith("mailto:") || l.href.startsWith("http");
          return (
            <li key={l.href}>
              {isExternal ? (
                <a
                  href={l.href}
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  href={l.href}
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UtcClock() {
  const [stamp, setStamp] = React.useState<string>("");

  React.useEffect(() => {
    function format() {
      const d = new Date();
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mi = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`;
    }
    setStamp(format());
    const id = setInterval(() => setStamp(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span aria-hidden suppressHydrationWarning className="tabular-nums">
      {stamp}
    </span>
  );
}
