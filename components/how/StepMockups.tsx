"use client";

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Shared screen-frame wrapper. Every step mockup lives inside one.
   ───────────────────────────────────────────────────────────── */
function ScreenFrame({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d11] shadow-[0_25px_70px_-30px_rgba(0,0,0,0.85)]">
      {/* Top chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-black/40 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        {label && (
          <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
            {label}
          </span>
        )}
      </div>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 1 — Book slot with "+Match Video" toggle animating on
   ───────────────────────────────────────────────────────────── */
function Step1Booking() {
  const slots = ["18:00 – 19:00", "19:00 – 20:00", "20:00 – 21:00"];
  const activeIdx = 1;
  return (
    <ScreenFrame label="Facility · Book slot">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="text-white/50">Tuesday · Nov 12</span>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-white/40">Football · 5v5</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {slots.map((slot, i) => (
          <motion.div
            key={slot}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
            initial={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
            animate={
              i === activeIdx
                ? {
                    borderColor: [
                      "rgba(255,255,255,0.08)",
                      "rgba(253,230,138,0.55)",
                      "rgba(253,230,138,0.55)",
                      "rgba(253,230,138,0.55)",
                      "rgba(255,255,255,0.08)",
                    ],
                    backgroundColor: [
                      "rgba(255,255,255,0.02)",
                      "rgba(253,230,138,0.06)",
                      "rgba(253,230,138,0.06)",
                      "rgba(253,230,138,0.06)",
                      "rgba(255,255,255,0.02)",
                    ],
                  }
                : undefined
            }
            transition={{ duration: 6, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }}
          >
            <span className="text-white/85">{slot}</span>
          </motion.div>
        ))}
      </div>

      {/* +Match Video row */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-accent/25 bg-accent/[0.05] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
          <span className="text-sm text-white/85">+ Match Video</span>
        </div>
        <motion.div
          className="relative h-5 w-9 rounded-full"
          animate={{
            backgroundColor: [
              "rgba(255,255,255,0.08)",
              "rgba(255,255,255,0.08)",
              "rgb(253,230,138)",
              "rgb(253,230,138)",
              "rgba(255,255,255,0.08)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1], ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.div
            className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
            animate={{ x: [2, 2, 18, 18, 2] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1], ease: [0.77, 0, 0.175, 1] }}
          />
        </motion.div>
      </div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 2 — Camera silently records (bird's-eye pitch + REC ticker)
   ───────────────────────────────────────────────────────────── */
function Step2Recording() {
  return (
    <ScreenFrame label="Replash Cam · Live feed">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        {/* Pitch */}
        <div className="absolute inset-0 bg-[#0f2a1c]" />
        {/* Field lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="none">
          <g stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" fill="none">
            <rect x="10" y="12" width="300" height="156" rx="2" />
            <line x1="160" y1="12" x2="160" y2="168" />
            <circle cx="160" cy="90" r="18" />
            <rect x="10" y="60" width="30" height="60" />
            <rect x="280" y="60" width="30" height="60" />
          </g>
          {/* Ball moving in figure-8 */}
          <motion.circle
            r="2.5"
            fill="rgb(253,230,138)"
            animate={{
              cx: [160, 120, 100, 130, 160, 200, 220, 190, 160],
              cy: [90, 70, 100, 120, 90, 70, 100, 120, 90],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          {/* Two players (white team) */}
          <motion.circle r="3" fill="white" animate={{ cx: [90, 110, 95, 90], cy: [70, 85, 100, 70] }} transition={{ duration: 12, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }} />
          <motion.circle r="3" fill="white" animate={{ cx: [140, 160, 145, 140], cy: [110, 100, 130, 110] }} transition={{ duration: 12, repeat: Infinity, ease: [0.77, 0, 0.175, 1], delay: 0.5 }} />
          {/* Two players (dark team) */}
          <motion.circle r="3" fill="#111" stroke="white" strokeWidth="0.5" animate={{ cx: [230, 210, 220, 230], cy: [80, 95, 110, 80] }} transition={{ duration: 12, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }} />
          <motion.circle r="3" fill="#111" stroke="white" strokeWidth="0.5" animate={{ cx: [180, 200, 185, 180], cy: [110, 95, 125, 110] }} transition={{ duration: 12, repeat: Infinity, ease: [0.77, 0, 0.175, 1], delay: 0.8 }} />
        </svg>
        {/* REC ticker */}
        <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded bg-black/50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white/85 backdrop-blur-sm">
          <motion.span className="h-1.5 w-1.5 rounded-full bg-red-500" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }} />
          Rec 47:12
        </div>
        {/* Camera label bottom-left */}
        <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-widest text-white/50">Cam 01 · Auto</div>
      </div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 3 — Recording auto-tagged with venue/date/time chips
   ───────────────────────────────────────────────────────────── */
function Step3Tagging() {
  const chips = [
    { label: "Facility", value: "Example FC" },
    { label: "Date", value: "Tue · Nov 12" },
    { label: "Slot", value: "19:00 – 20:00" },
  ];
  return (
    <ScreenFrame label="Auto-tagging">
      <div className="mb-3 flex items-center gap-2 text-xs text-white/50">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        Recording · 00:47:12
      </div>
      <div className="flex flex-col gap-2">
        {chips.map((chip, i) => (
          <motion.div
            key={chip.label}
            className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: [0, 1, 1, 1, 0], x: [-12, 0, 0, 0, -12] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.4, times: [0, 0.15, 0.5, 0.85, 1], ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">{chip.label}</span>
            <span className="text-sm text-white/85">{chip.value}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-3 flex items-center gap-2 text-xs text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.7, 0.85, 1] }}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Match indexed
      </motion.div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 4 — Staff activates sale in the admin panel
   ───────────────────────────────────────────────────────────── */
function Step4Admin() {
  const rows = [
    { time: "18:00", players: "4/4", status: "SOLD", sold: true },
    { time: "19:00", players: "4/4", status: "PENDING", sold: false, active: true },
    { time: "20:00", players: "3/4", status: "OPEN", sold: false },
  ];
  return (
    <ScreenFrame label="Admin panel · Today">
      <div className="mb-2 grid grid-cols-[80px_1fr_100px] gap-2 border-b border-white/[0.06] pb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Slot</span>
        <span>Players</span>
        <span className="text-right">Status</span>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, i) => (
          <motion.div
            key={row.time}
            className="grid grid-cols-[80px_1fr_100px] items-center gap-2 rounded-md px-2 py-2 text-sm"
            animate={
              row.active
                ? {
                    backgroundColor: [
                      "rgba(255,255,255,0)",
                      "rgba(253,230,138,0.08)",
                      "rgba(253,230,138,0.08)",
                      "rgba(255,255,255,0)",
                    ],
                  }
                : undefined
            }
            transition={{ duration: 6, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }}
            style={i === 0 ? { opacity: 0.55 } : {}}
          >
            <span className="text-white/80">{row.time}</span>
            <span className="text-white/60">{row.players}</span>
            {row.active ? (
              <motion.span
                className="justify-self-end rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                animate={{
                  backgroundColor: [
                    "rgba(255,255,255,0.08)",
                    "rgba(255,255,255,0.08)",
                    "rgb(253,230,138)",
                    "rgb(253,230,138)",
                    "rgba(255,255,255,0.08)",
                  ],
                  color: [
                    "rgba(255,255,255,0.6)",
                    "rgba(255,255,255,0.6)",
                    "rgb(10,10,10)",
                    "rgb(10,10,10)",
                    "rgba(255,255,255,0.6)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1], ease: [0.77, 0, 0.175, 1] }}
              >
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0, 1] }}
                  transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1] }}
                  style={{ position: "absolute" }}
                >
                  Pending
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 0, 1, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1] }}
                >
                  Unlockable
                </motion.span>
              </motion.span>
            ) : (
              <span
                className={`justify-self-end rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  row.sold ? "bg-white/8 text-white/40" : "bg-white/5 text-white/55"
                }`}
              >
                {row.status}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 5 — Player finds the match through the search form
   ───────────────────────────────────────────────────────────── */
function Step5Find() {
  const fields = [
    { label: "Facility", value: "Example FC", delay: 0 },
    { label: "Date", value: "Nov 12", delay: 0.8 },
    { label: "Time slot", value: "19:00 – 20:00", delay: 1.6 },
  ];
  return (
    <ScreenFrame label="Find your match">
      <div className="flex flex-col gap-2">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{f.label}</span>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm">
              <motion.span
                className="text-white/85"
                initial={{ opacity: 0.25 }}
                animate={{ opacity: [0.25, 0.25, 1, 1, 0.25] }}
                transition={{ duration: 8, repeat: Infinity, delay: f.delay, times: [0, 0.15, 0.3, 0.85, 1] }}
              >
                {f.value}
              </motion.span>
            </div>
          </div>
        ))}
      </div>
      <motion.div
        className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-ink-900"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.3, 0.3, 1, 1, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, times: [0, 0.3, 0.5, 0.65, 0.9, 1] }}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 5v10l7-5-7-5z" />
        </svg>
        Watch match
      </motion.div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 6 — Watch, clip, and share to social
   ───────────────────────────────────────────────────────────── */
function Step6Share() {
  return (
    <ScreenFrame label="Video player · Clip & share">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#0f2a1c]">
        {/* Pitch-tinted backdrop for the video area */}
        <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 320 180" preserveAspectRatio="none">
          <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none">
            <rect x="10" y="12" width="300" height="156" rx="2" />
            <line x1="160" y1="12" x2="160" y2="168" />
            <circle cx="160" cy="90" r="18" />
          </g>
        </svg>
        {/* Big play triangle in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <svg className="h-4 w-4 translate-x-[1px] text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5v10l7-5-7-5z" />
            </svg>
          </div>
        </div>
        {/* Scrub bar with animated clip window */}
        <div className="absolute inset-x-3 bottom-3">
          <div className="relative h-1 rounded-full bg-white/15">
            <motion.div
              className="absolute top-0 h-1 rounded-full bg-accent"
              initial={{ left: "18%", width: "8%" }}
              animate={{ left: ["18%", "22%", "26%", "18%"], width: ["8%", "14%", "18%", "8%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/50">
            <span>17:04</span>
            <span>17:32</span>
          </div>
        </div>
      </div>
      {/* Share row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-white/50">Clip 00:28</span>
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.4, 0.4, 1, 1, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.65, 0.85, 1] }}
        >
          {["IG", "TT", "WA"].map((s) => (
            <span
              key={s}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/8 font-mono text-[9px] font-bold uppercase text-white/70"
            >
              {s}
            </span>
          ))}
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-ink-900">Share</span>
        </motion.div>
      </div>
    </ScreenFrame>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dispatcher — HowSteps imports this and passes the step key.
   ───────────────────────────────────────────────────────────── */
export default function StepMockup({ step }: { step: string }) {
  switch (step) {
    case "1":
      return <Step1Booking />;
    case "2":
      return <Step2Recording />;
    case "3":
      return <Step3Tagging />;
    case "4":
      return <Step4Admin />;
    case "5":
      return <Step5Find />;
    case "6":
      return <Step6Share />;
    default:
      return null;
  }
}
