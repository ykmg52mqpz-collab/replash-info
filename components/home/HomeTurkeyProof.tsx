"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const statKeys = ["1", "2", "3"] as const;

/**
 * "Already proven in Turkey" — the strongest de-risking argument for a
 * skeptical facility owner: the behavior isn't a bet, it's a settled market
 * standard elsewhere. Reuses the forFacilities.turkey copy on the homepage.
 */
export default function HomeTurkeyProof() {
  const t = useTranslations("forFacilities.turkey");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading title={t("title")} align="center" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-base leading-relaxed text-white/60 md:text-lg"
          >
            {t("desc")}
          </motion.p>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {statKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-7 text-center"
            >
              <div className="font-display text-3xl font-bold text-accent md:text-4xl">
                {t(`stats.${key}.value`)}
              </div>
              <div className="mt-2 text-xs leading-relaxed text-white/50">
                {t(`stats.${key}.label`)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lesson callout — what Replash brings on top of the proven behavior */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.08] to-accent/[0.02] px-6 py-6"
        >
          <p className="text-center text-sm leading-relaxed text-white/70 md:text-base">
            {t("lesson")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
