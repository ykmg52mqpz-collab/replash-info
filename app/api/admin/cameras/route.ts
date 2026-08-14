/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(s: string) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Camera registry — list (with token + live recording count + status).
export async function GET(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const facMap = Object.fromEntries(data.facilities.map((f: any) => [f.id, f]));
  const cameras = (data.cameras || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    facilityId: c.facilityId,
    facilityName: facMap[c.facilityId] ? facMap[c.facilityId].name : c.facilityId,
    court: c.court,
    channelId: c.channelId || c.id,
    token: c.token,
    active: c.active !== false,
    status: c.status || "unknown",
    lastSeenAt: c.lastSeenAt || null,
    recordings: data.matches.filter((m: any) => m.cameraId === c.id && !db.isExpired(m)).length,
  }));
  return core.json(200, { cameras });
}

// Register a camera against a facility+court (one per court).
export async function POST(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const body = await request.json().catch(() => ({}));
  const data = db.load();
  const fac = data.facilities.find((f: any) => f.id === body.facilityId);
  const court = String(body.court || "").trim();
  if (!fac || !court) return core.json(400, { error: "facility_and_court_required" });
  if (!fac.courts.includes(court)) return core.json(400, { error: "court_not_in_facility" });
  data.cameras = data.cameras || [];
  if (data.cameras.some((c: any) => c.facilityId === fac.id && c.court === court)) {
    return core.json(409, { error: "camera_exists_for_court" });
  }
  const cam = {
    id: `cam-${slugify(fac.name)}-${slugify(court)}`,
    facilityId: fac.id,
    court,
    name: `${fac.name} · ${court}`,
    channelId: String(body.channelId || `${slugify(fac.name)}-${slugify(court)}`),
    token: "camk_" + crypto.randomBytes(10).toString("hex"),
    status: "unknown",
    lastSeenAt: null,
    active: true,
    createdAt: db.nowIso(),
  };
  data.cameras.push(cam);
  db.save(data);
  return core.json(200, { ok: true, camera: cam });
}
