/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 'Find my match' fallback — the 5-condition Access Control Engine:
 * facility + court + date + timeSlot + status === UNLOCKABLE, within retention.
 * A LOCKED match's existence is never revealed.
 */
export async function POST(request: Request) {
  const ip = core.clientIp(request);
  if (core.rateLimited(ip)) {
    core.logAccess({ event: "find_rate_limited", ip });
    return core.json(429, { error: "rate_limited" });
  }
  const body = await request.json().catch(() => ({}));
  const { facilityId, court, date, timeSlot } = body || {};
  if (!facilityId || !court || !date || !timeSlot) {
    return core.json(400, { error: "missing_fields" });
  }
  const data = db.load();
  const match = data.matches.find(
    (m: any) =>
      m.facilityId === facilityId &&
      m.court === court &&
      m.date === date &&
      m.timeSlot === timeSlot &&
      m.status === "UNLOCKABLE" &&
      !db.isExpired(m)
  );
  core.logAccess({ event: "find_attempt", ip, facilityId, court, date, timeSlot, result: match ? "unlockable" : "not_found" });
  if (!match) return core.json(200, { found: false });
  const pres = core.presentMatch(match, data);
  return core.json(200, { found: true, processing: pres.processing, match: pres.match });
}
