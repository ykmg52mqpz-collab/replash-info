/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import db from "@/server/db";
import webhook from "@/server/webhook";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * recording.ready — the external video provider notifies that a slot's
 * recording is processed and playable. AUTO-MATCHED to a match by
 * channel + date + slot; stores the external playback URL + thumbnail.
 * Body is HMAC-signed (x-replash-signature) over the exact raw bytes.
 */
export async function POST(request: Request) {
  const raw = await request.text().catch(() => null);
  if (raw === null) return core.json(400, { error: "bad_body" });
  if (!webhook.verify(raw, request.headers.get("x-replash-signature"))) {
    return core.json(401, { error: "invalid_signature" });
  }
  let body: any;
  try { body = JSON.parse(raw); } catch { return core.json(400, { error: "invalid_json" }); }
  if (body.event && body.event !== "recording.ready") return core.json(200, { ignored: body.event });

  const data = db.load();
  const chan = body.channelId || body.cameraId;
  const cam = (data.cameras || []).find((c: any) => c.channelId === chan || c.id === chan);
  if (!cam) return core.json(404, { error: "unknown_channel" });
  if (!body.playbackUrl) return core.json(400, { error: "missing_playbackUrl" });
  const fac = data.facilities.find((f: any) => f.id === cam.facilityId);

  let slot = body.slot;
  let date = body.date;
  if ((!slot || !date) && body.startedAt) {
    const d = new Date(body.startedAt);
    if (!slot) slot = core.deriveSlot(d);
    if (!date) date = d.toISOString().slice(0, 10);
  }
  slot = (slot || core.deriveSlot(new Date())).replace("-", "–");
  date = date || new Date().toISOString().slice(0, 10);
  if (!/^\d{2}:\d{2}–\d{2}:\d{2}$/.test(slot)) return core.json(400, { error: "bad_slot" });

  const nowIso = db.nowIso();
  const ext = {
    externalUrl: body.playbackUrl,
    playbackType: body.playbackType || (/\.m3u8(\?|$)/.test(body.playbackUrl) ? "hls" : "mp4"),
    thumbnailUrl: body.thumbnailUrl || null,
    recordingId: body.recordingId || null,
    durationSec: Number(body.durationSec || 3600),
    sizeBytes: Number(body.sizeBytes || 0),
    storage: "external",
    source: "provider",
    recordedAt: nowIso,
    availableAt: nowIso, // provider fires this only when the video is ready
  };
  const existing = data.matches.find((m: any) => m.cameraId === cam.id && m.date === date && m.timeSlot === slot);
  let match: any;
  let upserted = false;
  if (existing) {
    upserted = true;
    Object.assign(existing, ext);
    match = existing;
  } else {
    match = Object.assign(
      {
        id: "m-" + crypto.randomBytes(5).toString("hex"),
        code: core.matchCodeFrom(date, slot),
        accessCode: db.genAccessCode(),
        cameraId: cam.id,
        facilityId: cam.facilityId,
        court: cam.court,
        date,
        timeSlot: slot,
        status: "LOCKED",
        soldAt: null,
        views: 0,
        viewerSessions: [],
        billable: false,
        sport: fac ? fac.sport : "",
        videoFile: null,
      },
      ext
    );
    data.matches.push(match);
  }
  cam.status = "online";
  cam.lastSeenAt = nowIso;
  db.save(data);
  core.logAccess({ event: "hook_recording", matchId: match.id, cameraId: cam.id, upserted });
  return core.json(200, { ok: true, matchId: match.id, code: match.code, status: match.status, upserted });
}
