// filepath: namaweb/extra_router.js
// Extra clinical modules — burns, trauma, ortho, ENT, ophthalmic, neuro/memory.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Burn resuscitation
router.get('/burn', requireAuth, requireTenantScope, requireRole('burn_specialist', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`log_time >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, log_time, tbsa_percent, fluid_volume_ml, fluid_type, urine_output_ml_hr, created_at
            FROM burn_resuscitation_logs WHERE ${conditions.join(' AND ')}
            ORDER BY log_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, burns: r.rows });
    } catch (err) { console.error('GET /api/extra/burn', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/burn', requireAuth, requireTenantScope, requireRole('burn_specialist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, log_time, tbsa_percent, fluid_volume_ml, fluid_type, urine_output_ml_hr } = req.body;
        if (!patient_id || !log_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO burn_resuscitation_logs (tenant_id, patient_id, log_time, tbsa_percent, fluid_volume_ml, fluid_type, urine_output_ml_hr)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, patient_id, log_time, tbsa_percent || null, fluid_volume_ml || null, fluid_type || '', urine_output_ml_hr || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/burn', err); res.status(500).json({ error: 'internal_error' }); }
});

// Fracture management
router.get('/fractures', requireAuth, requireTenantScope, requireRole('orthopedic', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, ao_ota_classification, fixation_method, complications, created_at
            FROM fracture_management_logs WHERE tenant_id = $1 ORDER BY operation_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, fractures: r.rows });
    } catch (err) { console.error('GET /api/extra/fractures', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/fractures', requireAuth, requireTenantScope, requireRole('orthopedic', 'doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, ao_ota_classification, fixation_method, complications } = req.body;
        if (!patient_id || !operation_date || !procedure_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO fracture_management_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, ao_ota_classification, fixation_method, complications)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, surgeon_id || null, operation_date, procedure_type, side || '', duration_minutes || null, ao_ota_classification || '', fixation_method || '', complications || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/fractures', err); res.status(500).json({ error: 'internal_error' }); }
});

// Joint replacements
router.get('/joint-replacements', requireAuth, requireTenantScope, requireRole('orthopedic', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number,
                   implant_size, alignment_angle, stability_grade, created_at
            FROM joint_replacement_registry WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, replacements: r.rows });
    } catch (err) { console.error('GET /api/extra/joint-replacements', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/joint-replacements', requireAuth, requireTenantScope, requireRole('orthopedic', 'doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade } = req.body;
        if (!patient_id || !joint_replaced) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO joint_replacement_registry (tenant_id, patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, procedure_id || null, joint_replaced, implant_brand || '', implant_model || '', implant_serial_number || '', implant_size || '', alignment_angle || null, stability_grade || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/joint-replacements', err); res.status(500).json({ error: 'internal_error' }); }
});

// Memory clinic (geriatric cognitive)
router.get('/memory/:patient_id', requireAuth, requireTenantScope, requireRole('geriatrician', 'neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, mmse_score, moca_score, cdr_stage, behavioural_changes, caregiver, created_at
            FROM memory_clinic_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/extra/memory', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/memory', requireAuth, requireTenantScope, requireRole('geriatrician', 'neurologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, mmse_score, moca_score, cdr_stage, behavioural_changes, caregiver } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO memory_clinic_assessments (tenant_id, patient_id, encounter_id, mmse_score, moca_score, cdr_stage, behavioural_changes, caregiver)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, mmse_score || null, moca_score || null, cdr_stage || null, behavioural_changes || '', caregiver || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/memory', err); res.status(500).json({ error: 'internal_error' }); }
});

// ENT surgical logs
router.get('/ent-surgery', requireAuth, requireTenantScope, requireRole('ent_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications, created_at FROM ent_surgical_logs WHERE tenant_id = $1 ORDER BY operation_date DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, surgeries: r.rows });
    } catch (err) { console.error('GET /api/extra/ent-surgery', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/ent-surgery', requireAuth, requireTenantScope, requireRole('ent_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications } = req.body;
        if (!patient_id || !operation_date || !procedure_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO ent_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, surgeon_id || null, operation_date, procedure_type, side || '', duration_minutes || null, complications || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/ent-surgery', err); res.status(500).json({ error: 'internal_error' }); }
});

// Ophthalmic surgical logs
router.get('/ophth-surgery', requireAuth, requireTenantScope, requireRole('ophthalmologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications, created_at FROM ophthalmic_surgical_logs WHERE tenant_id = $1 ORDER BY operation_date DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, surgeries: r.rows });
    } catch (err) { console.error('GET /api/extra/ophth-surgery', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/ophth-surgery', requireAuth, requireTenantScope, requireRole('ophthalmologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications } = req.body;
        if (!patient_id || !operation_date || !procedure_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO ophthalmic_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, surgeon_id || null, operation_date, procedure_type, side || '', duration_minutes || null, complications || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/extra/ophth-surgery', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const b = await db.query(`SELECT COUNT(*) as burn_logs, ROUND(AVG(tbsa_percent)::numeric, 1) as avg_tbsa FROM burn_resuscitation_logs WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        const f = await db.query(`SELECT COUNT(*) as total_fractures, COUNT(*) FILTER (WHERE operation_date >= CURRENT_DATE - INTERVAL '30 days') as fractures_30d FROM fracture_management_logs WHERE tenant_id = $1`, [req.tenantId]);
        const jr = await db.query(`SELECT COUNT(*) as total_replacements, COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as replacements_30d FROM joint_replacement_registry WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, burn_30d: b.rows[0], fractures: f.rows[0], joint_replacements: jr.rows[0] });
    } catch (err) { console.error('GET /api/extra/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['burn', 'fractures', 'joint-replacements', 'memory', 'ent-surgery', 'ophth-surgery', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
