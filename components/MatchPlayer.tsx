"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Match footage player.
 * - With `videoSrc`: real <video> playback (signed /api/video link; MP4 or HLS)
 *   with a custom scrubber and 15–40s clip selection.
 * - Without: a fixed-camera canvas simulation (padel/football) so seeded demo
 *   matches are playable before real footage exists.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export const CLIP_MIN = 15;
export const CLIP_MAX = 40;
const SIM_DURATION = 90;

export type Clip = { start: number; end: number; length: number; valid: boolean } | null;

type Props = {
  sport?: string;
  videoSrc?: string | null;
  playbackType?: string | null;
  poster?: string | null;
  label?: string;
  onView?: () => void;
  onClipChange?: (clip: Clip) => void;
};

function fmt(s: number) {
  s = Math.max(0, Math.floor(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- canvas court drawing (simulation mode) ---------- */
function drawPadel(ctx: CanvasRenderingContext2D, w: number, h: number, tt: number) {
  ctx.fillStyle = "#0e2a24";
  ctx.fillRect(0, 0, w, h);
  const pad = Math.min(w, h) * 0.09;
  const cw = w - pad * 2, ch = h - pad * 2;
  ctx.save();
  ctx.translate(pad, pad);
  ctx.strokeStyle = "rgba(253,230,138,.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, cw, ch);
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cw / 2, 0); ctx.lineTo(cw / 2, ch); ctx.stroke();
  ctx.strokeRect(cw * 0.16, 0, cw * 0.68, ch);
  ctx.beginPath(); ctx.moveTo(cw * 0.16, ch / 2); ctx.lineTo(cw * 0.84, ch / 2); ctx.stroke();
  const t = tt * Math.PI * 2;
  const players: [number, number][] = [
    [cw * 0.28 + Math.sin(t) * 22, ch * 0.32 + Math.cos(t * 1.3) * 20],
    [cw * 0.28 + Math.cos(t * 0.8) * 18, ch * 0.7 + Math.sin(t) * 22],
    [cw * 0.72 + Math.sin(t * 1.1) * 20, ch * 0.34 + Math.cos(t) * 18],
    [cw * 0.72 + Math.cos(t) * 16, ch * 0.68 + Math.sin(t * 1.2) * 22],
  ];
  const colors = ["#3aa0ff", "#3aa0ff", "#ff7a59", "#ff7a59"];
  players.forEach((p, i) => {
    ctx.fillStyle = colors[i];
    ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 7); ctx.fill();
  });
  const bx = cw / 2 + Math.sin(t * 2.2) * cw * 0.34;
  const by = ch / 2 + Math.cos(t * 3.1) * ch * 0.3;
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath(); ctx.arc(bx, by, 5, 0, 7); ctx.fill();
  ctx.restore();
}

function drawFootball(ctx: CanvasRenderingContext2D, w: number, h: number, tt: number) {
  ctx.fillStyle = "#0b3018";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.06)";
    ctx.fillRect((w / 8) * i, 0, w / 8, h);
  }
  const pad = Math.min(w, h) * 0.07;
  const cw = w - pad * 2, ch = h - pad * 2;
  ctx.save();
  ctx.translate(pad, pad);
  ctx.strokeStyle = "rgba(255,255,255,.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, cw, ch);
  ctx.beginPath(); ctx.moveTo(cw / 2, 0); ctx.lineTo(cw / 2, ch); ctx.stroke();
  ctx.beginPath(); ctx.arc(cw / 2, ch / 2, Math.min(cw, ch) * 0.13, 0, 7); ctx.stroke();
  ctx.strokeRect(-2, ch * 0.32, cw * 0.06, ch * 0.36);
  ctx.strokeRect(cw - cw * 0.06 + 2, ch * 0.32, cw * 0.06, ch * 0.36);
  const t = tt * Math.PI * 2;
  for (let i = 0; i < 10; i++) {
    const base = i < 5 ? 0.3 : 0.7;
    const x = cw * base + Math.sin(t + i) * cw * 0.12 + ((i % 5) - 2) * 14;
    const y = ch * (0.2 + ((i % 5) / 5) * 0.6) + Math.cos(t * 1.2 + i) * 16;
    ctx.fillStyle = i < 5 ? "#3aa0ff" : "#ff7a59";
    ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
  }
  const bx = cw / 2 + Math.sin(t * 1.7) * cw * 0.4;
  const by = ch / 2 + Math.cos(t * 2.3) * ch * 0.34;
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath(); ctx.arc(bx, by, 5, 0, 7); ctx.fill();
  ctx.restore();
}

export default function MatchPlayer({ sport, videoSrc, poster, label, onView, onClipChange }: Props) {
  const isVideo = !!videoSrc;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(isVideo ? 0 : SIM_DURATION);
  const [clip, setClip] = useState<Clip>(null);
  const viewCounted = useRef(false);
  const durationFixed = useRef(false);
  const simTime = useRef(0);
  const rafRef = useRef(0);
  const lastTs = useRef(0);
  const dragging = useRef(false);
  const dragStart = useRef(0);

  const countView = useCallback(() => {
    if (!viewCounted.current) {
      viewCounted.current = true;
      onView?.();
    }
  }, [onView]);

  /* ---------- simulation rendering ---------- */
  const renderSim = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(r.width * dpr)) {
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tt = simTime.current / SIM_DURATION;
    if (sport === "football") drawFootball(ctx, r.width, r.height, tt);
    else drawPadel(ctx, r.width, r.height, tt);
  }, [sport]);

  useEffect(() => {
    if (isVideo) return;
    renderSim();
    const ro = new ResizeObserver(() => renderSim());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [isVideo, renderSim]);

  useEffect(() => {
    if (isVideo || !playing) return;
    const loop = (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      simTime.current = Math.min(SIM_DURATION, simTime.current + (ts - lastTs.current) / 1000);
      lastTs.current = ts;
      setCur(simTime.current);
      renderSim();
      if (simTime.current > 2) countView();
      if (simTime.current >= SIM_DURATION) { setPlaying(false); return; }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); lastTs.current = 0; };
  }, [playing, isVideo, renderSim, countView]);

  /* ---------- video events ---------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!isVideo || !v) return;
    const onMeta = () => {
      // MediaRecorder WebM ships without duration — force a seek to resolve it.
      if (!isFinite(v.duration) || v.duration === 0) v.currentTime = 1e101;
      else setDur(v.duration);
    };
    const onDur = () => { if (isFinite(v.duration) && v.duration > 0) setDur(v.duration); };
    const onSeeked = () => {
      if (!durationFixed.current && isFinite(v.duration) && v.duration > 0) {
        durationFixed.current = true;
        v.currentTime = 0;
        setDur(v.duration);
      }
    };
    const onTime = () => { setCur(v.currentTime); if (v.currentTime > 2) countView(); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [isVideo, countView]);

  const togglePlay = () => {
    if (isVideo) {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play();
      else v.pause();
    } else {
      if (!playing && simTime.current >= SIM_DURATION) { simTime.current = 0; }
      setPlaying((p) => !p);
    }
  };

  /* ---------- scrub + clip selection ---------- */
  const posFromEvent = (e: MouseEvent | TouchEvent) => {
    const el = scrubRef.current;
    if (!el || !dur) return 0;
    const r = el.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX) - r.left;
    return Math.min(1, Math.max(0, x / r.width)) * dur;
  };
  const seekTo = (t: number) => {
    if (isVideo) { if (videoRef.current) videoRef.current.currentTime = t; }
    else { simTime.current = t; setCur(t); renderSim(); }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const t = posFromEvent(e);
      const a = Math.min(dragStart.current, t);
      const b = Math.max(dragStart.current, t);
      if (b - a >= 1) {
        const len = b - a;
        setClip({ start: a, end: b, length: len, valid: len >= CLIP_MIN && len <= CLIP_MAX });
      }
      seekTo(t);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setClip((c) => {
        const final = c && c.length >= 2 ? c : null;
        onClipChange?.(final);
        return final;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dur, isVideo]);

  const onScrubDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    dragStart.current = posFromEvent(e.nativeEvent as any);
    seekTo(dragStart.current);
    e.preventDefault();
  };

  /* ---------- snapshot (clip download, demo) ---------- */
  const snapshot = () => {
    let url: string | null = null;
    if (isVideo && videoRef.current) {
      const v = videoRef.current;
      const cv = document.createElement("canvas");
      cv.width = v.videoWidth || 1280;
      cv.height = v.videoHeight || 720;
      try { cv.getContext("2d")?.drawImage(v, 0, 0, cv.width, cv.height); url = cv.toDataURL("image/png"); } catch {}
    } else if (canvasRef.current) {
      url = canvasRef.current.toDataURL("image/png");
    }
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "replash-clip.png";
      a.click();
    }
  };

  // expose snapshot to parent through a data attribute hack? No — parent uses render prop instead.
  // Simpler: parent passes onClipChange and calls back via ref. We attach to window-free API:
  (MatchPlayer as any)._lastSnapshot = snapshot;

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      {/* live tag */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] text-white/80">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        {label || "Match recording"}
      </div>

      {isVideo ? (
        <video
          ref={videoRef}
          src={videoSrc || undefined}
          poster={poster || undefined}
          playsInline
          preload="metadata"
          className="h-full w-full bg-black object-cover"
        />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" />
      )}

      {/* control bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-3 py-2.5">
        <button
          onClick={togglePlay}
          aria-label="Play/Pause"
          className="grid h-10 w-10 flex-none place-items-center rounded-full bg-accent text-ink-900 transition hover:scale-105 active:scale-95"
        >
          {playing ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div
          ref={scrubRef}
          onMouseDown={onScrubDown}
          onTouchStart={onScrubDown}
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/20"
        >
          {clip && (
            <div
              className="absolute -bottom-1 -top-1 rounded border border-accent bg-accent/20"
              style={{ left: `${(clip.start / dur) * 100}%`, width: `${((clip.end - clip.start) / dur) * 100}%` }}
            />
          )}
          <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <div className="min-w-[84px] text-right font-mono text-xs tabular-nums text-white/90">
          {fmt(cur)} / {fmt(dur)}
        </div>
      </div>
    </div>
  );
}

/** Helper the parent can call to download the current frame as the clip (demo). */
export function downloadSnapshot() {
  const fn = (MatchPlayer as any)._lastSnapshot;
  if (typeof fn === "function") fn();
}
