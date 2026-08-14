/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Watch by access code — the primary post-match flow: the facility gives the
 * player the code for their paid match. A wrong code and a LOCKED match are
 * indistinguishable from "not found".
 */
export async function POST(request: Request) {
  const ip = core.clientIp(request);
  if (core.rateLimited(ip)) {
    core.logAccess({ event: "watch_rate_limited", ip });
    return core.json(429, { error: "rate_limited" });
  }
  const body = await request.json().catch(() => ({}));
  const code = db.normalizeCode(body && body.code);
  if (code.length < 6) return core.json(400, { error: "missing_code" });
  const data = db.load();
  const match = data.matches.find(
    (m: any) => db.normalizeCode(m.accessCode) === code && m.status === "UNLOCKABLE" && !db.isExpired(m)
  );
  core.logAccess({ event: "watch_attempt", ip, result: match ? "ok" : "not_found" });
  if (!match) return core.json(200, { found: false });
  const pres = core.presentMatch(match, data);
  return core.json(200, { found: true, processing: pres.processing, match: pres.match });
}
