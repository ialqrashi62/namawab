'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Oncology regimens
router.get('/regimens/:patient_id', requireAuth, requireTenantScope, requireRole('oncologist', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, regimen_name, cycle_number, status, start_date, completion_date, cumulative_dose, notes, created_at FROM oncology_patient_regimens WHERE tenant_id = $1 AND patient_id = $2 ORDER BY start_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, regimens: r.rows });
    } catch (err) { console.error('GET /api/onco/regimens', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/regimens', requireAuth, requireTenantScope, requireRole('oncologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, regimen_name, cycle_number, status, start_date } = req.body;
        if (!patient_id || !regimen_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO oncology_patient_regimens (tenant_id, patient_id, regimen_name, cycle_number, status, start_date) VALUES ($1,$2,$3,$4,COALESCE($5,'active'),COALESCE($6,CURRENT_DATE)) RETURNING id`, [req.tenantId, patient_id, regimen_name, cycle_number || null, status, start_date]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/onco/regimens', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/regimens/:id/complete', requireAuth, requireTenantScope, requireRole('oncologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE oncology_patient_regimens SET status = 'completed', completion_date = CURRENT_DATE WHERE id = $1 AND tenant_id = $2 RETURNING id, status, completion_date`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/onco/regimens/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cosmetic cases
router.get('/cosmetic-cases/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'aesthetic_surgeon'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, procedure_name, surgical_approach, anesthetic_type, satisfaction_score, complications, outcome_notes, surgery_date, created_at FROM cosmetic_cases WHERE tenant_id = $1 AND patient_id = $2 ORDER BY surgery_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, cases: r.rows });
    } catch (err) { console.error('GET /api/onco/cosmetic-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cosmetic-cases', requireAuth, requireTenantScope, requireRole('doctor', 'aesthetic_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure_name, surgical_approach, anesthetic_type, satisfaction_score, complications, outcome_notes, surgery_date } = req.body;
        if (!patient_id || !procedure_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO cosmetic_cases (tenant_id, patient_id, procedure_name, surgical_approach, anesthetic_type, satisfaction_score, complications, outcome_notes, surgery_date, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,CURRENT_DATE),$10) RETURNING id`, [req.tenantId, patient_id, procedure_name, surgical_approach || '', anesthetic_type || '', satisfaction_score || null, complications || '', outcome_notes || '', surgery_date, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/onco/cosmetic-cases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/cosmetic-followups/:case_id', requireAuth, requireTenantScope, requireRole('doctor', 'aesthetic_surgeon', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, follow_up_date, healing_status, satisfaction, complications_resolved, notes, created_at FROM cosmetic_followups WHERE tenant_id = $1 AND case_id = $2 ORDER BY follow_up_date DESC LIMIT 30`, [req.tenantId, req.params.case_id]);
        res.json({ ok: true, total: r.rows.length, followups: r.rows });
    } catch (err) { console.error('GET /api/onco/cosmetic-followups', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cosmetic-followups', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'aesthetic_surgeon'), async (req, res) => {
    try {
        const { case_id, follow_up_date, healing_status, satisfaction, complications_resolved, notes } = req.body;
        if (!case_id || !follow_up_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO cosmetic_followups (tenant_id, case_id, follow_up_date, healing_status, satisfaction, complications_resolved, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, [req.tenantId, case_id, follow_up_date, healing_status || '', satisfaction || null, complications_resolved || false, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/onco/cosmetic-followups', err); res.status(500).json({ error: 'internal_error' }); }
});

// Chemotherapy infusion tracker
router.get('/chemo-record', requireAuth, requireTenantScope, requireRole('oncologist', 'nurse', 'admin'), async (req, res) => {
    try {
        const { regimen_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (regimen_id) { params.push(regimen_id); conditions.push(`regimen_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`SELECT id, regimen_id, patient_id, infusion_start, infusion_end, drugs_administrated, total_volume_ml, pre_vitals, post_vitals, reactions, nurse_notes FROM chemo_infusions WHERE ${conditions.join(' AND ')} ORDER BY infusion_start DESC LIMIT $${params.length}`, params);
        res.json({ ok: true, total: r.rows.length, infusions: r.rows });
    } catch (err) { console.error('GET /api/onco/chemo-record', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'oncologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'active') as active_regimens, COUNT(*) as total_regimens, COUNT(DISTINCT patient_id) as cancer_patients FROM oncology_patient_regimens WHERE tenant_id = $1`, [req.tenantId]);
        const c = await db.query(`SELECT COUNT(*) FILTER (WHERE follow_up_date >= CURRENT_DATE) as upcoming_followups, COUNT(*) FILTER (WHERE complications != '' AND complications IS NOT NULL) as cases_with_complications, ROUND(AVG(satisfaction_score)::numeric, 1) as avg_satisfaction FROM cosmetic_cases WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, oncology: r.rows[0], cosmetic: c.rows[0] });
    } catch (err) { console.error('GET /api/onco/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['regimens', 'cosmetic-cases', 'cosmetic-followups', 'chemo-record', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
