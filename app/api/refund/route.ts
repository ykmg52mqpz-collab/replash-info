/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Refund / "video problem" request (brief §06 / §07).
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, facilityId, court, date, timeSlot, message } = body || {};
  if (!email || !facilityId || !date) return core.json(400, { error: "missing_fields" });
  const data = db.load();
  const ref = {
    id: "REF-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    email,
    facilityId,
    court: court || null,
    date,
    timeSlot: timeSlot || null,
    message: message || "",
    status: "open",
    createdAt: db.nowIso(),
    approvedAt: null,
  };
  data.refunds.push(ref);
  db.save(data);
  return core.json(200, { ok: true, id: ref.id });
}
