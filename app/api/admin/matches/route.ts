/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const facMap = Object.fromEntries(data.facilities.map((f: any) => [f.id, f]));
  const q = new URL(request.url).searchParams;
  const fStatus = q.get("status");
  const fFacility = q.get("facilityId");
  const fFrom = q.get("from");
  const fTo = q.get("to");
  const fSearch = (q.get("q") || "").trim().toUpperCase();

  let rows = data.matches.filter((m: any) => !db.isExpired(m));
  if (fStatus) rows = rows.filter((m: any) => m.status === fStatus);
  if (fFacility) rows = rows.filter((m: any) => m.facilityId === fFacility);
  if (fFrom) rows = rows.filter((m: any) => m.date >= fFrom);
  if (fTo) rows = rows.filter((m: any) => m.date <= fTo);
  if (fSearch) rows = rows.filter((m: any) => m.code.toUpperCase().includes(fSearch));

  rows = rows
    .sort((a: any, b: any) => (a.recordedAt < b.recordedAt ? 1 : -1))
    .map((m: any) => ({
      id: m.id,
      code: m.code,
      facilityId: m.facilityId,
      facilityName: facMap[m.facilityId] ? facMap[m.facilityId].name : m.facilityId,
      court: m.court,
      date: m.date,
      timeSlot: m.timeSlot,
      status: m.status,
      soldAt: m.soldAt,
      views: m.views,
      billable: m.status === "UNLOCKABLE",
    }));

  return core.json(200, { matches: rows });
}
