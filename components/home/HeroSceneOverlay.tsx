"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Pitch geometry inside a 1600x900 viewBox.
// Pitch centered horizontally, framed with generous padding for HUD.
const PITCH = {
  x: 220,
  y: 140,
  w: 1160,
  h: 620,
  cx: 800, // center X
  cy: 450, // center Y
};

type Player = {
  num: number;
  team: "A" | "B";
  path: { cx: number; cy: number }[];
  delay?: number;
};

// 5v5 choreographed match — smooth ease-in-out loops, ~16s cycle.
const players: Player[] = [
  // Team A (white) — attacking left→right
  { num: 1, team: "A", path: [{ cx: 320, cy: 450 }, { cx: 340, cy: 420 }, { cx: 320, cy: 480 }, { cx: 320, cy: 450 }] }, // GK
  { num: 4, team: "A", path: [{ cx: 500, cy: 320 }, { cx: 580, cy: 300 }, { cx: 540, cy: 380 }, { cx: 500, cy: 320 }], delay: 0.5 },
  { num: 6, team: "A", path: [{ cx: 500, cy: 580 }, { cx: 560, cy: 620 }, { cx: 480, cy: 620 }, { cx: 500, cy: 580 }], delay: 1 },
  { num: 8, team: "A", path: [{ cx: 700, cy: 400 }, { cx: 780, cy: 380 }, { cx: 740, cy: 480 }, { cx: 700, cy: 400 }], delay: 0.3 },
  { num: 10, team: "A", path: [{ cx: 860, cy: 520 }, { cx: 940, cy: 500 }, { cx: 900, cy: 580 }, { cx: 860, cy: 520 }], delay: 0.8 },

  // Team B (dark) — defending right, holding line
  { num: 1, team: "B", path: [{ cx: 1280, cy: 450 }, { cx: 1260, cy: 420 }, { cx: 1280, cy: 480 }, { cx: 1280, cy: 450 }] }, // GK
  { num: 4, team: "B", path: [{ cx: 1100, cy: 320 }, { cx: 1040, cy: 300 }, { cx: 1080, cy: 380 }, { cx: 1100, cy: 320 }], delay: 0.6 },
  { num: 6, team: "B", path: [{ cx: 1100, cy: 580 }, { cx: 1040, cy: 620 }, { cx: 1120, cy: 620 }, { cx: 1100, cy: 580 }], delay: 1.2 },
  { num: 8, team: "B", path: [{ cx: 940, cy: 380 }, { cx: 900, cy: 420 }, { cx: 960, cy: 460 }, { cx: 940, cy: 380 }], delay: 0.4 },
  { num: 10, team: "B", path: [{ cx: 780, cy: 500 }, { cx: 720, cy: 540 }, { cx: 800, cy: 560 }, { cx: 780, cy: 500 }], delay: 0.9 },
];

// Ball weaves through midfield, occasionally touches the attacking third.
const ballPath = [
  { cx: 800, cy: 450 },
  { cx: 700, cy: 380 },
  { cx: 620, cy: 500 },
  { cx: 740, cy: 560 },
  { cx: 860, cy: 500 },
  { cx: 960, cy: 400 },
  { cx: 1080, cy: 460 },
  { cx: 980, cy: 540 },
  { cx: 820, cy: 500 },
  { cx: 800, cy: 450 },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function HeroSceneOverlay() {
  // Live-ticking REC counter (visual only)
  const [seconds, setSeconds] = useState(2847); // ~47:27 — mid second half
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = pad(Math.floor(seconds / 60));
  const ss = pad(seconds % 60);

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Warm stadium light pools (top-left + top-right tungsten) */}
          <radialGradient id="lightL" cx="15%" cy="0%" r="45%">
            <stop offset="0%" stopColor="rgba(253,230,138,0.22)" />
            <stop offset="100%" stopColor="rgba(253,230,138,0)" />
          </radialGradient>
          <radialGradient id="lightR" cx="85%" cy="0%" r="45%">
            <stop offset="0%" stopColor="rgba(253,230,138,0.18)" />
            <stop offset="100%" stopColor="rgba(253,230,138,0)" />
          </radialGradient>

          {/* Vignette darkening edges */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="rgba(10,10,10,0)" />
            <stop offset="100%" stopColor="rgba(10,10,10,0.85)" />
          </radialGradient>

          {/* Ball halo glow */}
          <radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(253,230,138,0.7)" />
            <stop offset="100%" stopColor="rgba(253,230,138,0)" />
          </radialGradient>

          {/* Camera FOV cone gradient */}
          <linearGradient id="fov" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(253,230,138,0.18)" />
            <stop offset="100%" stopColor="rgba(253,230,138,0)" />
          </linearGradient>

          {/* Clip FOV cones to the pitch so nothing bleeds outside the field */}
          <clipPath id="pitchClip">
            <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} rx="8" />
          </clipPath>
        </defs>

        {/* Base ink */}
        <rect x="0" y="0" width="1600" height="900" fill="#0a0a0a" />

        {/* Pitch — solid single tone */}
        <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} rx="8" fill="#0f2a1c" />

        {/* Field lines */}
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none">
          {/* Outer boundary */}
          <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} rx="4" />
          {/* Center line */}
          <line x1={PITCH.cx} y1={PITCH.y} x2={PITCH.cx} y2={PITCH.y + PITCH.h} />
          {/* Center circle + spot */}
          <circle cx={PITCH.cx} cy={PITCH.cy} r="70" />
          <circle cx={PITCH.cx} cy={PITCH.cy} r="3" fill="rgba(255,255,255,0.3)" stroke="none" />
          {/* Left penalty area */}
          <rect x={PITCH.x} y={PITCH.cy - 130} width="160" height="260" />
          <rect x={PITCH.x} y={PITCH.cy - 60} width="60" height="120" />
          <circle cx={PITCH.x + 110} cy={PITCH.cy} r="3" fill="rgba(255,255,255,0.3)" stroke="none" />
          {/* Right penalty area */}
          <rect x={PITCH.x + PITCH.w - 160} y={PITCH.cy - 130} width="160" height="260" />
          <rect x={PITCH.x + PITCH.w - 60} y={PITCH.cy - 60} width="60" height="120" />
          <circle cx={PITCH.x + PITCH.w - 110} cy={PITCH.cy} r="3" fill="rgba(255,255,255,0.3)" stroke="none" />
          {/* Goals (small posts) */}
          <line x1={PITCH.x - 12} y1={PITCH.cy - 40} x2={PITCH.x} y2={PITCH.cy - 40} />
          <line x1={PITCH.x - 12} y1={PITCH.cy + 40} x2={PITCH.x} y2={PITCH.cy + 40} />
          <line x1={PITCH.x + PITCH.w} y1={PITCH.cy - 40} x2={PITCH.x + PITCH.w + 12} y2={PITCH.cy - 40} />
          <line x1={PITCH.x + PITCH.w} y1={PITCH.cy + 40} x2={PITCH.x + PITCH.w + 12} y2={PITCH.cy + 40} />
        </g>

        {/* FOV cones — clipped to pitch so they don't bleed outside the field */}
        <g clipPath="url(#pitchClip)">
          {/* Top-left cone — from top-left corner sweeping down-right */}
          <polygon
            points={`${PITCH.x},${PITCH.y} ${PITCH.x + PITCH.w + 40},${PITCH.y + PITCH.h * 0.55} ${PITCH.x + PITCH.w},${PITCH.y + PITCH.h + 40}`}
            fill="url(#fov)"
            opacity="0.55"
          />
          {/* Bottom-right cone — from bottom-right corner sweeping up-left */}
          <polygon
            points={`${PITCH.x + PITCH.w},${PITCH.y + PITCH.h} ${PITCH.x - 40},${PITCH.y + PITCH.h * 0.45} ${PITCH.x},${PITCH.y - 40}`}
            fill="url(#fov)"
            opacity="0.55"
          />
        </g>

        {/* Two REPLASH cameras — sitting EXACTLY at diagonal pitch corners */}
        {/* Top-left corner */}
        <g transform={`translate(${PITCH.x}, ${PITCH.y})`}>
          <g transform="translate(-16, -14)">
            <rect width="32" height="24" rx="4" fill="#1a1a1a" stroke="rgba(253,230,138,0.55)" strokeWidth="1.2" />
            <circle cx="16" cy="12" r="6" fill="#0a0a0a" stroke="rgba(253,230,138,0.7)" strokeWidth="1.2" />
            <circle cx="16" cy="12" r="2.5" fill="rgba(253,230,138,0.85)" />
            <motion.circle
              cx="26" cy="5" r="2"
              fill="#ef4444"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </g>

        {/* Bottom-right corner */}
        <g transform={`translate(${PITCH.x + PITCH.w}, ${PITCH.y + PITCH.h})`}>
          <g transform="translate(-16, -14)">
            <rect width="32" height="24" rx="4" fill="#1a1a1a" stroke="rgba(253,230,138,0.55)" strokeWidth="1.2" />
            <circle cx="16" cy="12" r="6" fill="#0a0a0a" stroke="rgba(253,230,138,0.7)" strokeWidth="1.2" />
            <circle cx="16" cy="12" r="2.5" fill="rgba(253,230,138,0.85)" />
            <motion.circle
              cx="6" cy="5" r="2"
              fill="#ef4444"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            />
          </g>
        </g>

        {/* REC indicator INSIDE the pitch (top-right corner of the pitch),
            styled like the broadcast overlay on the feed itself. */}
        <g transform={`translate(${PITCH.x + PITCH.w - 24}, ${PITCH.y + 24})`}>
          <motion.circle
            cx="0" cy="0" r="4"
            fill="#ef4444"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <text
            x="-12" y="1"
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
            fill="rgba(255,255,255,0.9)"
          >
            REC {mm}:{ss}
          </text>
        </g>

        {/* Player trails (soft glow under each player) */}
        <g style={{ mixBlendMode: "screen" }}>
          {players.map((p, i) => (
            <motion.circle
              key={`trail-${i}`}
              r="16"
              fill={p.team === "A" ? "rgba(253,230,138,0.14)" : "rgba(253,230,138,0.09)"}
              initial={p.path[0]}
              animate={{
                cx: p.path.map((k) => k.cx),
                cy: p.path.map((k) => k.cy),
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay ?? 0,
              }}
            />
          ))}
        </g>

        {/* Players */}
        {players.map((p) => (
          <motion.g
            key={`p-${p.team}-${p.num}`}
            initial={{ x: p.path[0].cx, y: p.path[0].cy }}
            animate={{
              x: p.path.map((k) => k.cx),
              y: p.path.map((k) => k.cy),
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay ?? 0,
            }}
          >
            <circle
              r="9"
              fill={p.team === "A" ? "#ffffff" : "#111214"}
              stroke={p.team === "A" ? "rgba(253,230,138,0.55)" : "rgba(255,255,255,0.35)"}
              strokeWidth="1.2"
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="9"
              fontWeight="700"
              fill={p.team === "A" ? "#0a0a0a" : "#ffffff"}
            >
              {p.num}
            </text>
          </motion.g>
        ))}

        {/* Ball with halo */}
        <motion.circle
          r="22"
          fill="url(#ballGlow)"
          initial={ballPath[0]}
          animate={{ cx: ballPath.map((p) => p.cx), cy: ballPath.map((p) => p.cy) }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          r="5"
          fill="rgb(253 230 138)"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="0.8"
          initial={ballPath[0]}
          animate={{ cx: ballPath.map((p) => p.cx), cy: ballPath.map((p) => p.cy) }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Slow horizontal scan sweep — subtle broadcast/monitor feel */}
        <motion.rect
          x="0"
          y="0"
          width="140"
          height="900"
          fill="url(#lightL)"
          opacity="0.35"
          animate={{ x: [-140, 1600] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 2 }}
        />

        {/* Stadium light pools + vignette (topmost visual layer) */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#lightL)" opacity="0.9" />
        <rect x="0" y="0" width="1600" height="900" fill="url(#lightR)" opacity="0.9" />
        <rect x="0" y="0" width="1600" height="900" fill="url(#vignette)" />

      </svg>
    </div>
  );
}
