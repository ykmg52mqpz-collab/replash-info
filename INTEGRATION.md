# Replash ↔ Video Provider — Integration Spec

This document defines the contract between the **external video infrastructure**
(camera → recording → MP4/HLS → storage → playback URL + thumbnail, per-channel
management, online/offline) and the **Replash platform**, which owns the
website, the webhook API, automatic match binding, access control, and the
secure player link.

## Responsibility split

| Video provider | Replash (this platform) |
|---|---|
| Ingest RTMP/RTSP from cameras | Webhook API to receive events |
| Central recording → MP4/HLS | **Auto-match** recordings to the right match slot |
| Per-channel (per-court) management | Camera registry + online/offline display |
| Store videos, mint playback URLs | **Secure user link** + access control (pay-to-unlock, access code) |
| Thumbnails | Player, billing, refunds, i18n site |
| Camera online/offline signal | Retention policy (7 days) |

The provider **pushes two webhooks** to Replash. Replash never pulls from the
provider except by following the playback URL the provider supplies.

## Authentication

Every webhook body is signed with a shared secret (HMAC-SHA256 over the exact
raw request body), sent in the `x-replash-signature` header as `sha256=<hex>`
(bare hex also accepted). Replash rejects unsigned/invalid requests with `401`.

- Secret is shown in the server boot log (`Provider webhook secret → whsec_…`)
  or set via `REPLASH_WEBHOOK_SECRET`.

```
signature = HMAC_SHA256(secret, rawRequestBody)   // hex
header:    x-replash-signature: sha256=<signature>
```

## Channel mapping

Each Replash camera (one per court) has a `channelId` — the provider's identifier
for that camera's stream. Set it when registering the camera (Admin → Cameras) or
use the default slug (e.g. `milano-padel-club-campo-1`). Webhooks reference the
camera by `channelId` (the camera `id` is also accepted).

## 1) `POST /api/hooks/recording` — recording ready

Call this when a slot's recording is processed and **playable**. Replash
auto-creates/updates the matching match (by channel + date + slot), stores the
playback URL + thumbnail, and marks it available immediately (no extra delay —
you fire this only when ready).

Request body:

```json
{
  "event": "recording.ready",
  "channelId": "milano-padel-club-campo-1",
  "date": "2026-08-12",
  "slot": "18:00–19:00",
  "startedAt": "2026-08-12T18:00:00Z",
  "durationSec": 3600,
  "playbackUrl": "https://cdn.provider.com/rec/milano-c1-1800.m3u8",
  "playbackType": "hls",
  "thumbnailUrl": "https://cdn.provider.com/rec/milano-c1-1800.jpg",
  "sizeBytes": 1234567890,
  "recordingId": "provider-rec-abc123"
}
```

- `channelId` (required) — resolves to a Replash camera → its facility + court.
- `slot` **or** `startedAt` (required) — the 1-hour slot. If only `startedAt` is
  sent, Replash derives the slot from its start hour. `date` derived likewise.
- `playbackUrl` (required) — HLS `.m3u8` or MP4. Should stay valid ≥ 7 days, or
  be re-mintable; if the URL itself is short-lived/tokenised, prefer sending a
  fresh one and re-calling this webhook, or expose a signing endpoint (see note).
- `playbackType` — `hls` | `mp4` (auto-detected from the URL if omitted).
- `thumbnailUrl`, `durationSec`, `sizeBytes`, `recordingId` — optional metadata.

Response `200`:

```json
{ "ok": true, "matchId": "m-f121c32ca1", "code": "MATCH-20260812-1800", "status": "LOCKED", "upserted": false }
```

Idempotent per `channel × date × slot`: re-sending updates the same match
(e.g. a re-processed/replaced recording). Errors: `401` bad signature,
`404 unknown_channel`, `400 missing_playbackUrl` / `bad_slot`.

## 2) `POST /api/hooks/camera-status` — online/offline

```json
{ "event": "camera.status", "channelId": "milano-padel-club-campo-1", "status": "offline", "at": "2026-08-12T09:00:00Z" }
```

Updates the camera's status (shown in Admin → Cameras) and `lastSeenAt`.
`recording.ready` also implicitly marks the camera online.

## Playback & the secure user link

Replash never exposes the provider URL to players directly. Flow:

1. Match starts **LOCKED**. After payment, facility staff press **Video sold**
   → **UNLOCKABLE**, which reveals a per-match **access code** (e.g. `AEXF-BFFG`).
2. The player enters that code at `/find` → Replash returns a **secure link**
   `/api/video/:id?t=<signed, expiring token>`.
3. That link enforces access control (sold + available + not expired) and then
   **302-redirects to `playbackUrl`**. The player (`<video>` / hls.js) streams
   from the provider's CDN with native range/seeking.

> Optional hardening: if the provider can mint short-lived signed URLs on demand,
> expose an endpoint and Replash can call it at step 3 instead of redirecting to
> a stored URL — swap the single redirect in `server.js` (`/api/video/:id`).

## Retention

Replash targets 7-day retention. Either the provider deletes recordings after
7 days, or Replash's `playbackUrl` simply stops resolving — Replash also hides
matches older than 7 days regardless.

## Testing without the provider

`tools/simulate-mujdat.js` signs and posts both webhooks:

```bash
# a recording becomes available for a slot
node tools/simulate-mujdat.js recording \
  --channel milano-padel-club-campo-1 --date 2026-08-12 --slot "18:00–19:00" \
  --url "https://cdn.example.com/rec/demo.mp4" --type mp4

# camera goes offline / online
node tools/simulate-mujdat.js status --channel milano-padel-club-campo-1 --status offline
```

Then: `/panel` (PIN `482913`) → **Video sold** → copy the code → `/find` → enter
the code → the provider video plays.
