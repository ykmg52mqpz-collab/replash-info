"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Status = "idle" | "searching" | "notFound";

const demoFacilities = [
  "Milano Padel Club",
  "Centro Sportivo Lambrate",
  "Padel Center Navigli",
  "Futsal Arena Bicocca",
  "Sporting Milano 7",
];

export default function FindForm() {
  const t = useTranslations("find");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("searching");
    // Demo: always returns notFound (no real recordings yet)
    await new Promise((r) => setTimeout(r, 900));
    setStatus("notFound");
  }

  return (
    <section className="border-t border-white/5 bg-ink-900 py-16 md:py-20">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          {/* Demo notice */}
          <div className="mb-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {t("demoNote")}
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8"
          >
            <div className="flex flex-col gap-5">
              {/* Facility */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {t("form.facility")}
                </label>
                <select
                  name="facility"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                >
                  <option value="" disabled className="bg-ink-900">
                    {t("form.facilityPlaceholder")}
                  </option>
                  {demoFacilities.map((f) => (
                    <option key={f} value={f} className="bg-ink-900">
                      {f}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-white/35">{t("form.facilityHelp")}</span>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {t("form.date")}
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-accent [color-scheme:dark]"
                />
                <span className="text-xs text-white/35">{t("form.dateHelp")}</span>
              </div>

              {/* Time slot */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {t("form.time")}
                </label>
                <input
                  type="text"
                  name="time"
                  placeholder="19:00–20:00"
                  required
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-accent"
                />
                <span className="text-xs text-white/35">{t("form.timeHelp")}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "searching"}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-ink-900 shadow-glow transition-all hover:bg-accent-neon hover:shadow-[0_0_50px_rgba(254,243,199,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "searching" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    {t("form.buttonLoading")}
                  </>
                ) : (
                  <>
                    {t("form.button")}
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Not found state */}
          {status === "notFound" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10">
                  <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    {t("errors.notFound.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {t("errors.notFound.desc")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
