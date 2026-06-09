"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const layerKeys = ["1", "2", "3", "4"] as const;

const layerIcons = [
  // Camera (Edge)
  <svg key="1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  // Cloud
  <svg key="2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
  // Web/monitor
  <svg key="3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  // Receipt / billing
  <svg key="4" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>,
];

export default function HowArchitecture() {
  const t = useTranslations("howItWorks.architecture");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layerKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              {/* Layer number */}
              <span className="font-display text-5xl font-bold text-white/[0.05] absolute top-3 right-4 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                {layerIcons[i]}
              </div>

              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Layer {i + 1}
                </div>
                <div className="mt-1 font-display text-lg font-bold text-white">
                  {t(`layers.${key}.name`)}
                </div>
                <div className="mt-1 text-xs font-medium text-white/55">
                  {t(`layers.${key}.function`)}
                </div>
                <div className="mt-3 text-xs leading-relaxed text-white/40 border-t border-white/5 pt-3">
                  {t(`layers.${key}.detail`)}
                </div>
              </div>

              {/* Connector arrow (not on last) */}
              {i < 3 && (
                <div className="absolute -right-2 top-1/2 hidden lg:flex items-center justify-center">
                  <svg className="h-4 w-4 text-accent/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
