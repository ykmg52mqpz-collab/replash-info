# Replash Edge Agent

Records one 1-hour match slot from a camera and uploads it to the platform's
`/api/ingest` endpoint. Runs at the facility (mini-PC / NVR / Raspberry Pi),
wherever the camera is reachable on the LAN. **One agent per camera.**

Each camera is **registered against a facility + court** (Admin → Cameras), so
the agent only needs the camera's id + token — the court and facility are known
server-side, and the **slot is auto-derived from the clock**. Nothing is entered
by hand.

## Requirements
- Node.js 18+
- **ffmpeg** on PATH (`brew install ffmpeg` on macOS · `apt install ffmpeg` on Debian/Ubuntu)

## Quick test — no camera required

Push a generated test pattern through the full pipeline (records 15s, uploads):

```bash
node edge/record.js --source test \
  --camera cam-milano-padel-club-campo-1 \
  --token camk_xxxxxxxxxxxxxxxxxxxx \
  --duration 15
```

(The demo `edge/config.json` already has a working camera id + token, so you can
also just run `node edge/record.js --source test --duration 15`.)

Then: the match is **LOCKED** in the facility panel (`/panel`, PIN `482913`).
Staff press **Video sold** → the panel reveals the **access code** → they give it
to the player → the player enters it at **`/find`** and watches (after the short
processing delay).

## Real RTSP IP camera

```bash
node edge/record.js \
  --source "rtsp://user:pass@192.168.1.50:554/stream1" \
  --camera cam-milano-padel-club-campo-1 \
  --token camk_xxxxxxxxxxxxxxxxxxxx \
  --duration 3600
```

Or copy `config.example.json` → `config.json`, fill in the camera id/token +
RTSP URL, and run `node edge/record.js`.

## Automatic operation (one recording per slot)

Cron on the edge device, one line per camera. Fire at the top of each hour to
record the slot that just started:

```cron
0 * * * *  cd /opt/replash && node edge/record.js --duration 3600 >> /var/log/replash-edge.log 2>&1
```

The agent tags the upload with the current slot; the server files it under the
right camera×date×slot (one recording per slot — a re-run replaces it).

## Notes
- Video is H.264, **no audio** (`-an`) — pitch only, per GDPR (brief §08).
- Auth = the camera's device **token**. (The in-browser `/ingest` test page can
  instead use the facility **PIN**.)
- The server stores the file, upserts a **LOCKED** match with a per-match
  **access code**, and applies the processing-availability delay before the
  video is watchable. Retention: 7-day auto-delete.
