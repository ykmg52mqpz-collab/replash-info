"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const teaserKeys = ["1", "2", "5"] as const; // Pick top 3: New Service, Stand Out, Zero Complexity

export default function WhyFacilities() {
  const t = useTranslations("home.whyFacilities");
  const tNav = useTranslations("nav");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img src="/images/gen_padel_club_empty.jpg" alt="" className="h-full w-full object-cover object-center" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-ink-900" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Left: Heading + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("eyebrow")}
            </div>
            <h2
              className="mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl"
              style={{
                background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("title")}
            </h2>

            <Link
              href="/for-facilities"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              {tNav("forFacilities")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
              </svg>
            </Link>
          </motion.div>

          {/* Right: 3 teaser cards */}
          <div className="grid gap-3">
            {teaserKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
                  <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t(`items.${key}.title`)}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/50">{t(`items.${key}.desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
