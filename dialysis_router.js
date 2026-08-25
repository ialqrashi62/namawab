// filepath: namaweb/dialysis_router.js
// Dialysis: hemodialysis session + adequacy (Kt/V, URR) + CKD staging + renal dose adjustment.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Hemodialysis session
router.post('/sessions', requireAuth, requireTenantScope, requireRole('nephrologist', 'dialysis_nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, session_date, weight_pre, weight_post, blood_flow_rate, ultrafiltration_volume, duration_hours, notes, dialysis_type, ultrafiltration_target_liters, blood_flow_rate_ml_min, dialysate_flow_rate_ml_min, pre_weight_kg, post_weight_kg } = req.body;
        if (!patient_id || !session_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO dialysis_sessions (tenant_id, patient_id, encounter_id, session_date, weight_pre, weight_post, blood_flow_rate, ultrafiltration_volume, duration_hours, notes, dialysis_type, ultrafiltration_target_liters, blood_flow_rate_ml_min, dialysate_flow_rate_ml_min, pre_weight_kg, post_weight_kg)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, 'hemodialysis'), $12, $13, $14, $15, $16)
            RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, session_date, weight_pre != null ? +weight_pre : null, weight_post != null ? +weight_post : null, blood_flow_rate != null ? +blood_flow_rate : null, ultrafiltration_volume != null ? +ultrafiltration_volume : null, duration_hours != null ? +duration_hours : null, notes || '', dialysis_type, ultrafiltration_target_liters || null, blood_flow_rate_ml_min || null, dialysate_flow_rate_ml_min || null, pre_weight_kg || null, post_weight_kg || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/dial/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/sessions/:patient_id', requireAuth, requireTenantScope, requireRole('nephrologist', 'nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, session_date, weight_pre, weight_post, blood_flow_rate, ultrafiltration_volume, duration_hours, dialysis_type, notes, created_at FROM dialysis_sessions WHERE tenant_id = $1 AND patient_id = $2 ORDER BY session_date DESC LIMIT 100`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, sessions: r.rows });
    } catch (err) { console.error('GET /api/dial/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

// HD adequacy (URR, spKt/V, weekly Kt/V)
router.post('/adequacy', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, pre_bun_mg_dl, post_bun_mg_dl, spktv, weekly_ktv } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        // Compute URR
        const pre = +pre_bun_mg_dl || 0;
        const post = +post_bun_mg_dl || 0;
        const computedUrr = (pre > 0) ? Math.round(100 * (pre - post) / pre * 10) / 10 : null;
        const computedSpKtv = spktv != null ? +spktv : (pre > 0 && post > 0 ? Math.round(-Math.log((pre - post) / pre + 0.008 * 0) * 10) / 10 : null);
        const adequacy = (computedUrr != null && computedUrr >= 65) || (computedSpKtv != null && computedSpKtv >= 1.2);
        const r = await db.query(`INSERT INTO nephrology_hd_adequacy (tenant_id, patient_id, encounter_id, assessed_by, pre_bun_mg_dl, post_bun_mg_dl, spktv, weekly_ktv, urr_pct, adequacy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, urr_pct, adequacy`, [req.tenantId, patient_id, encounter_id || null, assessed_by || req.userName || '', pre || null, post || null, computedSpKtv, weekly_ktv || null, computedUrr, adequacy]);
        res.status(201).json({ ok: true, id: r.rows[0].id, urr_pct: r.rows[0].urr_pct, adequacy: r.rows[0].adequacy });
    } catch (err) { console.error('POST /api/dial/adequacy', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/adequacy/:patient_id', requireAuth, requireTenantScope, requireRole('nephrologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT pre_bun_mg_dl, post_bun_mg_dl, spktv, weekly_ktv, urr_pct, adequacy, assessed_by, created_at FROM nephrology_hd_adequacy WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, adequacy_records: r.rows });
    } catch (err) { console.error('GET /api/dial/adequacy', err); res.status(500).json({ error: 'internal_error' }); }
});

// CKD staging (KDIGO 2012)
router.post('/ckd', requireAuth, requireTenantScope, requireRole('nephrologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, age, sex, creatinine_mg_dl, egfr, albuminuria_category } = req.body;
        if (!patient_id || creatinine_mg_dl == null) return res.status(400).json({ error: 'missing_required' });
        let stage = 1;
        const e = +egfr || 0;
        if (e < 15) stage = 5;
        else if (e < 30) stage = 4;
        else if (e < 45) stage = '3b';
        else if (e < 60) stage = '3a';
        else if (e < 90) stage = 2;
        else stage = 1;
        const risk = ['G3a/G3b transition', 'Stage 4 advanced', 'Stage 5 kidney failure'][stage - 3] || 'low-risk';
        const r = await db.query(`INSERT INTO nephrology_ckd_assessments (tenant_id, patient_id, encounter_id, assessed_by, age, sex, creatinine_mg_dl, egfr, albuminuria_category, kdigo_stage, risk_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, kdigo_stage`, [req.tenantId, patient_id, encounter_id || null, assessed_by || req.userName || '', age || null, sex || '', creatinine_mg_dl, egfr, albuminuria_category || '', `Stage ${stage}`, risk]);
        res.status(201).json({ ok: true, id: r.rows[0].id, kdigo_stage: r.rows[0].kdigo_stage, risk_level: risk });
    } catch (err) { console.error('POST /api/dial/ckd', err); res.status(500).json({ error: 'internal_error' }); }
});

// Renal drug dose adjustment
router.post('/dose-adjust', requireAuth, requireTenantScope, requireRole('nephrologist', 'doctor', 'pharmacist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, drug_name, standard_dose_mg, crcl_ml_per_min, ckd_stage, adjustment_factor } = req.body;
        if (!patient_id || !drug_name) return res.status(400).json({ error: 'missing_required' });
        // Cockcroft-Gault equation estimate
        let crcl = +crcl_ml_per_min || null;
        let factor = +adjustment_factor;
        if (!factor) {
            if (!crcl || crcl >= 50) factor = 1.0;
            else if (crcl >= 30) factor = 0.75;
            else if (crcl >= 10) factor = 0.5;
            else factor = 0.25;
        }
        const adjusted = +standard_dose_mg * factor;
        const r = await db.query(`INSERT INTO renal_dose_adjustments (tenant_id, patient_id, encounter_id, adjusted_by, drug_name, standard_dose_mg, crcl_ml_per_min, ckd_stage, adjustment_factor, adjusted_dose_mg, recommendation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, adjusted_dose_mg`, [req.tenantId, patient_id, encounter_id || null, req.userName || '', drug_name, standard_dose_mg, crcl, ckd_stage || '', factor, adjusted, factor === 1 ? 'No adjustment required' : `Adjust to ${adjusted}mg (${Math.round(factor * 100)}% of standard)`]);
        res.status(201).json({ ok: true, id: r.rows[0].id, adjusted_dose_mg: r.rows[0].adjusted_dose_mg, factor });
    } catch (err) { console.error('POST /api/dial/dose-adjust', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/dose-history/:patient_id', requireAuth, requireTenantScope, requireRole('nephrologist', 'doctor', 'pharmacist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT drug_name, standard_dose_mg, crcl_ml_per_min, ckd_stage, adjustment_factor, adjusted_dose_mg, recommendation, adjusted_by, created_at FROM renal_dose_adjustments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, dose_adjustments: r.rows });
    } catch (err) { console.error('GET /api/dial/dose-history', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['sessions', 'adequacy', 'ckd', 'dose-adjust', 'dose-history'], timestamp: new Date().toISOString() });
});

module.exports = router;


