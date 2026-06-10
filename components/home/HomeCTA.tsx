"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomeCTA() {
  const t = useTranslations("home.cta");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(253,230,138,0.12), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="mx-auto max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-5xl"
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
              href="/for-facilities"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-ink-900 shadow-glow transition-all hover:bg-accent-neon hover:shadow-[0_0_60px_rgba(254,243,199,0.5)]"
            >
              {t("button")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
