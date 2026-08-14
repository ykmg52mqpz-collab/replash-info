/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const live = data.matches.filter((m: any) => !db.isExpired(m));
  const unlockable = live.filter((m: any) => m.status === "UNLOCKABLE");
  const byFacility = data.facilities.map((f: any) => {
    const fm = unlockable.filter((m: any) => m.facilityId === f.id);
    return {
      id: f.id,
      name: f.name,
      unitPriceEur: f.unitPriceEur,
      soldCount: fm.length,
      totalEur: +(fm.length * f.unitPriceEur).toFixed(2),
    };
  });
  return core.json(200, {
    total: live.length,
    locked: live.length - unlockable.length,
    unlockable: unlockable.length,
    totalViews: live.reduce((s: number, m: any) => s + m.views, 0),
    billable: unlockable.length,
    revenueEur: +byFacility.reduce((s: number, f: any) => s + f.totalEur, 0).toFixed(2),
    byFacility,
    openRefunds: data.refunds.filter((r: any) => r.status === "open").length,
  });
}
