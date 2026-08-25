// filepath: namaweb/therapy_router.js
// Therapy + Rehab module — physiotherapy, speech, occupational, cardiac meds.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Physiotherapy assessments
router.get('/physio', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'therapist', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM physiotherapy_assessments WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/therapy/physio', err); res.status(500).json({ error: 'internal_error' }); }
});

// Speech therapy assessments
router.get('/speech/assessments', requireAuth, requireTenantScope, requireRole('doctor', 'therapist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM speech_therapy_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/therapy/speech/assessments', err); res.status(500).json({ error: 'internal_error' }); }
});

// Speech therapy sessions
router.get('/speech/sessions', requireAuth, requireTenantScope, requireRole('therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, dysphagia_grade, language, articulation, asha_score, progress, session_date, created_by, created_at
            FROM speech_therapy_sessions WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, sessions: r.rows });
    } catch (err) { console.error('GET /api/therapy/speech/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/speech/sessions', requireAuth, requireTenantScope, requireRole('therapist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, dysphagia_grade, language, articulation, asha_score, progress, session_date } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO speech_therapy_sessions (tenant_id, patient_id, encounter_id, dysphagia_grade, language, articulation, asha_score, progress, session_date, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,CURRENT_DATE),$10) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, dysphagia_grade || null, language || '', articulation || '', asha_score || null, progress || '', session_date, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/therapy/speech/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

// Occupational therapy assessments
router.get('/occupational', requireAuth, requireTenantScope, requireRole('therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM occupational_therapy_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/therapy/occupational', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cardiac medications
router.get('/cardiac-medications/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, dosage, frequency, start_date, end_date, is_active, created_at
            FROM cardiac_medications WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY start_date DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, medications: r.rows });
    } catch (err) { console.error('GET /api/therapy/cardiac-medications', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cardiac-medications', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, drug_name, dosage, frequency, start_date, end_date, is_active } = req.body;
        if (!patient_id || !drug_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cardiac_medications (tenant_id, patient_id, drug_name, dosage, frequency, start_date, end_date, is_active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,true)) RETURNING id
        `, [req.tenantId, patient_id, drug_name, dosage || '', frequency || '', start_date || null, end_date || null, is_active]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/therapy/cardiac-medications', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cardiac-medications/:id/discontinue', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE cardiac_medications SET is_active = false, end_date = COALESCE(end_date, CURRENT_DATE)
            WHERE id = $1 AND tenant_id = $2 AND is_active = true RETURNING id, is_active, end_date
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_inactive' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/therapy/cardiac-medications/discontinue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'therapist', 'doctor'), async (req, res) => {
    try {
        const physio = await db.query(`
            SELECT COUNT(*) as assessments_30d,
                   ROUND(AVG(score)::numeric, 1) as avg_score,
                   COUNT(*) FILTER (WHERE risk_level IN ('high','critical')) as high_risk
            FROM physiotherapy_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const speech = await db.query(`
            SELECT COUNT(*) as sessions_30d,
                   ROUND(AVG(asha_score)::numeric, 1) as avg_asha
            FROM speech_therapy_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const cardio = await db.query(`
            SELECT COUNT(*) FILTER (WHERE is_active) as active_meds,
                   COUNT(DISTINCT patient_id) as cardiac_patients
            FROM cardiac_medications WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, physio_30d: physio.rows[0], speech_30d: speech.rows[0], cardiac: cardio.rows[0] });
    } catch (err) { console.error('GET /api/therapy/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['physio', 'speech', 'occupational', 'cardiac-medications', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
