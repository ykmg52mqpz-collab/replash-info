"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const objectionKeys = ["gdpr", "tech"] as const;
const objectionIcons = {
  gdpr: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  tech: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
};

export default function FacilitiesObjections() {
  const t = useTranslations("forFacilities.objections");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />

        <div className="mx-auto mt-12 max-w-5xl grid gap-5 md:grid-cols-2">
          {objectionKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  {objectionIcons[key]}
                </div>
                <h3 className="text-base font-bold text-white">
                  &ldquo;{t(`items.${key}.question`)}&rdquo;
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/55">{t(`items.${key}.answer`)}</p>

              <ul className="mt-5 flex flex-col gap-2">
                {(["1", "2", "3", "4"] as const).map((idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-white/60">{t(`items.${key}.items.${idx}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
