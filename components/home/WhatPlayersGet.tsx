"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const teaserKeys = ["1", "2", "3"] as const; // Watch, Clip, Share

const icons = [
  // Play
  <svg key="1" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  // Scissors
  <svg key="2" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>,
  // Share
  <svg key="3" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
];

export default function WhatPlayersGet() {
  const t = useTranslations("home.whatPlayersGet");
  const tNav = useTranslations("nav");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          {/* Left: 3 teaser cards */}
          <div className="grid gap-3">
            {teaserKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  {icons[i]}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t(`items.${key}.title`)}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/50">{t(`items.${key}.desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Heading + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:order-last"
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
              href="/for-players"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              {tNav("forPlayers")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
