// filepath: namaweb/e2e_tests_router.js
// E2E smoke test runner. Executes a battery of basic API checks server-side.
// Returns pass/fail per test with timing. NO PHI sent (uses anonymous tokens where required).
'use strict';

const express = require('express');
const router = express.Router();
const http = require('http');
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const HOST = 'localhost';
const PORT = 3000;

// ============================================================
// Define smoke tests
// ============================================================
const SMOKE_TESTS = [
    // /health endpoints (should respond without auth — checking server reachability)
    { id: 'srv.hub_health',         method: 'GET', path: '/api/hub/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.patient_health',     method: 'GET', path: '/api/patient', expectStatus: 401, requiresAuth: false },
    { id: 'srv.drug_health',        method: 'GET', path: '/api/drug-interactions/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.soap_health',        method: 'GET', path: '/api/soap-notes/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.allergies_health',   method: 'GET', path: '/api/allergies/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.labs_health',        method: 'GET', path: '/api/labs/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.pathways_health',    method: 'GET', path: '/api/pathways/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.cds_health',         method: 'GET', path: '/api/cds/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.discharge_health',   method: 'GET', path: '/api/discharge/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.imaging_health',     method: 'GET', path: '/api/imaging/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.care_plans_health',  method: 'GET', path: '/api/care-plans/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.qm_health',          method: 'GET', path: '/api/quality-metrics/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.appt_health',        method: 'GET', path: '/api/appointments/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.billing_health',     method: 'GET', path: '/api/billing/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.portal_health',      method: 'GET', path: '/api/patient-portal/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.telehealth_health',  method: 'GET', path: '/api/telehealth/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.audit_health',       method: 'GET', path: '/api/audit/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.audit_trail_health', method: 'GET', path: '/api/audit-trail/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.backup_health',      method: 'GET', path: '/api/backup/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.i18n_health',        method: 'GET', path: '/api/i18n/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.onboarding_health',  method: 'GET', path: '/api/onboarding/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.sec_health',         method: 'GET', path: '/api/security-audit/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.perf_health',         method: 'GET', path: '/api/perf/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.saas_health',        method: 'GET', path: '/api/saas-billing/health', expectStatus: 401, requiresAuth: false },
    { id: 'srv.openapi_catalog',    method: 'GET', path: '/api/openapi.json/catalog', expectStatus: 200, requiresAuth: false },
    { id: 'srv.billing_plans',      method: 'GET', path: '/api/saas-billing/plans', expectStatus: 200, requiresAuth: false },
    { id: 'srv.openapi_spec',       method: 'GET', path: '/api/openapi.json', expectStatus: 200, requiresAuth: false }
];

function runHttpTest(test) {
    return new Promise(resolve => {
        const t0 = Date.now();
        const req = http.request({ hostname: HOST, port: PORT, path: test.path, method: test.method, timeout: 5000 }, res => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                const ms = Date.now() - t0;
                const pass = res.statusCode === test.expectStatus;
                resolve({ id: test.id, method: test.method, path: test.path, status: res.statusCode, expected: test.expectStatus, ms, pass });
            });
        });
        req.on('error', err => resolve({ id: test.id, method: test.method, path: test.path, status: 0, expected: test.expectStatus, ms: Date.now() - t0, pass: false, error: err.message }));
        req.on('timeout', () => { req.destroy(); resolve({ id: test.id, path: test.path, pass: false, error: 'timeout' }); });
        req.end();
    });
}

async function runDatabaseTests(req) {
    const results = [];
    // Test 1: tenant_id resolves
    try {
        const r = await db.query('SELECT current_setting($1) as t', ['app.tenant_id']);
        results.push({ id: 'db.tenant_context', pass: true, detail: `tenant_id=${r.rows[0].t}` });
    } catch (e) {
        results.push({ id: 'db.tenant_context', pass: false, error: e.message.substring(0, 100) });
    }
    // Test 2: tables accessible
    try {
        const r = await db.query('SELECT COUNT(*) as c FROM pg_tables WHERE schemaname = $1', ['public']);
        results.push({ id: 'db.tables_visible', pass: true, detail: `${r.rows[0].c} tables` });
    } catch (e) {
        results.push({ id: 'db.tables_visible', pass: false, error: e.message.substring(0, 100) });
    }
    // Test 3: critical tables have RLS
    try {
        const r = await db.query(`
            SELECT
                (SELECT relrowsecurity FROM pg_class WHERE relname = 'patients') as patients_rls,
                (SELECT relrowsecurity FROM pg_class WHERE relname = 'soap_notes') as soap_rls,
                (SELECT relrowsecurity FROM pg_class WHERE relname = 'cds_alerts') as cds_rls
        `);
        const rls = r.rows[0];
        const allRls = rls.patients_rls && rls.soap_rls && rls.cds_rls;
        results.push({ id: 'db.critical_rls', pass: allRls, detail: `patients=${rls.patients_rls}, soap=${rls.soap_rls}, cds=${rls.cds_rls}` });
    } catch (e) {
        results.push({ id: 'db.critical_rls', pass: false, error: e.message.substring(0, 100) });
    }
    return results;
}

// ============================================================
// POST /api/e2e/run — execute all smoke tests
// ============================================================
router.post('/run', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const t0 = Date.now();
        // HTTP tests in parallel
        const httpResults = await Promise.all(SMOKE_TESTS.map(runHttpTest));
        // DB tests sequential
        const dbResults = await runDatabaseTests(req);
        const all = [...httpResults, ...dbResults];
        const passing = all.filter(r => r.pass).length;
        const failing = all.length - passing;
        const totalMs = Date.now() - t0;
        res.json({
            ok: failing === 0,
            timestamp: new Date().toISOString(),
            total_tests: all.length,
            passing, failing,
            total_ms: totalMs,
            results: all
        });
    } catch (err) {
        console.error('POST /api/e2e/run', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/e2e/list — list available tests without running
// ============================================================
router.get('/list', requireAuth, requireTenantScope, requireRole('admin', 'owner'), (req, res) => {
    res.json({
        ok: true,
        total: SMOKE_TESTS.length + 3,
        http_tests: SMOKE_TESTS.length,
        db_tests: 3,
        tests: SMOKE_TESTS.map(t => ({ id: t.id, method: t.method, path: t.path, expectStatus: t.expectStatus }))
    });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', total_tests: SMOKE_TESTS.length + 3, timestamp: new Date().toISOString() });
});

module.exports = router;