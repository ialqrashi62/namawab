// filepath: namaweb/chronic_router.js
// Chronic disease management — diabetes glucose + CKD + psychosocial support.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/chronic/diabetes/:patient_id
router.get('/diabetes/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, log_date, glucose_mg_dl, meal_context, insulin_dose, carbs_g,
                   activity, mood, hba1c_pct, recorded_by, created_at
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND patient_id = $2
              AND log_date >= CURRENT_DATE - ($3 || ' days')::interval
            ORDER BY log_date DESC LIMIT 200
        `, [req.tenantId, req.params.patient_id, days]);
        const stats = await db.query(`
            SELECT ROUND(AVG(glucose_mg_dl)::numeric, 1) as avg_glucose,
                   MIN(glucose_mg_dl) as min_glucose,
                   MAX(glucose_mg_dl) as max_glucose,
                   COUNT(*) FILTER (WHERE glucose_mg_dl < 70) as hypoglycemic_events,
                   COUNT(*) FILTER (WHERE glucose_mg_dl > 180) as hyperglycemic_events,
                   ROUND(AVG(hba1c_pct)::numeric, 2) as avg_hba1c
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND patient_id = $2
              AND log_date >= CURRENT_DATE - ($3 || ' days')::interval
        `, [req.tenantId, req.params.patient_id, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, logs: r.rows, stats: stats.rows[0] });
    } catch (err) { console.error('GET /api/chronic/diabetes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/diabetes', requireAuth, requireTenantScope, requireRole('patient', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, glucose_mg_dl, meal_context, insulin_dose, carbs_g, activity, mood, hba1c_pct } = req.body;
        if (!patient_id || !log_date || glucose_mg_dl == null) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'log_date', 'glucose_mg_dl'] });
        const r = await db.query(`
            INSERT INTO diabetes_glucose_logs (tenant_id, patient_id, log_date, glucose_mg_dl, meal_context, insulin_dose, carbs_g, activity, mood, hba1c_pct, recorded_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id
        `, [req.tenantId, patient_id, log_date, glucose_mg_dl, meal_context || '', insulin_dose || null, carbs_g || null, activity || '', mood || '', hba1c_pct || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/chronic/diabetes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/diabetes/:patient_id/hypo-events', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 90);
        const r = await db.query(`
            SELECT id, log_date, glucose_mg_dl, meal_context, insulin_dose, notes
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND patient_id = $2
              AND log_date >= CURRENT_DATE - ($3 || ' days')::interval AND glucose_mg_dl < 70
            ORDER BY log_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, hypo_events: r.rows });
    } catch (err) { console.error('GET /api/chronic/diabetes/hypo', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/ckd-assessments', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { stage, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (stage) { params.push(stage); conditions.push(`ckd_stage = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, ckd_stage, egfr, creatinine, bun, potassium,
                   albumin_creatinine_ratio, bp_systolic, bp_diastolic, proteinuria, anemia, assessed_by, created_at
            FROM nephrology_ckd_assessments WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/chronic/ckd', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/ckd-assessments', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, encounter_id, ckd_stage, egfr, creatinine, bun, potassium, albumin_creatinine_ratio, bp_systolic, bp_diastolic, proteinuria, anemia } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO nephrology_ckd_assessments (tenant_id, patient_id, encounter_id, ckd_stage, egfr, creatinine, bun, potassium, albumin_creatinine_ratio, bp_systolic, bp_diastolic, proteinuria, anemia, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, ckd_stage || null, egfr || null, creatinine || null, bun || null, potassium || null, albumin_creatinine_ratio || null, bp_systolic || null, bp_diastolic || null, proteinuria || false, anemia || false, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/chronic/ckd', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/psychosocial', requireAuth, requireTenantScope, requireRole('nurse', 'social_worker', 'doctor', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, patient_id, support_type, referral_source, intervention, duration_minutes,
                   outcome, follow_up_needed, logged_by, session_date, created_at
            FROM psychosocial_support_logs WHERE tenant_id = $1
              AND session_date >= CURRENT_DATE - ($2 || ' days')::interval
            ORDER BY session_date DESC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, logs: r.rows });
    } catch (err) { console.error('GET /api/chronic/psychosocial', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/psychosocial', requireAuth, requireTenantScope, requireRole('nurse', 'social_worker', 'doctor'), async (req, res) => {
    try {
        const { patient_id, support_type, referral_source, intervention, duration_minutes, outcome, follow_up_needed } = req.body;
        if (!patient_id || !support_type || !intervention) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'support_type', 'intervention'] });
        const r = await db.query(`
            INSERT INTO psychosocial_support_logs (tenant_id, patient_id, support_type, referral_source, intervention, duration_minutes, outcome, follow_up_needed, logged_by, session_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_DATE) RETURNING id
        `, [req.tenantId, patient_id, support_type, referral_source || '', intervention, duration_minutes || null, outcome || '', follow_up_needed || false, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/chronic/psychosocial', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const d = await db.query(`
            SELECT COUNT(DISTINCT patient_id) as patients_tracked,
                   COUNT(*) FILTER (WHERE glucose_mg_dl < 70) as hypo_events_30d,
                   COUNT(*) FILTER (WHERE glucose_mg_dl > 180) as hyper_events_30d,
                   ROUND(AVG(glucose_mg_dl)::numeric, 1) as avg_glucose_30d
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '30 days'
        `, [req.tenantId]);
        const c = await db.query(`
            SELECT ckd_stage, COUNT(*) as patients
            FROM (SELECT DISTINCT ON (patient_id) patient_id, ckd_stage FROM nephrology_ckd_assessments WHERE tenant_id = $1 ORDER BY patient_id, created_at DESC) latest
            GROUP BY ckd_stage ORDER BY ckd_stage
        `, [req.tenantId]);
        const p = await db.query(`
            SELECT COUNT(*) FILTER (WHERE session_date >= CURRENT_DATE - INTERVAL '7 days') as sessions_7d,
                   COUNT(*) FILTER (WHERE follow_up_needed) as follow_ups_pending
            FROM psychosocial_support_logs WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, diabetes_30d: d.rows[0], ckd_distribution: c.rows, psychosocial: p.rows[0] });
    } catch (err) { console.error('GET /api/chronic/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['diabetes', 'ckd-assessments', 'psychosocial', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
