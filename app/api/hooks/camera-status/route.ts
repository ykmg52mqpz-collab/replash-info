/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import webhook from "@/server/webhook";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// camera.status — online/offline heartbeat from the video provider.
export async function POST(request: Request) {
  const raw = await request.text().catch(() => null);
  if (raw === null) return core.json(400, { error: "bad_body" });
  if (!webhook.verify(raw, request.headers.get("x-replash-signature"))) {
    return core.json(401, { error: "invalid_signature" });
  }
  let body: any;
  try { body = JSON.parse(raw); } catch { return core.json(400, { error: "invalid_json" }); }
  const data = db.load();
  const chan = body.channelId || body.cameraId;
  const cam = (data.cameras || []).find((c: any) => c.channelId === chan || c.id === chan);
  if (!cam) return core.json(404, { error: "unknown_channel" });
  cam.status = body.status === "offline" ? "offline" : "online";
  cam.lastSeenAt = body.at || db.nowIso();
  db.save(data);
  core.logAccess({ event: "hook_camera_status", cameraId: cam.id, status: cam.status });
  return core.json(200, { ok: true, cameraId: cam.id, status: cam.status });
}
