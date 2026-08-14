/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-facility unit price (admin sets pricing; brief §06).
export async function POST(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const body = await request.json().catch(() => ({}));
  const data = db.load();
  const fac = data.facilities.find((f: any) => f.id === body.facilityId);
  if (!fac) return core.json(404, { error: "not_found" });
  const price = Number(body.unitPriceEur);
  if (!(price >= 0)) return core.json(400, { error: "invalid_price" });
  fac.unitPriceEur = +price.toFixed(2);
  db.save(data);
  return core.json(200, { ok: true, facilityId: fac.id, unitPriceEur: fac.unitPriceEur });
}
