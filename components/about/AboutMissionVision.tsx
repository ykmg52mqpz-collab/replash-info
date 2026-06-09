"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const targetIcon: ReactNode = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const horizonIcon: ReactNode = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20" />
    <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function AboutMissionVision() {
  const tM = useTranslations("about.mission");
  const tV = useTranslations("about.vision");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { eyebrow: tM("eyebrow"), text: tM("text"), icon: targetIcon },
            { eyebrow: tV("eyebrow"), text: tV("text"), icon: horizonIcon },
          ].map((item, i) => (
            <motion.div
              key={item.eyebrow}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-8"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                {item.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                {item.eyebrow}
              </span>
              <p className="mt-3 text-lg font-medium leading-relaxed text-white/80">
                &ldquo;{item.text}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
