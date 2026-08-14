/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const s = core.requireRole(request, "panel");
  if (!s) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const fac = data.facilities.find((f: any) => f.id === s.subject);
  const rows = data.matches
    .filter((m: any) => m.facilityId === s.subject && !db.isExpired(m))
    .sort((a: any, b: any) => (a.recordedAt < b.recordedAt ? 1 : -1))
    .map((m: any) => ({
      id: m.id,
      code: m.code,
      court: m.court,
      date: m.date,
      timeSlot: m.timeSlot,
      status: m.status,
      views: m.views,
      recordedAt: m.recordedAt,
      soldAt: m.soldAt,
      // Access code is revealed to staff only once the match is sold.
      accessCode: m.status === "UNLOCKABLE" ? m.accessCode : null,
      availability: db.availabilityInfo(m),
    }));
  const sold = rows.filter((r: any) => r.status === "UNLOCKABLE");
  const summary = {
    total: rows.length,
    unlockable: sold.length,
    locked: rows.length - sold.length,
    totalViews: rows.reduce((acc: number, r: any) => acc + r.views, 0),
    unitPriceEur: fac.unitPriceEur,
    billableCount: sold.length,
    billableTotalEur: +(sold.length * fac.unitPriceEur).toFixed(2),
  };
  return core.json(200, { facility: core.facilityPublic(fac), matches: rows, summary });
}
