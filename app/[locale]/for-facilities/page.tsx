import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import FacilitiesCompetitors from "@/components/facilities/FacilitiesCompetitors";
import FacilitiesEngagement from "@/components/facilities/FacilitiesEngagement";
import FacilitiesObjections from "@/components/facilities/FacilitiesObjections";
import FacilitiesMarketing from "@/components/facilities/FacilitiesMarketing";
import FacilitiesWhatYouDo from "@/components/facilities/FacilitiesWhatYouDo";
import FacilitiesCTA from "@/components/facilities/FacilitiesCTA";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.forFacilities" });
  return { title: t("title"), description: t("description") };
}

export default async function ForFacilitiesPage() {
  const t = await getTranslations("forFacilities.hero");
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/gen_padel_golden.jpg"
        imageOpacity={0.5}
      />
      <FacilitiesCompetitors />
      <FacilitiesEngagement />
      <FacilitiesObjections />
      <FacilitiesMarketing />
      <FacilitiesWhatYouDo />
      <FacilitiesCTA />
      <Footer />
    </main>
  );
}
