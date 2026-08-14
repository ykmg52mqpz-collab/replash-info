'use strict';

/**
 * Pluggable media storage.
 *
 *   STORAGE=local  (default) → files under ./media  (dev / single node)
 *   STORAGE=s3              → any S3-compatible EU bucket (AWS eu-south-1 Milano,
 *                            Scaleway fr-par, OVH, Cloudflare R2, MinIO…)
 *
 * The S3 driver speaks the S3 REST API directly with AWS Signature V4 signing
 * implemented on Node's crypto — no SDK, no npm dependencies. Uploads stream
 * with `x-amz-content-sha256: UNSIGNED-PAYLOAD` (safe over HTTPS), and playback
 * is served by 302-redirecting the viewer to a short-lived **presigned** URL so
 * bytes flow straight from the bucket/CDN (native Range support), never through
 * the app server.
 *
 * Env for s3:
 *   S3_ENDPOINT        e.g. https://s3.eu-south-1.amazonaws.com
 *                           https://s3.fr-par.scw.cloud
 *                           https://<accountid>.r2.cloudflarestorage.com
 *   S3_REGION          e.g. eu-south-1 | fr-par | auto (R2)
 *   S3_BUCKET          bucket name
 *   S3_ACCESS_KEY / S3_SECRET_KEY
 *   S3_FORCE_PATH_STYLE  "true" for R2 / Scaleway / MinIO, "false" for AWS
 */

const crypto = require('crypto');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

/* ----------------------------- SigV4 core ----------------------------- */

function sha256hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}
function signingKey(secret, date, region, service) {
  return hmac(hmac(hmac(hmac('AWS4' + secret, date), region), service), 'aws4_request');
}
// AWS-flavoured percent-encoding (RFC 3986, optionally keeping '/').
function uriEncode(str, keepSlash) {
  const bytes = Buffer.from(String(str), 'utf8');
  let out = '';
  for (const b of bytes) {
    const c = String.fromCharCode(b);
    if (/[A-Za-z0-9_.~-]/.test(c)) out += c;
    else if (c === '/' && keepSlash) out += '/';
    else out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
  }
  return out;
}
function amzDates(d = new Date()) {
  const iso = d.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const amzdate = iso.slice(0, 15) + 'Z'; // YYYYMMDDTHHMMSSZ
  return { amzdate, datestamp: amzdate.slice(0, 8) };
}

/* --------------------------- S3 config/model -------------------------- */

function s3cfg() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || 'us-east-1';
  const bucket = process.env.S3_BUCKET;
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;
  const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE || 'false') === 'true';
  if (!endpoint || !bucket || !accessKey || !secretKey) {
    throw new Error('S3 storage selected but S3_ENDPOINT/S3_BUCKET/S3_ACCESS_KEY/S3_SECRET_KEY are not all set');
  }
  return { endpoint, region, bucket, accessKey, secretKey, forcePathStyle, service: 's3' };
}

// Resolve { host, canonicalUri, href } for a given object key.
function resolveTarget(cfg, key) {
  const ep = new URL(cfg.endpoint);
  const encKey = uriEncode(key, true);
  if (cfg.forcePathStyle) {
    const host = ep.host;
    const canonicalUri = `/${cfg.bucket}/${encKey}`;
    return { host, canonicalUri, protocol: ep.protocol };
  }
  const host = `${cfg.bucket}.${ep.host}`;
  const canonicalUri = `/${encKey}`;
  return { host, canonicalUri, protocol: ep.protocol };
}

/**
 * Build a presigned GET URL (query-string auth). Exposed for tests too.
 */
function presignGet(cfg, key, expiresSec, when) {
  const { host, canonicalUri, protocol } = resolveTarget(cfg, key);
  const { amzdate, datestamp } = amzDates(when || new Date());
  const scope = `${datestamp}/${cfg.region}/${cfg.service}/aws4_request`;
  const params = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${cfg.accessKey}/${scope}`,
    'X-Amz-Date': amzdate,
    'X-Amz-Expires': String(expiresSec),
    'X-Amz-SignedHeaders': 'host',
  };
  const canonicalQuery = Object.keys(params)
    .sort()
    .map((k) => `${uriEncode(k, false)}=${uriEncode(params[k], false)}`)
    .join('&');
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = ['GET', canonicalUri, canonicalQuery, canonicalHeaders, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const stringToSign = ['AWS4-HMAC-SHA256', amzdate, scope, sha256hex(canonicalRequest)].join('\n');
  const sig = crypto.createHmac('sha256', signingKey(cfg.secretKey, datestamp, cfg.region, cfg.service)).update(stringToSign).digest('hex');
  return `${protocol}//${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${sig}`;
}

// Signed header-auth request (PUT/DELETE/GET) with UNSIGNED-PAYLOAD body.
function signedRequest(cfg, method, key, { body, size, contentType, query } = {}) {
  const { host, canonicalUri, protocol } = resolveTarget(cfg, key);
  const { amzdate, datestamp } = amzDates();
  const scope = `${datestamp}/${cfg.region}/${cfg.service}/aws4_request`;
  const payloadHash = 'UNSIGNED-PAYLOAD';
  const q = query || {};
  const canonicalQuery = Object.keys(q)
    .sort()
    .map((k) => `${uriEncode(k, false)}=${uriEncode(q[k], false)}`)
    .join('&');
  const headers = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzdate,
  };
  if (contentType) headers['content-type'] = contentType;
  if (size != null) headers['content-length'] = String(size);
  const signedHeaderNames = Object.keys(headers).map((h) => h.toLowerCase()).sort();
  const canonicalHeaders = signedHeaderNames.map((h) => `${h}:${String(headers[h]).trim()}`).join('\n') + '\n';
  const signedHeaders = signedHeaderNames.join(';');
  const canonicalRequest = [method, canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const stringToSign = ['AWS4-HMAC-SHA256', amzdate, scope, sha256hex(canonicalRequest)].join('\n');
  const sig = crypto.createHmac('sha256', signingKey(cfg.secretKey, datestamp, cfg.region, cfg.service)).update(stringToSign).digest('hex');
  headers['Authorization'] =
    `AWS4-HMAC-SHA256 Credential=${cfg.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${sig}`;

  const lib = protocol === 'https:' ? https : http;
  const url = `${protocol}//${host}${canonicalUri}${canonicalQuery ? '?' + canonicalQuery : ''}`;
  return { lib, url, headers, method, body };
}

function doRequest({ lib, url, headers, method, body }) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = lib.request(u, { method, headers }, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body && typeof body.pipe === 'function') body.pipe(req);
    else { if (body) req.write(body); req.end(); }
  });
}

/* ------------------------------- Drivers ------------------------------ */

const LOCAL_DIR = path.join(process.cwd(), 'media');

const localDriver = {
  kind: 'local',
  ensure() { if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true }); },
  putStream(key, stream) {
    this.ensure();
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(path.join(LOCAL_DIR, path.basename(key)));
      let size = 0;
      stream.on('data', (c) => (size += c.length));
      stream.on('error', reject);
      ws.on('error', reject);
      ws.on('finish', () => resolve({ size }));
      stream.pipe(ws);
    });
  },
  async delete(key) { try { fs.unlinkSync(path.join(LOCAL_DIR, path.basename(key))); } catch (e) {} },
  async list() {
    this.ensure();
    return fs.readdirSync(LOCAL_DIR).filter((f) => !f.startsWith('.'));
  },
  localPath(key) { return path.join(LOCAL_DIR, path.basename(key)); },
};

function s3Driver() {
  const cfg = s3cfg();
  return {
    kind: 's3',
    cfg,
    ensure() {},
    async putStream(key, stream, { size, contentType } = {}) {
      const r = await doRequest(signedRequest(cfg, 'PUT', key, { body: stream, size, contentType }));
      if (r.status >= 300) throw new Error('s3 put failed ' + r.status + ' ' + r.body.slice(0, 200));
      return { size };
    },
    async delete(key) {
      await doRequest(signedRequest(cfg, 'DELETE', key));
    },
    async list(prefix = '') {
      const r = await doRequest(signedRequest(cfg, 'GET', '', { query: { 'list-type': '2', prefix } }));
      const keys = [];
      const re = /<Key>([^<]+)<\/Key>/g;
      let m;
      while ((m = re.exec(r.body))) keys.push(m[1]);
      return keys;
    },
    presignGet(key, expiresSec = 120) { return presignGet(cfg, key, expiresSec); },
  };
}

let _driver = null;
function driver() {
  if (_driver) return _driver;
  _driver = String(process.env.STORAGE || 'local') === 's3' ? s3Driver() : localDriver;
  return _driver;
}

module.exports = {
  driver,
  // exported for unit tests:
  _internal: { presignGet, resolveTarget, signingKey, uriEncode, sha256hex },
};
