"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";

const featureKeys = ["1", "2", "3", "4"] as const;

const featureIcons = [
  // Video play
  <svg key="1" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  // Scissors
  <svg key="2" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>,
  // Download
  <svg key="3" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  // Share
  <svg key="4" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
];

export default function PlayersClipping() {
  const t = useTranslations("forPlayers.clipping");

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(253,230,138,0.08), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-base leading-relaxed text-white/55"
          >
            {t("desc")}
          </motion.p>
        </div>

        {/* Visual: clip cutter mockup + social phones */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            {/* Clip cutter mockup */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1709] to-ink-900 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]">
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-500/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
                <span className="h-2 w-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-white/30">replash.io/match/M-1234</span>
              </div>

              {/* Video player area */}
              <div className="relative aspect-video bg-gradient-to-br from-[#201a08] to-[#110d08] overflow-hidden">
                <img src="/images/gen_halisaha_camera_v2.jpg" alt="" className="h-full w-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />

                {/* Play indicator center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <svg className="h-6 w-6 text-white translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                {/* Live tag */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-accent">Match · 1:24:35</span>
                </div>

                {/* Quality */}
                <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/60 backdrop-blur">
                  1080p
                </div>
              </div>

              {/* Timeline + clip selector */}
              <div className="border-t border-white/8 p-3">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="text-white/40">Timeline</span>
                  <span className="font-mono text-accent">Selected: 00:17:08 → 00:17:23</span>
                </div>
                <div className="relative h-8 rounded-md bg-white/[0.03] overflow-hidden">
                  {/* Waveform-style bars */}
                  <div className="absolute inset-0 flex items-end gap-0.5 px-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white/15"
                        style={{ height: `${30 + Math.sin(i * 0.4) * 30 + Math.random() * 20}%` }}
                      />
                    ))}
                  </div>
                  {/* Selection overlay */}
                  <div
                    className="absolute inset-y-0 border-x-2 border-accent bg-accent/20"
                    style={{ left: "28%", width: "8%" }}
                  >
                    <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-glow-sm" />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50">10s</span>
                    <span className="rounded-md border border-accent/30 bg-accent/15 px-2 py-1 text-[10px] font-semibold text-accent">15s</span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50">45s</span>
                  </div>
                  <button type="button" className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[10px] font-semibold text-ink-900">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download Clip
                  </button>
                </div>
              </div>
            </div>

            {/* Phone showing social share — full mockup image */}
            <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
              <div className="relative">
                <img
                  src="/images/gen_padel_story_blue.jpg"
                  alt="REPLASH match clip posted to Instagram story"
                  className="w-full h-auto rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)]"
                />
              </div>
              <p className="mt-3 text-center text-[10px] text-white/35">
                Posted to player&apos;s own Instagram story
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4-step features below */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.025] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  {featureIcons[i]}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{t(`features.${key}.label`)}</h3>
              <p className="text-xs leading-relaxed text-white/45">{t(`features.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
