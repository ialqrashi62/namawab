// filepath: namaweb/misc_specialty_router.js
// Misc specialty router — nuclear medicine, transplant, stroke, genetics, fetal medicine.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Nuclear medicine studies (PET/CT)
router.get('/nuclear-medicine/studies/:patient_id', requireAuth, requireTenantScope, requireRole('nuclear_med', 'radiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, tracer, study_type, uptake_pattern, suv_max, interpretation, created_at
            FROM nuclear_med_studies WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, studies: r.rows });
    } catch (err) { console.error('GET /api/misc/nm/studies', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/nuclear-medicine/studies', requireAuth, requireTenantScope, requireRole('nuclear_med', 'radiologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, tracer, study_type, uptake_pattern, suv_max, interpretation } = req.body;
        if (!patient_id || !tracer) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO nuclear_med_studies (tenant_id, patient_id, encounter_id, tracer, study_type, uptake_pattern, suv_max, interpretation)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, tracer, study_type || 'PET', uptake_pattern || '', suv_max || null, interpretation || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/misc/nm/studies', err); res.status(500).json({ error: 'internal_error' }); }
});

// Nuclear medicine logs (quantitative)
router.get('/nuclear-medicine/logs/:patient_id', requireAuth, requireTenantScope, requireRole('nuclear_med', 'radiologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, tracer_used, suv_max, uptake_region, quantification_value, created_at
            FROM nuclear_med_logs WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, logs: r.rows });
    } catch (err) { console.error('GET /api/misc/nm/logs', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/nuclear-medicine/logs', requireAuth, requireTenantScope, requireRole('nuclear_med', 'radiologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, tracer_used, suv_max, uptake_region, quantification_value } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO nuclear_med_logs (tenant_id, patient_id, tracer_used, suv_max, uptake_region, quantification_value)
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING id
        `, [req.tenantId, patient_id, tracer_used || '', suv_max || null, uptake_region || '', quantification_value || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/misc/nm/logs', err); res.status(500).json({ error: 'internal_error' }); }
});

// Transplant assessments
router.get('/transplant/:patient_id', requireAuth, requireTenantScope, requireRole('transplant_coordinator', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM transplant_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/misc/transplant', err); res.status(500).json({ error: 'internal_error' }); }
});

// Stroke unit assessments
router.get('/stroke/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM stroke_unit_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/misc/stroke', err); res.status(500).json({ error: 'internal_error' }); }
});

// Genetics assessments
router.get('/genetics/:patient_id', requireAuth, requireTenantScope, requireRole('geneticist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM genetics_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/misc/genetics', err); res.status(500).json({ error: 'internal_error' }); }
});

// Fetal medicine
router.get('/fetal-medicine/:patient_id', requireAuth, requireTenantScope, requireRole('obgyn', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, score, risk_level, recommendation, performed_by, created_at
            FROM fetal_medicine_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/misc/fetal-medicine', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const nm = await db.query(`
            SELECT COUNT(*) as nm_studies,
                   ROUND(AVG(suv_max)::numeric, 2) as avg_suv_max,
                   COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as studies_30d
            FROM nuclear_med_studies WHERE tenant_id = $1
        `, [req.tenantId]);
        const tr = await db.query(`SELECT COUNT(*) as transplant_assessments FROM transplant_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const st = await db.query(`SELECT COUNT(*) as stroke_assessments, COUNT(*) FILTER (WHERE risk_level = 'critical') as critical FROM stroke_unit_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, nuclear_medicine: nm.rows[0], transplant: tr.rows[0], stroke: st.rows[0] });
    } catch (err) { console.error('GET /api/misc/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['nuclear-medicine', 'transplant', 'stroke', 'genetics', 'fetal-medicine', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
