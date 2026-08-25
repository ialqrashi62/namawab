'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Joint assessment (DAS28-like RA)
router.get('/joint-assessments/:patient_id', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor', 'rheumatologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, doctor_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes, created_at FROM joint_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY assessment_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        const enriched = r.rows.map(row => {
            let da28_activity = '';
            if (row.das28_score != null) {
                if (row.das28_score < 2.6) da28_activity = 'remission';
                else if (row.das28_score <= 3.2) da28_activity = 'low_activity';
                else if (row.das28_score <= 5.1) da28_activity = 'moderate_activity';
                else da28_activity = 'high_activity';
            }
            return Object.assign({}, row, { computed_da28_activity: da28_activity });
        });
        res.json({ ok: true, total: enriched.length, assessments: enriched });
    } catch (err) { console.error('GET /api/joint-ivf/joint-assessments', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/joint-assessments', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor', 'rheumatologist'), async (req, res) => {
    try {
        const { patient_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes } = req.body;
        if (!patient_id || !assessment_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO joint_assessments (tenant_id, patient_id, doctor_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, req.userId, assessment_date, tender_joint_count || null, swollen_joint_count || null, vas_pain || null, das28_score || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/joint-ivf/joint-assessments', err); res.status(500).json({ error: 'internal_error' }); }
});

// Joint ROM (deep)
router.post('/rom', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'therapist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted } = req.body;
        if (!patient_id || !joint_name || !movement_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO joint_rom_assessments (tenant_id, patient_id, doctor_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, req.userId, assessment_date || new Date().toISOString().substring(0, 10), joint_name, lateral_side || 'right', movement_type, angle_degrees || null, !!is_restricted]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/joint-ivf/rom', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/rom/:patient_id', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, joint_name, lateral_side, movement_type, angle_degrees, is_restricted, assessment_date FROM joint_rom_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY assessment_date DESC LIMIT 200`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/joint-ivf/rom', err); res.status(500).json({ error: 'internal_error' }); }
});

// Joint replacement registry
router.get('/replacement/:patient_id', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade, created_at FROM joint_replacement_registry WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, replacements: r.rows });
    } catch (err) { console.error('GET /api/joint-ivf/replacement', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/replacement', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade } = req.body;
        if (!patient_id || !joint_replaced) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO joint_replacement_registry (tenant_id, patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, [req.tenantId, patient_id, procedure_id || null, joint_replaced, implant_brand || '', implant_model || '', implant_serial_number || '', implant_size || '', alignment_angle || null, stability_grade || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/joint-ivf/replacement', err); res.status(500).json({ error: 'internal_error' }); }
});

// IVF assessment engine-result store
router.post('/ivf-assessments', requireAuth, requireTenantScope, requireRole('reproductive_endocrinologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation } = req.body;
        if (!patient_id || !engine_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO ivf_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, engine_name, JSON.stringify(input_payload || {}), JSON.stringify(output_payload || {}), score || null, risk_level || '', recommendation || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/joint-ivf/ivf-assessments', err); res.status(500).json({ error: 'internal_error' }); }
});

// IVF lab logs
router.post('/ivf-labs', requireAuth, requireTenantScope, requireRole('reproductive_endocrinologist', 'embryologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, cycle_id, log_date, oocyte_count, fertilization_rate, embryo_grade, embryo_stage, transfer_date, cryopreservation_count } = req.body;
        if (!patient_id || !log_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO obgyn_ivf_lab_logs (tenant_id, patient_id, cycle_id, log_date, oocyte_count, fertilization_rate, embryo_grade, embryo_stage, transfer_date, cryopreservation_count) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, [req.tenantId, patient_id, cycle_id || null, log_date, oocyte_count || null, fertilization_rate || null, embryo_grade || '', embryo_stage || '', transfer_date || null, cryopreservation_count || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/joint-ivf/ivf-labs', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/ivf-labs/:patient_id', requireAuth, requireTenantScope, requireRole('reproductive_endocrinologist', 'embryologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, cycle_id, log_date, oocyte_count, fertilization_rate, embryo_grade, embryo_stage, transfer_date, cryopreservation_count, created_at FROM obgyn_ivf_lab_logs WHERE tenant_id = $1 AND patient_id = $2 ORDER BY log_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, logs: r.rows });
    } catch (err) { console.error('GET /api/joint-ivf/ivf-labs', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'orthopedic_surgeon', 'reproductive_endocrinologist'), async (req, res) => {
    try {
        const j = await db.query(`SELECT COUNT(*) as total_joint_assessments, AVG(das28_score)::numeric(4,2) as avg_das28, COUNT(DISTINCT patient_id) as ra_patients FROM joint_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const r = await db.query(`SELECT COUNT(*) as total_replacements, COUNT(DISTINCT joint_replaced) as distinct_joints FROM joint_replacement_registry WHERE tenant_id = $1`, [req.tenantId]);
        const i = await db.query(`SELECT COUNT(*) as ivf_lab_events, SUM(oocyte_count) as total_oocytes, AVG(fertilization_rate)::numeric(4,2) as avg_fert_rate FROM obgyn_ivf_lab_logs WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, joint_assessments: j.rows[0], replacements: r.rows[0], ivf_labs: i.rows[0] });
    } catch (err) { console.error('GET /api/joint-ivf/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['joint-assessments', 'rom', 'replacement', 'ivf-assessments', 'ivf-labs', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
