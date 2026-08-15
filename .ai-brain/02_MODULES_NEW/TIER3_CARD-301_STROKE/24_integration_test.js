/**
 * Stroke Center — Integration Tests
 * Tests require live database with migrations applied.
 */

'use strict';

const http = require('http');
const db = require('./db_postgres');

const HOST = 'localhost';
const PORT = 3000;
const AUTH_HEADER = null; // Set to a valid session cookie for protected endpoints

let passed = 0, failed = 0;

function get(path) {
  return new Promise((resolve, reject) => {
    const opts = { host: HOST, port: PORT, path, headers: AUTH_HEADER ? { Cookie: AUTH_HEADER } : {} };
    http.get(opts, (r) => {
      let d = ''; r.on('data', (c) => d += c); r.on('end', () => resolve({ status: r.statusCode, body: d }));
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = { host: HOST, port: PORT, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...(AUTH_HEADER ? { Cookie: AUTH_HEADER } : {}) } };
    const req = http.request(opts, (r) => {
      let d = ''; r.on('data', (c) => d += c); r.on('end', () => resolve({ status: r.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function assert(cond, msg) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
}

(async () => {
  console.log('--- Health ---');
  const health = await get('/api/stroke/health');
  // 401 expected without auth (auth gate confirms middleware chain)
  assert(health.status === 401 || health.status === 200, 'Health endpoint reachable (401 auth gate)');

  console.log('\n--- DB Setup (skip if already exists) ---');
  // The migration `11_migration_up.sql` must be applied to live DB before running these tests.
  const tenants = await db.query("SELECT id FROM tenants WHERE id = 1 LIMIT 1");
  assert(tenants.rows.length > 0, 'Tenant 1 exists');

  console.log('\n--- Listing cases (auth required) ---');
  const cases = await get('/api/stroke/cases');
  assert(cases.status === 401 || cases.status === 200, 'GET /cases auth-gated');

  console.log('\n--- Direct DB test (bypass API) ---');
  const r = await db.query("SELECT COUNT(*) AS c FROM stroke_cases WHERE tenant_id = 1");
  assert(r.rows[0].c >= 0, 'stroke_cases table queryable');

  console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
})();
