const fs = require('fs');
const path = require('path');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSystemRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, app }) {
    const router = express.Router();
router.get('/api/system/info', (req, res) => {

    // Count engines + AI orchestrators at request time (cheap, just file I/O once per process).

    // We cache the counts in a module-level variable on first hit so we don't rescan

    // the filesystem on every monitor poll.

    if (!app.locals.systemCounts) {

        const fs = require('fs');

        const path = require('path');

        const here = __dirname;

        let engines = 0;

        let aiOrchestrators = 0;

        let specialtyStations = 0;

        try {

            for (const f of fs.readdirSync(here)) {

                if (/^[a-z0-9_]+_engine\.js$/.test(f)) engines++;

                if (/^ai_[a-z0-9_]+_orchestrator\.js$/.test(f)) aiOrchestrators++;

                if (/_station\.js$/.test(f)) specialtyStations++;

            }

        } catch (e) { /* swallow */ }

        app.locals.systemCounts = { engines, aiOrchestrators, specialtyStations, scanned_at: new Date().toISOString() };

    }

    res.json({

        ok: true,

        name: 'jumanaMedical ERP',

        version: '2026.07.23-001',

        node_version: process.version,

        pid: process.pid,

        env: process.env.NODE_ENV || 'development',

        uptime_seconds: Math.round(process.uptime()),

        platform: process.platform,

        arch: process.arch,

        counts: app.locals.systemCounts,

        timestamp: new Date().toISOString(),

        modules: {

            engines: app.locals.systemCounts.engines,

            ai_orchestrators: app.locals.systemCounts.aiOrchestrators,

            specialty_stations: app.locals.systemCounts.specialtyStations

        },

        capabilities: {

            rag: true,

            multi_tenant: true,

            phi_encryption: true,

            idempotency: true,

            audit_chain: true,

            mfa: true

        }

    });

});


    return router;
}
