"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";

const rows = [
  { key: "low", matches: 56, low: 168, high: 224, featured: false },
  { key: "medium", matches: 72, low: 216, high: 288, featured: false },
  { key: "high", matches: 88, low: 264, high: 352, featured: true },
  { key: "twoFields", matches: 144, low: 336, high: 704, featured: false },
] as const;

export default function RevenueTable() {
  const t = useTranslations("revenue");

  return (
    <section id="revenue" className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {rows.map((row, i) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                row.featured
                  ? "border-accent/40 bg-accent/[0.06] shadow-[0_0_40px_rgba(253,230,138,0.08)]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {/* Featured badge */}
              {row.featured && (
                <div className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-900">
                  Popular
                </div>
              )}

              <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {t(`scenarios.${row.key}`)}
              </div>

              <div className="mt-4 flex items-baseline gap-0.5">
                <span className="text-base font-medium text-white/40">€</span>
                <CountUp
                  to={row.low}
                  className={`font-display text-3xl font-bold md:text-4xl ${
                    row.featured ? "text-accent" : "text-white"
                  }`}
                />
                <span className="mx-1 text-white/30">–</span>
                <span className="text-base font-medium text-white/40">€</span>
                <CountUp
                  to={row.high}
                  className={`font-display text-3xl font-bold md:text-4xl ${
                    row.featured ? "text-accent" : "text-white"
                  }`}
                />
              </div>

              <div className="mt-1 text-xs text-white/35">per month</div>

              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/8">
                  <svg className="h-3 w-3 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-white/45">
                  {row.matches} {t("table.matches").toLowerCase()}
                </span>
              </div>

              {/* Glow orb */}
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 ${
                  row.featured ? "bg-accent/15 opacity-100" : "bg-accent/8 opacity-0 group-hover:opacity-100"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-r from-accent/[0.07] via-accent/[0.04] to-transparent"
        >
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p className="font-medium text-white">{t("footer")}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-900 shadow-glow">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              €0 investment
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
