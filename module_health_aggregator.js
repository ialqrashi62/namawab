// filepath: namaweb/module_health_aggregator.js
// Combined health check across ALL routers in the platform.
// Aggregates module health, DB status, server uptime, and version.
'use strict';

const express = require('express');
const router = express.Router();
const http = require('http');
const db = require('./db_postgres');
const { requireAuth, requireTenantScope } = require('./mw');

const HOST = 'localhost';
const PORT = 3000;

const HEALTH_ENDPOINTS = [
    { module: 'hub',                path: '/api/hub/health' },
    { module: 'patient',            path: '/api/patient' },
    { module: 'drug-interactions',   path: '/api/drug-interactions/health' },
    { module: 'soap-notes',          path: '/api/soap-notes/health' },
    { module: 'allergies',           path: '/api/allergies/health' },
    { module: 'labs',                path: '/api/labs/health' },
    { module: 'pathways',            path: '/api/pathways/health' },
    { module: 'cds',                 path: '/api/cds/health' },
    { module: 'discharge',           path: '/api/discharge/health' },
    { module: 'imaging',             path: '/api/imaging/health' },
    { module: 'care-plans',          path: '/api/care-plans/health' },
    { module: 'quality-metrics',     path: '/api/quality-metrics/health' },
    { module: 'appointments',        path: '/api/appointments/health' },
    { module: 'billing',             path: '/api/billing/health' },
    { module: 'patient-portal',      path: '/api/patient-portal/health' },
    { module: 'telehealth',          path: '/api/telehealth/health' },
    { module: 'audit',               path: '/api/audit/health' },
    { module: 'audit-trail',         path: '/api/audit-trail/health' },
    { module: 'backup',              path: '/api/backup/health' },
    { module: 'i18n',                path: '/api/i18n/health' },
    { module: 'onboarding',          path: '/api/onboarding/health' },
    { module: 'security-audit',      path: '/api/security-audit/health' },
    { module: 'perf',                path: '/api/perf/health' },
    { module: 'saas-billing',        path: '/api/saas-billing/health' },
    { module: 'e2e-tests',           path: '/api/e2e-tests/health' }
];

function pingEndpoint(item) {
    return new Promise(resolve => {
        const t0 = Date.now();
        const req = http.request({ hostname: HOST, port: PORT, path: item.path, method: 'GET', timeout: 3000 }, res => {
            res.on('data', () => {});
            res.on('end', () => {
                resolve({ module: item.module, path: item.path, status: res.statusCode, ms: Date.now() - t0, reachable: res.statusCode > 0 });
            });
        });
        req.on('error', () => resolve({ module: item.module, path: item.path, status: 0, ms: Date.now() - t0, reachable: false, error: 'connection_refused_or_timeout' }));
        req.on('timeout', () => { req.destroy(); resolve({ module: item.module, path: item.path, status: 0, ms: 3000, reachable: false, error: 'timeout' }); });
        req.end();
    });
}

// GET /api/module-health/all — aggregate health of every module
router.get('/all', requireAuth, requireTenantScope, async (req, res) => {
    const t0 = Date.now();
    try {
        const results = await Promise.all(HEALTH_ENDPOINTS.map(pingEndpoint));
        const reachable = results.filter(r => r.reachable).length;
        const respondingWith401 = results.filter(r => r.status === 401).length;
        const respondingWith200 = results.filter(r => r.status === 200).length;
        const otherStatus = results.filter(r => r.status !== 0 && r.status !== 401 && r.status !== 200);
        const avgMs = results.reduce((s, r) => s + (r.ms || 0), 0) / results.length;
        res.json({
            ok: reachable === results.length,
            timestamp: new Date().toISOString(),
            total_modules: results.length,
            reachable,
            auth_protected: respondingWith401,
            public: respondingWith200,
            other_status: otherStatus.length,
            avg_response_ms: +avgMs.toFixed(1),
            total_ms: Date.now() - t0,
            modules: results
        });
    } catch (err) {
        console.error('GET /api/module-health/all', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/module-health/db — DB + server quick stats
router.get('/db', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const t0 = Date.now();
        const dbRes = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
                (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
                (SELECT COUNT(*) FROM pg_class WHERE relrowsecurity AND relforcerowsecurity) as forced_rls_tables,
                pg_database_size(current_database()) as db_bytes,
                pg_size_pretty(pg_database_size(current_database())) as db_size_pretty,
                (SELECT EXTRACT(EPOCH FROM (NOW() - pg_postmaster_start_time()))::int) as uptime_seconds
        `);
        const r = dbRes.rows[0];
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            ms: Date.now() - t0,
            active_connections: +r.active_connections,
            total_tables: +r.total_tables,
            forced_rls_tables: +r.forced_rls_tables,
            rls_coverage_pct: r.total_tables > 0 ? +((r.forced_rls_tables / r.total_tables) * 100).toFixed(1) : 0,
            database_size: r.db_size_pretty,
            database_bytes: +r.db_bytes,
            uptime_seconds: +r.uptime_seconds,
            uptime_human: `${Math.floor(r.uptime_seconds / 3600)}h ${Math.floor((r.uptime_seconds % 3600) / 60)}m`
        });
    } catch (err) {
        console.error('GET /api/module-health/db', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/module-health/version — single source of truth
router.get('/version', requireAuth, requireTenantScope, (req, res) => {
    const pkg = require('./package.json');
    res.json({
        ok: true,
        timestamp: new Date().toISOString(),
        app_name: pkg.name,
        version: pkg.version,
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        memory_mb: +(process.memoryUsage().rss / 1024 / 1024).toFixed(1)
    });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['all', 'db', 'version'], total_modules: HEALTH_ENDPOINTS.length, timestamp: new Date().toISOString() });
});

module.exports = router;