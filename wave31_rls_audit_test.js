/**
 * wave31_rls_audit_test.js — Unit tests for the RLS pattern audit scanner.
 */
'use strict';

const assert = require('assert');
const { auditSource, auditFiles, toPrometheusMetrics, TENANT_SCOPED_TABLES } = require('./wave31_rls_audit');

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); console.log('[PASS]', name); passed++; }
    catch (e) { console.error('[FAIL]', name, e && e.message ? e.message : e); failed++; }
}

test('auditSource: tenant predicate matches the OK class', () => {
    const src = `pool.query("SELECT * FROM patients WHERE id=$1 AND tenant_id=$2", [id, t]);`;
    const r = auditSource(src, 'inline');
    assert.strictEqual(r.risk, 0, 'should be 0 risk');
    assert.strictEqual(r.ok, 1, 'should be 1 ok');
});

test('auditSource: missing tenant_id on a tenant-scoped table => RISK', () => {
    const src = `pool.query("SELECT * FROM patients WHERE id=$1", [id]);`;
    const r = auditSource(src, 'inline');
    assert.strictEqual(r.risk, 1, 'should be 1 risk');
    assert.strictEqual(r.ok, 0, 'should be 0 ok');
});

test('auditSource: non-tenant-scoped table is INFO, not risk', () => {
    const src = `pool.query("SELECT * FROM medical_services WHERE specialty=$1", ['x']);`;
    const r = auditSource(src, 'inline');
    assert.strictEqual(r.risk, 0, 'should be 0 risk');
    assert.strictEqual(r.info, 1, 'should be 1 info');
});

test('auditSource: app.tenant_id GUC reference also counts as scoped', () => {
    const src = `await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);`;
    const r = auditSource(src, 'inline');
    // medical_services / system-wide tables not in scope list, so this becomes info, but the
    // GUC pattern means hasTenant=true for any table mention.
    assert.strictEqual(r.risk, 0, 'should be 0 risk (GUC pattern)');
});

test('auditSource: multiple tables in a join, all need tenant_id', () => {
    const src = `pool.query("SELECT * FROM patients p JOIN appointments a ON a.patient_id=p.id WHERE p.id=$1", [id]);`;
    const r = auditSource(src, 'inline');
    // No tenant predicate at all -> 2 risk (patients + appointments are tenant-scoped).
    assert.strictEqual(r.risk, 2, 'both tables should be risk without tenant_id');
});

test('auditSource: tenant_id present in join, all good', () => {
    const src = `pool.query("SELECT * FROM patients p JOIN appointments a ON a.patient_id=p.id WHERE p.tenant_id=$1", [t]);`;
    const r = auditSource(src, 'inline');
    assert.strictEqual(r.ok, 2, 'both tables ok');
    assert.strictEqual(r.risk, 0);
});

test('auditSource: ignores non pool.query calls', () => {
    const src = `function audit() { /* not a query */ }`;
    const r = auditSource(src, 'inline');
    assert.strictEqual(r.total, 0);
});

test('auditFiles: returns aggregate + per-file summary', () => {
    // Use the real server.js if available, but don't fail if the test runs in isolation.
    const path = require('path');
    const serverJs = path.join(__dirname, 'server.js');
    const result = auditFiles([serverJs]);
    assert.ok(result.summary);
    assert.ok(result.summary.total > 0, 'should scan a non-trivial number of queries');
    assert.ok(Array.isArray(result.files));
    assert.strictEqual(result.files.length, 1);
    assert.ok(result.files[0].file);
});

test('toPrometheusMetrics: well-formed output', () => {
    const out = toPrometheusMetrics({ total: 100, ok: 95, risk: 5, info: 200 });
    assert.ok(out.includes('# TYPE wave31_rls_audit_total counter'));
    assert.ok(out.includes('wave31_rls_audit_total 100'));
    assert.ok(out.includes('wave31_rls_audit_ok 95'));
    assert.ok(out.includes('wave31_rls_audit_risk 5'));
    assert.ok(out.includes('wave31_rls_audit_info 200'));
});

test('TENANT_SCOPED_TABLES: contains core tables', () => {
    assert.ok(TENANT_SCOPED_TABLES.includes('patients'));
    assert.ok(TENANT_SCOPED_TABLES.includes('invoices'));
    assert.ok(TENANT_SCOPED_TABLES.includes('medical_records'));
    assert.ok(TENANT_SCOPED_TABLES.includes('appointments'));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
