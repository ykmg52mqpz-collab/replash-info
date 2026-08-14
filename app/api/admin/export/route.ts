/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";
import { toCsv } from "@/server/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSV export of all live matches (brief §07).
export async function GET(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const facMap = Object.fromEntries(data.facilities.map((f: any) => [f.id, f]));
  const rows = data.matches
    .filter((m: any) => !db.isExpired(m))
    .map((m: any) => [
      m.code,
      facMap[m.facilityId] ? facMap[m.facilityId].name : m.facilityId,
      m.court,
      m.date,
      m.timeSlot,
      m.status,
      m.soldAt || "",
      m.views,
      m.status === "UNLOCKABLE" ? "billable" : "not-billable",
    ]);
  const csv = toCsv(
    ["Match ID", "Facility", "Court", "Date", "Time Slot", "Status", "Sold At", "Views", "Billing"],
    rows
  );
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="replash-matches.csv"',
      "Cache-Control": "no-store",
    },
  });
}
