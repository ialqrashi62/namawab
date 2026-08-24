const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeHealthRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/health', async (req, res) => {
    // Liveness + DB readiness + diagnostics.
    // Backwards-compatible: returns the original {status, db} shape plus optional
    // diagnostic fields when the client sends `?detail=1` (used by the local
    // sync script and ops dashboards). Never leaks secrets/PHI.
    const startTime = process.hrtime.bigint();
    const wantDetail = req.query.detail === '1' || req.query.detail === 'true';
    const checks = { db: false, redis: false };
    const meta = {};
    try {
        const t0 = Date.now();
        const r = await pool.query('SELECT 1 AS ok, current_database() AS db, current_user AS usr, version() AS pg_version, now() AS server_time');
        checks.db = true;
        meta.db = {
            roundtrip_ms: Date.now() - t0,
            database: r.rows[0].db,
            user: r.rows[0].usr,
            pg_version: r.rows[0].pg_version ? r.rows[0].pg_version.split(' ').slice(0, 2).join(' ') : null,
            server_time: r.rows[0].server_time
        };
    } catch (e) {
        // swallow; reported via checks.db=false below
    }
    // Redis check is best-effort: we don't fail the health if Redis is unreachable
    // because sessions can fall back to MemoryStore (see session middleware).
    // The redis client is defined inside the session middleware closure, so we
    // can't reach it from here. Instead we attempt a no-op via the global
    // `app.locals.redisClient` if it was exposed at boot.
    try {
        const t0 = Date.now();
        const rc = res.app && res.app.locals && res.app.locals.redisClient;
        if (rc && typeof rc.ping === 'function') {
            await rc.ping();
            checks.redis = true;
            meta.redis = { roundtrip_ms: Date.now() - t0 };
        } else {
            meta.redis = { status: 'unknown', note: 'redis client not exposed via app.locals' };
        }
    } catch (e) {
        meta.redis = { error: 'unreachable' };
    }

    const allUp = checks.db; // db is the only hard requirement
    const elapsed_ms = Number(process.hrtime.bigint() - startTime) / 1e6;
    const body = {
        status: allUp ? 'UP' : 'DEGRADED',
        db: checks.db ? 'up' : 'down',
        redis: checks.redis ? 'up' : 'down',
        uptime_seconds: Math.round(process.uptime()),
        node_version: process.version,
        pid: process.pid,
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        elapsed_ms: Math.round(elapsed_ms * 100) / 100
    };
    if (wantDetail) {
        body.meta = meta;
    }
    return res.status(allUp ? 200 : 503).json(body);
});

    return router;
}
