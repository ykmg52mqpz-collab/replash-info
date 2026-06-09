"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink-900 pt-32 pb-24 md:pt-44 md:pb-36"
    >
      {/* Background image - night court */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ opacity: 0.55 }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/20 to-ink-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 via-transparent to-ink-900/40" />
      </div>

      {/* Accent glow orb */}
      <div
        className="pointer-events-none absolute -top-60 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(253,230,138,0.10) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Grid noise */}
      <div className="absolute inset-0 grid-noise opacity-15" aria-hidden />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("badge")}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mt-6 font-display text-5xl font-bold leading-[1.1] tracking-tight text-balance md:text-6xl lg:text-7xl"
            style={{
              background:
                "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg text-white/55 md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-ink-900 shadow-glow transition-all duration-300 hover:bg-accent-neon hover:shadow-[0_0_60px_rgba(254,243,199,0.5)]"
            >
              {t("cta")}
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
              </svg>
            </a>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 text-base font-medium text-white/70 backdrop-blur transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              {t("howItWorks")}
            </a>
          </motion.div>

        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: "easeOut" }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_140px_-20px_rgba(0,0,0,0.9)]">
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <div className="mx-4 flex-1 rounded-md border border-white/8 bg-white/[0.04] px-3 py-1 text-center text-xs text-white/25">
                replash.io/dashboard
              </div>
              <div className="h-4 w-4 rounded text-white/20">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2h4v4H2zm0 8h4v4H2zm8-8h4v4h-4zm0 8h4v4h-4z" />
                </svg>
              </div>
            </div>

            {/* Screen content */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1a1709] to-ink-900 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(253,230,138,0.09),transparent_60%)]" />

              {/* Fake sidebar */}
              <div className="absolute inset-y-0 left-0 w-[13%] border-r border-white/5 bg-white/[0.02] p-3 flex flex-col gap-2">
                <div className="h-2 w-10 rounded-full bg-accent/40 mb-3" />
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${i === 1 ? "w-full bg-accent/30" : "w-3/4 bg-white/8"}`}
                  />
                ))}
              </div>

              {/* Main content area */}
              <div className="absolute inset-y-0 left-[13%] right-0 p-3 flex flex-col gap-2.5">

                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 w-28 rounded-full bg-white/20" />
                    <div className="h-1 w-20 rounded-full bg-white/8" />
                  </div>
                  <div className="h-5 w-16 rounded-full border border-accent/30 bg-accent/10" />
                </div>

                {/* Court revenue cards */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { courts: "1 Court", rev: "€224", growth: "", accent: false },
                    { courts: "2 Courts", rev: "€448", growth: "+100%", accent: false },
                    { courts: "3 Courts", rev: "€672", growth: "+200%", accent: false },
                    { courts: "4 Courts", rev: "€896", growth: "+300%", accent: false },
                    { courts: "5 Courts", rev: "€1,120", growth: "+400%", accent: true },
                  ].map((card) => (
                    <div
                      key={card.courts}
                      className={`rounded-lg border px-2 py-2 flex flex-col gap-1 ${
                        card.accent
                          ? "border-accent/40 bg-accent/[0.08]"
                          : "border-white/8 bg-white/[0.02]"
                      }`}
                    >
                      <span className={`text-[9px] font-medium leading-none ${card.accent ? "text-accent/70" : "text-white/30"}`}>
                        {card.courts}
                      </span>
                      <span className={`text-[13px] font-bold leading-none ${card.accent ? "text-accent" : "text-white/80"}`}>
                        {card.rev}
                      </span>
                      {card.growth && (
                        <span className="text-[8px] text-accent/60 leading-none">{card.growth}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bar chart: monthly revenue by court count */}
                <div className="flex-1 rounded-lg border border-white/8 bg-white/[0.015] p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/30 font-medium">Monthly Revenue / Courts</span>
                    <span className="text-[9px] text-accent/60">per month · 15% share</span>
                  </div>
                  <div className="flex-1 flex items-end gap-3 px-2 pb-1 pt-2">
                    {[
                      { label: "1", h: 20, val: "€224" },
                      { label: "2", h: 40, val: "€448" },
                      { label: "3", h: 60, val: "€672" },
                      { label: "4", h: 80, val: "€896" },
                      { label: "5+", h: 100, val: "€1,120", highlight: true },
                    ].map((bar) => (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[8px] font-semibold ${bar.highlight ? "text-accent" : "text-white/40"}`}>
                          {bar.val}
                        </span>
                        <div
                          className="w-full rounded-t-sm transition-all"
                          style={{
                            height: `${bar.h * 0.55}%`,
                            background: bar.highlight
                              ? "rgba(253,230,138,0.55)"
                              : `rgba(253,230,138,${0.08 + bar.h * 0.0015})`,
                            border: bar.highlight ? "1px solid rgba(253,230,138,0.4)" : "1px solid rgba(255,255,255,0.06)",
                          }}
                        />
                        <span className="text-[8px] text-white/25">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer note */}
                <div className="flex items-center gap-1.5 rounded-lg border border-accent/15 bg-accent/[0.04] px-2.5 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                  <span className="text-[9px] text-white/35">Cameras, installation & software: €0 — covered by replash</span>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-ink-900/60 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
