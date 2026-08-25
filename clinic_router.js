// filepath: namaweb/clinic_router.js
// Clinical specialty router — dental/derm/eye/nephrology/joint/stent.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Dental records
router.get('/dental', requireAuth, requireTenantScope, requireRole('doctor', 'dentist', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`visit_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, tooth_number, condition, treatment_done, affected_surfaces, visit_date
            FROM dental_records WHERE ${conditions.join(' AND ')}
            ORDER BY visit_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, records: r.rows });
    } catch (err) { console.error('GET /api/clinic/dental', err); res.status(500).json({ error: 'internal_error' }); }
});

// Dental periodontal
router.get('/dental/periodontal', requireAuth, requireTenantScope, requireRole('doctor', 'dentist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, tooth_number, probing_depth, bleeding_on_probing, gingival_recession, exam_date FROM dental_periodontal_exams WHERE tenant_id = $1 ORDER BY exam_date DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, exams: r.rows });
    } catch (err) { console.error('GET /api/clinic/dental/periodontal', err); res.status(500).json({ error: 'internal_error' }); }
});

// Dermatology
router.get('/dermatology', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, body_site, lesion_type, color, size_mm, distribution, biopsy_taken, notes, exam_date FROM dermatology_lesions WHERE tenant_id = $1 ORDER BY exam_date DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, lesions: r.rows });
    } catch (err) { console.error('GET /api/clinic/dermatology', err); res.status(500).json({ error: 'internal_error' }); }
});

// Eye exams
router.get('/eye-exams', requireAuth, requireTenantScope, requireRole('doctor', 'admin', 'nurse'), async (req, res) => {
    try {
        const { patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, exam_date, od_va_uncorrected, os_va_uncorrected,
                   od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method,
                   od_sphere, os_sphere, od_cylinder, os_cylinder, slit_lamp_exam, fundoscopy_exam, notes
            FROM eye_exams WHERE ${conditions.join(' AND ')}
            ORDER BY exam_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, exams: r.rows });
    } catch (err) { console.error('GET /api/clinic/eye-exams', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/eye-exams', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, exam_date, od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method, od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis, slit_lamp_exam, fundoscopy_exam, notes } = req.body;
        if (!patient_id || !exam_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO eye_exams (tenant_id, patient_id, doctor_id, exam_date, od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method, od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis, slit_lamp_exam, fundoscopy_exam, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING id
        `, [req.tenantId, patient_id, req.userId, exam_date, od_va_uncorrected || null, os_va_uncorrected || null, od_va_corrected || null, os_va_corrected || null, od_iop || null, os_iop || null, iop_method || '', od_sphere || null, os_sphere || null, od_cylinder || null, os_cylinder || null, od_axis || null, os_axis || null, slit_lamp_exam || '', fundoscopy_exam || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinic/eye-exams', err); res.status(500).json({ error: 'internal_error' }); }
});

// Nephrology - CKD already in chronic, but renal dose adjustments
router.get('/renal-dose-adjustments', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, drug_name, original_dose, adjusted_dose,
                   gfr_at_recommendation, adjustment_reason, recommended_by, created_at
            FROM renal_dose_adjustments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, adjustments: r.rows });
    } catch (err) { console.error('GET /api/clinic/renal-dose', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/renal-dose-adjustments', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, drug_name, original_dose, adjusted_dose, gfr_at_recommendation, adjustment_reason } = req.body;
        if (!patient_id || !drug_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO renal_dose_adjustments (tenant_id, patient_id, encounter_id, drug_name, original_dose, adjusted_dose, gfr_at_recommendation, adjustment_reason, recommended_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, drug_name, original_dose || '', adjusted_dose || '', gfr_at_recommendation || null, adjustment_reason || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinic/renal-dose', err); res.status(500).json({ error: 'internal_error' }); }
});

// Joint ROM (range of motion)
router.get('/joint-rom/:patient_id', requireAuth, requireTenantScope, requireRole('therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, joint, rom_flexion_deg, rom_extension_deg, pain_scale, strength_grade, notes, log_date, created_at
            FROM joint_rom_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY log_date DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/clinic/joint-rom', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/joint-rom', requireAuth, requireTenantScope, requireRole('doctor', 'therapist'), async (req, res) => {
    try {
        const { patient_id, joint, rom_flexion_deg, rom_extension_deg, pain_scale, strength_grade, notes } = req.body;
        if (!patient_id || !joint) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO joint_rom_assessments (tenant_id, patient_id, joint, rom_flexion_deg, rom_extension_deg, pain_scale, strength_grade, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, joint, rom_flexion_deg || null, rom_extension_deg || null, pain_scale || null, strength_grade || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinic/joint-rom', err); res.status(500).json({ error: 'internal_error' }); }
});

// Stent registry (cardiology)
router.get('/stents', requireAuth, requireTenantScope, requireRole('cardiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, stent_type, brand, model, location, vessel,
                   placement_date, expiration_date, status, surgeon_name, created_at
            FROM stent_registry WHERE tenant_id = $1 ORDER BY placement_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, stents: r.rows });
    } catch (err) { console.error('GET /api/clinic/stents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/stents', requireAuth, requireTenantScope, requireRole('cardiologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, stent_type, brand, model, location, vessel, placement_date, expiration_date, surgeon_name } = req.body;
        if (!patient_id || !stent_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO stent_registry (tenant_id, patient_id, stent_type, brand, model, location, vessel, placement_date, expiration_date, status, surgeon_name)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10) RETURNING id
        `, [req.tenantId, patient_id, stent_type, brand || '', model || '', location || '', vessel || '', placement_date || null, expiration_date || null, surgeon_name || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinic/stents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const d = await db.query(`SELECT COUNT(*) FILTER (WHERE visit_date >= CURRENT_DATE) as dental_today, COUNT(DISTINCT patient_id) as dental_patients FROM dental_records WHERE tenant_id = $1`, [req.tenantId]);
        const e = await db.query(`SELECT COUNT(*) FILTER (WHERE exam_date >= CURRENT_DATE - INTERVAL '30 days') as eye_exams_30d, COUNT(*) FILTER (WHERE od_iop > 21 OR os_iop > 21) as elevated_iop FROM eye_exams WHERE tenant_id = $1`, [req.tenantId]);
        const s = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'active') as active_stents, COUNT(DISTINCT patient_id) as cardiac_patients FROM stent_registry WHERE tenant_id = $1`, [req.tenantId]);
        const jo = await db.query(`SELECT COUNT(*) FILTER (WHERE log_date >= CURRENT_DATE - INTERVAL '7 days') as rom_assessments_7d FROM joint_rom_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, dental: d.rows[0], eye: e.rows[0], stents: s.rows[0], joint_rom: jo.rows[0] });
    } catch (err) { console.error('GET /api/clinic/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['dental', 'dermatology', 'eye-exams', 'renal-dose', 'joint-rom', 'stents', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
