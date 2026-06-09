import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import FindForm from "@/components/find/FindForm";
import FindExplainer from "@/components/find/FindExplainer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.find" });
  return { title: t("title"), description: t("description") };
}

export default async function FindPage() {
  const t = await getTranslations("find.hero");
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <FindForm />
      <FindExplainer />
      <Footer />
    </main>
  );
}
