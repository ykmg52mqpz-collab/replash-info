'use strict';

/**
 * File-based JSON data store for the Replash platform (Next.js port).
 * Zero external dependencies. All state lives in db/data.json at the repo root.
 *
 * Read the whole file, mutate in memory, write back atomically. For a
 * single-node deployment (`next start` on a VM) this is robust and simple.
 * Swap for a real DB later without touching the route handlers' shapes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(process.cwd(), 'db', 'data.json');

/** Video retention window (brief §08 / delta #7): 7 days, then auto-deleted. */
const RETENTION_DAYS = 7;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Post-match processing delay: after a slot is recorded the video needs time
 * to be ingested/processed before players can watch it. Configurable via
 * PROCESSING_MINUTES (default 10). availableAt = recordedAt + this.
 */
const PROCESSING_MINUTES = Number(
  process.env.PROCESSING_MINUTES != null ? process.env.PROCESSING_MINUTES : 10
);

// Access-code alphabet: no ambiguous chars (0/O/1/I). 8 chars ≈ 40 bits.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genAccessCode() {
  const bytes = crypto.randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) s += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return s.slice(0, 4) + '-' + s.slice(4); // e.g. K7PQ-9RMX
}
function normalizeCode(code) {
  return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function nowIso() {
  return new Date().toISOString();
}

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    return { facilities: [], cameras: [], matches: [], refunds: [], leads: [], admins: [], meta: {} };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function save(db) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function isExpired(match, at = Date.now()) {
  const recorded = new Date(match.recordedAt).getTime();
  return at - recorded > RETENTION_MS;
}

function retentionInfo(match, at = Date.now()) {
  const recorded = new Date(match.recordedAt).getTime();
  const deleteAt = recorded + RETENTION_MS;
  const msLeft = deleteAt - at;
  return {
    expired: msLeft <= 0,
    deleteAt: new Date(deleteAt).toISOString(),
    daysLeft: Math.max(0, msLeft / (24 * 60 * 60 * 1000)),
  };
}

/** Availability: when does/did the recording become watchable? */
function availabilityInfo(match, at = Date.now()) {
  const avail = match.availableAt
    ? new Date(match.availableAt).getTime()
    : new Date(match.recordedAt).getTime() + PROCESSING_MINUTES * 60 * 1000;
  const msLeft = avail - at;
  return {
    available: msLeft <= 0,
    availableAt: new Date(avail).toISOString(),
    minutesLeft: Math.max(0, Math.ceil(msLeft / 60000)),
  };
}

module.exports = {
  DATA_FILE,
  RETENTION_DAYS,
  RETENTION_MS,
  PROCESSING_MINUTES,
  nowIso,
  load,
  save,
  isExpired,
  retentionInfo,
  availabilityInfo,
  genAccessCode,
  normalizeCode,
};
