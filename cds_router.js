// filepath: namaweb/cds_router.js
// CDS alert endpoints
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const cdsEngine = require('./cds_engine');

// POST /api/cds/evaluate
// Body: { patient_id, drugs?: string[] }
router.post('/evaluate', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = +req.body.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const drugs = Array.isArray(req.body.drugs) ? req.body.drugs : [];
        if (drugs.length > 100) return res.status(400).json({ error: 'too_many_drugs', max: 100 });
        const result = await cdsEngine.evaluatePatient(req.tenantId, patientId, { drugs });
        res.json(result);
    } catch (err) {
        console.error('POST /api/cds/evaluate', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/cds/alerts?patient_id=X[&status=active|all]
router.get('/alerts', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const status = req.query.status || 'active';
        const where = status === 'all' ? '' : "AND status = 'active'";
        const result = await db.query(`
            SELECT id, alert_type, severity, title, message, details, status, created_at, acknowledged_at
            FROM cds_alerts
            WHERE tenant_id = $1 AND patient_id = $2 ${where}
            ORDER BY
                CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'moderate' THEN 3 ELSE 4 END,
                created_at DESC
            LIMIT 100
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, alerts: result.rows });
    } catch (err) {
        console.error('GET /api/cds/alerts', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/cds/alerts/:id/acknowledge
router.post('/alerts/:id/acknowledge', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            UPDATE cds_alerts
            SET status = 'acknowledged', acknowledged_by = $1, acknowledged_at = NOW()
            WHERE id = $2 AND tenant_id = $3 AND status = 'active'
            RETURNING id
        `, [req.userId, req.params.id, req.tenantId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'alert_not_found_or_not_active' });
        res.json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/cds/alerts/acknowledge', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/cds/alerts/:id/dismiss
router.post('/alerts/:id/dismiss', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            UPDATE cds_alerts
            SET status = 'dismissed', resolved_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status IN ('active', 'acknowledged')
            RETURNING id
        `, [req.params.id, req.tenantId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'alert_not_found_or_already_resolved' });
        res.json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/cds/alerts/dismiss', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/cds/alerts/active-summary?patient_id=X  -- top of patient chart
router.get('/alerts/active-summary', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const result = await db.query(`
            SELECT severity, COUNT(*) as cnt
            FROM cds_alerts
            WHERE tenant_id = $1 AND patient_id = $2 AND status = 'active'
            GROUP BY severity
        `, [req.tenantId, patientId]);
        const summary = { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: 0 };
        for (const r of result.rows) {
            summary[r.severity] = +r.cnt;
            summary.total += +r.cnt;
        }
        res.json({ ok: true, ...summary });
    } catch (err) {
        console.error('GET /api/cds/alerts/active-summary', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/cds/health
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: cdsEngine.ENGINE_VERSION, rules: ['drug_allergy', 'drug_interaction', 'drug_lab', 'sepsis', 'aki'], timestamp: new Date().toISOString() });
});

module.exports = router;