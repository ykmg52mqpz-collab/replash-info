/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Count a unique view (session-based dedup; brief §11).
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { matchId, sessionId } = body || {};
  if (!matchId || !sessionId) return core.json(400, { error: "missing_fields" });
  const data = db.load();
  const m = data.matches.find((x: any) => x.id === matchId);
  if (!m || m.status !== "UNLOCKABLE" || db.isExpired(m)) {
    return core.json(404, { error: "not_available" });
  }
  if (!m.viewerSessions.includes(sessionId)) {
    m.viewerSessions.push(sessionId);
    m.views = m.viewerSessions.length;
    db.save(data);
  }
  core.logAccess({ event: "video_view", matchId, sessionId });
  return core.json(200, { views: m.views });
}
