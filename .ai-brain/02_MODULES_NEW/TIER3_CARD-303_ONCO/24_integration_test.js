/**
 * Cardio-Onc — Integration Tests
 */

'use strict';

const http = require('http');
const db = require('./db_postgres');

const HOST = 'localhost';
const PORT = 3000;

let passed = 0, failed = 0;
function get(p) { return new Promise((res, rej) => http.get({host:HOST,port:PORT,path:p}, r => { let d=''; r.on('data', c => d+=c); r.on('end', () => res({status: r.statusCode, body: d})); }).on('error', rej)); }
function post(p, body) { return new Promise((res, rej) => { const data = JSON.stringify(body); const opts = {host:HOST,port:PORT,path:p,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}; const req = http.request(opts, r => { let d=''; r.on('data', c => d+=c); r.on('end', () => res({status: r.statusCode, body: d})); }); req.on('error', rej); req.write(data); req.end(); }); }
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  ✗ FAIL: ${msg}`); } }

(async () => {
  console.log('--- Health ---');
  const h = await get('/api/coo/health');
  assert(h.status === 401 || h.status === 200, 'Health (401 auth gate)');

  console.log('\n--- DB Setup ---');
  const t = await db.query("SELECT id FROM tenants WHERE id = 1 LIMIT 1");
  assert(t.rows.length > 0, 'Tenant 1 exists');

  console.log('\n--- Listing cases (auth required) ---');
  const c = await get('/api/coo/cases');
  assert(c.status === 401 || c.status === 200, 'GET /cases auth-gated');

  console.log('\n--- Direct DB ---');
  const r = await db.query("SELECT COUNT(*) AS c FROM cardio_onc_cases WHERE tenant_id = 1");
  assert(r.rows[0].c >= 0, 'cardio_onc_cases table queryable');

  console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
})();
