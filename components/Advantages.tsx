"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";

const itemKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export default function Advantages() {
  const t = useTranslations("advantages");

  return (
    <section className="section-y relative overflow-hidden border-t border-white/5 bg-ink-900">
      {/* Background image - AI tracking figure */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-24" aria-hidden>
        <img
          src="/images/tracking.jpg"
          alt=""
          className="h-full max-h-[600px] w-auto object-contain"
          style={{ opacity: 0.25 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 to-ink-900/70" />
      </div>
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {itemKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-sm text-white/85">
                {t(`items.${key}`)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
