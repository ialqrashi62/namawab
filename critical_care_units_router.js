'use strict';
// Wave 123 — Critical care & specialty units (ICU, NICU, Peds, CCU/CICU/ctu)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BUNDLE_TYPE = ['VAP','CLABSI','CAUTI','SSI','PressureInjury','DVT','Delirium','Sepsis'];
const VALID_VENT_MODE = ['AC','SIMV','PSV','CPAP','BiPAP','PRVC','HFOV','NIV'];
const VALID_NICU_MODE = ['CPAP','IMV','NIPPV','HFNC','HFOV','nCPAP'];
const VALID_MILESTONE_STATUS = ['emerging','achieved','delayed','regressed','not_assessed'];
const VALID_CHD = ['VSD','ASD','TOF','TGA','HLHS','COA','PA','TA','DORV','AVSD','Truncus','IAA','PS'];
const VALID_SEIZURE_TYPE = ['focal','generalized','absence','myoclonic','tonic_clonic','atonic','febrile','status','neonatal','infantile_spasm'];
const VALID_RISK_LEVEL = ['low','moderate','high','critical','severe'];

function apacheII(temp, mapVal, hr, rr, pao2, ph, na, k, creatinine, hct, wbc, gcs, agePts, chronicPts) {
    const aps = (temp||0) + (mapVal||0) + (hr||0) + (rr||0) + (pao2||0) + (ph||0) + (na||0) + (k||0) + (creatinine||0) + (hct||0) + (wbc||0) + (gcs||0);
    return (aps||0) + (agePts||0) + (chronicPts||0);
}

function sofa(pao2FiO2, platelets, bilirubin, mapVasopressor, gcs, creatinine) {
    return (pao2FiO2||0) + (platelets||0) + (bilirubin||0) + (mapVasopressor||0) + (gcs||0) + (creatinine||0);
}

function apgarScore(hr, resp, muscleTone, reflex, color) {
    return (hr||0) + (resp||0) + (muscleTone||0) + (reflex||0) + (color||0);
}

function apgarInterpretation(score) {
    if (score === undefined || score === null) return null;
    if (score >= 7) return 'reassuring';
    if (score >= 4) return 'moderately_depressed';
    return 'severely_depressed';
}

function oxygenationIndex(fio2, map, pao2) {
    if (!fio2 || !map || !pao2) return null;
    return Math.round((parseFloat(fio2) * parseFloat(map) / parseFloat(pao2)) * 10) / 10;
}

function pfRatio(pao2, fio2) {
    if (!pao2 || !fio2 || parseFloat(fio2) === 0) return null;
    return Math.round((parseFloat(pao2) / parseFloat(fio2)) * 10) / 10;
}

function pfSeverity(ratio) {
    if (ratio === null) return null;
    if (ratio >= 300) return 'normal';
    if (ratio >= 200) return 'mild_ARDS';
    if (ratio >= 100) return 'moderate_ARDS';
    return 'severe_ARDS';
}

function bundleCompliance(rate) {
    if (rate === undefined || rate === null) return null;
    if (rate >= 95) return 'excellent';
    if (rate >= 85) return 'good';
    if (rate >= 70) return 'fair';
    return 'poor';
}

function fluidBalanceStatus(intake, output) {
    const i = parseInt(intake) || 0;
    const o = parseInt(output) || 0;
    const net = i - o;
    if (Math.abs(net) <= 500) return 'balanced';
    if (net > 0) return net > 1000 ? 'overloaded' : 'positive';
    return net < -1000 ? 'severely_depleted' : 'negative';
}

function zScoreInterpretation(z) {
    if (z === undefined || z === null) return null;
    if (z > 2) return 'above_normal';
    if (z < -2) return 'below_normal';
    return 'within_normal';
}

function gestationalCategory(weeks) {
    if (!weeks) return null;
    if (weeks < 28) return 'extremely_preterm';
    if (weeks < 32) return 'very_preterm';
    if (weeks < 34) return 'moderately_preterm';
    if (weeks < 37) return 'late_preterm';
    if (weeks <= 40) return 'term';
    return 'post_term';
}

function seizureFrequencyBucket(freq) {
    const f = parseInt(freq) || 0;
    if (f === 0) return 'controlled';
    if (f <= 2) return 'rare';
    if (f <= 7) return 'frequent';
    return 'status_risk';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'critical-care-units',
        endpoints: [
            'GET/POST /icu/assessments',
            'GET/POST /icu/scores',
            'GET/POST /icu/monitoring',
            'GET/POST /icu/ventilator',
            'GET/POST /icu/fluid-balance',
            'GET/POST /icu/daily-goals',
            'GET/POST /icu/prevention-bundles',
            'GET /icu/pf-ratio',
            'GET /icu/oxygenation-index',
            'GET/POST /nicu/assessments',
            'GET/POST /nicu/transition',
            'GET/POST /nicu/ventilation',
            'GET/POST /neonatal/apgar',
            'GET/POST /peds/growth',
            'GET/POST /peds/milestones',
            'GET/POST /peds/neuro',
            'GET/POST /peds/cardio',
            'GET/POST /ccu/assessments',
            'GET/POST /cicu/assessments',
            'GET/POST /ctu/assessments',
            'GET /apache-ii',
            'GET /sofa',
            'GET /apgar',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== ICU ASSESSMENTS (APACHE II + SOFA inputs) =====
router.get('/icu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, assessment_date, apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs, apache_age_points, apache_chronic_points, sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine, clinical_notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const apacheScore = apacheII(apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs, apache_age_points, apache_chronic_points);
        const sofaScore = sofa(sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine);
        const r = await db.query(
            `INSERT INTO icu_assessments (patient_id, doctor_id, assessment_date, apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs, apache_age_points, apache_chronic_points, apache_ii_score, sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine, sofa_score, clinical_notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, assessment_date || null,
             apache_temp || 0, apache_map || 0, apache_hr || 0, apache_rr || 0, apache_pao2 || 0,
             apache_ph || 0, apache_na || 0, apache_k || 0, apache_creatinine || 0, apache_hct || 0,
             apache_wbc || 0, apache_gcs || 0, apache_age_points || 0, apache_chronic_points || 0,
             apacheScore, sofa_pao2_fio2 || 0, sofa_platelets || 0, sofa_bilirubin || 0,
             sofa_map_vasopressor || 0, sofa_gcs || 0, sofa_creatinine || 0, sofaScore,
             clinical_notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { apache_ii: apacheScore, sofa: sofaScore } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU SCORES (consolidated panel) =====
router.get('/icu/scores', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_scores WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY score_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/scores', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, score_date, apache_ii, sofa, gcs, rass, cam_icu, braden, morse_fall, pain_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO icu_scores (admission_id, patient_id, score_date, apache_ii, sofa, gcs, rass, cam_icu, braden, morse_fall, pain_score, calculated_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [admission_id ? parseInt(admission_id) : null, parseInt(patient_id), score_date || new Date().toISOString().slice(0,10),
             apache_ii || 0, sofa || 0, gcs || 15, rass || 0, cam_icu || 0, braden || 0, morse_fall || 0,
             pain_score || 0, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, score: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU MONITORING =====
router.get('/icu/monitoring', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, hours = 24, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_monitoring WHERE tenant_id = $1 AND monitor_time >= NOW() - INTERVAL '${parseInt(hours)} hours'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY monitor_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/monitoring', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO icu_monitoring (admission_id, patient_id, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [admission_id ? parseInt(admission_id) : null, parseInt(patient_id),
             hr || null, sbp || null, dbp || null, map || null, rr || null, spo2 || null,
             temp || null, etco2 || null, cvp || null, fio2 || null, peep || null,
             urine_output || null, notes || null, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, monitoring: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU VENTILATOR =====
router.get('/icu/ventilator', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, is_active } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_ventilator WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_active === 'true') sql += ` AND ended_at IS NULL`;
        sql += ` ORDER BY started_at DESC`;
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/ventilator', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, started_at, ett_size, ett_position, cuff_pressure, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (vent_mode && !VALID_VENT_MODE.includes(vent_mode)) return res.status(400).json({ ok: false, error: 'invalid_vent_mode', valid: VALID_VENT_MODE });
        const r = await db.query(
            `INSERT INTO icu_ventilator (admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, started_at, ett_size, ett_position, cuff_pressure, notes, recorded_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [admission_id ? parseInt(admission_id) : null, parseInt(patient_id),
             vent_mode || 'AC', fio2 || 40, tidal_volume || 0, respiratory_rate || 0,
             peep || 5, pip || 0, ie_ratio || '1:2', ps || 0, started_at || new Date().toISOString(),
             ett_size || null, ett_position || null, cuff_pressure || null, notes || null,
             req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, ventilator: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU FLUID BALANCE =====
router.get('/icu/fluid-balance', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_fluid_balance WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY balance_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(b => ({ ...b, status: fluidBalanceStatus(b.total_intake, b.total_output) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/fluid-balance', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, balance_date, shift, iv_fluids, oral_intake, blood_products, medications_iv, urine, drains, ngt_output, stool, vomit, insensible } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const total_intake = (iv_fluids||0) + (oral_intake||0) + (blood_products||0) + (medications_iv||0);
        const total_output = (urine||0) + (drains||0) + (ngt_output||0) + (stool||0) + (vomit||0) + (insensible||0);
        const net_balance = total_intake - total_output;
        const r = await db.query(
            `INSERT INTO icu_fluid_balance (admission_id, patient_id, balance_date, shift, iv_fluids, oral_intake, blood_products, medications_iv, total_intake, urine, drains, ngt_output, stool, vomit, insensible, total_output, net_balance, recorded_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
            [admission_id ? parseInt(admission_id) : null, parseInt(patient_id), balance_date || new Date().toISOString().slice(0,10),
             shift || 'day', iv_fluids || 0, oral_intake || 0, blood_products || 0, medications_iv || 0,
             total_intake, urine || 0, drains || 0, ngt_output || 0, stool || 0, vomit || 0,
             insensible || 0, total_output, net_balance, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, balance: r.rows[0], status: fluidBalanceStatus(total_intake, total_output) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU DAILY GOALS =====
router.get('/icu/daily-goals', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, goal_date, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_daily_goals WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (goal_date) { sql += ` AND goal_date = $${params.length + 1}`; params.push(goal_date); }
        sql += ` ORDER BY goal_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/daily-goals', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, goal_date, vent_goal_fio2, vent_goal_peep, vent_goal_tv, vent_wean_plan, sedation_target_rass, daily_sat, daily_sbt, pain_goal_nrs, delirium_cam_icu, dvt_prophylaxis, stress_ulcer_prophy, nutrition_route, caloric_goal_kcal, protein_goal_g, medical_goals, nursing_goals, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO icu_daily_goals (admission_id, patient_id, goal_date, vent_goal_fio2, vent_goal_peep, vent_goal_tv, vent_wean_plan, sedation_target_rass, daily_sat, daily_sbt, pain_goal_nrs, delirium_cam_icu, dvt_prophylaxis, stress_ulcer_prophy, nutrition_route, caloric_goal_kcal, protein_goal_g, medical_goals, nursing_goals, notes, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *`,
            [admission_id ? parseInt(admission_id) : null, parseInt(patient_id), goal_date || new Date().toISOString().slice(0,10),
             vent_goal_fio2 || null, vent_goal_peep || null, vent_goal_tv || null, vent_wean_plan || null,
             sedation_target_rass || 0, daily_sat !== undefined ? daily_sat : false, daily_sbt !== undefined ? daily_sbt : false,
             pain_goal_nrs || 0, delirium_cam_icu || null, dvt_prophylaxis || null, stress_ulcer_prophy || null,
             nutrition_route || null, caloric_goal_kcal || null, protein_goal_g || null,
             medical_goals || null, nursing_goals || null, notes || null, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, goals: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU PREVENTION BUNDLES =====
router.get('/icu/prevention-bundles', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, bundle_type, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM icu_prevention_bundles WHERE tenant_id = $1 AND audit_date >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (admission_id) { sql += ` AND admission_id = $${params.length + 1}`; params.push(parseInt(admission_id)); }
        if (bundle_type) { sql += ` AND bundle_type = $${params.length + 1}`; params.push(bundle_type); }
        sql += ` ORDER BY audit_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(b => ({ ...b, compliance_category: bundleCompliance(b.compliance_rate) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/icu/prevention-bundles', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, bundle_type, audit_date, checked_items, compliance_rate, non_compliance_reason } = req.body;
        if (!bundle_type) return res.status(400).json({ ok: false, error: 'bundle_type_required' });
        if (!VALID_BUNDLE_TYPE.includes(bundle_type)) return res.status(400).json({ ok: false, error: 'invalid_bundle_type', valid: VALID_BUNDLE_TYPE });
        const r = await db.query(
            `INSERT INTO icu_prevention_bundles (tenant_id, admission_id, bundle_type, audit_date, checked_items, compliance_rate, non_compliance_reason, recorded_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, admission_id ? parseInt(admission_id) : null, bundle_type,
             audit_date || new Date().toISOString().slice(0,10),
             typeof checked_items === 'object' ? JSON.stringify(checked_items) : (checked_items || null),
             compliance_rate || 0, non_compliance_reason || null, req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, bundle: r.rows[0], compliance_category: bundleCompliance(compliance_rate) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICU UTILITIES =====
router.get('/icu/pf-ratio', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { pao2, fio2 } = req.query;
        if (pao2 === undefined || fio2 === undefined) return res.status(400).json({ ok: false, error: 'pao2_and_fio2_required' });
        const ratio = pfRatio(pao2, fio2);
        res.json({ ok: true, pao2: parseFloat(pao2), fio2: parseFloat(fio2), pf_ratio: ratio, severity: pfSeverity(ratio) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/icu/oxygenation-index', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { fio2, map, pao2 } = req.query;
        if (fio2 === undefined || map === undefined || pao2 === undefined) return res.status(400).json({ ok: false, error: 'all_required' });
        res.json({ ok: true, oi: oxygenationIndex(fio2, map, pao2) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NICU / NEONATAL =====
router.get('/nicu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM neonatal_assessments WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, ga_category: gestationalCategory(a.gestational_age) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nicu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, birth_weight_kg, apgar_1min, apgar_5min, gestational_age, nicu_los_days } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO neonatal_assessments (tenant_id, patient_id, encounter_id, birth_weight_kg, apgar_1min, apgar_5min, gestational_age, nicu_los_days, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             birth_weight_kg || null, apgar_1min || null, apgar_5min || null, gestational_age || null,
             nicu_los_days || null, req.user?.username || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], ga_category: gestationalCategory(gestational_age) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nicu/transition', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 50 } = req.query;
        const params = [];
        let sql = `SELECT * FROM neonatal_transition_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY birth_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nicu/transition', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, birth_time, apgar_1min, apgar_5min, apgar_10min, initial_stabilization_notes, surfactant_administered, surfactant_type } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO neonatal_transition_logs (tenant_id, patient_id, birth_time, apgar_1min, apgar_5min, apgar_10min, initial_stabilization_notes, surfactant_administered, surfactant_type)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), birth_time || new Date().toISOString(),
             apgar_1min || null, apgar_5min || null, apgar_10min || null,
             initial_stabilization_notes || null,
             surfactant_administered !== undefined ? surfactant_administered : false,
             surfactant_type || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nicu/ventilation', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, hours = 24, limit = 500 } = req.query;
        const params = [];
        let sql = `SELECT * FROM nicu_ventilation_logs WHERE tenant_id::text = $1 AND log_time >= NOW() - INTERVAL '${parseInt(hours)} hours'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nicu/ventilation', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, vent_mode, fio2_percent, peep_cmh2o, mean_airway_pressure_cmh2o, tidal_volume_ml, respiratory_rate_bpm, spo2_percent } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (vent_mode && !VALID_NICU_MODE.includes(vent_mode)) return res.status(400).json({ ok: false, error: 'invalid_nicu_mode', valid: VALID_NICU_MODE });
        const r = await db.query(
            `INSERT INTO nicu_ventilation_logs (tenant_id, patient_id, log_time, vent_mode, fio2_percent, peep_cmh2o, mean_airway_pressure_cmh2o, tidal_volume_ml, respiratory_rate_bpm, spo2_percent)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             vent_mode || 'CPAP', fio2_percent || null, peep_cmh2o || null, mean_airway_pressure_cmh2o || null,
             tidal_volume_ml || null, respiratory_rate_bpm || null, spo2_percent || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/neonatal/apgar', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM neonatal_apgar_scores WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({
            ...a,
            interpretation_1min: apgarInterpretation(a.apgar_1min),
            interpretation_5min: apgarInterpretation(a.apgar_5min)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/neonatal/apgar', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, mother_id, apgar_1min, apgar_5min, apgar_10min, details, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO neonatal_apgar_scores (patient_id, mother_id, apgar_1min, apgar_5min, apgar_10min, details, notes, assessed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), mother_id ? parseInt(mother_id) : null,
             apgar_1min || 0, apgar_5min || 0, apgar_10min || null,
             typeof details === 'object' ? JSON.stringify(details) : (details || null),
             notes || null, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, apgar: r.rows[0],
            interpretation_1min: apgarInterpretation(apgar_1min),
            interpretation_5min: apgarInterpretation(apgar_5min) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PEDIATRICS =====
router.get('/peds/growth', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM peds_growth_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(g => ({
            ...g,
            weight_z: zScoreInterpretation(g.weight_zscore),
            length_z: zScoreInterpretation(g.length_zscore),
            head_z: zScoreInterpretation(g.head_zscore)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/growth', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_zscore, length_zscore, head_zscore } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO peds_growth_logs (tenant_id, patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_zscore, length_zscore, head_zscore)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             weight_kg || null, length_cm || null, head_circ_cm || null, bmi || null,
             weight_zscore || null, length_zscore || null, head_zscore || null]
        );
        res.status(201).json({ ok: true, growth: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/milestones', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM peds_milestone_tracking WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY achievement_date DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/milestones', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, milestone_category, milestone_name, status, achievement_date, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_MILESTONE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_MILESTONE_STATUS });
        const r = await db.query(
            `INSERT INTO peds_milestone_tracking (tenant_id, patient_id, milestone_category, milestone_name, status, achievement_date, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), milestone_category || null, milestone_name || null,
             status || 'emerging', achievement_date || null, notes || null]
        );
        res.status(201).json({ ok: true, milestone: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/neuro', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM peds_neuro_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(n => ({ ...n, freq_bucket: seizureFrequencyBucket(n.seizure_frequency_per_day) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/neuro', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, seizure_type, seizure_frequency_per_day, bayley_iii_score, mri_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (seizure_type && !VALID_SEIZURE_TYPE.includes(seizure_type)) return res.status(400).json({ ok: false, error: 'invalid_seizure_type', valid: VALID_SEIZURE_TYPE });
        const r = await db.query(
            `INSERT INTO peds_neuro_logs (tenant_id, patient_id, log_date, seizure_type, seizure_frequency_per_day, bayley_iii_score, mri_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             seizure_type || null, seizure_frequency_per_day || 0, bayley_iii_score || null, mri_findings || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], freq_bucket: seizureFrequencyBucket(seizure_frequency_per_day) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/cardio', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, chd_diagnosis, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM peds_cardio_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (chd_diagnosis) { sql += ` AND chd_diagnosis = $${params.length + 1}`; params.push(chd_diagnosis); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/cardio', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, chd_diagnosis, aortic_zscore, pulmonary_zscore, ef_percent, echo_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (chd_diagnosis && !VALID_CHD.includes(chd_diagnosis)) return res.status(400).json({ ok: false, error: 'invalid_chd', valid: VALID_CHD });
        const r = await db.query(
            `INSERT INTO peds_cardio_logs (tenant_id, patient_id, log_date, chd_diagnosis, aortic_zscore, pulmonary_zscore, ef_percent, echo_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             chd_diagnosis || null, aortic_zscore || null, pulmonary_zscore || null,
             ef_percent || null, echo_findings || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CCU / CICU / ctu ASSESSMENTS (jsonb payload) =====
async function handleSpecialtyAssessments(req, res, table) {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ${table} WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows, table });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
}

router.get('/ccu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => handleSpecialtyAssessments(req, res, 'ccu_assessments'));
router.get('/cicu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => handleSpecialtyAssessments(req, res, 'cicu_assessments'));
router.get('/ctu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => handleSpecialtyAssessments(req, res, 'ctu_assessments'));

router.post('/ccu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (risk_level && !VALID_RISK_LEVEL.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level', valid: VALID_RISK_LEVEL });
        const r = await db.query(
            `INSERT INTO ccu_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score || null, risk_level || 'low', recommendation || null, req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cicu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (risk_level && !VALID_RISK_LEVEL.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level', valid: VALID_RISK_LEVEL });
        const r = await db.query(
            `INSERT INTO cicu_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score || null, risk_level || 'low', recommendation || null, req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ctu/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (risk_level && !VALID_RISK_LEVEL.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level', valid: VALID_RISK_LEVEL });
        const r = await db.query(
            `INSERT INTO ctu_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score || null, risk_level || 'low', recommendation || null, req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/apache-ii', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { temp, map_val, hr, rr, pao2, ph, na, k, creatinine, hct, wbc, gcs, age_points, chronic_points } = req.query;
        const score = apacheII(parseInt(temp), parseInt(map_val), parseInt(hr), parseInt(rr), parseInt(pao2), parseInt(ph), parseInt(na), parseInt(k), parseInt(creatinine), parseInt(hct), parseInt(wbc), parseInt(gcs), parseInt(age_points), parseInt(chronic_points));
        let mortality = 'unknown';
        if (score <= 15) mortality = '6%';
        else if (score <= 25) mortality = '30%';
        else if (score <= 35) mortality = '70%';
        else mortality = '85%';
        res.json({ ok: true, apache_ii: score, mortality_estimate: mortality });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sofa', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pao2_fio2, platelets, bilirubin, map_vasopressor, gcs, creatinine } = req.query;
        const score = sofa(parseInt(pao2_fio2), parseInt(platelets), parseInt(bilirubin), parseInt(map_vasopressor), parseInt(gcs), parseInt(creatinine));
        let mortality = 'unknown';
        if (score <= 6) mortality = '<10%';
        else if (score <= 9) mortality = '15-25%';
        else if (score <= 12) mortality = '40-55%';
        else mortality = '>80%';
        res.json({ ok: true, sofa: score, mortality_estimate: mortality });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/apgar', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { hr, resp, muscle_tone, reflex, color } = req.query;
        const score = apgarScore(parseInt(hr), parseInt(resp), parseInt(muscle_tone), parseInt(reflex), parseInt(color));
        res.json({ ok: true, score, interpretation: apgarInterpretation(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const a = await db.query(`SELECT COUNT(*) AS count FROM icu_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const s = await db.query(`SELECT COUNT(*) AS count FROM icu_scores WHERE tenant_id = $1`, [req.tenantId]);
        const m = await db.query(`SELECT COUNT(*) AS count FROM icu_monitoring WHERE tenant_id = $1 AND monitor_time >= NOW() - INTERVAL '24 hours'`, [req.tenantId]);
        const v = await db.query(`SELECT COUNT(*) AS count FROM icu_ventilator WHERE tenant_id = $1 AND ended_at IS NULL`, [req.tenantId]);
        const fb = await db.query(`SELECT COUNT(*) AS count FROM icu_fluid_balance WHERE tenant_id = $1`, [req.tenantId]);
        const dg = await db.query(`SELECT COUNT(*) AS count FROM icu_daily_goals WHERE tenant_id = $1`, [req.tenantId]);
        const pb = await db.query(`SELECT bundle_type, COUNT(*) AS count FROM icu_prevention_bundles WHERE tenant_id = $1 GROUP BY bundle_type`, [req.tenantId]);
        const ccu = await db.query(`SELECT COUNT(*) AS count FROM ccu_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const cicu = await db.query(`SELECT COUNT(*) AS count FROM cicu_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const ctu = await db.query(`SELECT COUNT(*) AS count FROM ctu_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({
            ok: true,
            icu: { assessments: parseInt(a.rows[0].count), scores: parseInt(s.rows[0].count),
                   monitoring_24h: parseInt(m.rows[0].count), active_ventilators: parseInt(v.rows[0].count),
                   fluid_balance_logs: parseInt(fb.rows[0].count), daily_goals: parseInt(dg.rows[0].count),
                   prevention_bundles: pb.rows },
            ccu_assessments: parseInt(ccu.rows[0].count),
            cicu_assessments: parseInt(cicu.rows[0].count),
            ctu_assessments: parseInt(ctu.rows[0].count)
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
