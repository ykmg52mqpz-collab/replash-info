/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = db.load();
  return core.json(200, { facilities: data.facilities.map(core.facilityPublic) });
}
