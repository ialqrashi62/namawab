'use strict';
// Wave 74 — Family Medicine: visits + wellness risk assessments
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_VISIT_FIELDS = ['sbp','hr','weight','height','chief_complaint','diagnosis','notes','attending_user_id'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'family-medicine',
        endpoints: [
            'GET /visits',
            'GET /visits/:id',
            'POST /visits',
            'PUT /visits/:id',
            'GET /wellness',
            'POST /wellness',
            'GET /wellness/patient/:patientId',
            'GET /risk-summary',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== VISITS =====
router.get('/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 50, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name, p.mrn FROM family_medicine_visits v LEFT JOIN patients p ON p.id = v.patient_id WHERE v.tenant_id = $1 AND v.deleted_at IS NULL`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(patient_id); }
        sql += ` ORDER BY v.visit_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/visits/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT v.*, p.full_name AS patient_name, p.mrn FROM family_medicine_visits v LEFT JOIN patients p ON p.id = v.patient_id WHERE v.tenant_id = $1 AND v.id = $2 AND v.deleted_at IS NULL`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'visit_not_found' });
        res.json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, visit_date = new Date(), chief_complaint, sbp, hr, weight, height, diagnosis, notes, attending_user_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        let bmi = null;
        if (weight && height) {
            const heightM = parseFloat(height) / 100;
            if (heightM > 0) bmi = Math.round((parseFloat(weight) / (heightM * heightM)) * 10) / 10;
        }

        const payload = {
            sbp: sbp || null,
            hr: hr || null,
            weight: weight || null,
            height: height || null,
            bmi,
            diagnosis: diagnosis || null
        };

        const r = await db.query(
            `INSERT INTO family_medicine_visits (tenant_id, patient_id, visit_date, chief_complaint, sbp, hr, weight, height, diagnosis, notes, attending_user_id, payload)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, patient_id, visit_date, chief_complaint, sbp || null, hr || null, weight || null, height || null, diagnosis || null, notes || null, attending_user_id || req.user?.id || null, payload]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], bmi });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/visits/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const body = req.body || {};
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of VALID_VISIT_FIELDS) {
            if (k in body) { sets.push(`${k} = $${i++}`); params.push(body[k]); }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(
            `UPDATE family_medicine_visits SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'visit_not_found' });
        res.json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WELLNESS RISK ASSESSMENTS =====
router.get('/wellness', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT w.*, p.full_name AS patient_name, p.mrn FROM family_medicine_wellness w LEFT JOIN patients p ON p.id = w.patient_id WHERE w.tenant_id = $1 AND w.deleted_at IS NULL`;
        if (patient_id) { sql += ` AND w.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (risk) { sql += ` AND w.risk = $${params.length + 1}`; params.push(risk); }
        sql += ` ORDER BY w.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/wellness', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, score, risk, result, payload = {}, assessed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        const numericScore = score !== undefined ? parseFloat(score) : null;
        let computedRisk = risk;
        if (!computedRisk && numericScore !== null) {
            if (numericScore < 25) computedRisk = 'low';
            else if (numericScore < 50) computedRisk = 'moderate';
            else if (numericScore < 75) computedRisk = 'high';
            else computedRisk = 'very_high';
        }

        const r = await db.query(
            `INSERT INTO family_medicine_wellness (tenant_id, patient_id, assessed_by, score, risk, result, payload)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, patient_id, assessed_by || req.user?.id || null, numericScore, computedRisk, result || null, payload]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed_risk: computedRisk });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/wellness/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT w.*, u.full_name AS assessed_by_name FROM family_medicine_wellness w LEFT JOIN users u ON u.id = w.assessed_by
             WHERE w.tenant_id = $1 AND w.patient_id = $2 AND w.deleted_at IS NULL ORDER BY w.created_at DESC LIMIT 20`,
            [req.tenantId, req.params.patientId]
        );
        const latest = r.rows[0] || null;
        res.json({ ok: true, count: r.rows.length, latest, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ANALYTICS =====
router.get('/risk-summary', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT risk, COUNT(*) AS count, AVG(score)::NUMERIC(10,2) AS avg_score FROM family_medicine_wellness
             WHERE tenant_id = $1 AND deleted_at IS NULL AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY risk ORDER BY risk`,
            [req.tenantId]
        );
        res.json({ ok: true, buckets: r.rows, total: r.rows.reduce((a, b) => a + parseInt(b.count), 0) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const v = await db.query(
            `SELECT COUNT(*) AS total_visits, COUNT(DISTINCT patient_id) AS unique_patients,
                    AVG(sbp)::NUMERIC(10,2) AS avg_sbp, AVG(hr)::NUMERIC(10,2) AS avg_hr,
                    AVG(weight)::NUMERIC(10,2) AS avg_weight
             FROM family_medicine_visits WHERE tenant_id = $1 AND deleted_at IS NULL AND visit_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const w = await db.query(
            `SELECT risk, COUNT(*) AS count FROM family_medicine_wellness WHERE tenant_id = $1 AND deleted_at IS NULL GROUP BY risk`,
            [req.tenantId]
        );
        const riskMap = {};
        w.rows.forEach(x => { riskMap[x.risk || 'unknown'] = parseInt(x.count); });
        res.json({ ok: true, visits_90d: v.rows[0], risk_distribution: riskMap });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
