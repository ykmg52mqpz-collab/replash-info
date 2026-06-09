"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomeHero() {
  const t = useTranslations("home.hero");

  return (
    <section
      className="relative overflow-hidden bg-ink-900 pt-[26rem] pb-24 md:pt-[34rem] md:pb-36"
    >
      {/* Background image — friends watching match highlights after the game */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/images/gen_hero_friends.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{ opacity: 0.75, objectPosition: "center 35%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-ink-900/55 to-ink-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 via-transparent to-ink-900/40" />
      </div>

      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -top-60 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(253,230,138,0.12) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grid-noise opacity-10" aria-hidden />

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
            transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-display text-6xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl lg:text-8xl"
            style={{
              background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.45))",
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
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-white/55 md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-ink-900 shadow-glow transition-all duration-300 hover:bg-accent-neon hover:shadow-[0_0_60px_rgba(254,243,199,0.5)]"
            >
              {t("cta")}
              <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
              </svg>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 text-base font-medium text-white/70 backdrop-blur transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
