"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

export default function TwoLayerValue() {
  const t = useTranslations("home.twoLayer");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(253,230,138,0.07), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
        />

        {/* Two layers side by side */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          {/* Layer 1 — Gap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-7"
          >
            <span className="absolute -right-8 -top-8 font-display text-[180px] font-bold leading-none text-white/[0.025] select-none">
              01
            </span>
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                {t("layer1.label")}
              </div>
              <h3 className="font-display text-2xl font-bold leading-tight text-white">
                {t("layer1.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/55">
                {t("layer1.desc")}
              </p>
            </div>
          </motion.div>

          {/* Layer 2 — Habit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.04] p-7"
          >
            <span className="absolute -right-8 -top-8 font-display text-[180px] font-bold leading-none text-accent/[0.08] select-none">
              02
            </span>
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                {t("layer2.label")}
              </div>
              <h3 className="font-display text-2xl font-bold leading-tight text-white">
                {t("layer2.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/55">
                {t("layer2.desc")}
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
