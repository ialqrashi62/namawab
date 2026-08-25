// filepath: namaweb/pcsc_router.js
// Palliative + Chaplaincy + Sleep + PFT.
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/palliative', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, symptom_burden, goals_of_care, advance_directive, family_meeting, spiritual_needs, created_at FROM palliative_care_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/pcsc/palliative', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/palliative', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, symptom_burden, goals_of_care, advance_directive, family_meeting, spiritual_needs } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`INSERT INTO palliative_care_assessments (tenant_id, patient_id, encounter_id, symptom_burden, goals_of_care, advance_directive, family_meeting, spiritual_needs, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, symptom_burden || '', goals_of_care || '', advance_directive || false, family_meeting || false, spiritual_needs || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pcsc/palliative', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/palliative-visits', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, visit_date, visit_type, symptom_management, distress_score, notes, created_at FROM palliative_visits WHERE tenant_id = $1 ORDER BY visit_date DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/pcsc/palliative-visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/palliative-visits', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, visit_date, visit_type, symptom_management, distress_score, notes } = req.body;
        if (!patient_id || !visit_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO palliative_visits (tenant_id, patient_id, encounter_id, visit_date, visit_type, symptom_management, distress_score, notes, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, visit_date, visit_type || 'routine', symptom_management || '', distress_score || null, notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pcsc/palliative-visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/chaplaincy', requireAuth, requireTenantScope, requireRole('chaplain', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, assessment_type, total_score, risk_level, recommendation, performed_by, created_at FROM chaplaincy_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/pcsc/chaplaincy', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/chaplaincy-visits', requireAuth, requireTenantScope, requireRole('chaplain', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, visit_type, spiritual_concern, faith_tradition, family_notified, comfort_provided, created_at FROM chaplaincy_visits WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/pcsc/chaplaincy-visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/chaplaincy-visits', requireAuth, requireTenantScope, requireRole('chaplain', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, visit_type, spiritual_concern, faith_tradition, family_notified, comfort_provided } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO chaplaincy_visits (tenant_id, patient_id, encounter_id, visit_type, spiritual_concern, faith_tradition, family_notified, comfort_provided, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, visit_type || 'pastoral', spiritual_concern || '', faith_tradition || '', family_notified || false, comfort_provided || false, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pcsc/chaplaincy-visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/sleep', requireAuth, requireTenantScope, requireRole('doctor', 'pulmonologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, encounter_id, study_date, ahi, spo2_nadir, sleep_efficiency, recommendations, cpap_pressure, created_at FROM sleep_studies WHERE tenant_id = $1 ORDER BY study_date DESC LIMIT 100`, [req.tenantId]);
        const enriched = r.rows.map(row => {
            let severity = 'normal';
            if (row.ahi >= 30) severity = 'severe';
            else if (row.ahi >= 15) severity = 'moderate';
            else if (row.ahi >= 5) severity = 'mild';
            return Object.assign({}, row, { computed_severity: severity });
        });
        res.json({ ok: true, total: enriched.length, studies: enriched });
    } catch (err) { console.error('GET /api/pcsc/sleep', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sleep', requireAuth, requireTenantScope, requireRole('doctor', 'pulmonologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, study_date, ahi, spo2_nadir, sleep_efficiency, recommendations, cpap_pressure } = req.body;
        if (!patient_id || !study_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO sleep_studies (tenant_id, patient_id, encounter_id, study_date, ahi, spo2_nadir, sleep_efficiency, recommendations, cpap_pressure, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, study_date, ahi || null, spo2_nadir || null, sleep_efficiency || null, recommendations || '', cpap_pressure || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pcsc/sleep', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/pft', requireAuth, requireTenantScope, requireRole('doctor', 'pulmonologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, encounter_id, test_date, fev1_predicted, fev1_actual, fvc_predicted, fvc_actual, fev1_fvc_ratio, gold_stage, created_at FROM pulmonology_pft_results WHERE tenant_id = $1 ORDER BY test_date DESC LIMIT 100`, [req.tenantId]);
        const enriched = r.rows.map(row => {
            let computed_ratio = row.fev1_fvc_ratio;
            if (!computed_ratio && row.fvc_actual && row.fev1_actual) computed_ratio = +(row.fev1_actual / row.fvc_actual * 100).toFixed(1);
            let gold = row.gold_stage;
            if (!gold && computed_ratio < 70 && row.fev1_actual && row.fev1_predicted) {
                const pct = row.fev1_actual / row.fev1_predicted * 100;
                gold = pct >= 80 ? 'GOLD1' : pct >= 50 ? 'GOLD2' : pct >= 30 ? 'GOLD3' : 'GOLD4';
            }
            return Object.assign({}, row, { computed_ratio: computed_ratio, computed_gold: gold });
        });
        res.json({ ok: true, total: enriched.length, pft: enriched });
    } catch (err) { console.error('GET /api/pcsc/pft', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/pft', requireAuth, requireTenantScope, requireRole('doctor', 'pulmonologist', 'respiratory_therapist'), async (req, res) => {
    try {
        const { encounter_id, test_date, fev1_predicted, fev1_actual, fvc_predicted, fvc_actual, fev1_fvc_ratio, gold_stage } = req.body;
        if (!encounter_id || !test_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO pulmonology_pft_results (tenant_id, encounter_id, test_date, fev1_predicted, fev1_actual, fvc_predicted, fvc_actual, fev1_fvc_ratio, gold_stage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, encounter_id, test_date, fev1_predicted || null, fev1_actual || null, fvc_predicted || null, fvc_actual || null, fev1_fvc_ratio || null, gold_stage || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pcsc/pft', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const p = await db.query(`SELECT COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as palliative_30d, COUNT(*) FILTER (WHERE advance_directive = true) as advance_directives FROM palliative_care_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const c = await db.query(`SELECT COUNT(*) as chaplaincy_visits, COUNT(DISTINCT patient_id) as patients_served FROM chaplaincy_visits WHERE tenant_id = $1`, [req.tenantId]);
        const s = await db.query(`SELECT COUNT(*) FILTER (WHERE ahi >= 15) as sleep_mod_or_severe, COUNT(*) as total_sleep_studies, AVG(ahi)::numeric(6,2) as avg_ahi FROM sleep_studies WHERE tenant_id = $1`, [req.tenantId]);
        const pf = await db.query(`SELECT COUNT(*) FILTER (WHERE gold_stage IN ('GOLD3','GOLD4')) as severe_copd, COUNT(*) as total_pfts FROM pulmonology_pft_results WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, palliative: p.rows[0], chaplaincy: c.rows[0], sleep: s.rows[0], pft: pf.rows[0] });
    } catch (err) { console.error('GET /api/pcsc/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['palliative', 'chaplaincy', 'sleep', 'pft', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
