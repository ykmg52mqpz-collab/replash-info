'use strict';

/**
 * Media layer for camera ingestion:
 *   - persistent server secret (HMAC signing of stream URLs)
 *   - short-lived signed video tokens (unguessable, expiring — brief §08)
 *   - HTTP Range streaming for <video> seeking
 *   - 7-day retention sweep of ingested files
 *
 * Ingested recordings live in media/<matchId>.<ext>. This directory is the
 * local stand-in for EU object storage (S3/R2) — swap the read/write calls
 * for an SDK to move to the cloud without touching the rest of the app.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEDIA_DIR = path.join(process.cwd(), 'media');
const SECRET_FILE = path.join(process.cwd(), 'db', '.secret');
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function ensureDir() {
  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function secret() {
  if (process.env.REPLASH_SECRET) return process.env.REPLASH_SECRET;
  try {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  } catch (e) {
    const s = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(SECRET_FILE, s);
    return s;
  }
}

/** Sign a stream grant for a match id, valid for ttlMs (default 2h). */
function signToken(matchId, ttlMs = 2 * 60 * 60 * 1000) {
  const exp = Date.now() + ttlMs;
  const sig = crypto.createHmac('sha256', secret()).update(matchId + '.' + exp).digest('base64url');
  return exp + '.' + sig;
}

function verifyToken(matchId, token) {
  if (!token) return false;
  const [expStr, sig] = String(token).split('.');
  const exp = Number(expStr);
  if (!exp || Date.now() > exp || !sig) return false;
  const expected = crypto.createHmac('sha256', secret()).update(matchId + '.' + exp).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const CT = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.m4v': 'video/mp4', '.mov': 'video/quicktime' };

function contentType(file) {
  return CT[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function mediaPath(file) {
  return path.join(MEDIA_DIR, path.basename(file)); // basename guards traversal
}

/** Stream a media file honouring a Range header (206 partial content). */
function streamRange(req, res, file) {
  const full = mediaPath(file);
  let stat;
  try {
    stat = fs.statSync(full);
  } catch (e) {
    res.writeHead(404);
    return res.end('not found');
  }
  const size = stat.size;
  const type = contentType(full);
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-store',
    });
    return fs.createReadStream(full).pipe(res);
  }
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let start = m && m[1] ? parseInt(m[1], 10) : 0;
  let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
  if (isNaN(start) || start < 0) start = 0;
  if (isNaN(end) || end >= size) end = size - 1;
  if (start > end) {
    res.writeHead(416, { 'Content-Range': `bytes */${size}` });
    return res.end();
  }
  res.writeHead(206, {
    'Content-Type': type,
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Cache-Control': 'private, no-store',
  });
  fs.createReadStream(full, { start, end }).pipe(res);
}

/** Delete ingested files whose match is past the 7-day retention window. */
function sweepExpired(matches) {
  ensureDir();
  const now = Date.now();
  let removed = 0;
  const live = new Set();
  for (const m of matches) {
    if (!m.videoFile) continue;
    const age = now - new Date(m.recordedAt).getTime();
    if (age <= RETENTION_MS) live.add(path.basename(m.videoFile));
  }
  for (const f of fs.readdirSync(MEDIA_DIR)) {
    if (f.startsWith('.')) continue;
    if (!live.has(f)) {
      try { fs.unlinkSync(path.join(MEDIA_DIR, f)); removed++; } catch (e) {}
    }
  }
  return removed;
}

module.exports = {
  MEDIA_DIR, ensureDir, mediaPath, contentType,
  signToken, verifyToken, streamRange, sweepExpired,
};
