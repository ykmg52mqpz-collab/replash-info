"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const itemKeys = ["1", "2", "3"] as const;

const icons = [
  // Star/featured
  <svg key="1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  // Share
  <svg key="2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  // Trophy
  <svg key="3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
];

export default function FacilitiesMarketing() {
  const t = useTranslations("forFacilities.marketing");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      {/* Background — court atmosphere */}
      <div className="absolute inset-0" aria-hidden>
        <img src="/images/gen_marketing_bright.jpg" alt="" className="h-full w-full object-cover object-center" style={{ opacity: 0.28 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-900/70 to-ink-900" />
      </div>
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("desc")} align="center" />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {itemKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-all duration-300 hover:border-accent/30"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                {icons[i]}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">{t(`items.${key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-white/55">{t(`items.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
