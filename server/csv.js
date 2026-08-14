'use strict';

/** Tiny CSV serializer with proper escaping (RFC-4180-ish). */
function escapeCell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(headers, rows) {
  const head = headers.map(escapeCell).join(',');
  const body = rows.map((r) => r.map(escapeCell).join(',')).join('\r\n');
  return head + '\r\n' + body + '\r\n';
}

module.exports = { toCsv };
