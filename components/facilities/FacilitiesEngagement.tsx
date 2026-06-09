"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const itemKeys = ["1", "2", "3", "4"] as const;

export default function FacilitiesEngagement() {
  const t = useTranslations("forFacilities.engagement");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="left" />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 text-base leading-relaxed text-white/60"
            >
              {t("desc")}
            </motion.p>
          </div>

          <div className="flex flex-col gap-3">
            {itemKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3.5"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white/70">{t(`items.${key}`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
