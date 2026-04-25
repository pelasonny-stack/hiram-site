import type { Metadata } from "next";
import * as React from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/marketing/section";
import { TeamCard } from "@/components/marketing/team-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("About");
  const tTeam = useTranslations("AboutTeam");
  const tFinal = useTranslations("Home.finalCta");
  const tCommon = useTranslations("Common");

  const whatWeAreRows = t.raw("whatWeAre.rows") as {
    title: string;
    body: string;
  }[];
  const howWeWorkItems = t.raw("howWeWork.items") as {
    n: string;
    title: string;
    body: string;
  }[];
  const stats = t.raw("byTheNumbers.stats") as {
    value: string;
    label: string;
  }[];
  const teamMembers = tTeam.raw("members") as {
    name: string;
    role: string;
    bio: string;
    links: { label: string; href: string }[];
  }[];
  const editHint = tTeam("editHint");

  return (
    <>
      <Section>
        <div className="max-w-3xl space-y-6">
          <Eyebrow accent>{t("hero.eyebrow")}</Eyebrow>
          <h1 className="text-display max-w-[20ch]">{t("hero.headline")}</h1>
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("hero.lede")}
          </p>
        </div>
      </Section>

      <Section bleed>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>{t("whatWeAre.eyebrow")}</Eyebrow>
            <h2 className="text-h1 mt-4 max-w-[14ch]">
              {t("whatWeAre.headline")}
            </h2>
          </div>
          <ul className="space-y-0 lg:col-span-8">
            {whatWeAreRows.map((row, i) => (
              <li
                key={row.title}
                className={
                  "flex flex-col gap-3 py-8 pl-6 border-l-2 border-transparent" +
                  (i > 0 ? " border-t border-t-border" : "")
                }
              >
                <h3 className="text-h3">{row.title}</h3>
                <p className="text-foreground-muted leading-relaxed max-w-prose">
                  {row.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>{t("howWeWork.eyebrow")}</Eyebrow>
          <h2 className="text-h1 mt-4">{t("howWeWork.headline")}</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {howWeWorkItems.map((item) => (
            <div
              key={item.n}
              className="flex flex-col gap-4 rounded-lg border border-border bg-background-elev/40 p-6 md:p-8"
            >
              <div className="font-mono text-sm text-accent">{item.n}</div>
              <h3 className="text-h3">{item.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>{tTeam("eyebrow")}</Eyebrow>
            <h2 className="text-h1 mt-4 max-w-[14ch]">
              {tTeam("headline")}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-5 md:grid-cols-2">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  editHint={editHint}
                />
              ))}
            </div>
            <p className="mt-6 font-mono text-xs italic text-foreground-subtle">
              {tTeam("lede")}
            </p>
          </div>
        </div>
      </Section>

      <Section bleed>
        <div className="text-center">
          <Eyebrow>{t("byTheNumbers.eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-4 max-w-2xl mx-auto">
            {t("byTheNumbers.headline")}
          </h2>
        </div>
        <ConfigManifest stats={stats} />
        <p className="mt-10 text-center text-sm text-foreground-subtle">
          {t("byTheNumbers.footnote")}
        </p>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center space-y-7">
          <h2 className="text-display">{tFinal("headline")}</h2>
          <p className="text-lg text-foreground-muted max-w-prose mx-auto">
            {tFinal("lede")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/contact">{tFinal("ctaPrimary")}</Link>
            </Button>
            <Button asChild variant="quiet" size="lg">
              <Link href="/demo">{tFinal("ctaSecondary")}</Link>
            </Button>
          </div>
          <p className="text-xs font-mono text-foreground-subtle">
            {tCommon("respondWithin")}
          </p>
        </div>
      </Section>
    </>
  );
}

function ConfigManifest({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  // Source values from existing dictionary (English values are idiomatic for a config file)
  // stats[0] = "40+" collective experience, stats[1] = "5" languages, stats[2] = "12" engines
  const productionEngines = stats[2]?.value ?? "12";
  const collectiveExperience = `${stats[0]?.value ?? "40+"} years`;

  // Config-file aesthetic. Keys/values intentionally untranslated (idiomatic).
  const rows: { key: string; value: React.ReactNode }[] = [
    {
      key: "production_engines",
      value: <span className="text-accent">{productionEngines}</span>,
    },
    {
      key: "languages",
      value: (
        <span className="text-foreground">
          rust, typescript, go, python, kotlin
        </span>
      ),
    },
    {
      key: "regions",
      value: <span className="text-foreground">na, eu, latam</span>,
    },
    {
      key: "on_call_rotation",
      value: <span className="text-accent">24/7</span>,
    },
    {
      key: "collective_experience",
      value: <span className="text-accent">{collectiveExperience}</span>,
    },
  ];

  const KEY_COL = 21; // padded width for key column

  return (
    <pre className="mx-auto mt-14 max-w-2xl overflow-x-auto rounded-md border border-border bg-background-elev/40 p-6 md:p-8 font-mono text-sm leading-relaxed text-foreground">
      <span className="text-accent">{"> team_manifest"}</span>
      {"\n"}
      <span className="text-border-strong">
        ─────────────────────────────────────────
      </span>
      {"\n"}
      {rows.map((row, i) => {
        const padding = " ".repeat(Math.max(1, KEY_COL - row.key.length));
        return (
          <React.Fragment key={row.key}>
            <span className="text-foreground-subtle">{row.key}</span>
            {padding}
            <span className="text-border-strong">: </span>
            {row.value}
            {i < rows.length - 1 ? "\n" : ""}
          </React.Fragment>
        );
      })}
    </pre>
  );
}
