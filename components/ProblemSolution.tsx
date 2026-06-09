"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";

const cardKeys = ["recording", "access", "revenue"] as const;

const icons: Record<(typeof cardKeys)[number], JSX.Element> = {
  recording: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  access: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ProblemSolution() {
  const t = useTranslations("problem");

  return (
    <section className="section-y relative overflow-hidden bg-ink-900">
      {/* Background image - night football match */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/images/court-night.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ opacity: 0.45 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/30 to-ink-900/80" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              <span className="text-white/50">{t("problemTitle")}</span>
              <br />
              <span>{t("solutionTitle")}</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3 relative">
          {cardKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:border-accent/35 hover:bg-white/[0.045]"
            >
              {/* Gradient glow on hover */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, rgba(253,230,138,0.07) 0%, transparent 60%)",
                }}
              />

              {/* Icon */}
              <div className="relative flex h-13 w-13 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-all duration-300 group-hover:bg-accent/15 group-hover:ring-accent/35 group-hover:shadow-[0_0_24px_rgba(253,230,138,0.2)]">
                <span className="block h-6 w-6">{icons[key]}</span>
              </div>

              {/* Number */}
              <div className="absolute right-5 top-5 font-display text-4xl font-bold text-white/[0.04] select-none transition-all duration-300 group-hover:text-white/[0.07]">
                0{i + 1}
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-white transition-colors duration-200 group-hover:text-white">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60 transition-colors duration-200 group-hover:text-white/70">
                {t(`cards.${key}.description`)}
              </p>

              {/* Bottom accent line */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
