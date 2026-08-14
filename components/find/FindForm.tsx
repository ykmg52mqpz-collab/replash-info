"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Find your match — real flow.
 * Primary: the player enters the access code the facility gave them after the
 * match (POST /api/watch). Fallback: 4-field search (facility/court/date/slot,
 * POST /api/find). Renders the processing state, the player with 15–40s clip
 * cutting, or a not-found notice with a refund request form.
 */

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import MatchPlayer, { Clip, downloadSnapshot } from "@/components/MatchPlayer";

type Facility = { id: string; name: string; city: string; sport: string; courts: string[] };
type MatchInfo = {
  id: string; code: string; facilityName: string; court: string; date: string;
  timeSlot: string; sport: string; videoUrl: string | null; playbackType?: string;
  thumbnailUrl?: string | null;
  availability?: { available: boolean; availableAt: string; minutesLeft: number };
  retention?: { deleteAt: string };
};
type Result =
  | { kind: "idle" }
  | { kind: "rate" }
  | { kind: "notFound"; via: "code" | "fields" }
  | { kind: "processing"; match: MatchInfo }
  | { kind: "match"; match: MatchInfo };

const SLOTS = ["17:00–18:00", "18:00–19:00", "19:00–20:00", "20:00–21:00", "21:00–22:00"];

function sessionId() {
  let s = localStorage.getItem("replash_sid");
  if (!s) {
    s = "sid-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("replash_sid", s);
  }
  return s;
}

function dateOptions() {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

const inputCls =
  "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-accent";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-white/60";

export default function FindForm() {
  const t = useTranslations("find");
  const locale = useLocale();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [clip, setClip] = useState<Clip>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [fac, setFac] = useState("");
  const [court, setCourt] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundSent, setRefundSent] = useState<string | null>(null);
  const lastCtx = useRef<{ facilityId?: string; court?: string; date?: string; timeSlot?: string }>({});
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/facilities")
      .then((r) => r.json())
      .then((d) => setFacilities(d.facilities || []))
      .catch(() => {});
  }, []);

  const selectedFacility = facilities.find((f) => f.id === fac);

  function handleResult(data: any, via: "code" | "fields") {
    setClip(null);
    setRefundOpen(false);
    setRefundSent(null);
    if (!data || !data.found) setResult({ kind: "notFound", via });
    else if (data.processing) setResult({ kind: "processing", match: data.match });
    else setResult({ kind: "match", match: data.match });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  }

  async function onCodeSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = code.replace(/[^A-Z0-9]/gi, "");
    if (clean.length < 6) return;
    setBusy(true);
    lastCtx.current = {};
    const res = await fetch("/api/watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: clean }),
    });
    setBusy(false);
    if (res.status === 429) return setResult({ kind: "rate" });
    handleResult(await res.json().catch(() => null), "code");
  }

  async function onFieldsSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fac || !court || !date || !slot) return;
    setBusy(true);
    lastCtx.current = { facilityId: fac, court, date, timeSlot: slot };
    const res = await fetch("/api/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facilityId: fac, court, date, timeSlot: slot }),
    });
    setBusy(false);
    if (res.status === 429) return setResult({ kind: "rate" });
    handleResult(await res.json().catch(() => null), "fields");
  }

  async function onRefundSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        message: form.get("message") || "",
        facilityId: lastCtx.current.facilityId || facilities[0]?.id,
        court: lastCtx.current.court || null,
        date: lastCtx.current.date || new Date().toISOString().slice(0, 10),
        timeSlot: lastCtx.current.timeSlot || null,
      }),
    });
    const d = await res.json().catch(() => null);
    if (d?.ok) setRefundSent(d.id);
  }

  function onViewCount(matchId: string) {
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, sessionId: sessionId() }),
    }).catch(() => {});
  }

  const fmtDateOpt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

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
          {/* Code entry (primary) */}
          <form
            onSubmit={onCodeSubmit}
            className="card-elevated rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDE68A" strokeWidth="2">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 118 0v3" />
              </svg>
              <h3 className="font-display text-lg font-bold text-white">{t("watch.title")}</h3>
            </div>
            <p className="mb-5 text-sm text-white/50">{t("watch.subtitle")}</p>
            <div className="flex flex-col gap-2">
              <label className={labelCls}>{t("watch.codeLabel")}</label>
              <input
                value={code}
                onChange={(e) => {
                  let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4, 8);
                  setCode(v);
                }}
                placeholder="XXXX-XXXX"
                maxLength={10}
                autoComplete="off"
                spellCheck={false}
                className={`${inputCls} text-center font-mono text-2xl font-bold tracking-[0.3em] placeholder:tracking-[0.3em] placeholder:text-white/25`}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-ink-900 shadow-glow-sm transition hover:shadow-glow disabled:opacity-60"
            >
              {busy ? t("watch.buttonLoading") : t("watch.button")}
            </button>

            {/* Fallback toggle */}
            <button
              type="button"
              onClick={() => setShowFallback((s) => !s)}
              className="mt-4 flex items-center gap-1.5 text-xs text-white/45 transition hover:text-accent"
            >
              {t("watch.fallbackToggle")}
              <span className={`transition-transform ${showFallback ? "rotate-180" : ""}`}>▾</span>
            </button>

            {showFallback && (
              <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>{t("form.facility")}</label>
                    <select value={fac} onChange={(e) => { setFac(e.target.value); setCourt(""); }} className={inputCls}>
                      <option value="" disabled className="bg-ink-900">{t("form.facilityPlaceholder")}</option>
                      {facilities.map((f) => (
                        <option key={f.id} value={f.id} className="bg-ink-900">{f.name} — {f.city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>{t("watch.court")}</label>
                      <select value={court} onChange={(e) => setCourt(e.target.value)} disabled={!fac} className={inputCls}>
                        <option value="" disabled className="bg-ink-900">{t("watch.courtPlaceholder")}</option>
                        {(selectedFacility?.courts || []).map((c) => (
                          <option key={c} value={c} className="bg-ink-900">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>{t("form.date")}</label>
                      <select value={date} onChange={(e) => setDate(e.target.value)} className={inputCls}>
                        <option value="" disabled className="bg-ink-900">{t("form.datePlaceholder")}</option>
                        {dateOptions().map((d) => (
                          <option key={d} value={d} className="bg-ink-900">{fmtDateOpt(d)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>{t("form.time")}</label>
                    <select value={slot} onChange={(e) => setSlot(e.target.value)} className={inputCls}>
                      <option value="" disabled className="bg-ink-900">{t("form.timePlaceholder")}</option>
                      {SLOTS.map((s) => (
                        <option key={s} value={s} className="bg-ink-900">{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={onFieldsSubmit}
                    disabled={busy || !fac || !court || !date || !slot}
                    className="rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {busy ? t("form.buttonLoading") : t("form.button")}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Result */}
          <div ref={resultRef} aria-live="polite" className="mt-6">
            {result.kind === "rate" && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                {t("watch.rateLimited")}
              </div>
            )}

            {result.kind === "processing" && (
              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
                <div className="font-semibold text-accent">{t("watch.processing.title")}</div>
                <p className="mt-1 text-sm text-white/60">
                  {t("watch.processing.desc", { minutes: result.match.availability?.minutesLeft ?? 0 })}
                </p>
              </div>
            )}

            {result.kind === "notFound" && (
              <div>
                <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5">
                  <div className="font-semibold text-red-200">
                    {result.via === "code" ? t("watch.notFound.title") : t("errors.notFound.title")}
                  </div>
                  <p className="mt-1 text-sm text-white/60">
                    {result.via === "code" ? t("watch.notFound.desc") : t("errors.notFound.desc")}
                  </p>
                </div>
                {!refundOpen ? (
                  <button
                    onClick={() => setRefundOpen(true)}
                    className="mt-3 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/80 transition hover:border-accent hover:text-accent"
                  >
                    {t("watch.refund.open")}
                  </button>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="font-semibold text-white">{t("watch.refund.title")}</h4>
                    <p className="mb-4 mt-1 text-sm text-white/50">{t("watch.refund.desc")}</p>
                    {refundSent ? (
                      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                        {t("watch.refund.sent")} <span className="font-mono">{refundSent}</span>
                      </div>
                    ) : (
                      <form onSubmit={onRefundSubmit} className="flex flex-col gap-3">
                        <input name="email" type="email" required placeholder={t("watch.refund.email")} className={inputCls} />
                        <textarea name="message" rows={3} placeholder={t("watch.refund.message")} className={inputCls} />
                        <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-ink-900">
                          {t("watch.refund.send")}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {result.kind === "match" && (
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> UNLOCKABLE
                  </span>
                  <span className="font-mono text-xs text-white/70">
                    {result.match.facilityName} · {result.match.court} · {result.match.timeSlot}
                  </span>
                </div>

                <MatchPlayer
                  sport={result.match.sport}
                  videoSrc={result.match.videoUrl}
                  poster={result.match.thumbnailUrl || null}
                  label={t("watch.playerLabel")}
                  onView={() => onViewCount(result.match.id)}
                  onClipChange={setClip}
                />

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">✂︎ {t("watch.clip.label")}</span>
                  <span>{t("watch.clip.hint")}</span>
                </div>

                {clip && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => clip.valid && downloadSnapshot()}
                      disabled={!clip.valid}
                      className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-ink-900 disabled:opacity-50"
                    >
                      {t("watch.clip.download")}
                    </button>
                    <span className={`text-xs ${clip.valid ? "text-white/50" : "text-red-300"}`}>
                      {clip.valid ? `${Math.round(clip.length)}s` : t("watch.clip.range")}
                    </span>
                  </div>
                )}

                {result.match.retention && (
                  <p className="mt-4 text-xs text-white/35">
                    {t("watch.expires", {
                      date: new Date(result.match.retention.deleteAt).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
