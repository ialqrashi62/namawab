'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Movement disorders (UPDRS-like)
router.get('/movement/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, log_date, tremor_score, rigidity_score, bradykinesia_score, postural_instability_score, gait_score, total_updrs_score, mobility_aid, falls_count, examined_by, created_at FROM movement_disorders_clinical WHERE tenant_id = $1 AND patient_id = $2 ORDER BY log_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        // Auto-classify Hoehn-Yahr
        const enriched = r.rows.map(row => {
            const score = +row.total_updrs_score || 0;
            let hy_stage = '0';
            if (score > 0 && score < 30) hy_stage = '1';
            else if (score >= 30 && score < 60) hy_stage = '2';
            else if (score >= 60 && score < 90) hy_stage = '3';
            else if (score >= 90 && score < 120) hy_stage = '4';
            else if (score >= 120) hy_stage = '5';
            return Object.assign({}, row, { computed_hy_stage: hy_stage });
        });
        res.json({ ok: true, total: enriched.length, assessments: enriched });
    } catch (err) { console.error('GET /api/ns/movement', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/movement', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, tremor_score, rigidity_score, bradykinesia_score, postural_instability_score, gait_score, mobility_aid, falls_count } = req.body;
        if (!patient_id || !log_date) return res.status(400).json({ error: 'missing_required' });
        const total = (+tremor_score || 0) + (+rigidity_score || 0) + (+bradykinesia_score || 0) + (+postural_instability_score || 0) + (+gait_score || 0);
        const r = await db.query(`INSERT INTO movement_disorders_clinical (tenant_id, patient_id, log_date, tremor_score, rigidity_score, bradykinesia_score, postural_instability_score, gait_score, total_updrs_score, mobility_aid, falls_count, examined_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`, [req.tenantId, patient_id, log_date, tremor_score || 0, rigidity_score || 0, bradykinesia_score || 0, postural_instability_score || 0, gait_score || 0, total, mobility_aid || '', falls_count || 0, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, total_updrs_score: total });
    } catch (err) { console.error('POST /api/ns/movement', err); res.status(500).json({ error: 'internal_error' }); }
});

// Joint ROM (range of motion)
router.get('/rom/:patient_id', requireAuth, requireTenantScope, requireRole('therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, joint, rom_flexion_deg, rom_extension_deg, pain_scale, strength_grade, recorded_at FROM joint_rom_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY recorded_at DESC LIMIT 100`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, rom: r.rows });
    } catch (err) { console.error('GET /api/ns/rom', err); res.status(500).json({ error: 'internal_error' }); }
});

// Memory clinic
router.get('/memory/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, mmse_score, moca_score, cdr_stage, gds_score, education_years, bilingual_factor, examined_by, created_at FROM memory_clinic_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        const enriched = r.rows.map(row => {
            let mmse_interpretation = '';
            if (row.mmse_score >= 24) mmse_interpretation = 'normal';
            else if (row.mmse_score >= 19) mmse_interpretation = 'mild_cognitive_impairment';
            else if (row.mmse_score >= 11) mmse_interpretation = 'moderate_dementia';
            else if (row.mmse_score != null) mmse_interpretation = 'severe_dementia';
            return Object.assign({}, row, { mmse_interpretation });
        });
        res.json({ ok: true, total: enriched.length, assessments: enriched });
    } catch (err) { console.error('GET /api/ns/memory', err); res.status(500).json({ error: 'internal_error' }); }
});

// Speech therapy dysphagia grades
router.get('/dysphagia/:patient_id', requireAuth, requireTenantScope, requireRole('speech_therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, session_date, dysphagia_grade, language, articulation, asha_score, progress FROM speech_therapy_sessions WHERE tenant_id = $1 AND patient_id = $2 ORDER BY session_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, sessions: r.rows });
    } catch (err) { console.error('GET /api/ns/dysphagia', err); res.status(500).json({ error: 'internal_error' }); }
});

// IVF records
router.get('/ivf/:patient_id', requireAuth, requireTenantScope, requireRole('reproductive_endocrinologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, cycle_type, cycle_date, protocol_used, follicles_count, oocytes_retrieved, embryos_created, fertilization_rate, endometrial_thickness_mm, pregnancy_outcome, notes, created_at FROM ivf_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY cycle_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, cycles: r.rows });
    } catch (err) { console.error('GET /api/ns/ivf', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'neurologist'), async (req, res) => {
    try {
        const m = await db.query(`SELECT COUNT(DISTINCT patient_id) as parkinson_patients, ROUND(AVG(total_updrs_score)::numeric, 1) as avg_updrs FROM movement_disorders_clinical WHERE tenant_id = $1`, [req.tenantId]);
        const me = await db.query(`SELECT COUNT(DISTINCT patient_id) as memory_clinic_patients, AVG(mmse_score)::numeric(4,1) as avg_mmse FROM memory_clinic_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const i = await db.query(`SELECT COUNT(*) as ivf_cycles, SUM(oocytes_retrieved) as total_oocytes, SUM(embryos_created) as total_embryos FROM ivf_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, movement: m.rows[0], memory: me.rows[0], ivf: i.rows[0] });
    } catch (err) { console.error('GET /api/ns/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['movement', 'rom', 'memory', 'dysphagia', 'ivf', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
