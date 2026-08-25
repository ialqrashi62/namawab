// filepath: namaweb/nursing_vitals_router.js
// Nursing-specific vital signs + auto EWNS scoring.
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/vitals/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 30);
        const r = await db.query(`SELECT id, recorded_at, temperature_c, pulse, bp_systolic, bp_diastolic, respiratory_rate, spo2_percent, oxygen_device, pain_score, recorded_by FROM nursing_vitals WHERE tenant_id = $1 AND patient_id = $2 AND recorded_at >= NOW() - ($3 || ' days')::interval ORDER BY recorded_at DESC LIMIT 200`, [req.tenantId, req.params.patient_id, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, vitals: r.rows });
    } catch (err) { console.error('GET /api/nv/vitals', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/vitals', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, recorded_at, temperature_c, pulse, bp_systolic, bp_diastolic, respiratory_rate, spo2_percent, oxygen_device, pain_score } = req.body;
        if (!patient_id || !recorded_at) return res.status(400).json({ error: 'missing_required' });
        // Auto-compute Modified Early Warning Score (MEWS)
        let mews = 0;
        if (pulse != null) {
            if (pulse >= 130 || pulse < 40) mews += 3;
            else if (pulse >= 110) mews += 2;
            else if (pulse >= 100 || pulse < 50) mews += 1;
        }
        if (bp_systolic != null) {
            if (bp_systolic < 70) mews += 3;
            else if (bp_systolic < 80) mews += 2;
            else if (bp_systolic < 100 || bp_systolic >= 200) mews += 1;
        }
        if (respiratory_rate != null) {
            if (respiratory_rate >= 30 || respiratory_rate < 8) mews += 3;
            else if (respiratory_rate >= 25) mews += 2;
            else if (respiratory_rate < 12) mews += 1;
        }
        if (temperature_c != null) {
            if (temperature_c >= 38.5) mews += 2;
            else if (temperature_c < 35) mews += 2;
            else if (temperature_c >= 38) mews += 1;
        }
        if (pain_score != null && pain_score >= 3) mews += 1;
        const r = await db.query(`INSERT INTO nursing_vitals (tenant_id, patient_id, encounter_id, recorded_at, temperature_c, pulse, bp_systolic, bp_diastolic, respiratory_rate, spo2_percent, oxygen_device, pain_score, recorded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, recorded_at, temperature_c || null, pulse || null, bp_systolic || null, bp_diastolic || null, respiratory_rate || null, spo2_percent || null, oxygen_device || 'room-air', pain_score || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, mews_score: mews, mews_risk: mews >= 5 ? 'critical' : mews >= 3 ? 'high' : mews >= 1 ? 'moderate' : 'normal' });
    } catch (err) { console.error('POST /api/nv/vitals', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/risks/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, assessment_type, total_score, risk_level, details, assessed_by, created_at FROM nursing_risk_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/nv/risks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/risks', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, admission_id, assessment_type, total_score, risk_level, details } = req.body;
        if (!patient_id || !assessment_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO nursing_risk_assessments (tenant_id, patient_id, admission_id, assessment_type, total_score, risk_level, details, assessed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`, [req.tenantId, patient_id, admission_id || null, assessment_type, total_score || null, risk_level || '', details || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nv/risks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'nurse'), async (req, res) => {
    try {
        const v = await db.query(`SELECT COUNT(*) FILTER (WHERE recorded_at >= NOW() - INTERVAL '24 hours') as vitals_24h, COUNT(*) FILTER (WHERE recorded_at >= CURRENT_DATE) as vitals_today FROM nursing_vitals WHERE tenant_id = $1`, [req.tenantId]);
        const r = await db.query(`SELECT COUNT(*) FILTER (WHERE risk_level IN ('high','critical')) as high_risk_assessments, COUNT(*) as total_risk_assessments FROM nursing_risk_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, vitals: v.rows[0], risks: r.rows[0] });
    } catch (err) { console.error('GET /api/nv/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['vitals', 'risks', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
