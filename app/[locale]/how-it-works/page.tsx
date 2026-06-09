import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import HowSteps from "@/components/how/HowSteps";
import HowCTA from "@/components/how/HowCTA";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.howItWorks" });
  return { title: t("title"), description: t("description") };
}

export default async function HowItWorksPage() {
  const t = await getTranslations("howItWorks.hero");
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/gen_football_night.jpg"
        imageOpacity={0.45}
      />
      <HowSteps />
      <HowCTA />
      <Footer />
    </main>
  );
}
