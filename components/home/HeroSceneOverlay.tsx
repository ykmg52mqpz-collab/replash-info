"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Choreographed player paths (viewBox: 1200x800, hero image bird-ish frame)
// Two teams of 4 outfield + a couple positional anchors. Slow, ambient loops.
const teamA = [
  { keyframes: [{ cx: 340, cy: 260 }, { cx: 420, cy: 220 }, { cx: 380, cy: 340 }, { cx: 340, cy: 260 }] },
  { keyframes: [{ cx: 500, cy: 380 }, { cx: 560, cy: 340 }, { cx: 540, cy: 460 }, { cx: 500, cy: 380 }] },
  { keyframes: [{ cx: 420, cy: 500 }, { cx: 480, cy: 540 }, { cx: 380, cy: 560 }, { cx: 420, cy: 500 }] },
  { keyframes: [{ cx: 260, cy: 420 }, { cx: 300, cy: 480 }, { cx: 240, cy: 500 }, { cx: 260, cy: 420 }] },
];

const teamB = [
  { keyframes: [{ cx: 780, cy: 300 }, { cx: 720, cy: 340 }, { cx: 800, cy: 400 }, { cx: 780, cy: 300 }] },
  { keyframes: [{ cx: 640, cy: 420 }, { cx: 600, cy: 380 }, { cx: 680, cy: 460 }, { cx: 640, cy: 420 }] },
  { keyframes: [{ cx: 860, cy: 500 }, { cx: 820, cy: 560 }, { cx: 900, cy: 540 }, { cx: 860, cy: 500 }] },
  { keyframes: [{ cx: 940, cy: 380 }, { cx: 980, cy: 440 }, { cx: 920, cy: 480 }, { cx: 940, cy: 380 }] },
];

// Ball traces a slow figure-8 around the midfield
const ballPath = [
  { cx: 600, cy: 400 },
  { cx: 500, cy: 340 },
  { cx: 400, cy: 420 },
  { cx: 500, cy: 500 },
  { cx: 600, cy: 400 },
  { cx: 700, cy: 340 },
  { cx: 800, cy: 420 },
  { cx: 700, cy: 500 },
  { cx: 600, cy: 400 },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function HeroSceneOverlay() {
  // Live-ticking REC counter (visual only)
  const [seconds, setSeconds] = useState(754); // starts around 12:34 for realism
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = pad(Math.floor(seconds / 60));
  const ss = pad(seconds % 60);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* SVG tactical scene — sits on top of the photo, semi-transparent */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-70"
        aria-hidden
      >
        {/* Corner brackets (camera framing) */}
        <g stroke="rgb(253 230 138 / 0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M40 40 L40 80 M40 40 L80 40" />
          <path d="M1160 40 L1160 80 M1160 40 L1120 40" />
          <path d="M40 760 L40 720 M40 760 L80 760" />
          <path d="M1160 760 L1160 720 M1160 760 L1120 760" />
        </g>

        {/* Subtle scan grid */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={100 + i * 100} y1="120" x2={100 + i * 100} y2="680" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="80" y1={140 + i * 100} x2="1120" y2={140 + i * 100} />
          ))}
        </g>

        {/* Player trails (very subtle glow disks under each player) */}
        {[...teamA, ...teamB].map((p, i) => (
          <motion.circle
            key={`trail-${i}`}
            r="14"
            fill="rgba(253,230,138,0.08)"
            initial={p.keyframes[0]}
            animate={{
              cx: p.keyframes.map((k) => k.cx),
              cy: p.keyframes.map((k) => k.cy),
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Team A players (white) */}
        {teamA.map((p, i) => (
          <motion.circle
            key={`a-${i}`}
            r="5"
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
            initial={p.keyframes[0]}
            animate={{
              cx: p.keyframes.map((k) => k.cx),
              cy: p.keyframes.map((k) => k.cy),
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Team B players (dark) */}
        {teamB.map((p, i) => (
          <motion.circle
            key={`b-${i}`}
            r="5"
            fill="rgba(10,10,10,0.95)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
            initial={p.keyframes[0]}
            animate={{
              cx: p.keyframes.map((k) => k.cx),
              cy: p.keyframes.map((k) => k.cy),
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Ball — yellow accent, traces a figure-8 */}
        <motion.circle
          r="4"
          fill="rgb(253 230 138)"
          initial={ballPath[0]}
          animate={{
            cx: ballPath.map((p) => p.cx),
            cy: ballPath.map((p) => p.cy),
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {/* Ball halo */}
        <motion.circle
          r="10"
          fill="rgba(253,230,138,0.2)"
          initial={ballPath[0]}
          animate={{
            cx: ballPath.map((p) => p.cx),
            cy: ballPath.map((p) => p.cy),
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* HUD: camera label + REC counter (top corners) */}
      <div className="absolute left-6 top-6 flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-sm md:left-10 md:top-10">
        <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
        Replash Cam 01 · Pitch View
      </div>

      <div className="absolute right-6 top-6 flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur-sm md:right-10 md:top-10">
        <motion.span
          className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        REC 00:{mm}:{ss}
      </div>

      {/* Bottom coord/status line — very small, adds broadcast feel */}
      <div className="absolute bottom-6 left-6 hidden font-mono text-[10px] uppercase tracking-widest text-white/45 md:bottom-8 md:left-10 md:block">
        Auto-record · PoE · 1080p50 · Buffered
      </div>
      <div className="absolute bottom-6 right-6 hidden font-mono text-[10px] uppercase tracking-widest text-white/45 md:bottom-8 md:right-10 md:block">
        LAT 45.4642° · LON 9.1900°
      </div>
    </div>
  );
}
