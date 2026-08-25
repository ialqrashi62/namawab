'use strict';
// Wave 75 — Rehabilitation: physio sessions + rehab assessments
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PAIN_RANGE = (v) => v === null || v === undefined || (Number.isFinite(v) && v >= 0 && v <= 10);
const MOBILITY_RANGE = (v) => v === null || v === undefined || (Number.isFinite(v) && v >= 0 && v <= 100);

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'rehab',
        endpoints: [
            'GET /sessions',
            'GET /sessions/:id',
            'POST /sessions',
            'PUT /sessions/:id',
            'GET /assessments',
            'POST /assessments',
            'GET /assessments/patient/:patientId',
            'GET /patient-summary/:patientId',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== PHYSIO SESSIONS =====
router.get('/sessions', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const { patient_id, limit = 50, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn FROM physio_sessions s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/:id', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn FROM physio_sessions s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, mobility_score, strength, balance, exercises, progress } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!MOBILITY_RANGE(mobility_score)) return res.status(400).json({ ok: false, error: 'mobility_score_out_of_range' });

        const r = await db.query(
            `INSERT INTO physio_sessions (tenant_id, patient_id, encounter_id, mobility_score, strength, balance, exercises, progress, created_by, updated_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, mobility_score || null, strength || null, balance || null,
             exercises ? JSON.stringify(exercises) : null, progress || null, req.user?.id || null, req.user?.id || null]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/sessions/:id', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const body = req.body || {};
        const allowed = ['mobility_score','strength','balance','exercises','progress'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in body) {
                let v = body[k];
                if (k === 'exercises' && typeof v === 'object') v = JSON.stringify(v);
                sets.push(`${k} = $${i++}`); params.push(v);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`, `updated_by = $${i++}`); params.push(req.user?.id || null);
        const r = await db.query(
            `UPDATE physio_sessions SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB ASSESSMENTS =====
router.get('/assessments', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const { patient_id, type, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name, p.mrn, u.full_name AS assessor_name FROM rehab_assessments a LEFT JOIN patients p ON p.id = a.patient_id LEFT JOIN users u ON u.id = a.assessor WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (type) { sql += ` AND a.assessment_type = $${params.length + 1}`; params.push(type); }
        sql += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const { patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!VALID_PAIN_RANGE(pain_level)) return res.status(400).json({ ok: false, error: 'pain_level_out_of_range' });

        const r = await db.query(
            `INSERT INTO rehab_assessments (tenant_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, assessment_type || null, rom_scores ? JSON.stringify(rom_scores) : null,
             strength_scores ? JSON.stringify(strength_scores) : null,
             functional_scores ? JSON.stringify(functional_scores) : null,
             balance_scores ? JSON.stringify(balance_scores) : null,
             pain_level !== undefined ? pain_level : null,
             assessor || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/patient/:patientId', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, u.full_name AS assessor_name FROM rehab_assessments a LEFT JOIN users u ON u.id = a.assessor
             WHERE a.tenant_id = $1 AND a.patient_id = $2 ORDER BY a.created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        const latest = r.rows[0] || null;
        const avgPain = r.rows.length ? (r.rows.reduce((a, b) => a + (b.pain_level || 0), 0) / r.rows.length).toFixed(2) : null;
        res.json({ ok: true, count: r.rows.length, latest, avg_pain: avgPain, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COMBINED VIEW =====
router.get('/patient-summary/:patientId', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const sess = await db.query(
            `SELECT id, mobility_score, strength, balance, progress, created_at FROM physio_sessions WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 5`,
            [req.tenantId, req.params.patientId]
        );
        const ass = await db.query(
            `SELECT id, assessment_type, pain_level, rom_scores, functional_scores, created_at FROM rehab_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 5`,
            [req.tenantId, req.params.patientId]
        );
        const sessCount = await db.query(`SELECT COUNT(*) AS c FROM physio_sessions WHERE tenant_id = $1 AND patient_id = $2`, [req.tenantId, req.params.patientId]);
        const assCount = await db.query(`SELECT COUNT(*) AS c FROM rehab_assessments WHERE tenant_id = $1 AND patient_id = $2`, [req.tenantId, req.params.patientId]);
        res.json({
            ok: true,
            recent_sessions: sess.rows,
            recent_assessments: ass.rows,
            totals: { physio_sessions: parseInt(sessCount.rows[0].c), rehab_assessments: parseInt(assCount.rows[0].c) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const s = await db.query(
            `SELECT COUNT(*) AS total_sessions, COUNT(DISTINCT patient_id) AS unique_patients,
                    AVG(mobility_score)::NUMERIC(10,2) AS avg_mobility, AVG(balance)::NUMERIC(10,2) AS avg_balance
             FROM physio_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const a = await db.query(
            `SELECT COUNT(*) AS total_assessments, AVG(pain_level)::NUMERIC(10,2) AS avg_pain, COUNT(DISTINCT patient_id) AS unique_patients
             FROM rehab_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const types = await db.query(
            `SELECT assessment_type, COUNT(*) AS count FROM rehab_assessments WHERE tenant_id = $1 AND assessment_type IS NOT NULL
             GROUP BY assessment_type ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, sessions_90d: s.rows[0], assessments_90d: a.rows[0], assessment_types: types.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
