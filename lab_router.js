// filepath: namaweb/lab_router.js
// Lab result endpoints: trends, abnormal summary, SVG chart
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const labEngine = require('./lab_trends_engine');

// ============================================================
// GET /api/labs?patient_id=X
// ============================================================
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const limit = Math.min(+req.query.limit || 100, 500);
        const result = await db.query(`
            SELECT id, test_name, value, unit, ref_low, ref_high, abnormal_flag, is_critical, reported_at
            FROM lab_results
            WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY reported_at DESC
            LIMIT $3
        `, [req.tenantId, patientId, limit]);
        res.json({ ok: true, total: result.rows.length, results: result.rows });
    } catch (err) {
        console.error('GET /api/labs', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/labs/tests?patient_id=X
// ============================================================
router.get('/tests', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const tests = await labEngine.listPatientTests(req.tenantId, patientId);
        res.json({ ok: true, total: tests.length, tests });
    } catch (err) {
        console.error('GET /api/labs/tests', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/labs/abnormal?patient_id=X&days=90
// ============================================================
router.get('/abnormal', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const days = Math.min(+req.query.days || 90, 365);
        const summary = await labEngine.getAbnormalSummary(req.tenantId, patientId, days);
        res.json({ ok: true, ...summary });
    } catch (err) {
        console.error('GET /api/labs/abnormal', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/labs/trend?patient_id=X&test_name=Y[&limit=30]
// ============================================================
router.get('/trend', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, test_name, limit } = req.query;
        if (!patient_id || !test_name) return res.status(400).json({ error: 'missing_patient_id_or_test_name' });
        const trend = await labEngine.getTestTrend(req.tenantId, +patient_id, test_name, Math.min(+limit || 30, 100));
        res.json({ ok: true, ...trend });
    } catch (err) {
        console.error('GET /api/labs/trend', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/labs/trend.svg?patient_id=X&test_name=Y
// ============================================================
router.get('/trend.svg', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, test_name, limit } = req.query;
        if (!patient_id || !test_name) {
            return res.status(400).send('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100"><text x="20" y="50" fill="red">missing patient_id or test_name</text></svg>');
        }
        const trend = await labEngine.getTestTrend(req.tenantId, +patient_id, test_name, Math.min(+limit || 30, 100));
        const latest = trend.latest;
        const refLow = latest?.ref_low ?? null;
        const refHigh = latest?.ref_high ?? null;
        const unit = latest?.unit ?? '';
        res.set('Content-Type', 'image/svg+xml');
        res.set('Cache-Control', 'no-store');
        res.send(labEngine.renderTrendSvg(test_name, trend.points, refLow, refHigh, unit));
    } catch (err) {
        console.error('GET /api/labs/trend.svg', err);
        res.status(500).send('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><text x="20" y="100" fill="red">Error generating chart</text></svg>');
    }
});

// ============================================================
// POST /api/labs
// Record a lab result (used by lab stations to push results in)
// ============================================================
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'lab_tech'), async (req, res) => {
    try {
        const { patient_id, test_name, value, unit, ref_low, ref_high, abnormal_flag, notes } = req.body;
        if (!patient_id || !test_name || value === undefined) {
            return res.status(400).json({ error: 'missing_required_fields', required: ['patient_id', 'test_name', 'value'] });
        }
        // Auto-derive abnormal_flag if not provided
        let flag = abnormal_flag || '';
        if (!flag) {
            const n = parseFloat(value);
            if (Number.isFinite(n)) {
                if (ref_low != null && n < +ref_low) flag = 'L';
                else if (ref_high != null && n > +ref_high) flag = 'H';
                else flag = 'N';
            }
        }
        const result = await db.query(`
            INSERT INTO lab_results
                (tenant_id, patient_id, ordered_by, reported_by, panel, test_name, value, unit, ref_low, ref_high, abnormal_flag, notes)
            VALUES ($1, $2, $3, $4, '', $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
        `, [req.tenantId, patient_id, req.userId, req.userId, test_name, String(value), unit || '', ref_low || null, ref_high || null, flag, notes || '']);
        res.status(201).json({ ok: true, id: result.rows[0].id, abnormal_flag: flag });
    } catch (err) {
        console.error('POST /api/labs', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/labs/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', numeric_tests: labEngine.NUMERIC_TESTS.size, timestamp: new Date().toISOString() });
});

module.exports = router;