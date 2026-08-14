/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { Readable } from "stream";
import db from "@/server/db";
import media from "@/server/media";
import storage from "@/server/storage";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Signed, range-enabled streaming of a recording (brief §08: unguessable,
 * expiring links). Origins resolved server-side: external provider URL (302),
 * S3 presigned URL (302), or local file (206 partial content).
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const url = new URL(request.url);
  if (!media.verifyToken(id, url.searchParams.get("t"))) {
    return core.json(403, { error: "invalid_or_expired_token" });
  }
  const data = db.load();
  const m = data.matches.find((x: any) => x.id === id);
  const hasSource = m && (m.externalUrl || m.videoFile);
  if (!m || !hasSource || m.status !== "UNLOCKABLE" || db.isExpired(m)) {
    return core.json(404, { error: "not_available" });
  }
  if (!db.availabilityInfo(m).available) return core.json(404, { error: "not_available" });
  core.logAccess({ event: "video_stream", matchId: id, origin: m.externalUrl ? "external" : m.storage || "local" });

  // External provider (video vendor): redirect to their playback URL.
  if (m.externalUrl) {
    return new Response(null, { status: 302, headers: { Location: m.externalUrl, "Cache-Control": "no-store" } });
  }
  // S3-compatible bucket: redirect to a short-lived presigned URL.
  const drv = storage.driver();
  if (drv.kind === "s3") {
    return new Response(null, { status: 302, headers: { Location: drv.presignGet(m.videoFile, 120), "Cache-Control": "no-store" } });
  }
  // Local file: honour Range for <video> seeking.
  const full = media.mediaPath(m.videoFile);
  let stat: fs.Stats;
  try {
    stat = fs.statSync(full);
  } catch {
    return core.json(404, { error: "not_available" });
  }
  const size = stat.size;
  const type = media.contentType(full);
  const range = request.headers.get("range");
  if (!range) {
    const stream = Readable.toWeb(fs.createReadStream(full)) as unknown as ReadableStream;
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, no-store",
      },
    });
  }
  const mm = /bytes=(\d*)-(\d*)/.exec(range);
  let start = mm && mm[1] ? parseInt(mm[1], 10) : 0;
  let end = mm && mm[2] ? parseInt(mm[2], 10) : size - 1;
  if (isNaN(start) || start < 0) start = 0;
  if (isNaN(end) || end >= size) end = size - 1;
  if (start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  const stream = Readable.toWeb(fs.createReadStream(full, { start, end })) as unknown as ReadableStream;
  return new Response(stream, {
    status: 206,
    headers: {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(end - start + 1),
      "Cache-Control": "private, no-store",
    },
  });
}
