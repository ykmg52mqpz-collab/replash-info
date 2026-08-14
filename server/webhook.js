'use strict';

/**
 * Webhook signing/verification for the video-infrastructure integration.
 *
 * The external recording provider (e.g. Müjdat's system) signs each webhook
 * body with a shared secret; Replash verifies it before trusting the payload.
 * HMAC-SHA256 over the raw request body (same pattern as Stripe/GitHub).
 *
 * Secret resolution: REPLASH_WEBHOOK_SECRET env, else a random one persisted to
 * db/.webhook-secret (printed on boot so it can be handed to the provider).
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRET_FILE = path.join(process.cwd(), 'db', '.webhook-secret');

function secret() {
  if (process.env.REPLASH_WEBHOOK_SECRET) return process.env.REPLASH_WEBHOOK_SECRET;
  try {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  } catch (e) {
    const s = 'whsec_' + crypto.randomBytes(24).toString('hex');
    try { fs.writeFileSync(SECRET_FILE, s); } catch (_) {}
    return s;
  }
}

function sign(rawBody) {
  return crypto.createHmac('sha256', secret()).update(rawBody, 'utf8').digest('hex');
}

function verify(rawBody, signature) {
  if (!signature) return false;
  // Accept "sha256=<hex>" or bare hex.
  const provided = String(signature).replace(/^sha256=/i, '').trim();
  const expected = sign(rawBody);
  const a = Buffer.from(provided, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { secret, sign, verify };
