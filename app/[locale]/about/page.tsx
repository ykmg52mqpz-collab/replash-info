import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AboutMissionVision from "@/components/about/AboutMissionVision";
import AboutFounders from "@/components/about/AboutFounders";
import AboutStory from "@/components/about/AboutStory";
import AboutWhoWeServe from "@/components/about/AboutWhoWeServe";
import AboutCTA from "@/components/about/AboutCTA";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage() {
  const t = await getTranslations("about.hero");
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/gen_padel_club_empty.jpg"
        imageOpacity={0.5}
      />
      <AboutMissionVision />
      <AboutFounders />
      <AboutStory />
      <AboutWhoWeServe />
      <AboutCTA />
      <Footer />
    </main>
  );
}
