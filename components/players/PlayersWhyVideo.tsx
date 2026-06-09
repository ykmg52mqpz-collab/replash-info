"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const reasonKeys = ["1", "2", "3", "4"] as const;

const reasonIcons = [
  // Heart / satisfaction
  <svg key="1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  // Camera flash / moment
  <svg key="2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
  // Send / paper plane
  <svg key="3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  // Users
  <svg key="4" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
];

export default function PlayersWhyVideo() {
  const t = useTranslations("forPlayers.whyVideo");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {reasonKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-all duration-300 hover:border-accent/30"
            >
              {/* Watermark number */}
              <span className="absolute right-5 top-4 font-display text-6xl font-bold text-white/[0.04] select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  {reasonIcons[i]}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {t(`reasons.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {t(`reasons.${key}.desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
