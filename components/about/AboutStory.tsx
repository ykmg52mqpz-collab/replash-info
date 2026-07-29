"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

export default function AboutStory() {
  const t = useTranslations("about.story");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img src="/images/gen_padel_club_empty.jpg" alt="" className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
        <div className="absolute inset-0 bg-ink-900/80" />
      </div>

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base leading-relaxed text-white/60"
          >
            {t("desc")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
