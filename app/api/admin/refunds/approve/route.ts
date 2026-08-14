/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Approve refund → free-match credit email (mock body returned). Billing unaffected.
export async function POST(request: Request) {
  if (!core.requireRole(request, "admin")) return core.json(401, { error: "unauthorized" });
  const body = await request.json().catch(() => ({}));
  const data = db.load();
  const ref = data.refunds.find((r: any) => r.id === body.id);
  if (!ref) return core.json(404, { error: "not_found" });
  ref.status = "approved";
  ref.approvedAt = db.nowIso();
  db.save(data);
  return core.json(200, {
    ok: true,
    email: {
      to: ref.email,
      subject: "Replash — Free match credit",
      body:
        "Your video problem was reviewed. Show this email to the facility staff to receive your next match video free of charge. Ref: " +
        ref.id,
    },
  });
}
