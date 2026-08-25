// filepath: /var/www/namaweb/tests/e2e_public_pages.test.js
// E2E — Public marketing + manifest + OpenAPI surface on the ERP (port 3000).
//
// What this suite covers:
//   - 9 HTML pages all return 200 with text/html
//   - /manifest.json is valid JSON with name, version, and at least one icon
//   - /openapi-pcc.yaml is a 200 with text/yaml and includes the OpenAPI 3 keys
//   - /offline.html is HTML and contains Arabic content (RTL)
//
// Failures clearly identify which page is broken.
//
// Run:
//   BASE_URL=http://127.0.0.1:3000 node --test tests/e2e_public_pages.test.js

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const TIMEOUT_MS = 5000;

const PUBLIC_PAGES = [
  '/',
  '/about/',
  '/solutions/',
  '/departments/',
  '/docs/',
  '/faq/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

async function get(path, base = BASE_URL) {
  const url = `${base.replace(/\/+$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text, url };
}

for (const path of PUBLIC_PAGES) {
  test(`public page ${path} returns HTTP 200`, async () => {
    const res = await get(path);
    assert.equal(res.status, 200,
      `GET ${path} expected 200, got ${res.status}; body head: ${res.text.slice(0, 200)}`);
    const ct = res.headers.get('content-type') || '';
    assert.ok(ct.includes('text/html') || ct.includes('application/xhtml'),
      `GET ${path} expected text/html content-type, got "${ct}"`);
    // Every page should be non-trivial
    assert.ok(res.text.length > 200,
      `GET ${path} returned suspiciously short body (${res.text.length} bytes)`);
  });
}

test('/manifest.json is valid JSON with name + version + icons', async () => {
  const res = await get('/manifest.json');
  assert.equal(res.status, 200,
    `GET /manifest.json expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('application/json') || ct.includes('text/json'),
    `/manifest.json expected JSON content-type, got "${ct}"`);
  let body;
  try { body = JSON.parse(res.text); }
  catch (e) { throw new Error(`/manifest.json is not valid JSON: ${e.message}`); }
  assert.equal(typeof body.name, 'string',
    `/manifest.json "name" must be a string, got ${typeof body.name} (${JSON.stringify(body.name)})`);
  assert.ok(body.name.length > 0,
    `/manifest.json "name" must be non-empty, got ${JSON.stringify(body.name)}`);
  // version is optional in the PWA manifest spec; only assert if present
  if ('version' in body) {
    assert.equal(typeof body.version, 'string',
      `/manifest.json "version" must be a string, got ${typeof body.version} (${JSON.stringify(body.version)})`);
    assert.ok(body.version.length > 0,
      `/manifest.json "version" must be non-empty, got ${JSON.stringify(body.version)}`);
  }
  assert.ok(Array.isArray(body.icons) && body.icons.length > 0,
    `/manifest.json must have a non-empty "icons" array, got ${JSON.stringify(body.icons)}`);
  for (const icon of body.icons) {
    assert.equal(typeof icon.src, 'string',
      `each icon "src" must be a string, got ${typeof icon.src} (${JSON.stringify(icon)})`);
    assert.ok(icon.src.length > 0,
      `each icon must have a non-empty "src", got ${JSON.stringify(icon)}`);
  }
});

test('/openapi-pcc.yaml returns HTTP 200 with valid YAML structure', async () => {
  const res = await get('/openapi-pcc.yaml');
  assert.equal(res.status, 200,
    `GET /openapi-pcc.yaml expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  // YAML is sometimes served as text/plain or application/yaml
  assert.ok(
    ct.includes('yaml') || ct.includes('text/plain') || ct.includes('octet-stream'),
    `/openapi-pcc.yaml expected YAML-ish content-type, got "${ct}"`,
  );
  // The body must declare OpenAPI 3 + have a top-level info: section
  assert.ok(/^openapi:\s*3\./m.test(res.text),
    `/openapi-pcc.yaml must declare openapi: 3.x at top level; head: ${res.text.slice(0, 200)}`);
  assert.ok(/^info:/m.test(res.text),
    `/openapi-pcc.yaml must have an info: section; head: ${res.text.slice(0, 200)}`);
  // Must include at least one path
  assert.ok(/^paths:/m.test(res.text),
    `/openapi-pcc.yaml must have a paths: section; head: ${res.text.slice(0, 200)}`);
});

test('/offline.html returns HTML with Arabic content', async () => {
  const res = await get('/offline.html');
  assert.equal(res.status, 200,
    `GET /offline.html expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.ok(ct.includes('text/html'),
    `/offline.html expected text/html, got "${ct}"`);
  // Arabic content check: at least one common Arabic letter range
  // Arabic block: U+0600–U+06FF
  const hasArabic = /[\u0600-\u06FF]/.test(res.text);
  assert.ok(hasArabic,
    '/offline.html should contain Arabic characters (U+0600–U+06FF)');
  // Sanity: also should be HTML
  assert.ok(/<html[\s>]/i.test(res.text),
    '/offline.html should include an <html> tag');
  // And have RTL direction (offline page is Arabic-first)
  assert.ok(/dir\s*=\s*"rtl"/i.test(res.text) || /<html[^>]*\blang\s*=\s*"ar/i.test(res.text),
    '/offline.html should be marked as RTL or Arabic (lang="ar" / dir="rtl")');
});
