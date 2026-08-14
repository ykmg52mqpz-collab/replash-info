"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Test Camera — simulates a court camera end-to-end: pick a registered camera
 * (facility + court implied), authenticate with the facility PIN, capture from
 * the webcam or a generated test pattern, and upload the slot to /api/ingest.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

const T: Record<string, Record<string, string>> = {
  it: {
    title: "Test Camera",
    hint: "Una registrazione caricata diventa una partita BLOCCATA. Aprila nel pannello del centro («Video venduto»), poi guardala con il codice.",
    webcam: "Webcam", pattern: "Test pattern", start: "Avvia", record: "Registra", stop: "Ferma",
    meta: "Dettagli registrazione", facility: "Centro", camera: "Camera (campo)", pin: "PIN del centro",
    date: "Data", slot: "Fascia", autostop: "Stop automatico", manual: "Manuale",
    idle: "in attesa", live: "in diretta", rec: "REC", uploading: "Caricamento…",
    ok: "Caricata come partita BLOCCATA.", badauth: "PIN non valido.", fill: "Seleziona camera, PIN e slot.",
    needcam: "Webcam non accessibile. Prova il test pattern.", panel: "Apri il pannello", find: "Trova la partita",
  },
  en: {
    title: "Test Camera",
    hint: "An uploaded recording becomes a LOCKED match. Open it in the facility panel ('Video sold'), then watch it with the code.",
    webcam: "Webcam", pattern: "Test pattern", start: "Start", record: "Record", stop: "Stop",
    meta: "Recording details", facility: "Facility", camera: "Camera (court)", pin: "Facility PIN",
    date: "Date", slot: "Slot", autostop: "Auto-stop", manual: "Manual",
    idle: "idle", live: "live", rec: "REC", uploading: "Uploading…",
    ok: "Uploaded as a LOCKED match.", badauth: "Invalid PIN.", fill: "Select camera, PIN and slot.",
    needcam: "Couldn't access the webcam. Try the test pattern.", panel: "Open the panel", find: "Find my match",
  },
  tr: {
    title: "Test Kamerası",
    hint: "Yüklenen kayıt KİLİTLİ maç olur. Tesis panelinden «Video satıldı» ile aç, sonra kodla izle.",
    webcam: "Webcam", pattern: "Test görüntüsü", start: "Başlat", record: "Kaydet", stop: "Durdur",
    meta: "Kayıt bilgileri", facility: "Tesis", camera: "Kamera (saha)", pin: "Tesis PIN",
    date: "Tarih", slot: "Saat", autostop: "Otomatik durdur", manual: "Manuel",
    idle: "beklemede", live: "canlı", rec: "KAYIT", uploading: "Yükleniyor…",
    ok: "KİLİTLİ maç olarak yüklendi.", badauth: "Geçersiz PIN.", fill: "Kamera, PIN ve saat seç.",
    needcam: "Webcam'e erişilemedi. Test görüntüsünü dene.", panel: "Paneli aç", find: "Maçını bul",
  },
  es: {
    title: "Cámara de prueba",
    hint: "Una grabación subida se convierte en un partido BLOQUEADO. Ábrelo en el panel del club («Vídeo vendido») y míralo con el código.",
    webcam: "Webcam", pattern: "Patrón de prueba", start: "Iniciar", record: "Grabar", stop: "Parar",
    meta: "Detalles de la grabación", facility: "Club", camera: "Cámara (pista)", pin: "PIN del club",
    date: "Fecha", slot: "Franja", autostop: "Auto-stop", manual: "Manual",
    idle: "en espera", live: "en vivo", rec: "REC", uploading: "Subiendo…",
    ok: "Subido como partido BLOQUEADO.", badauth: "PIN no válido.", fill: "Selecciona cámara, PIN y franja.",
    needcam: "No se pudo acceder a la webcam. Prueba el patrón.", panel: "Abrir el panel", find: "Buscar mi partido",
  },
};

const SLOTS = ["17:00–18:00", "18:00–19:00", "19:00–20:00", "20:00–21:00", "21:00–22:00"];
const input = "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-accent";

function dateOptions() {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); out.push(d.toISOString().slice(0, 10)); }
  return out;
}
function currentSlot() {
  const h = new Date().getHours();
  const p = (n: number) => String(n).padStart(2, "0");
  const label = `${p(h)}:00–${p((h + 1) % 24)}:00`;
  return SLOTS.includes(label) ? label : SLOTS[1];
}

export default function IngestApp() {
  const locale = useLocale();
  const t = (k: string) => (T[locale] || T.en)[k];
  const [source, setSource] = useState<"webcam" | "test">("test");
  const [liveState, setLiveState] = useState<"idle" | "live" | "rec">("idle");
  const [recSecs, setRecSecs] = useState(0);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [fac, setFac] = useState("");
  const [cam, setCam] = useState("");
  const [pin, setPin] = useState("");
  const [date, setDate] = useState(dateOptions()[0]);
  const [slot, setSlot] = useState(currentSlot());
  const [autoStop, setAutoStop] = useState("10");
  const [result, setResult] = useState<{ kind: "ok" | "err" | "info"; text: string; code?: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const testTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/facilities").then((r) => r.json()),
      fetch("/api/cameras").then((r) => r.json()),
    ]).then(([f, c]) => {
      setFacilities(f.facilities || []);
      setCameras(c.cameras || []);
      if (f.facilities?.[0]) setFac(f.facilities[0].id);
    });
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const list = cameras.filter((c) => c.facilityId === fac);
    setCam(list[0]?.id || "");
  }, [fac, cameras]);

  function stopStream() {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    testTimerRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }

  function startTestPattern() {
    stopStream();
    const cv = canvasRef.current!;
    cv.width = 1280; cv.height = 720;
    const ctx = cv.getContext("2d")!;
    const t0 = performance.now();
    const draw = () => {
      const tt = (performance.now() - t0) / 1000;
      ctx.fillStyle = "#0e2a24"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = "rgba(253,230,138,.7)"; ctx.lineWidth = 6; ctx.strokeRect(80, 60, cv.width - 160, cv.height - 120);
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cv.width / 2, 60); ctx.lineTo(cv.width / 2, cv.height - 60); ctx.stroke();
      const bx = cv.width / 2 + Math.sin(tt * 2) * (cv.width * 0.32);
      const by = cv.height / 2 + Math.cos(tt * 3) * (cv.height * 0.28);
      ctx.fillStyle = "#FEF3C7"; ctx.beginPath(); ctx.arc(bx, by, 16, 0, 7); ctx.fill();
      ctx.fillStyle = "#3aa0ff"; ctx.beginPath(); ctx.arc(cv.width * 0.3 + Math.sin(tt) * 30, cv.height * 0.5, 20, 0, 7); ctx.fill();
      ctx.fillStyle = "#ff7a59"; ctx.beginPath(); ctx.arc(cv.width * 0.7 + Math.cos(tt) * 30, cv.height * 0.5, 20, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(90, 70, 400, 54);
      ctx.fillStyle = "#fff"; ctx.font = "600 30px system-ui, sans-serif";
      ctx.fillText("REPLASH CAM · " + new Date().toLocaleTimeString(), 108, 108);
    };
    // captureStream(0) + manual requestFrame: frames flow even if the tab is hidden.
    const stream = (cv as any).captureStream(0) as MediaStream;
    const track: any = stream.getVideoTracks()[0];
    draw();
    testTimerRef.current = setInterval(() => { draw(); track?.requestFrame?.(); }, 1000 / 30);
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.style.display = "none";
    cv.style.display = "block";
    setLiveState("live");
  }

  async function startWebcam() {
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      v.style.display = "block";
      if (canvasRef.current) canvasRef.current.style.display = "none";
      setLiveState("live");
    } catch {
      setResult({ kind: "err", text: t("needcam") });
    }
  }

  function pickMime() {
    for (const o of ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"]) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(o)) return o;
    }
    return "";
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    chunksRef.current = [];
    const mime = pickMime();
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    rec.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
    rec.onstop = () => upload();
    rec.start();
    recorderRef.current = rec;
    setLiveState("rec");
    setRecSecs(0);
    recTimerRef.current = setInterval(() => setRecSecs((s) => s + 0.1), 100);
    const dur = Number(autoStop);
    if (dur > 0) setTimeout(() => { if (recorderRef.current?.state === "recording") stopRecording(); }, dur * 1000);
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setLiveState("live");
  }

  async function upload() {
    const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    if (!cam || !pin || !slot) { setResult({ kind: "err", text: t("fill") }); return; }
    setResult({ kind: "info", text: `${t("uploading")} (${(blob.size / 1024 / 1024).toFixed(1)} MB)` });
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "x-camera-id": cam,
        "x-ingest-pin": pin,
        "x-date": date,
        "x-slot": encodeURIComponent(slot),
        "x-ext": ext,
        "x-source": "test:" + source,
      },
      body: blob,
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok && d.ok) setResult({ kind: "ok", text: t("ok"), code: d.code });
    else if (res.status === 401) setResult({ kind: "err", text: t("badauth") });
    else setResult({ kind: "err", text: "Error: " + (d.error || res.status) });
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 mt-2 inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">ⓘ {t("hint")}</p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Preview */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 inline-flex overflow-hidden rounded-full border border-white/10">
            <button onClick={() => setSource("webcam")} className={`px-4 py-2 text-sm font-semibold ${source === "webcam" ? "bg-accent text-ink-900" : "text-white/60"}`}>{t("webcam")}</button>
            <button onClick={() => setSource("test")} className={`px-4 py-2 text-sm font-semibold ${source === "test" ? "bg-accent text-ink-900" : "text-white/60"}`}>{t("pattern")}</button>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
            <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px]">
              <span className={`h-2 w-2 rounded-full ${liveState === "rec" ? "animate-pulse bg-red-500" : liveState === "live" ? "bg-emerald-400" : "bg-white/30"}`} />
              {t(liveState)}
              {liveState === "rec" && <span className="font-mono">{recSecs.toFixed(1)}s</span>}
            </div>
            <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-cover" style={{ display: "none" }} />
            <canvas ref={canvasRef} className="h-full w-full" style={{ display: "none" }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button onClick={() => (source === "test" ? startTestPattern() : startWebcam())} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:border-accent hover:text-accent">{t("start")}</button>
            <button onClick={startRecording} disabled={liveState !== "live"} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink-900 disabled:opacity-40">{t("record")}</button>
            <button onClick={stopRecording} disabled={liveState !== "rec"} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 disabled:opacity-40">{t("stop")}</button>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-4 font-semibold">{t("meta")}</h3>
          <div className="flex flex-col gap-3.5">
            <label className="text-[11px] uppercase tracking-wider text-white/40">{t("facility")}
              <select value={fac} onChange={(e) => setFac(e.target.value)} className={`${input} mt-1.5 w-full`}>
                {facilities.map((f) => <option key={f.id} value={f.id} className="bg-ink-900">{f.name} — {f.city}</option>)}
              </select>
            </label>
            <label className="text-[11px] uppercase tracking-wider text-white/40">{t("camera")}
              <select value={cam} onChange={(e) => setCam(e.target.value)} className={`${input} mt-1.5 w-full`}>
                {cameras.filter((c) => c.facilityId === fac).map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.court}</option>)}
              </select>
            </label>
            <label className="text-[11px] uppercase tracking-wider text-white/40">{t("pin")}
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="482913" inputMode="numeric" className={`${input} mt-1.5 w-full`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] uppercase tracking-wider text-white/40">{t("date")}
                <select value={date} onChange={(e) => setDate(e.target.value)} className={`${input} mt-1.5 w-full`}>
                  {dateOptions().map((d) => <option key={d} value={d} className="bg-ink-900">{d}</option>)}
                </select>
              </label>
              <label className="text-[11px] uppercase tracking-wider text-white/40">{t("slot")}
                <select value={slot} onChange={(e) => setSlot(e.target.value)} className={`${input} mt-1.5 w-full`}>
                  {SLOTS.map((s) => <option key={s} value={s} className="bg-ink-900">{s}</option>)}
                </select>
              </label>
            </div>
            <label className="text-[11px] uppercase tracking-wider text-white/40">{t("autostop")}
              <select value={autoStop} onChange={(e) => setAutoStop(e.target.value)} className={`${input} mt-1.5 w-full`}>
                <option value="0" className="bg-ink-900">{t("manual")}</option>
                <option value="10" className="bg-ink-900">10s</option>
                <option value="30" className="bg-ink-900">30s</option>
                <option value="60" className="bg-ink-900">60s</option>
              </select>
            </label>
          </div>

          {result && (
            <div className={`mt-4 rounded-xl border p-4 text-sm ${
              result.kind === "ok" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : result.kind === "err" ? "border-red-400/30 bg-red-400/10 text-red-200"
              : "border-white/10 bg-white/[0.03] text-white/70"}`}>
              {result.text}
              {result.code && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs">{result.code}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/15 px-2.5 py-0.5 text-[11px] font-bold text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />LOCKED</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
