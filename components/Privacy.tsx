"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";

const itemKeys = ["1", "2", "3", "4", "5", "6"] as const;

export default function Privacy() {
  const t = useTranslations("privacy");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <SectionHeading title={t("title")} />
        </div>

        <ul className="grid gap-3">
          {itemKeys.map((key, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <svg className="h-3 w-3 text-white/80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-sm text-white/85">{t(`items.${key}`)}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
