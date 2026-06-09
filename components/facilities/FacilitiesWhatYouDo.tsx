"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const itemKeys = ["1", "2", "3", "4"] as const;

const nums = ["01", "02", "03", "04"];

export default function FacilitiesWhatYouDo() {
  const t = useTranslations("forFacilities.whatYouDo");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {itemKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6"
            >
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-white/[0.04] select-none">
                {nums[i]}
              </span>
              <h3 className="mb-2 text-base font-semibold text-white">{t(`items.${key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-white/55">{t(`items.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
