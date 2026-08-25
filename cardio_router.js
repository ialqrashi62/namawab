// filepath: namaweb/cardio_router.js
// Cardiac/vascular/thoracic/neurosurgery specialty router.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Cardiology visits
router.get('/cardiology-visits', requireAuth, requireTenantScope, requireRole('cardiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`visit_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, visit_date, visit_type, chief_complaint, examination_findings, diagnosis, treatment_plan, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes, created_at
            FROM cardiology_visits WHERE ${conditions.join(' AND ')}
            ORDER BY visit_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/cardio/visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cardiology-visits', requireAuth, requireTenantScope, requireRole('cardiologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, visit_date, visit_type, chief_complaint, examination_findings, diagnosis, treatment_plan, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes } = req.body;
        if (!patient_id || !visit_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cardiology_visits (tenant_id, patient_id, doctor_id, visit_date, visit_type, chief_complaint, examination_findings, diagnosis, treatment_plan, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes)
            VALUES ($1,$2,$3,$4,COALESCE($5,'outpatient'),$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, patient_id, doctor_id || req.userId, visit_date, visit_type, chief_complaint || '', examination_findings || '', diagnosis || '', treatment_plan || '', bp_systolic || null, bp_diastolic || null, heart_rate || null, ef_percentage || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/visits', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cath lab reports
router.get('/cath-reports', requireAuth, requireTenantScope, requireRole('cardiologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, blockage_lad, blockage_lcx, blockage_rca, findings, recommendations, created_at
            FROM cardiology_cath_reports WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, cath_reports: r.rows });
    } catch (err) { console.error('GET /api/cardio/cath-reports', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cath-reports', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, blockage_lad, blockage_lcx, blockage_rca, findings, recommendations } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cardiology_cath_reports (tenant_id, patient_id, blockage_lad, blockage_lcx, blockage_rca, findings, recommendations)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, patient_id, blockage_lad || null, blockage_lcx || null, blockage_rca || null, findings || '', recommendations || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/cath-reports', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cardiac rehab
router.get('/rehab/:patient_id', requireAuth, requireTenantScope, requireRole('cardiologist', 'physio', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, session_date, exercise_tolerance_mets, blood_pressure_response, heart_rate_response,
                   target_heart_rate, perceived_exertion, complications, notes, created_at
            FROM cardiac_rehab_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY session_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, sessions: r.rows });
    } catch (err) { console.error('GET /api/cardio/rehab', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/rehab', requireAuth, requireTenantScope, requireRole('cardiologist', 'physio', 'doctor'), async (req, res) => {
    try {
        const { patient_id, session_date, exercise_tolerance_mets, blood_pressure_response, heart_rate_response, target_heart_rate, perceived_exertion, complications, notes } = req.body;
        if (!patient_id || !session_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cardiac_rehab_assessments (tenant_id, patient_id, session_date, exercise_tolerance_mets, blood_pressure_response, heart_rate_response, target_heart_rate, perceived_exertion, complications, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, session_date, exercise_tolerance_mets || null, blood_pressure_response || '', heart_rate_response || '', target_heart_rate || null, perceived_exertion || null, complications || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/rehab', err); res.status(500).json({ error: 'internal_error' }); }
});

// Vascular surgery cases
router.get('/vascular-cases', requireAuth, requireTenantScope, requireRole('vascular_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, procedure, vessel, approach, bypass_used, graft_diameter, created_at
            FROM vascular_surgery_cases WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, cases: r.rows });
    } catch (err) { console.error('GET /api/cardio/vascular-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/vascular-cases', requireAuth, requireTenantScope, requireRole('vascular_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, vessel, approach, bypass_used, graft_diameter } = req.body;
        if (!patient_id || !procedure) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO vascular_surgery_cases (tenant_id, patient_id, encounter_id, procedure, vessel, approach, bypass_used, graft_diameter, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, procedure, vessel || '', approach || '', bypass_used || false, graft_diameter || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/vascular-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

// Thoracic surgery cases
router.get('/thoracic-cases', requireAuth, requireTenantScope, requireRole('thoracic_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, procedure, approach, lobectomy, stage, complications, created_at
            FROM thoracic_surgery_cases WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, cases: r.rows });
    } catch (err) { console.error('GET /api/cardio/thoracic-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/thoracic-cases', requireAuth, requireTenantScope, requireRole('thoracic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, approach, lobectomy, stage, complications } = req.body;
        if (!patient_id || !procedure) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO thoracic_surgery_cases (tenant_id, patient_id, encounter_id, procedure, approach, lobectomy, stage, complications, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, procedure, approach || '', lobectomy || false, stage || '', complications || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/thoracic-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

// Neurosurgery ops
router.get('/neurosurgery-ops', requireAuth, requireTenantScope, requireRole('neurosurgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, procedure, approach, duration_hours, blood_loss_ml, gcs_pre_op, created_at
            FROM neurosurgery_ops WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, ops: r.rows });
    } catch (err) { console.error('GET /api/cardio/neuro-ops', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/neurosurgery-ops', requireAuth, requireTenantScope, requireRole('neurosurgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, approach, duration_hours, blood_loss_ml, gcs_pre_op } = req.body;
        if (!patient_id || !procedure) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO neurosurgery_ops (tenant_id, patient_id, encounter_id, procedure, approach, duration_hours, blood_loss_ml, gcs_pre_op, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, procedure, approach || '', duration_hours || null, blood_loss_ml || null, gcs_pre_op || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/neuro-ops', err); res.status(500).json({ error: 'internal_error' }); }
});

// Glaucoma tracking
router.get('/glaucoma/:patient_id', requireAuth, requireTenantScope, requireRole('ophthalmologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, log_time, iop_value, drainage_device, cup_to_disc_ratio, visual_field_loss_percent, created_at
            FROM glaucoma_metrics WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY log_time DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, glaucoma: r.rows });
    } catch (err) { console.error('GET /api/cardio/glaucoma', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/glaucoma', requireAuth, requireTenantScope, requireRole('ophthalmologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, iop_value, drainage_device, cup_to_disc_ratio, visual_field_loss_percent } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO glaucoma_metrics (tenant_id, patient_id, log_time, iop_value, drainage_device, cup_to_disc_ratio, visual_field_loss_percent)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [req.tenantId, patient_id, log_time || new Date().toISOString(), iop_value || null, drainage_device || '', cup_to_disc_ratio || null, visual_field_loss_percent || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cardio/glaucoma', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'cardiologist', 'doctor'), async (req, res) => {
    try {
        const c = await db.query(`SELECT COUNT(*) as cardio_visits, COUNT(*) FILTER (WHERE ef_percentage < 35) as low_ef FROM cardiology_visits WHERE tenant_id = $1`, [req.tenantId]);
        const r = await db.query(`SELECT COUNT(*) as cath_reports, COUNT(*) FILTER (WHERE (blockage_lad >= 70 OR blockage_lcx >= 70 OR blockage_rca >= 70)) as significant_blockage FROM cardiology_cath_reports WHERE tenant_id = $1`, [req.tenantId]);
        const s = await db.query(`SELECT COUNT(*) as vascular_cases, COUNT(*) FILTER (WHERE bypass_used) as bypass_cases FROM vascular_surgery_cases WHERE tenant_id = $1`, [req.tenantId]);
        const n = await db.query(`SELECT COUNT(*) as neuro_ops, AVG(gcs_pre_op)::numeric(4,1) as avg_gcs FROM neurosurgery_ops WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, cardiology: c.rows[0], cath: r.rows[0], vascular: s.rows[0], neurosurgery: n.rows[0] });
    } catch (err) { console.error('GET /api/cardio/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['cardiology-visits', 'cath-reports', 'rehab', 'vascular-cases', 'thoracic-cases', 'neurosurgery-ops', 'glaucoma', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
