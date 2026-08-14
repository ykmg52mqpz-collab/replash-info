#!/usr/bin/env node
'use strict';

/**
 * Replash Edge Agent — records one match slot from a camera and uploads it
 * to the platform's ingest endpoint. Runs wherever the camera is reachable
 * (a mini-PC / NVR / Raspberry Pi at the facility). Requires ffmpeg on PATH.
 *
 * Zero npm dependencies (Node core + ffmpeg).
 *
 * Examples:
 *   # Real RTSP IP camera, record the 18:00–19:00 slot on Campo 1
 *   node edge/record.js --source "rtsp://user:pass@192.168.1.50:554/stream1" \
 *       --court "Campo 1" --slot "18:00–19:00" --duration 3600
 *
 *   # No camera? Generate a test pattern and push it through the pipeline
 *   node edge/record.js --source test --court "Campo 1" --slot "18:00–19:00" --duration 15
 *
 *   # macOS webcam (device index 0)
 *   node edge/record.js --source webcam --court "Campo 1" --slot "18:00–19:00" --duration 20
 *
 * Config: defaults are read from edge/config.json (copy config.example.json).
 * Any flag overrides the config file.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { out[a.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
  }
  return out;
}

function loadConfig() {
  const p = path.join(__dirname, 'config.json');
  if (fs.existsSync(p)) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return {}; } }
  return {};
}

function today() { return new Date().toISOString().slice(0, 10); }
// The 1-hour slot currently being recorded (start of the current hour).
function currentSlot(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  const h = d.getHours();
  return `${p(h)}:00–${p((h + 1) % 24)}:00`;
}

function ffmpegArgs(source, duration, outFile) {
  // Pitch-only, no audio (-an) per GDPR (brief §08).
  const enc = ['-an', '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', String(duration), '-y', outFile];
  if (source === 'test') {
    return ['-f', 'lavfi', '-i', 'testsrc=size=1280x720:rate=25', ...enc];
  }
  if (source === 'webcam') {
    if (os.platform() === 'darwin') return ['-f', 'avfoundation', '-framerate', '30', '-video_size', '1280x720', '-i', '0', ...enc];
    if (os.platform() === 'linux') return ['-f', 'v4l2', '-framerate', '30', '-video_size', '1280x720', '-i', '/dev/video0', ...enc];
    return ['-f', 'dshow', '-i', 'video=Integrated Camera', ...enc]; // windows (name may vary)
  }
  // Assume RTSP / RTMP / http(s) stream URL
  return ['-rtsp_transport', 'tcp', '-i', source, ...enc];
}

function record(source, duration, outFile) {
  return new Promise((resolve, reject) => {
    const args = ffmpegArgs(source, duration, outFile);
    console.log('  ffmpeg', args.join(' '));
    const ff = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
    ff.on('error', (e) => reject(new Error('ffmpeg not found on PATH? ' + e.message)));
    ff.on('close', (code) => (code === 0 || fs.existsSync(outFile) ? resolve() : reject(new Error('ffmpeg exit ' + code))));
  });
}

function upload(serverUrl, headers, file) {
  return new Promise((resolve, reject) => {
    const u = new URL('/api/ingest', serverUrl);
    const lib = u.protocol === 'https:' ? https : http;
    const stat = fs.statSync(file);
    const req = lib.request(
      u,
      { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/octet-stream', 'Content-Length': stat.size }, headers) },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
          catch (e) { resolve({ status: res.statusCode, data: body }); }
        });
      }
    );
    req.on('error', reject);
    fs.createReadStream(file).pipe(req);
  });
}

async function main() {
  const cfg = loadConfig();
  const args = parseArgs(process.argv);
  const source = args.source || cfg.source || 'test';
  const duration = Number(args.duration || cfg.duration || 3600);
  const server = args.server || cfg.server || 'http://localhost:4173';
  const cameraId = args.camera || cfg.cameraId;
  const cameraToken = args.token || cfg.cameraToken;
  // The camera is bound to a court, so court/facility aren't passed. The slot is
  // the one being recorded now (auto), unless explicitly overridden.
  const slot = args.slot || currentSlot();
  const date = args.date || today();

  if (!cameraId || !cameraToken) {
    console.error('Missing required: --camera <cameraId> --token <cameraToken>');
    console.error('(or set cameraId / cameraToken in edge/config.json)');
    process.exit(1);
  }

  const outFile = path.join(os.tmpdir(), `replash-${Date.now()}.mp4`);
  console.log(`\n  Recording ${source} → camera ${cameraId} @ ${slot} (${duration}s)`);
  await record(source, duration, outFile);
  const size = fs.statSync(outFile).size;
  console.log(`  Recorded ${(size / 1024 / 1024).toFixed(1)} MB → uploading to ${server}`);

  const r = await upload(server, {
    'x-camera-id': cameraId,
    'x-camera-token': cameraToken,
    'x-date': date,
    'x-slot': encodeURIComponent(slot),
    'x-duration': String(duration),
    'x-ext': 'mp4',
    'x-source': 'edge:' + source,
  }, outFile);

  fs.unlink(outFile, () => {});
  console.log('  Server:', JSON.stringify(r.data));
  if (r.status !== 200) process.exit(2);
  console.log('\n  Done. The match is LOCKED — the facility unlocks it after payment (which reveals the access code); the player then watches it with that code.\n');
}

main().catch((e) => { console.error('  Error:', e.message); process.exit(1); });
