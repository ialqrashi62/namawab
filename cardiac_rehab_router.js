'use strict';
// Wave 87 — Cardiac Rehab: structured exercise sessions with VO2/METs tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ECG = ['normal','st_depression','st_elevation','arrhythmia','paced','lvh','ischemic','uninterpretable'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'cardiac-rehab',
        endpoints: [
            'GET /sessions',
            'GET /sessions/:id',
            'POST /sessions',
            'PUT /sessions/:id',
            'GET /sessions/patient/:patientId',
            'GET /sessions/patient/:patientId/progress',
            'GET /abnormal-ecg',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/sessions', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, ecg_findings, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS created_by_name FROM cardiac_rehab_sessions s
                   LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.created_by WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (ecg_findings) { sql += ` AND s.ecg_findings = $${params.length + 1}`; params.push(ecg_findings); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/:id', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS created_by_name FROM cardiac_rehab_sessions s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.created_by
             WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, session_number, vo2_max, mets_achieved, bp_resting, ecg_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!session_number || session_number < 1) return res.status(400).json({ ok: false, error: 'session_number_required_positive' });
        if (vo2_max !== undefined && vo2_max !== null && (vo2_max < 0 || vo2_max > 100)) return res.status(400).json({ ok: false, error: 'vo2_max_out_of_range' });
        if (mets_achieved !== undefined && mets_achieved !== null && (mets_achieved < 0 || mets_achieved > 25)) return res.status(400).json({ ok: false, error: 'mets_achieved_out_of_range' });
        if (ecg_findings && !VALID_ECG.includes(ecg_findings)) return res.status(400).json({ ok: false, error: 'invalid_ecg_findings', valid: VALID_ECG });

        const r = await db.query(
            `INSERT INTO cardiac_rehab_sessions (tenant_id, patient_id, encounter_id, session_number, vo2_max, mets_achieved, bp_resting, ecg_findings, created_by, updated_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, session_number, vo2_max || null, mets_achieved || null,
             bp_resting || null, ecg_findings || null, req.user?.id || null, req.user?.id || null]
        );
        const isAbnormal = ecg_findings && ecg_findings !== 'normal' && ecg_findings !== 'paced';
        res.status(201).json({ ok: true, session: r.rows[0], requires_review: isAbnormal });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/sessions/:id', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const allowed = ['session_number','vo2_max','mets_achieved','bp_resting','ecg_findings'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'ecg_findings' && !VALID_ECG.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_ecg_findings' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`, `updated_by = $${i++}`); params.push(req.user?.id || null);
        const r = await db.query(
            `UPDATE cardiac_rehab_sessions SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/patient/:patientId', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM cardiac_rehab_sessions WHERE tenant_id = $1 AND patient_id = $2 ORDER BY session_number ASC`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, sessions: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/patient/:patientId/progress', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT session_number, vo2_max, mets_achieved, ecg_findings, created_at FROM cardiac_rehab_sessions
             WHERE tenant_id = $1 AND patient_id = $2 ORDER BY session_number ASC`,
            [req.tenantId, req.params.patientId]
        );
        if (!r.rows.length) return res.json({ ok: true, sessions: 0, improvement: null });
        const first = r.rows[0];
        const last = r.rows[r.rows.length - 1];
        const vo2Delta = (first.vo2_max && last.vo2_max) ? Math.round((last.vo2_max - first.vo2_max) * 100) / 100 : null;
        const metsDelta = (first.mets_achieved && last.mets_achieved) ? Math.round((last.mets_achieved - first.mets_achieved) * 100) / 100 : null;
        res.json({ ok: true, sessions: r.rows.length, first_vo2: first.vo2_max, latest_vo2: last.vo2_max, vo2_improvement: vo2Delta, first_mets: first.mets_achieved, latest_mets: last.mets_achieved, mets_improvement: metsDelta, series: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/abnormal-ecg', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name FROM cardiac_rehab_sessions s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.ecg_findings NOT IN ('normal','paced') AND s.ecg_findings IS NOT NULL
             ORDER BY s.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, review_recommendation: 'These sessions showed non-normal ECG findings. Consider clinical correlation and possible protocol adjustment.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_sessions, COUNT(DISTINCT patient_id) AS unique_patients,
                    AVG(vo2_max)::NUMERIC(10,2) AS avg_vo2_max, AVG(mets_achieved)::NUMERIC(10,2) AS avg_mets,
                    MAX(session_number) AS max_session_number
             FROM cardiac_rehab_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const ecg = await db.query(
            `SELECT ecg_findings, COUNT(*) AS count FROM cardiac_rehab_sessions WHERE tenant_id = $1 AND ecg_findings IS NOT NULL
             GROUP BY ecg_findings ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0], ecg_distribution: ecg.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
