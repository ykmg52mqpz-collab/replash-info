"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/SectionHeading";

type Sport = "padel" | "football";

// Facility share per unlocked match (=15% revenue share, raw price kept private).
// Padel €8 total, Football €15 total — facility keeps 15%.
const FACILITY_SHARE: Record<Sport, number> = {
  padel: 8 * 0.15,
  football: 15 * 0.15,
};
// Average activation rate across early pilots.
const ACTIVATION_RATE = 0.4;

export default function FacilitiesROI() {
  const t = useTranslations("forFacilities.roi");
  const tCta = useTranslations("forFacilities.cta");

  const [sport, setSport] = useState<Sport>("padel");
  const [courts, setCourts] = useState(3);
  const [bookings, setBookings] = useState(5);
  const [days, setDays] = useState(26);

  const { matches, unlocked, monthly, yearly } = useMemo(() => {
    const m = courts * bookings * days;
    const u = Math.round(m * ACTIVATION_RATE);
    const mo = u * FACILITY_SHARE[sport];
    return {
      matches: m,
      unlocked: u,
      monthly: Math.round(mo),
      yearly: Math.round(mo * 12),
    };
  }, [sport, courts, bookings, days]);

  return (
    <section className="section-y border-t border-white/5 bg-ink-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(253,230,138,0.08), transparent 70%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/55 md:text-base">
          {t("subtitle")}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
        >
          {/* Sport toggle */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {(["padel", "football"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSport(s)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    sport === s ? "bg-accent text-ink-900" : "text-white/55 hover:text-white"
                  }`}
                >
                  {t(`sport.${s}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid gap-6 md:grid-cols-3">
            <Slider
              label={t("inputs.courts")}
              value={courts}
              min={1}
              max={12}
              suffix={t("inputs.courtsSuffix")}
              onChange={setCourts}
            />
            <Slider
              label={t("inputs.bookings")}
              value={bookings}
              min={1}
              max={15}
              suffix={t("inputs.bookingsSuffix")}
              onChange={setBookings}
            />
            <Slider
              label={t("inputs.days")}
              value={days}
              min={20}
              max={30}
              suffix={t("inputs.daysSuffix")}
              onChange={setDays}
            />
          </div>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Results */}
          <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-accent/70">
            {t("results.eyebrow")}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ResultCard label={t("results.matches")} value={matches.toLocaleString()} hint={t("results.matchesHint")} />
            <ResultCard label={t("results.unlocked")} value={unlocked.toLocaleString()} hint={t("results.unlockedHint")} />
            <ResultCard
              label={t("results.share")}
              value={`€${monthly.toLocaleString()}`}
              hint={t("results.shareHint")}
              highlight
            />
          </div>

          {/* Yearly headline */}
          <motion.div
            key={yearly}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 to-accent/[0.02] px-6 py-5 text-center"
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-accent/80">
              {t("results.yearlyEyebrow")}
            </div>
            <div className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
              ≈ €{yearly.toLocaleString()}{" "}
              <span className="text-base font-medium text-white/55">{t("results.yearlySuffix")}</span>
            </div>
            <div className="mt-2 text-xs text-white/45">{t("results.yearlyNote")}</div>
          </motion.div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-white/35">
            {t("disclaimer")}
          </p>

          <div className="mt-7 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-ink-900 shadow-glow transition-all hover:bg-accent-neon hover:shadow-[0_0_50px_rgba(254,243,199,0.5)]"
            >
              {tCta("button")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/55">{label}</label>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-accent">{value}</span>
        <span className="text-xs text-white/40">{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#FDE68A]"
      />
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 text-center ${
        highlight ? "border-accent/30 bg-accent/[0.06]" : "border-white/8 bg-white/[0.025]"
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{label}</div>
      <div
        className={`mt-2 font-display text-2xl font-bold md:text-3xl ${highlight ? "text-accent" : "text-white"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] text-white/40">{hint}</div>
    </div>
  );
}
