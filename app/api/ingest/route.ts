/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import fs from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import db from "@/server/db";
import media from "@/server/media";
import storage from "@/server/storage";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CT: Record<string, string> = { webm: "video/webm", mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime" };
const MAX = 600 * 1024 * 1024; // 600 MB

/**
 * Camera-driven ingest: an edge agent (or the in-browser test camera) uploads
 * the just-recorded 1-hour slot as raw bytes. Auth = camera token (or the
 * facility PIN via x-ingest-pin for the browser test tool). Facility + court
 * come from the camera registry; the slot is derived from the clock when not
 * passed. Upserts ONE recording per camera × date × slot.
 */
export async function POST(request: Request) {
  const h = request.headers;
  const camId = h.get("x-camera-id");
  const camToken = h.get("x-camera-token");
  const ext = String(h.get("x-ext") || "webm").replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!["webm", "mp4", "m4v", "mov"].includes(ext)) return core.json(400, { error: "bad_ext" });

  const data = db.load();
  const cam = (data.cameras || []).find((c: any) => c.id === camId);
  if (!cam || cam.active === false) return core.json(404, { error: "unknown_camera" });
  const fac = data.facilities.find((f: any) => f.id === cam.facilityId);
  const byToken = camToken && camToken === cam.token;
  const byPin = h.get("x-ingest-pin") && fac && h.get("x-ingest-pin") === fac.pin;
  if (!byToken && !byPin) return core.json(401, { error: "unauthorized" });

  const now = new Date();
  const slot = (h.get("x-slot") ? decodeURIComponent(h.get("x-slot") as string) : core.deriveSlot(now)).replace("-", "–");
  const date = h.get("x-date") || now.toISOString().slice(0, 10);
  if (!/^\d{2}:\d{2}–\d{2}:\d{2}$/.test(slot)) return core.json(400, { error: "bad_slot" });

  const declared = Number(h.get("content-length") || 0);
  if (declared > MAX) return core.json(413, { error: "too_large" });
  if (!request.body) return core.json(400, { error: "empty" });

  const id = "m-" + crypto.randomBytes(5).toString("hex");
  const file = id + "." + ext;
  const contentType = CT[ext] || "application/octet-stream";
  const drv = storage.driver();

  let size = 0;
  if (drv.kind === "s3") {
    if (!declared) return core.json(411, { error: "length_required" });
    try {
      await drv.putStream(file, Readable.fromWeb(request.body as any), { size: declared, contentType });
      size = declared;
    } catch (e: any) {
      return core.json(502, { error: "storage_put_failed", detail: String(e.message).slice(0, 160) });
    }
  } else {
    media.ensureDir();
    const full = media.mediaPath(file);
    try {
      await pipeline(Readable.fromWeb(request.body as any), fs.createWriteStream(full));
      size = fs.statSync(full).size;
      if (size === 0) throw new Error("empty");
      if (size > MAX) throw new Error("too_large");
    } catch (e: any) {
      try { fs.unlinkSync(full); } catch {}
      return core.json(e.message === "too_large" ? 413 : 400, { error: e.message === "too_large" ? "too_large" : "upload_error" });
    }
  }

  const fresh = db.load();
  const recordedAt = db.nowIso();
  const availableAt = new Date(Date.now() + db.PROCESSING_MINUTES * 60000).toISOString();
  const duration = Number(h.get("x-duration") || 3600);
  const existing = fresh.matches.find((m: any) => m.cameraId === cam.id && m.date === date && m.timeSlot === slot);
  let match: any;
  let upserted = false;
  let oldFile: string | null = null;
  if (existing) {
    upserted = true;
    oldFile = existing.videoFile && existing.videoFile !== file ? existing.videoFile : null;
    Object.assign(existing, {
      videoFile: file, sizeBytes: size, recordedAt, availableAt,
      durationSec: duration, storage: drv.kind, source: h.get("x-source") || "camera",
    });
    match = existing;
  } else {
    match = {
      id,
      code: core.matchCodeFrom(date, slot),
      accessCode: db.genAccessCode(),
      cameraId: cam.id,
      facilityId: cam.facilityId,
      court: cam.court,
      date,
      timeSlot: slot,
      status: "LOCKED",
      recordedAt,
      availableAt,
      durationSec: duration,
      soldAt: null,
      views: 0,
      viewerSessions: [],
      billable: false,
      sport: fac ? fac.sport : h.get("x-sport") || "",
      videoFile: file,
      sizeBytes: size,
      source: h.get("x-source") || "camera",
      storage: drv.kind,
    };
    fresh.matches.push(match);
  }
  db.save(fresh);
  if (oldFile) Promise.resolve(drv.delete(oldFile)).catch(() => {});
  core.logAccess({ event: "ingest", matchId: match.id, cameraId: cam.id, bytes: size, upserted, storage: drv.kind });
  return core.json(200, { ok: true, matchId: match.id, code: match.code, accessCode: match.accessCode, status: match.status, upserted });
}
