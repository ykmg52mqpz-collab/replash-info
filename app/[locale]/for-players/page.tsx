import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PlayersClipping from "@/components/players/PlayersClipping";
import PlayersWhyVideo from "@/components/players/PlayersWhyVideo";
import PlayersRelive from "@/components/players/PlayersRelive";
import PlayersAI from "@/components/players/PlayersAI";
import PlayersCTA from "@/components/players/PlayersCTA";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.forPlayers" });
  return { title: t("title"), description: t("description") };
}

export default async function ForPlayersPage() {
  const t = await getTranslations("forPlayers.hero");
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/gen_player_phone_v2.jpg"
        imageOpacity={0.5}
      />
      <PlayersClipping />
      <PlayersWhyVideo />
      <PlayersRelive />
      <PlayersAI />
      <PlayersCTA />
      <Footer />
    </main>
  );
}
