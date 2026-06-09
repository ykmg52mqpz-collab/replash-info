"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const itemKeys = ["1", "2", "3", "4"] as const;

const icons = [
  // Football
  <svg key="football" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2l3 6-3 4-3-4 3-6z" />
    <path d="M22 12l-6 3-4-3 4-3 6 3z" />
    <path d="M12 22l-3-6 3-4 3 4-3 6z" />
    <path d="M2 12l6-3 4 3-4 3-6-3z" />
  </svg>,
  // Padel paddle
  <svg key="padel" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="9" rx="6" ry="7" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <circle cx="9" cy="8" r="0.5" fill="currentColor" />
    <circle cx="14" cy="7" r="0.5" fill="currentColor" />
    <circle cx="11" cy="11" r="0.5" fill="currentColor" />
  </svg>,
  // Building / venue
  <svg key="venue" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
  </svg>,
  // Users / players
  <svg key="players" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];

export default function AboutWhoWeServe() {
  const t = useTranslations("about.whoWeServe");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {itemKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 text-center"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                {icons[i]}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">{t(`items.${key}.title`)}</h3>
              <p className="text-xs leading-relaxed text-white/50">{t(`items.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
