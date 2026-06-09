"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const rowKeys = ["target", "venues", "purpose", "cost", "ops", "audience"] as const;

export default function FacilitiesCompetitors() {
  const t = useTranslations("forFacilities.competitors");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-base leading-relaxed text-white/60"
          >
            {t("desc")}
          </motion.p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-white/5 text-xs font-semibold uppercase tracking-widest">
            <div className="bg-ink-900 px-4 py-3 text-white/40 sm:px-6">
              {t("comparison.header.feature")}
            </div>
            <div className="bg-ink-900 px-4 py-3 text-white/55 sm:px-6">
              {t("comparison.header.pro")}
            </div>
            <div className="bg-accent/10 px-4 py-3 text-accent sm:px-6">
              {t("comparison.header.replash")}
            </div>
          </div>

          {/* Rows */}
          {rowKeys.map((key) => (
            <div
              key={key}
              className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-white/5 text-sm last:rounded-b-2xl"
            >
              <div className="bg-ink-900 px-4 py-4 font-medium text-white/65 sm:px-6">
                {t(`comparison.rows.${key}.feature`)}
              </div>
              <div className="bg-ink-900 px-4 py-4 text-white/45 sm:px-6">
                {t(`comparison.rows.${key}.pro`)}
              </div>
              <div className="bg-accent/[0.04] px-4 py-4 font-medium text-white sm:px-6">
                {t(`comparison.rows.${key}.replash`)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
