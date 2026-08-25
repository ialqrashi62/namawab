// filepath: namaweb/quality_metrics_router.js
'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const qm = require('./quality_metrics_engine');

router.get('/overview', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const overview = await qm.getOverview(req.tenantId, days);
        res.json({ ok: true, ...overview });
    } catch (err) {
        console.error('GET /api/quality-metrics/overview', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/departments', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const deptStats = await qm.getDeptStats(req.tenantId, days);
        res.json({ ok: true, ...deptStats });
    } catch (err) {
        console.error('GET /api/quality-metrics/departments', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;