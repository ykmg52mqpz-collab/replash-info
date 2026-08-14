'use strict';

/**
 * Session + password helpers (zero dependencies), Next.js port.
 *
 * Sessions are persisted to db/.sessions.json rather than held in memory:
 * Next bundles each route handler separately, so an in-memory Map would not
 * be shared across routes. A tiny JSON file is shared by all of them.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SESSIONS_FILE = path.join(process.cwd(), 'db', '.sessions.json');

function loadSessions() {
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}
function saveSessions(all) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(all));
  } catch (e) { /* db dir may not exist yet */ }
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 32).toString('hex');
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function createSession(role, subject) {
  const token = crypto.randomBytes(24).toString('hex');
  const all = loadSessions();
  all[token] = { role, subject, createdAt: Date.now(), lastSeen: Date.now() };
  // prune expired while we're here
  const now = Date.now();
  for (const [t, s] of Object.entries(all)) {
    if (now - s.lastSeen > TTL_MS) delete all[t];
  }
  saveSessions(all);
  return token;
}

function getSession(token) {
  if (!token) return null;
  const all = loadSessions();
  const s = all[token];
  if (!s) return null;
  if (Date.now() - s.lastSeen > TTL_MS) {
    delete all[token];
    saveSessions(all);
    return null;
  }
  s.lastSeen = Date.now();
  saveSessions(all);
  return s;
}

function destroySession(token) {
  const all = loadSessions();
  if (all[token]) {
    delete all[token];
    saveSessions(all);
  }
}

/** Extract a Bearer token from a web-standard Request. */
function bearer(request) {
  const h = request.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

module.exports = { verifyPassword, createSession, getSession, destroySession, bearer };
