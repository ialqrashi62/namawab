'use strict';
// Wave 103 — Stroke unit + Burn unit: NIHSS + Parkland resuscitation + engine assessments
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_NIHSS_BANDS = ['minor','moderate','moderate_to_severe','severe'];
const VALID_OCCLUSION = ['ica','mca','aca','pca','basilar','vertebral','lacunar','tandem','multi'];
const VALID_THAW = ['iv_tpa','ia_tpa','tenecteplase','none'];
const VALID_BURN_GRADE = ['first','second_superficial','second_deep','third','fourth'];
const VALID_FLUID = ['ringer_lactate','normal_saline','ringer_acetate','colloid','plasma','albumin_5'];
const VALID_RISK = ['low','moderate','high','critical'];

function nihssBand(s) {
    const n = parseInt(s, 10);
    if (isNaN(n)) return null;
    if (n === 0) return 'no_stroke';
    if (n <= 4) return 'minor';
    if (n <= 15) return 'moderate';
    if (n <= 20) return 'moderate_to_severe';
    return 'severe';
}

function parklandFormula(weightKg, tbsaPct) {
    if (!weightKg || !tbsaPct) return null;
    return Math.round(parseFloat(weightKg) * parseFloat(tbsaPct) * 4);
}

function halfSplit(total) {
    if (total === null || total === undefined) return null;
    return { first_8h: Math.round(total / 2), next_16h: total - Math.round(total / 2) };
}

function bauxScore(age, tbsaPct, inhalation) {
    if (age === undefined || tbsaPct === undefined) return null;
    let score = parseFloat(age) + parseFloat(tbsaPct);
    if (inhalation) score += 17;
    return Math.round(score * 10) / 10;
}

function abiFromVitals(hr, sbp, lactate) {
    if (!hr || !sbp) return null;
    const shockIndex = parseFloat(hr) / parseFloat(sbp);
    let risk = 'low';
    if (shockIndex > 1.0) risk = 'high';
    else if (shockIndex > 0.8) risk = 'moderate';
    if (lactate !== undefined && parseFloat(lactate) > 4) risk = 'critical';
    return { shock_index: Math.round(shockIndex * 100) / 100, risk };
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'stroke-burn',
        endpoints: [
            'GET /stroke/admissions',
            'GET /stroke/admissions/:id',
            'POST /stroke/admissions',
            'GET /stroke/assessments',
            'POST /stroke/assessments',
            'GET /burn/assessments',
            'GET /burn/assessments/:id',
            'POST /burn/assessments',
            'GET /burn/resus-logs',
            'POST /burn/resus-logs',
            'GET /burn/unit-assessments',
            'POST /burn/unit-assessments',
            'GET /parkland',
            'GET /nihss-band',
            'GET /baux',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== STROKE ADMISSIONS =====
router.get('/stroke/admissions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, occlusion_site, tpa_given, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM stroke_admissions s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (occlusion_site) { sql += ` AND s.occlusion_site = $${params.length + 1}`; params.push(occlusion_site); }
        if (tpa_given !== undefined) { sql += ` AND s.tpa_given = $${params.length + 1}`; params.push(tpa_given === 'true'); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stroke/admissions/:id', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(`SELECT s.*, p.full_name AS patient_name FROM stroke_admissions s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1 AND s.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'stroke_admission_not_found' });
        res.json({ ok: true, admission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/stroke/admissions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, nihss, occlusion_site, tpa_given, thrombectomy, mrs_discharge, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (nihss === undefined || nihss < 0 || nihss > 42) return res.status(400).json({ ok: false, error: 'invalid_nihss_range_0_42' });
        if (occlusion_site && !VALID_OCCLUSION.includes(occlusion_site)) return res.status(400).json({ ok: false, error: 'invalid_occlusion_site' });
        if (mrs_discharge !== undefined && (mrs_discharge < 0 || mrs_discharge > 6)) return res.status(400).json({ ok: false, error: 'invalid_mrs_range_0_6' });

        const r = await db.query(
            `INSERT INTO stroke_admissions (tenant_id, patient_id, encounter_id, nihss, occlusion_site, tpa_given, thrombectomy, mrs_discharge, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null, nihss,
             occlusion_site || null, !!tpa_given, !!thrombectomy, mrs_discharge ?? null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, admission: r.rows[0], nihss_band: nihssBand(nihss) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STROKE UNIT ASSESSMENTS (engine pattern) =====
router.get('/stroke/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM stroke_unit_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/stroke/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO stroke_unit_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BURN ASSESSMENTS (Rule of Nines + Parkland) =====
router.get('/burn/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT b.*, p.full_name AS patient_name FROM burn_assessments b LEFT JOIN patients p ON p.id = b.patient_id WHERE b.tenant_id = $1`;
        if (patient_id) { sql += ` AND b.patient_id = $${params.length + 1}`; params.push(patient_id); }
        sql += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/burn/assessments/:id', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(`SELECT b.*, p.full_name AS patient_name FROM burn_assessments b LEFT JOIN patients p ON p.id = b.patient_id WHERE b.tenant_id = $1 AND b.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'burn_assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/burn/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor_id, assessment_date, weight_kg,
                head_percent, torso_front_percent, torso_back_percent, left_arm_percent, right_arm_percent,
                left_leg_percent, right_leg_percent, perineum_percent, clinical_notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!weight_kg || weight_kg <= 0) return res.status(400).json({ ok: false, error: 'weight_kg_required_positive' });

        const percents = [head_percent, torso_front_percent, torso_back_percent, left_arm_percent,
                          right_arm_percent, left_leg_percent, right_leg_percent, perineum_percent];
        const tbsa = percents.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        if (tbsa > 100) return res.status(400).json({ ok: false, error: 'tbsa_exceeds_100', tbsa_calculated: tbsa });
        const total = parklandFormula(weight_kg, tbsa);
        const split = halfSplit(total);

        const r = await db.query(
            `INSERT INTO burn_assessments (tenant_id, patient_id, doctor_id, assessment_date, weight_kg,
                head_percent, torso_front_percent, torso_back_percent, left_arm_percent, right_arm_percent,
                left_leg_percent, right_leg_percent, perineum_percent, tbsa_percent, parkland_fluid_ml,
                fluid_first_8h_ml, fluid_next_16h_ml, clinical_notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, assessment_date || null, weight_kg,
             head_percent || 0, torso_front_percent || 0, torso_back_percent || 0, left_arm_percent || 0, right_arm_percent || 0,
             left_leg_percent || 0, right_leg_percent || 0, perineum_percent || 0,
             tbsa, total, split.first_8h, split.next_16h, clinical_notes || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { tbsa_pct: tbsa, parkland_total_ml: total, first_8h_ml: split.first_8h, next_16h_ml: split.next_16h } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BURN RESUSCITATION LOGS =====
router.get('/burn/resus-logs', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM burn_resuscitation_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/burn/resus-logs', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, log_time, tbsa_percent, fluid_volume_ml, fluid_type, urine_output_ml_hr } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (fluid_volume_ml !== undefined && fluid_volume_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_fluid_volume' });
        if (fluid_type && !VALID_FLUID.includes(fluid_type)) return res.status(400).json({ ok: false, error: 'invalid_fluid_type' });

        const r = await db.query(
            `INSERT INTO burn_resuscitation_logs (tenant_id, patient_id, log_time, tbsa_percent, fluid_volume_ml, fluid_type, urine_output_ml_hr)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             tbsa_percent ?? null, fluid_volume_ml ?? null, fluid_type || null, urine_output_ml_hr ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BURN UNIT ASSESSMENTS (engine pattern) =====
router.get('/burn/unit-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM burn_unit_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/burn/unit-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO burn_unit_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL UTILITIES =====
router.get('/parkland', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { weight_kg, tbsa_pct } = req.query;
        if (!weight_kg || !tbsa_pct) return res.status(400).json({ ok: false, error: 'weight_kg_and_tbsa_pct_required' });
        const total = parklandFormula(weight_kg, tbsa_pct);
        const split = halfSplit(total);
        res.json({ ok: true, weight_kg: parseFloat(weight_kg), tbsa_pct: parseFloat(tbsa_pct), parkland_total_ml: total, first_8h_ml: split.first_8h, next_16h_ml: split.next_16h });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nihss-band', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score, 10), band: nihssBand(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/baux', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { age, tbsa_pct, inhalation } = req.query;
        if (age === undefined || tbsa_pct === undefined) return res.status(400).json({ ok: false, error: 'age_and_tbsa_required' });
        const score = bauxScore(age, tbsa_pct, inhalation === 'true');
        let risk = 'low';
        if (score > 100) risk = 'critical';
        else if (score > 80) risk = 'high';
        else if (score > 50) risk = 'moderate';
        res.json({ ok: true, score, risk, inhalation_included: inhalation === 'true' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const stroke = await db.query(`SELECT occlusion_site, tpa_given, thrombectomy, COUNT(*) AS count FROM stroke_admissions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY occlusion_site, tpa_given, thrombectomy ORDER BY count DESC`, [req.tenantId]);
        const burn = await db.query(`SELECT COUNT(*) AS total_assessments, AVG(tbsa_percent) AS avg_tbsa, AVG(parkland_fluid_ml) AS avg_parkland_ml FROM burn_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const burnResus = await db.query(`SELECT fluid_type, COUNT(*) AS count, SUM(fluid_volume_ml) AS total_ml FROM burn_resuscitation_logs WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '90 days' GROUP BY fluid_type ORDER BY count DESC`, [req.tenantId]);
        res.json({ ok: true, stroke_90d: stroke.rows, burn_90d: burn.rows[0], burn_resus_90d: burnResus.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
