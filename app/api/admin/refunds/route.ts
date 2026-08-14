/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const data = db.load();
  const facMap = Object.fromEntries(data.facilities.map((f: any) => [f.id, f]));
  const rows = data.refunds
    .slice()
    .reverse()
    .map((r: any) => ({ ...r, facilityName: facMap[r.facilityId] ? facMap[r.facilityId].name : r.facilityId }));
  return core.json(200, { refunds: rows });
}
