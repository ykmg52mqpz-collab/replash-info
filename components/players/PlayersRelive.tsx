"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const itemKeys = ["1", "2", "3", "4", "5"] as const;

export default function PlayersRelive() {
  const t = useTranslations("forPlayers.relive");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img src="/images/gen_player_watching.jpg" alt="" className="h-full w-full object-cover object-right" style={{ opacity: 0.6, filter: "brightness(1.15)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/40 to-ink-900/90" />
      </div>

      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/55"
        >
          {t("desc")}
        </motion.p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {itemKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-4"
            >
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/15">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
              <span className="text-sm leading-relaxed text-white/65">{t(`items.${key}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
