"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const valueKeys = ["1", "2", "3"] as const;

export default function AboutFounders() {
  const t = useTranslations("about.founders");

  return (
    <section className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Left: Heading + desc */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="left" />
            <p className="mt-5 text-base leading-relaxed text-white/60">{t("desc")}</p>

            <div className="mt-7 flex flex-col gap-3">
              {valueKeys.map((key) => (
                <div key={key} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="text-sm text-white/65">{t(`values.${key}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Founder cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { name: "Ömer Sager", role: "Founder", subtitle: "Economics, Behaviour Data and Policy" },
              { name: "Yiğit Ünal", role: "Co-founder", subtitle: "Economics, Behaviour Data and Policy" },
            ].map((founder) => (
              <div key={founder.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                {/* Avatar placeholder */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-accent/20 to-accent/5">
                  <span className="font-display text-2xl font-bold text-accent">
                    {founder.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{founder.name}</h3>
                <p className="mt-0.5 text-xs text-accent">{founder.role}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-white/40">{founder.subtitle}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-white/30">UniMi</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
