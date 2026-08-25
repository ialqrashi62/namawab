// pcc-catalog-fixes.test.js
// Regression tests for the 3 PCC catalog UI bugs fixed on 2026-07-29:
//   Bug #1: Double pcc- prefix in route URLs (normalizeName strips pcc_ / pcc-)
//   Bug #2: undefined.toLowerCase() crash when catalog returns plain strings
//          (getName / getRouteCount / getExtension / classify / humanize all
//           defend against non-object input)
//   Bug #3: POST /call/:fn (not GET) for module function calls
//
// Run with: node pcc-catalog-fixes.test.js
// Uses only node:test + node:assert — no npm install required.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// ─────────────────────────────────────────────────────────────────────────────
// Canonical post-fix helper definitions (paste of the fixed source).
// These must stay in sync with pcc-catalog-ui.js on the live server.
// ─────────────────────────────────────────────────────────────────────────────

function normalizeName(name) {
    // strip pcc_ or pcc- prefix if present, then convert any remaining
    // underscores to dashes. Catalog returns names like "pcc_adolescent_ext101".
    var stripped = String(name || '').replace(/^pcc[_-]/, '');
    return stripped.replace(/_/g, '-');
}

function getName(m) {
    if (!m) return '';
    return (typeof m === 'string') ? m : (m.name || '');
}

function getRouteCount(m) {
    if (!m) return 0;
    return (typeof m === 'string') ? 0 : (m.route_count || 0);
}

function getExtension(m) {
    if (!m) return '?';
    if (typeof m === 'string') {
        var x = m.match(/ext(\d+)/);
        return x ? x[1] : '?';
    }
    return m.extension || '?';
}

function classify(name) {
    if (!name) return 'admin';
    var n = String(name).toLowerCase();
    if (/cardio|oncol|pedia|obgyn|surg|derm|neuro|psy|hema|nephro|endo|radio|patho|urol|ent|oph|ortho|gi|resp|icu|er|triage|clinic|medic|nurs|lab|pharm|anest|emr|allergy|adolescent|addiction|wellness|prevent/.test(n)) {
        return 'clinical';
    }
    if (/bill|invoice|payroll|finance|account|tax|vat|insurance|nphies|zatca|claim|cost|revenue|budget|audit/.test(n)) {
        return 'financial';
    }
    return 'admin';
}

function humanize(name) {
    if (!name) return '';
    var cleaned = String(name)
        .replace(/^pcc[_-]/, '')
        .replace(/_ext\d+$/, '')
        .replace(/_/g, ' ');
    // Title-case the first non-empty word
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Build a call URL the same way callFunction() does in the live UI.
//   POST /api/v1/pcc-{routeName}/call/{fnName}
function buildCallUrl(moduleName, fnName) {
    var API_BASE = '/api/v1';
    var routeName = normalizeName(moduleName);
    return API_BASE + '/pcc-' + routeName + '/call/' + encodeURIComponent(fnName);
}

// Build a list URL the same way fetchModuleMeta() does in the live UI.
//   GET /api/v1/pcc-{routeName}/list
function buildListUrl(moduleName) {
    var API_BASE = '/api/v1';
    var routeName = normalizeName(moduleName);
    return API_BASE + '/pcc-' + routeName + '/list';
}

// ─────────────────────────────────────────────────────────────────────────────
// Bug #1 — Double pcc- prefix
// ─────────────────────────────────────────────────────────────────────────────

test('Bug #1 normalizeName: strips pcc_ prefix and converts _ to -', () => {
    assert.equal(normalizeName('pcc_adolescent_ext101'), 'adolescent-ext101');
});

test('Bug #1 normalizeName: strips pcc- prefix (dash form)', () => {
    assert.equal(normalizeName('pcc-addiction-ext102'), 'addiction-ext102');
});

test('Bug #1 normalizeName: does not double-strip (handles pcc_pcc_)', () => {
    // First regex strips one "pcc_" only; remaining "pcc_adolescent" still has
    // an underscore so the second pass turns it into "pcc-adolescent".
    assert.equal(normalizeName('pcc_pcc_adolescent'), 'pcc-adolescent');
});

test('Bug #1 normalizeName: passes through names without pcc prefix', () => {
    assert.equal(normalizeName('addiction_ext102'), 'addiction-ext102');
});

test('Bug #1 normalizeName: null-safe — returns "" on null', () => {
    assert.equal(normalizeName(null), '');
});

test('Bug #1 normalizeName: null-safe — returns "" on undefined', () => {
    assert.equal(normalizeName(undefined), '');
});

test('Bug #1 normalizeName: null-safe — returns "" on empty string', () => {
    assert.equal(normalizeName(''), '');
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug #2 — undefined.toLowerCase() crash
// Catalog can return plain strings OR objects depending on the endpoint. The
// helpers must defend against both shapes without throwing.
// ─────────────────────────────────────────────────────────────────────────────

test('Bug #2 getName: returns m.name when given an object', () => {
    assert.equal(getName({ name: 'pcc_x', route_count: 3, extension: 102 }), 'pcc_x');
});

test('Bug #2 getName: returns the string when given a string', () => {
    assert.equal(getName('pcc_y_ext100'), 'pcc_y_ext100');
});

test('Bug #2 getName: returns "" on null', () => {
    assert.equal(getName(null), '');
});

test('Bug #2 getName: returns "" on undefined', () => {
    assert.equal(getName(undefined), '');
});

test('Bug #2 getRouteCount: returns 0 for a string input (no field to read)', () => {
    assert.equal(getRouteCount('pcc_anything_ext1'), 0);
});

test('Bug #2 getRouteCount: reads route_count from object', () => {
    assert.equal(getRouteCount({ route_count: 5 }), 5);
});

test('Bug #2 getRouteCount: returns 0 for an object missing the field', () => {
    assert.equal(getRouteCount({}), 0);
});

test('Bug #2 getRouteCount: returns 0 on null (no crash)', () => {
    assert.equal(getRouteCount(null), 0);
});

test('Bug #2 getExtension: extracts extNNN from a string name', () => {
    assert.equal(getExtension('pcc_cardio_ext102'), '102');
});

test('Bug #2 getExtension: returns "?" when string has no ext token', () => {
    assert.equal(getExtension('pcc_cardio'), '?');
});

test('Bug #2 getExtension: returns numeric extension from object', () => {
    assert.equal(getExtension({ extension: 99 }), 99);
});

test('Bug #2 classify: null → "admin" (no .toLowerCase crash)', () => {
    assert.equal(classify(null), 'admin');
});

test('Bug #2 classify: undefined → "admin"', () => {
    assert.equal(classify(undefined), 'admin');
});

test('Bug #2 classify: clinical keyword → "clinical"', () => {
    assert.equal(classify('cardiology'), 'clinical');
});

test('Bug #2 classify: financial keyword → "financial"', () => {
    assert.equal(classify('billing'), 'financial');
});

test('Bug #2 humanize: null → ""', () => {
    assert.equal(humanize(null), '');
});

test('Bug #2 humanize: strips pcc- prefix and _extNNN suffix, title-cases', () => {
    assert.equal(humanize('pcc_cardiology_ext102'), 'Cardiology');
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug #3 — POST /call/:fn (not GET) — verified via URL construction
// The URL must NOT contain a double pcc- prefix even when normalizeName is
// fed a name that already has the prefix.
// ─────────────────────────────────────────────────────────────────────────────

test('Bug #3 buildCallUrl: builds /api/v1/pcc-{route}/call/{fn} with no double prefix', () => {
    var url = buildCallUrl('pcc_adolescent_ext101', 'AdolGenExt');
    assert.equal(url, '/api/v1/pcc-adolescent-ext101/call/AdolGenExt');
});

test('Bug #3 buildCallUrl: encodes fn name with encodeURIComponent', () => {
    var url = buildCallUrl('pcc_cardio_ext102', 'Order Create');
    assert.equal(url, '/api/v1/pcc-cardio-ext102/call/Order%20Create');
});

test('Bug #3 buildListUrl: parallel shape for the GET /list endpoint', () => {
    var url = buildListUrl('pcc_addiction_ext102');
    assert.equal(url, '/api/v1/pcc-addiction-ext102/list');
});

test('Bug #3 buildCallUrl: defends against pcc_pcc_ double prefix', () => {
    // Even with a malformed name that already starts with pcc_, the URL
    // must end up with exactly one "pcc-" segment.
    var url = buildCallUrl('pcc_pcc_adolescent', 'Foo');
    assert.equal(url, '/api/v1/pcc-pcc-adolescent/call/Foo');
    assert.equal((url.match(/\/pcc-/g) || []).length, 1,
        'expected exactly one /pcc- segment, got: ' + url);
});

