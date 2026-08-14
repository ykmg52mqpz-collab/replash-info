'use strict';

/**
 * Seeds db/data.json with a realistic Replash dataset:
 *   - Facilities (padel + football) with per-facility 6-digit PIN + unit price
 *   - Cameras: one per court, each bound to facility+court with its own token
 *   - Matches: one per camera per slot (auto-recorded), with an access code,
 *     availability time, and LOCKED / UNLOCKABLE status
 *   - A platform admin (email + password)
 *
 * Run: npm run seed        (won't overwrite an existing db)
 *      npm run reset       (force re-seed)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { genAccessCode, PROCESSING_MINUTES } = require('../server/db');

const DATA_FILE = path.join(__dirname, 'data.json');
const FORCE = process.argv.includes('--force');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}
function rid(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
}
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function dayAt(offsetDays, hhmm) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const [h, m] = hhmm.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}
function ymd(date) { return date.toISOString().slice(0, 10); }
function matchCode(date, hhmm) { return `MATCH-${ymd(date).replace(/-/g, '')}-${hhmm.replace(':', '')}`; }

const facilities = [
  { id: 'fac-milano-padel', name: 'Milano Padel Club', city: 'Milano', sport: 'padel', courts: ['Campo 1', 'Campo 2', 'Campo 3'], pin: '482913', unitPriceEur: 6.0 },
  { id: 'fac-navigli-calcio', name: 'Navigli Calcio Center', city: 'Milano', sport: 'football', courts: ['Campo A', 'Campo B'], pin: '739104', unitPriceEur: 8.0 },
  { id: 'fac-roma-padel', name: 'Roma Padel Arena', city: 'Roma', sport: 'padel', courts: ['Pista 1', 'Pista 2'], pin: '150726', unitPriceEur: 7.0 },
  { id: 'fac-torino-sport', name: 'Torino Sport Village', city: 'Torino', sport: 'football', courts: ['Campo Nord', 'Campo Sud'], pin: '901284', unitPriceEur: 7.5 },
];

// One camera per court, bound to facility+court.
function buildCameras() {
  const cams = [];
  for (const f of facilities) {
    for (const court of f.courts) {
      cams.push({
        id: `cam-${slug(f.name)}-${slug(court)}`,
        facilityId: f.id,
        court,
        name: `${f.name} · ${court}`,
        token: 'camk_' + crypto.randomBytes(10).toString('hex'),
        // The provider's channel identifier — how their recording/status
        // webhooks reference this camera. Defaults to a readable slug.
        channelId: `${slug(f.name)}-${slug(court)}`,
        status: 'online',
        lastSeenAt: new Date().toISOString(),
        active: true,
        createdAt: new Date().toISOString(),
      });
    }
  }
  return cams;
}

const TIME_SLOTS = ['17:00–18:00', '18:00–19:00', '19:00–20:00', '20:00–21:00', '21:00–22:00'];
function slotStart(slot) { return slot.split('–')[0]; }

function buildMatches(cameras) {
  const matches = [];
  let seed = 0;
  const rand = () => { seed += 1; return (Math.sin(seed * 12.9898) * 43758.5453) % 1; };

  for (const cam of cameras) {
    const fac = facilities.find((f) => f.id === cam.facilityId);
    // Auto-recorded slots over the last 6 days (within retention).
    for (let offset = 0; offset <= 6; offset++) {
      for (const slot of TIME_SLOTS) {
        // Not every slot is booked/recorded: ~60% have a recording.
        if (Math.abs(rand()) > 0.6) continue;
        const date = dayAt(offset, slotStart(slot));
        const recordedAt = new Date(date.getTime() + 60 * 60 * 1000); // end of the 1-hour slot
        const sold = Math.abs(rand()) < 0.55; // ~55% paid → UNLOCKABLE
        const status = sold ? 'UNLOCKABLE' : 'LOCKED';
        const soldAt = sold ? new Date(recordedAt.getTime() + (10 + Math.floor(Math.abs(rand()) * 40)) * 60000).toISOString() : null;
        const views = sold ? Math.floor(Math.abs(rand()) * 9) : 0;
        matches.push({
          id: rid('m'),
          code: matchCode(date, slotStart(slot)),
          accessCode: genAccessCode(),
          cameraId: cam.id,
          facilityId: cam.facilityId,
          court: cam.court,
          date: ymd(date),
          timeSlot: slot,
          status,
          recordedAt: recordedAt.toISOString(),
          availableAt: new Date(recordedAt.getTime() + PROCESSING_MINUTES * 60000).toISOString(),
          durationSec: 3600,
          soldAt,
          views,
          viewerSessions: [],
          billable: sold,
          sport: fac.sport,
          source: 'camera',
        });
      }
    }
  }
  return matches;
}

function build() {
  const cameras = buildCameras();
  return {
    meta: { seededAt: new Date().toISOString(), currency: 'EUR', retentionDays: 7, processingMinutes: PROCESSING_MINUTES },
    admins: [{ id: 'admin-root', email: 'admin@replash.info', name: 'Replash Admin', passwordHash: hashPassword('replash2025') }],
    facilities,
    cameras,
    matches: buildMatches(cameras),
    refunds: [],
    leads: [],
  };
}

if (fs.existsSync(DATA_FILE) && !FORCE) {
  console.log('data.json already exists. Use `npm run reset` to force re-seed.');
  process.exit(0);
}

const db = build();
fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log(`Seeded ${db.facilities.length} facilities, ${db.cameras.length} cameras, ${db.matches.length} matches → ${DATA_FILE}`);
console.log('Admin:  admin@replash.info / replash2025');
console.log('Facility PINs:');
for (const f of db.facilities) console.log(`  ${f.name.padEnd(24)} PIN ${f.pin}`);
console.log('Cameras:');
for (const c of db.cameras) console.log(`  ${c.id.padEnd(34)} ${c.token}`);
