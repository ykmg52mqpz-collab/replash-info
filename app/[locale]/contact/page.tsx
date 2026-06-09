import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Contact — REPLASH", description: "Get in touch with REPLASH to book a demo or ask about your facility." };
}

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
