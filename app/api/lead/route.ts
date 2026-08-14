/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// B2B lead: demo request / contact form.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { name, email, facility, city, sport, message, kind } = body || {};
  if (!name || !email) return core.json(400, { error: "missing_fields" });
  const data = db.load();
  const lead = {
    id: "LEAD-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    kind: kind || "demo",
    name,
    email,
    facility: facility || "",
    city: city || "",
    sport: sport || "",
    message: message || "",
    createdAt: db.nowIso(),
  };
  data.leads.push(lead);
  db.save(data);
  return core.json(200, { ok: true, id: lead.id });
}
