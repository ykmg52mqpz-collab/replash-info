import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeIntro from "@/components/home/HomeIntro";
import TwoLayerValue from "@/components/home/TwoLayerValue";
import HomeFindPreview from "@/components/home/HomeFindPreview";
import WhyFacilities from "@/components/home/WhyFacilities";
import WhatPlayersGet from "@/components/home/WhatPlayersGet";
import FAQ from "@/components/FAQ";
import HomeCTA from "@/components/home/HomeCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <HomeHero />
      <HomeIntro />
      <TwoLayerValue />
      <HomeFindPreview />
      <WhyFacilities />
      <WhatPlayersGet />
      <FAQ />
      <HomeCTA />
      <Footer />
    </main>
  );
}
