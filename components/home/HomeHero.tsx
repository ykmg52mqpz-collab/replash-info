"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroSceneOverlay from "./HeroSceneOverlay";

export default function HomeHero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Track scroll relative to the hero section:
  // 0 when section top hits viewport top, 1 when section bottom hits viewport top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background moves DOWN slowly → creates parallax "slower than page" feel.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  // Foreground text moves UP faster than scroll, and fades out.
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0]);

  // Disable parallax if user prefers reduced motion.
  const parallaxBg = prefersReduced ? {} : { y: bgY, scale: bgScale };
  const parallaxText = prefersReduced ? {} : { y: textY, opacity: textOpacity };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-900 pt-[26rem] pb-24 md:pt-[34rem] md:pb-36"
    >
      {/* Tactical scene — REPLASH camera view of a live match (replaces the photo) */}
      <motion.div className="absolute inset-0 will-change-transform" style={parallaxBg} aria-hidden>
        <HeroSceneOverlay />
        {/* Soft bottom fade to blend into the page */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-ink-900" />
      </motion.div>

      {/* Readability layer — darkens the scene enough for the title/CTAs to POP.
          Strongest in the vertical band where the text sits, fading toward the edges. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 62%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.15) 80%, rgba(10,10,10,0) 100%)",
        }}
      />

      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -top-60 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(253,230,138,0.12) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grid-noise opacity-10" aria-hidden />

      <div className="container-x relative z-10">
        <motion.div
          style={parallaxText}
          className="mx-auto max-w-4xl text-center will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-6xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl lg:text-8xl"
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
                className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-ink-900 shadow-glow transition-[background-color,box-shadow,transform] active:scale-[0.98] duration-300 hover:bg-accent-neon hover:shadow-[0_0_60px_rgba(254,243,199,0.5)]"
              >
                {t("cta")}
                <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                </svg>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 text-base font-medium text-white/70 backdrop-blur transition-colors active:scale-[0.98] duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
