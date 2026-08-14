#!/usr/bin/env node
'use strict';

/**
 * Simulates the external video provider (Müjdat's system) calling Replash's
 * webhooks — signs the body with the shared secret and POSTs it. Lets you test
 * the whole integration without the real provider.
 *
 *   node tools/simulate-mujdat.js recording \
 *     --channel milano-padel-club-campo-1 --date 2026-08-12 --slot "18:00–19:00" \
 *     --url "https://cdn.example.com/rec/demo.mp4" --type mp4
 *
 *   node tools/simulate-mujdat.js status --channel milano-padel-club-campo-1 --status offline
 *
 * Secret: REPLASH_WEBHOOK_SECRET env, else db/.webhook-secret.
 */

const crypto = require('crypto');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
function secret() {
  if (process.env.REPLASH_WEBHOOK_SECRET) return process.env.REPLASH_WEBHOOK_SECRET;
  return fs.readFileSync(path.join(__dirname, '..', 'db', '.webhook-secret'), 'utf8').trim();
}
function post(server, route, payload) {
  const raw = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', secret()).update(raw, 'utf8').digest('hex');
  const u = new URL(route, server);
  const lib = u.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(u, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(raw), 'x-replash-signature': 'sha256=' + sig },
    }, (res) => { let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => resolve({ status: res.statusCode, body: b })); });
    req.on('error', reject);
    req.write(raw);
    req.end();
  });
}

async function main() {
  const kind = process.argv[2];
  const server = arg('server', 'http://localhost:3000');
  const channel = arg('channel', 'milano-padel-club-campo-1');

  if (kind === 'recording') {
    const payload = {
      event: 'recording.ready',
      channelId: channel,
      date: arg('date'),
      slot: arg('slot'),
      startedAt: arg('startedAt'),
      durationSec: Number(arg('duration', '3600')),
      playbackUrl: arg('url', 'https://cdn.example.com/rec/demo.mp4'),
      playbackType: arg('type', 'mp4'),
      thumbnailUrl: arg('thumb', 'https://placehold.co/1280x720/0e2a24/f6e39c/png?text=Replash'),
      sizeBytes: Number(arg('size', '0')),
      recordingId: arg('recId', 'rec-' + Date.now()),
    };
    const r = await post(server, '/api/hooks/recording', payload);
    console.log(r.status, r.body);
  } else if (kind === 'status') {
    const r = await post(server, '/api/hooks/camera-status', { event: 'camera.status', channelId: channel, status: arg('status', 'online'), at: new Date().toISOString() });
    console.log(r.status, r.body);
  } else {
    console.error('Usage: node tools/simulate-mujdat.js <recording|status> [--channel ...] [...]');
    process.exit(1);
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
