// filepath: namaweb/specialty_registry_router.js
// Specialty registries — Gynec-oncology + Hematology + Neonatology.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Gyn Oncology Registry
router.get('/gyn-oncology', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { stage, grade, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (stage) { params.push(stage); conditions.push(`stage = $${params.length}`); }
        if (grade) { params.push(grade); conditions.push(`grade = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, diagnosis, stage, grade, treatment_plan, surgery_type, created_at
            FROM gyn_oncology_registry WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, registry: r.rows });
    } catch (err) { console.error('GET /api/sr/gyn-oncology', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/gyn-oncology', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, diagnosis, stage, grade, treatment_plan, surgery_type } = req.body;
        if (!patient_id || !diagnosis || !stage) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO gyn_oncology_registry (tenant_id, patient_id, diagnosis, stage, grade, treatment_plan, surgery_type)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, patient_id, diagnosis, stage, grade || '', treatment_plan || '', surgery_type || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/sr/gyn-oncology', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/gyn-oncology/stage-stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT stage, COUNT(*) as patients, AVG(EXTRACT(YEAR FROM AGE(NOW(), created_at)))::numeric(4,1) as avg_years_since_dx
            FROM gyn_oncology_registry WHERE tenant_id = $1 GROUP BY stage ORDER BY stage
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, by_stage: r.rows });
    } catch (err) { console.error('GET /api/sr/gyn-oncology/stage-stats', err); res.status(500).json({ error: 'internal_error' }); }
});

// Hematology
router.get('/hematology/results/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, cbc_date, hemoglobin, wbc, platelets, morphology, created_at
            FROM hematology_results WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY cbc_date DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, results: r.rows });
    } catch (err) { console.error('GET /api/sr/hematology/results', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/hematology/results', requireAuth, requireTenantScope, requireRole('doctor', 'lab'), async (req, res) => {
    try {
        const { patient_id, encounter_id, cbc_date, hemoglobin, wbc, platelets, morphology } = req.body;
        if (!patient_id || !cbc_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO hematology_results (tenant_id, patient_id, encounter_id, cbc_date, hemoglobin, wbc, platelets, morphology, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, cbc_date, hemoglobin || null, wbc || null, platelets || null, morphology || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/sr/hematology/results', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/hematology/abnormal-cbc', requireAuth, requireTenantScope, requireRole('doctor', 'admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, cbc_date, hemoglobin, wbc, platelets
            FROM hematology_results WHERE tenant_id = $1
              AND (
                  (hemoglobin IS NOT NULL AND (hemoglobin < 8 OR hemoglobin > 18))
                  OR (wbc IS NOT NULL AND (wbc < 3 OR wbc > 12))
                  OR (platelets IS NOT NULL AND (platelets < 100 OR platelets > 450))
              )
            ORDER BY cbc_date DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, abnormal: r.rows });
    } catch (err) { console.error('GET /api/sr/hematology/abnormal', err); res.status(500).json({ error: 'internal_error' }); }
});

// Neonatology
router.get('/neonatal-transitions', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, birth_time, apgar_1min, apgar_5min, apgar_10min,
                   initial_stabilization_notes, surfactant_administered, surfactant_type, created_at
            FROM neonatal_transition_logs WHERE tenant_id = $1 ORDER BY birth_time DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, transitions: r.rows });
    } catch (err) { console.error('GET /api/sr/neonatal-transitions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/neonatal-transitions', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, birth_time, apgar_1min, apgar_5min, apgar_10min, initial_stabilization_notes, surfactant_administered, surfactant_type } = req.body;
        if (!patient_id || !birth_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO neonatal_transition_logs (tenant_id, patient_id, birth_time, apgar_1min, apgar_5min, apgar_10min, initial_stabilization_notes, surfactant_administered, surfactant_type)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, birth_time, apgar_1min || null, apgar_5min || null, apgar_10min || null, initial_stabilization_notes || '', surfactant_administered || false, surfactant_type || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/sr/neonatal-transitions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const on = await db.query(`SELECT COUNT(*) as total_cancer_cases, COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_cases_30d FROM gyn_oncology_registry WHERE tenant_id = $1`, [req.tenantId]);
        const hm = await db.query(`
            SELECT COUNT(*) FILTER (WHERE hemoglobin < 8) as anemia_severe,
                   COUNT(*) FILTER (WHERE wbc > 12) as leukocytosis,
                   COUNT(*) FILTER (WHERE platelets < 100) as thrombocytopenia
            FROM hematology_results WHERE tenant_id = $1 AND cbc_date >= CURRENT_DATE - INTERVAL '7 days'
        `, [req.tenantId]);
        const neo = await db.query(`
            SELECT COUNT(*) as total_births,
                   AVG(apgar_5min)::numeric(4,2) as avg_5min,
                   COUNT(*) FILTER (WHERE surfactant_administered) as surfactant_needed
            FROM neonatal_transition_logs WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, gyn_oncology: on.rows[0], hematology_7d: hm.rows[0], neonatal: neo.rows[0] });
    } catch (err) { console.error('GET /api/sr/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['gyn-oncology', 'hematology/results', 'neonatal-transitions', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
