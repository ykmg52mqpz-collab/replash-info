"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const valueKeys = ["1", "2", "3"] as const;

export default function AboutFounders() {
  const t = useTranslations("about.founders");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="left" />
          <p className="mt-5 text-base leading-relaxed text-white/60">{t("desc")}</p>

          <div className="mt-7 flex flex-col gap-3">
            {valueKeys.map((key) => (
              <div key={key} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-sm text-white/65">{t(`values.${key}`)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
