/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 'Video sold' — LOCKED -> UNLOCKABLE, irreversible (brief §06).
export async function POST(request: Request) {
  const s = core.requireRole(request, "panel");
  if (!s) return core.json(401, { error: "unauthorized" });
  const body = await request.json().catch(() => ({}));
  const data = db.load();
  const m = data.matches.find((x: any) => x.id === body.matchId && x.facilityId === s.subject);
  if (!m) return core.json(404, { error: "not_found" });
  if (m.status === "UNLOCKABLE") return core.json(409, { error: "already_sold" });
  m.status = "UNLOCKABLE";
  m.soldAt = db.nowIso();
  m.billable = true;
  if (!m.accessCode) m.accessCode = db.genAccessCode();
  db.save(data);
  core.logAccess({ event: "video_sold", matchId: m.id, facilityId: s.subject });
  return core.json(200, {
    ok: true,
    match: { id: m.id, status: m.status, soldAt: m.soldAt, accessCode: m.accessCode, availability: db.availabilityInfo(m) },
  });
}
