// filepath: /var/www/namaweb/tests/e2e_static_assets.test.js
// E2E — PWA shell + catalog + API docs + icon set on the ERP (port 3000).
//
// What this suite covers:
//   - /sw.js                          : valid JS, declares a cache name, registers install + fetch
//   - /api/v1/pcc-catalog/modules     : 200, returns >= 789 modules
//   - /pcc-catalog/                   : 200 HTML with a search input
//   - /api-docs/                      : 200 HTML with a version element
//   - 8 PWA icons /img/logo-{72,96,128,144,152,192,384,512}.png all 200
//
// Failures clearly identify which asset is broken.
//
// Run:
//   BASE_URL=http://127.0.0.1:3000 node --test tests/e2e_static_assets.test.js

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const TIMEOUT_MS = 5000;
const EXPECTED_MIN_CATALOG_COUNT = 789;
const PWA_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function get(path, base = BASE_URL) {
  const url = `${base.replace(/\/+$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  let json = null;
  if ((res.headers.get('content-type') || '').includes('application/json')) {
    try { json = JSON.parse(text); } catch { /* leave null */ }
  }
  return { status: res.status, headers: res.headers, text, json, url };
}

test('/sw.js returns valid JS with cache name, install, fetch events', async () => {
  const res = await get('/sw.js');
  assert.equal(res.status, 200,
    `GET /sw.js expected 200, got ${res.status}; body head: ${res.text.slice(0, 200)}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('javascript') || ct.includes('text/'),
    `/sw.js expected a JS content-type, got "${ct}"`);

  // Must declare a cache name (CACHE_NAME or CACHE_VERSION identifier pattern)
  assert.ok(
    /CACHE_(?:NAME|VERSION)\s*=/.test(res.text) || /const\s+CACHE\s*=\s*['"]/.test(res.text),
    '/sw.js must declare a cache name (CACHE_NAME = ... or CACHE_VERSION = "..." or const CACHE = "...")',
  );

  // Must register both 'install' and 'fetch' event listeners
  assert.ok(/addEventListener\(\s*['"]install['"]/.test(res.text),
    "/sw.js must register an 'install' event listener (addEventListener('install', ...))");
  assert.ok(/addEventListener\(\s*['"]fetch['"]/.test(res.text),
    "/sw.js must register a 'fetch' event listener (addEventListener('fetch', ...))");

  // Must reference self (a service worker contract)
  assert.ok(/\bself\b/.test(res.text),
    '/sw.js must reference the `self` global (service-worker contract)');
});

test('/api/v1/pcc-catalog/modules count >= 789', async () => {
  const res = await get('/api/v1/pcc-catalog/modules');
  assert.equal(res.status, 200,
    `GET /api/v1/pcc-catalog/modules expected 200, got ${res.status}; body head: ${res.text.slice(0, 200)}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('application/json') || ct.includes('text/json'),
    `/api/v1/pcc-catalog/modules expected JSON content-type, got "${ct}"`);
  assert.ok(res.json, '/api/v1/pcc-catalog/modules must return a parseable JSON body');
  const arr = Array.isArray(res.json) ? res.json
    : Array.isArray(res.json.modules) ? res.json.modules
    : Array.isArray(res.json.data) ? res.json.data
    : null;
  assert.ok(arr, '/api/v1/pcc-catalog/modules JSON must have a modules[] array');
  assert.ok(arr.length >= EXPECTED_MIN_CATALOG_COUNT,
    `expected >= ${EXPECTED_MIN_CATALOG_COUNT} modules, got ${arr.length}`);
});

test('/pcc-catalog/ returns HTML with a search input', async () => {
  const res = await get('/pcc-catalog/');
  assert.equal(res.status, 200,
    `GET /pcc-catalog/ expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('text/html'),
    `/pcc-catalog/ expected text/html, got "${ct}"`);
  // Must include an <input ...> element (search box)
  assert.ok(/<input\b[^>]*>/i.test(res.text),
    '/pcc-catalog/ must include at least one <input> element');
  // Heuristic: a search-ish input (id, name, type, or placeholder containing search/q/ابحث)
  const hasSearchish = /<input\b[^>]*(?=(?:id|name|type|placeholder)\s*=\s*["'][^"']*(?:search|q|ابحث|بحث))/i.test(res.text);
  assert.ok(hasSearchish,
    '/pcc-catalog/ must include a search input (id/name/type/placeholder mentions search / q / بحث)');
});

test('/api-docs/ returns HTML with a version element', async () => {
  const res = await get('/api-docs/');
  assert.equal(res.status, 200,
    `GET /api-docs/ expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('text/html'),
    `/api-docs/ expected text/html, got "${ct}"`);
  // Match either a SemVer-ish string (vN.N.N or N.N.N) OR a swagger-ui reference
  const hasVersion = /\bv?\d+\.\d+\.\d+\b/.test(res.text)
    || /swagger-?ui/i.test(res.text)
    || /openapi/i.test(res.text);
  assert.ok(hasVersion,
    '/api-docs/ must include a version element (vN.N.N, swagger-ui, or openapi marker)');
  // Must include at least one <html> tag
  assert.ok(/<html\b/i.test(res.text),
    '/api-docs/ must include an <html> tag');
});

for (const size of PWA_ICON_SIZES) {
  test(`/img/logo-${size}.png responds 200`, async () => {
    const res = await get(`/img/logo-${size}.png`);
    assert.equal(res.status, 200,
      `GET /img/logo-${size}.png expected 200, got ${res.status}; body head: ${res.text.slice(0, 60)}`);
    const ct = res.headers.get('content-type') || '';
    assert.ok(ct.startsWith('image/'),
      `/img/logo-${size}.png expected image/* content-type, got "${ct}"`);
    // An empty 200 (0 bytes) is a broken asset
    assert.ok(res.text.length > 0,
      `/img/logo-${size}.png returned 200 with empty body`);
  });
}
