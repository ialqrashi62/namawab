// filepath: namaweb/diagnostic_router.js
// Diagnostic specialty module — epilepsy, headache, MS, movement, sleep, urology.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Epilepsy
router.get('/epilepsy/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM epilepsy_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/diag/epilepsy', err); res.status(500).json({ error: 'internal_error' }); }
});

// Headache
router.get('/headache/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at FROM headache_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/diag/headache', err); res.status(500).json({ error: 'internal_error' }); }
});

// Multiple Sclerosis
router.get('/ms/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at FROM multiple_sclerosis_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/diag/ms', err); res.status(500).json({ error: 'internal_error' }); }
});

// Movement disorders (Parkinson's)
router.get('/movement/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, updrs_score, tremor, rigidity, bradykinesia, gait, performed_by, created_at
            FROM movement_disorders_clinical WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/diag/movement', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/movement', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, updrs_score, tremor, rigidity, bradykinesia, gait } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO movement_disorders_clinical (tenant_id, patient_id, encounter_id, updrs_score, tremor, rigidity, bradykinesia, gait, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, updrs_score || null, tremor || '', rigidity || '', bradykinesia || '', gait || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/diag/movement', err); res.status(500).json({ error: 'internal_error' }); }
});

// Sleep medicine
router.get('/sleep/:patient_id', requireAuth, requireTenantScope, requireRole('sleep_specialist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM sleep_medicine_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/diag/sleep', err); res.status(500).json({ error: 'internal_error' }); }
});

// Urology
router.get('/urology', requireAuth, requireTenantScope, requireRole('urologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, surgeon_id, operation_date, procedure_type, approach,
                   duration_minutes, blood_loss_ml, complications, created_at
            FROM urology_surgical_logs WHERE tenant_id = $1 ORDER BY operation_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, surgeries: r.rows });
    } catch (err) { console.error('GET /api/diag/urology', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/urology', requireAuth, requireTenantScope, requireRole('urologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id || !operation_date || !procedure_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO urology_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, surgeon_id || null, operation_date, procedure_type, approach || '', duration_minutes || null, blood_loss_ml || null, complications || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/diag/urology', err); res.status(500).json({ error: 'internal_error' }); }
});

// Universal score-based assessment capture (engine_name + score + risk_level)
router.post('/scored-assessment', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { table_name, patient_id, encounter_id, score, risk_level, recommendation, input_payload } = req.body;
        if (!table_name || !patient_id) return res.status(400).json({ error: 'missing_required', required: ['table_name', 'patient_id'] });
        // Whitelist valid tables
        const valid = [
            'epilepsy_assessments','headache_assessments','multiple_sclerosis_assessments',
            'sleep_medicine_assessments','urology_assessments','immunology_assessments',
            'allergy_assessments','genetics_assessments','hematology_assessments',
            'speech_therapy_assessments','physiotherapy_assessments','occupational_therapy_assessments',
            'pain_management_assessments','psychiatry_assessments','infectious_disease_assessments',
            'transplant_assessments','stroke_unit_assessments','fetal_medicine_assessments',
            'neurosurgery_assessments','joint_assessments','wound_assessments','wound_care_assessments',
            'ivf_assessments','nursing_assessments','palliative_care_assessments','nephrology_ckd_assessments',
            'icu_assessments','nicu_assessments','picu_assessments','ccu_assessments','cicu_assessments','ctu_assessments',
            'trauma_assessments','burn_unit_assessments','ccu_visits'
        ];
        if (!valid.includes(table_name)) return res.status(400).json({ error: 'invalid_table_name' });
        const r = await db.query(`
            INSERT INTO ${table_name} (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
            VALUES ($1, $2, $3, $4, $5, '{}', $6, $7, $8, $9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, 'scoring-engine', JSON.stringify(input_payload || {}), score || null, risk_level || 'low', recommendation || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, table: table_name });
    } catch (err) { console.error('POST /api/diag/scored-assessment', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM movement_disorders_clinical WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as movement_30d,
                (SELECT COUNT(*) FROM urology_surgical_logs WHERE tenant_id = $1) as total_urology_surgeries,
                (SELECT COUNT(*) FROM epilepsy_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as epilepsy_30d
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0] });
    } catch (err) { console.error('GET /api/diag/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['epilepsy', 'headache', 'ms', 'movement', 'sleep', 'urology', 'scored-assessment', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
