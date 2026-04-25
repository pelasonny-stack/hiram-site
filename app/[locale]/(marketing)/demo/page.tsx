import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Section, Eyebrow } from "@/components/marketing/section";
import { ProblemAnalyzer } from "@/components/ai/problem-analyzer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Demo" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Demo");
  return (
    <Section>
      <div className="max-w-3xl space-y-5">
        <Eyebrow accent>{t("eyebrow")}</Eyebrow>
        <h1 className="text-h1">{t("headline")}</h1>
        <p className="text-lg text-foreground-muted">{t("lede")}</p>
      </div>
      <div className="mt-12">
        <ProblemAnalyzer variant="full" />
      </div>
    </Section>
  );
}
