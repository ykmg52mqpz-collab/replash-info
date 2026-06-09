"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HowCTA() {
  const t = useTranslations("howItWorks.cta");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(253,230,138,0.10), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
            style={{
              background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("title")}
          </h2>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-ink-900 shadow-glow transition-all hover:bg-accent-neon hover:shadow-[0_0_50px_rgba(254,243,199,0.5)]"
            >
              {t("button")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
