/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public camera list — ids/court/name only, never tokens.
export async function GET() {
  const data = db.load();
  const cameras = (data.cameras || [])
    .filter((c: any) => c.active !== false)
    .map((c: any) => ({ id: c.id, facilityId: c.facilityId, court: c.court, name: c.name }));
  return core.json(200, { cameras });
}
