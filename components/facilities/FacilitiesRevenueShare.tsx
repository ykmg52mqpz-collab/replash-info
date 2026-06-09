"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function FacilitiesRevenueShare() {
  const t = useTranslations("forFacilities.revenueShare");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(253,230,138,0.10), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/[0.08] to-accent/[0.02] px-7 py-9 text-center md:px-12 md:py-12"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent/80">
            <span className="h-1 w-6 rounded-full bg-accent/60" />
            {t("eyebrow")}
            <span className="h-1 w-6 rounded-full bg-accent/60" />
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">
            {t("title")}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
