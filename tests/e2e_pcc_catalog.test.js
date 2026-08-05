// filepath: /var/www/namaweb-pcc/tests/e2e_pcc_catalog.test.js
// E2E — PCC catalog API contract on the PCC server (port 3101).
//
// Live contract (verified 2026-07-29):
//   GET /api/v1/pcc-catalog/modules
//   -> {
//        "version": "v3.77.77.0",
//        "count": 789,
//        "modules": ["pcc_addiction_ext102", "pcc_admin_ext101", ...]
//      }
//
// What this suite guarantees:
//   1. The catalog endpoint returns a 200 with a JSON object.
//   2. The modules array contains the canonical PCC module count (789).
//   3. Every module id follows the canonical pattern pcc_<name>_ext<N>.
//   4. Module ids are unique (no duplicate registrations).
//   5. The catalog has a SemVer-style version field (vN+.N+.N+).
//   6. The modules list is alphabetically ordered (stable, deterministic).
//
// Run:
//   BASE_URL=http://127.0.0.1:3101 node --test tests/e2e_pcc_catalog.test.js

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3101';
const CATALOG_PATH = '/api/v1/pcc-catalog/modules';
const EXPECTED_MODULE_COUNT = 789;
const MODULE_PATTERN = /^pcc_[a-z][a-z0-9_]*_ext\d+$/;
const VERSION_PATTERN = /^v\d+\.\d+\.\d+/; // at minimum vN.N.N

const TIMEOUT_MS = 5000;

/**
 * Tiny HTTP helper. Uses built-in fetch (Node 18+).
 */
async function get(path, base = BASE_URL) {
  const url = `${base.replace(/\/+$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  let json = null;
  if ((res.headers.get('content-type') || '').includes('application/json')) {
    try { json = JSON.parse(text); } catch { /* leave null */ }
  }
  return { status: res.status, headers: res.headers, text, json, url };
}

// One shared fetch of the catalog; all tests reuse it. If the catalog is
// unreachable, the first test fails fast and the rest still report.
let catalog = null;
let catalogLoadError = null;

test.before(async () => {
  try {
    const res = await get(CATALOG_PATH);
    if (res.status !== 200) {
      throw new Error(
        `GET ${CATALOG_PATH} expected 200, got ${res.status}; ` +
        `body head: ${res.text.slice(0, 200)}`,
      );
    }
    if (!res.json) {
      throw new Error(
        `GET ${CATALOG_PATH} did not return JSON; content-type: ` +
        `${res.headers.get('content-type')}; head: ${res.text.slice(0, 200)}`,
      );
    }
    catalog = res.json;
  } catch (err) {
    catalogLoadError = err;
  }
});

function requireCatalog() {
  if (catalogLoadError) throw catalogLoadError;
  if (!catalog) throw new Error('catalog not loaded (before-hook failed)');
  return catalog;
}

function getModulesArray(cat) {
  if (Array.isArray(cat?.modules)) return cat.modules;
  if (Array.isArray(cat?.data)) return cat.data;
  if (Array.isArray(cat)) return cat;
  // Last resort: any array property
  for (const v of Object.values(cat || {})) {
    if (Array.isArray(v) && v.length) return v;
  }
  throw new Error('catalog JSON has no obvious modules[] array; top-level keys: '
    + Object.keys(cat || {}).join(','));
}

test('catalog endpoint returns HTTP 200 and JSON', async () => {
  assert.equal(catalogLoadError, null,
    catalogLoadError ? `catalog fetch failed: ${catalogLoadError.message}` : '');
  const cat = requireCatalog();
  assert.equal(typeof cat, 'object', 'catalog must be an object');
  assert.ok(!Array.isArray(cat), 'catalog top-level must be an object, not an array');
});

test(`catalog contains exactly ${EXPECTED_MODULE_COUNT} modules`, async () => {
  const cat = requireCatalog();
  const arr = getModulesArray(cat);
  assert.equal(
    arr.length,
    EXPECTED_MODULE_COUNT,
    `expected ${EXPECTED_MODULE_COUNT} modules, got ${arr.length}`,
  );
});

test('every module id matches pattern pcc_<name>_ext<N>', async () => {
  const cat = requireCatalog();
  const arr = getModulesArray(cat);
  const offenders = [];
  for (const id of arr) {
    if (typeof id !== 'string' || !MODULE_PATTERN.test(id)) {
      offenders.push(JSON.stringify(id).slice(0, 80));
    }
  }
  assert.equal(
    offenders.length,
    0,
    `expected all module ids to match ${MODULE_PATTERN}, ` +
    `offenders (first 5): ${offenders.slice(0, 5).join(' | ')}`,
  );
});

test('all module ids are unique', async () => {
  const cat = requireCatalog();
  const arr = getModulesArray(cat);
  const seen = new Set();
  const dupes = new Set();
  for (const id of arr) {
    if (typeof id !== 'string') continue;
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  assert.equal(
    dupes.size,
    0,
    `expected unique module ids, duplicates (first 10): ${[...dupes].slice(0, 10).join(', ')}`,
  );
});

test('catalog version field is SemVer-style (vN+.N+.N+)', async () => {
  const cat = requireCatalog();
  assert.equal(typeof cat.version, 'string',
    `catalog must expose a string "version" field, got ${typeof cat.version}`);
  assert.ok(VERSION_PATTERN.test(cat.version),
    `catalog version must match ${VERSION_PATTERN}, got "${cat.version}"`);
});

test('modules list is alphabetically ordered by id', async () => {
  const cat = requireCatalog();
  const arr = getModulesArray(cat);
  const ids = [...arr];
  // First id must be the smallest, last id must be the largest
  const sorted = [...ids].sort();
  assert.equal(
    ids[0],
    sorted[0],
    `first module id ${JSON.stringify(ids[0])} should equal smallest ${JSON.stringify(sorted[0])}`,
  );
  assert.equal(
    ids[ids.length - 1],
    sorted[sorted.length - 1],
    `last module id ${JSON.stringify(ids[ids.length - 1])} should equal largest ${JSON.stringify(sorted[sorted.length - 1])}`,
  );
  // And no id may precede its predecessor
  let outOfOrder = null;
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] < ids[i - 1]) {
      outOfOrder = `${JSON.stringify(ids[i - 1])} > ${JSON.stringify(ids[i])}`;
      break;
    }
  }
  assert.equal(outOfOrder, null,
    outOfOrder ? `modules list is not alphabetically sorted (saw ${outOfOrder})` : '');
});
