/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import auth from "@/server/auth";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const pin = String((body && body.pin) || "").trim();
  const data = db.load();
  const fac = data.facilities.find((f: any) => f.pin === pin);
  if (!/^\d{6}$/.test(pin) || !fac) return core.json(401, { error: "invalid_pin" });
  const token = auth.createSession("panel", fac.id);
  return core.json(200, { token, facility: core.facilityPublic(fac) });
}
