"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const stepKeys = ["1", "2", "3", "4", "5", "6"] as const;

// Optional visual images for some steps
const stepImages: Partial<Record<(typeof stepKeys)[number], { src: string; alt: string }>> = {
  "1": { src: "/images/gen_marco_booking.jpg", alt: "Marco booking the court with + Match Video option" },
  "2": { src: "/images/gen_marco_padel2v2.jpg", alt: "2v2 padel match captured silently by REPLASH PoE camera" },
  "4": { src: "/images/gen_marco_admin.jpg", alt: "Facility staff unlocking the match from the REPLASH admin panel" },
};

const stepIcons = [
  // Calendar+Play (booked & played)
  <svg key="1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polygon points="10 14 15 17 10 20" fill="currentColor" /></svg>,
  // Camera
  <svg key="2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  // Tag/folder
  <svg key="3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  // Check (sale activated)
  <svg key="4" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  // Search
  <svg key="5" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  // Share / scissors
  <svg key="6" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>,
];

export default function HowSteps() {
  const t = useTranslations("howItWorks");
  const tIntro = useTranslations("howItWorks.marcoIntro");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        {/* Marco intro chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 flex max-w-xl items-center gap-3 rounded-2xl border border-accent/15 bg-accent/[0.04] px-5 py-3"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/30 to-accent/10">
            <span className="text-sm font-bold text-accent">M</span>
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-white">
              Following <span className="text-accent">{tIntro("name")}</span>&apos;s match
            </div>
            <div className="text-[11px] text-white/45">{tIntro("context")}</div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-accent/15 to-accent/5 sm:left-[35px]" />

            <div className="flex flex-col gap-8">
              {stepKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative flex gap-5"
                >
                  {/* Step circle with icon */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-ink-900 text-accent sm:h-[70px] sm:w-[70px]">
                      {stepIcons[i]}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-2">
                    {/* Step label + title */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent/70">
                        {t(`steps.${key}.label`)}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold text-white md:text-2xl">
                        {t(`steps.${key}.title`)}
                      </h3>
                    </div>

                    {/* Abstract description */}
                    <p className="text-sm leading-relaxed text-white/55 md:text-base">
                      {t(`steps.${key}.desc`)}
                    </p>

                    {/* Marco's concrete example */}
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/8 bg-white/[0.025]">
                      <div className="flex gap-3 p-4">
                        <div className="flex flex-shrink-0 flex-col items-center gap-1">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-accent/15">
                            <span className="text-[10px] font-bold text-accent">M</span>
                          </div>
                          {t(`steps.${key}.marco.time`) && (
                            <span className="font-mono text-[9px] font-semibold text-accent/70">
                              {t(`steps.${key}.marco.time`)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed text-white/55 md:text-sm">
                          {t(`steps.${key}.marco.example`)}
                        </p>
                      </div>

                      {/* Optional visual */}
                      {stepImages[key] && (
                        <div className="border-t border-white/5 bg-black/20">
                          <img
                            src={stepImages[key]!.src}
                            alt={stepImages[key]!.alt}
                            className="h-40 w-full object-cover sm:h-48"
                            style={{ opacity: 0.85 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
