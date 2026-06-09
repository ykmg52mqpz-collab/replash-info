"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomeFindPreview() {
  const t = useTranslations("home.findPreview");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(253,230,138,0.06), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              {t("eyebrow")}
            </div>

            <h2
              className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
              style={{
                background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("title")}
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/55">{t("desc")}</p>

            <div className="mt-8">
              <Link
                href="/find"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-900 shadow-glow transition hover:bg-accent-neon"
              >
                {t("tryIt")}
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right: form preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur md:p-8">
              <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                replash.io/find
              </div>

              <div className="flex flex-col gap-4">
                {/* Facility */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {t("fields.facility")}
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm">
                    <span className="text-white">Milano Padel Club</span>
                    <svg className="h-4 w-4 text-white/30" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {t("fields.date")}
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm">
                    <span className="text-white">Tuesday, 14 May 2026</span>
                    <svg className="h-4 w-4 text-white/30" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM3 8h14V6H3v2z" clipRule="evenodd" /></svg>
                  </div>
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {t("fields.time")}
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/[0.05] px-3.5 py-3 text-sm">
                    <span className="font-semibold text-accent">19:00 — 20:00</span>
                    <svg className="h-4 w-4 text-accent/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 101.06-1.06L10.75 9.69V5z" clipRule="evenodd" /></svg>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-900 shadow-glow"
                >
                  {t("button")}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-white/30">
                <svg className="h-3 w-3 text-accent/60" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Private. Time-slot tied. Auto-deleted in 30 days.
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
