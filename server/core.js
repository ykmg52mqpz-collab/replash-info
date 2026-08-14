'use strict';

/**
 * Shared API core for the Next.js route handlers — ported from the standalone
 * platform server. Pure functions + small file-backed state (rate limit,
 * access log) so every separately-bundled route sees the same data.
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');
const media = require('./media');
const storage = require('./storage');
const auth = require('./auth');

/* ---------- JSON response helper ---------- */
function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/* ---------- Rate limiting (brief §08): protect find/watch ---------- */
const RL_FILE = path.join(process.cwd(), 'db', '.ratelimit.json');
const RL_WINDOW_MS = 60 * 1000;
const RL_MAX = 12;

function rateLimited(ip) {
  let all = {};
  try { all = JSON.parse(fs.readFileSync(RL_FILE, 'utf8')); } catch (e) {}
  const now = Date.now();
  const rec = all[ip];
  if (!rec || now - rec.windowStart > RL_WINDOW_MS) {
    all[ip] = { count: 1, windowStart: now };
  } else {
    rec.count += 1;
  }
  // prune old windows
  for (const [k, v] of Object.entries(all)) {
    if (now - v.windowStart > RL_WINDOW_MS * 5) delete all[k];
  }
  try { fs.writeFileSync(RL_FILE, JSON.stringify(all)); } catch (e) {}
  return all[ip].count > RL_MAX;
}

function clientIp(request) {
  return (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
}

/* ---------- Access log (brief §08): JSONL append ---------- */
const LOG_FILE = path.join(process.cwd(), 'db', 'access.log');
function logAccess(entry) {
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify({ at: db.nowIso(), ...entry }) + '\n');
  } catch (e) {}
}

/* ---------- Domain helpers ---------- */
function facilityPublic(f) {
  return { id: f.id, name: f.name, city: f.city, sport: f.sport, courts: f.courts };
}

function deriveSlot(d) {
  const p = (n) => String(n).padStart(2, '0');
  const hh = d.getHours();
  return `${p(hh)}:00–${p((hh + 1) % 24)}:00`;
}

function matchCodeFrom(date, slot) {
  const start = String(slot).split('–')[0].split('-')[0].trim();
  return 'MATCH-' + String(date).replace(/-/g, '') + '-' + start.replace(':', '');
}

/** Role guard: returns the session or null (caller sends 401). */
function requireRole(request, role) {
  const s = auth.getSession(auth.bearer(request));
  return s && s.role === role ? s : null;
}

/**
 * Shape a match for a player. Gates on the processing-availability window;
 * once available it carries the short-lived signed stream URL.
 */
function presentMatch(match, data) {
  const fac = data.facilities.find((f) => f.id === match.facilityId);
  const avail = db.availabilityInfo(match);
  const base = {
    id: match.id,
    code: match.code,
    facilityName: fac ? fac.name : '',
    court: match.court,
    date: match.date,
    timeSlot: match.timeSlot,
    sport: match.sport,
    availability: avail,
  };
  if (!avail.available) return { processing: true, match: base };
  const hasVideo = !!match.externalUrl ||
    (match.videoFile && (storage.driver().kind === 's3' ? true : fs.existsSync(media.mediaPath(match.videoFile))));
  base.videoUrl = hasVideo ? `/api/video/${match.id}?t=${encodeURIComponent(media.signToken(match.id))}` : null;
  base.playbackType = match.playbackType || (match.externalUrl && /\.m3u8(\?|$)/.test(match.externalUrl) ? 'hls' : 'mp4');
  base.thumbnailUrl = match.thumbnailUrl || null;
  base.retention = db.retentionInfo(match);
  return { processing: false, match: base };
}

module.exports = {
  json,
  rateLimited,
  clientIp,
  logAccess,
  facilityPublic,
  deriveSlot,
  matchCodeFrom,
  requireRole,
  presentMatch,
};
