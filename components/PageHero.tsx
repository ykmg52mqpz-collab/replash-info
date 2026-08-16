"use client";

import { motion } from "framer-motion";
import ParallaxImage from "@/components/ParallaxImage";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageOpacity?: number;
}

export default function PageHero({
  title,
  subtitle,
  image,
  imageOpacity = 0.35,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pt-36 pb-20 md:pt-44 md:pb-28">
      {image && (
        <div className="absolute inset-0" aria-hidden>
          <ParallaxImage
            src={image}
            imgClassName="h-full w-full object-cover object-center"
            imgStyle={{ opacity: imageOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/30 to-ink-900/90" />
        </div>
      )}

      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(253,230,138,0.12) 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* Grid */}
      <div className="absolute inset-0 grid-noise opacity-10" aria-hidden />

      <div className="container-x relative text-center">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-5xl lg:text-6xl"
          style={{
            background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/55 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
