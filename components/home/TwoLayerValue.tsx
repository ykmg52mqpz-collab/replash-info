"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function TwoLayerValue() {
  const t = useTranslations("home.twoLayer");

  const layers = [
    {
      index: "01",
      label: t("layer1.label"),
      title: t("layer1.title"),
      desc: t("layer1.desc"),
      accent: false,
    },
    {
      index: "02",
      label: t("layer2.label"),
      title: t("layer2.title"),
      desc: t("layer2.desc"),
      accent: true,
    },
  ];

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 60% at 15% 30%, rgba(253,230,138,0.06), transparent 70%)" }}
        aria-hidden
      />

      {/* Asymmetric editorial grid: heading left, layered content right */}
      <div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* Left — heading column, left-aligned (breaks the centered pattern) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">{t("subtitle")}</p>
        </motion.div>

        {/* Right — the two layers as a stacked editorial sequence with a connecting spine */}
        <div className="relative">
          {/* Vertical spine connecting the layers */}
          <div
            className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-accent/30 via-accent/15 to-transparent"
            aria-hidden
          />

          <div className="flex flex-col gap-6">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.index}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
                className="relative flex gap-5"
              >
                {/* Index marker on the spine */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border font-display text-lg font-bold ${
                      layer.accent
                        ? "border-accent/50 bg-accent text-ink-900 shadow-glow-sm"
                        : "border-white/15 bg-ink-900 text-white/70"
                    }`}
                  >
                    {layer.index}
                  </div>
                </div>

                {/* Content — accent layer gets elevated treatment, first stays flat (depth hierarchy) */}
                <div
                  className={`flex-1 rounded-2xl border p-6 md:p-7 ${
                    layer.accent
                      ? "card-elevated border-accent/25 bg-accent/[0.05]"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                      layer.accent
                        ? "border-accent/25 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/5 text-white/50"
                    }`}
                  >
                    {layer.label}
                  </div>
                  <h3 className="font-display text-2xl font-bold leading-tight text-white">
                    {layer.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/55">{layer.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
