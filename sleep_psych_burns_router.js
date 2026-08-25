'use strict';
// Wave 115 — Sleep medicine (PSG + engine) + Psychiatry (PHQ-9/GAD-7 + engine) + Plastic-burns surgery logs
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_RISK = ['low','moderate','high','critical'];
const VALID_PSG_INTERPRETATION = ['normal','obstructive','central','mixed','positional','upper_airway_resistance','narcolepsy','restless_leg','periodic_limb','parasomnia','insomnia'];
const VALID_CPAP_MODE = ['CPAP','BiPAP','APAP','ASV','none'];
const VALID_PHQ9 = ['none','minimal','mild','moderate','moderately_severe','severe'];
const VALID_GAD7 = ['minimal','mild','moderate','severe'];
const VALID_PROCEDURE_TYPE = ['reconstruction','burn_grafting','scar_revision','flap','filler','botox','laser','liposuction','tumor_excision','cosmetic','other'];
const VALID_APPROACH = ['open','minimally_invasive','endoscopic','robotic','percutaneous','other'];
const VALID_BURN_COMPLICATION = ['none','infection','contracture','hypertrophic_scar','flap_loss','graft_loss','dehiscence','hemorrhage','sepsis','other'];

function phq9Score(score) {
    if (score === undefined || score === null) return null;
    if (score <= 4) return 'none';
    if (score <= 9) return 'minimal';
    if (score <= 14) return 'mild';
    if (score <= 19) return 'moderate';
    return 'severe';
}

function gad7Score(score) {
    if (score === undefined || score === null) return null;
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
}

function suicidalRiskFlag(phq9) {
    if (phq9 === undefined || phq9 === null) return null;
    if (phq9 >= 20) return 'high_alert';
    if (phq9 >= 15) return 'moderate_alert';
    if (phq9 >= 10) return 'monitor';
    return 'standard';
}

function anxietyComorbidityFlag(gad7) {
    if (gad7 === undefined || gad7 === null) return null;
    if (gad7 >= 15) return 'comorbidity_high';
    if (gad7 >= 10) return 'comorbidity_moderate';
    return 'standard';
}

function ahiSeverity(ahi) {
    if (ahi === undefined || ahi === null) return null;
    if (ahi < 5) return 'normal';
    if (ahi < 15) return 'mild';
    if (ahi < 30) return 'moderate';
    return 'severe';
}

function oxygenSeverity(spo2) {
    if (spo2 === undefined || spo2 === null) return null;
    if (spo2 < 80) return 'critical';
    if (spo2 < 85) return 'severe';
    if (spo2 < 90) return 'moderate';
    return 'normal';
}

function sleepEfficiencyScore(efficiency) {
    if (efficiency === undefined || efficiency === null) return null;
    if (efficiency < 65) return 'severe_insomnia_pattern';
    if (efficiency < 75) return 'poor_sleep';
    if (efficiency < 85) return 'fair_sleep';
    if (efficiency < 95) return 'good_sleep';
    return 'excellent_sleep';
}

function cpapPressureRecommendation(ahi, spo2) {
    if (ahi < 5) return 'cpap_not_indicated';
    if (ahi < 15) return 'cpap_positional_therapy_first';
    if (ahi < 30 && spo2 >= 85) return 'cpap_8_12_cmH2o';
    if (ahi >= 30 || spo2 < 85) return 'cpap_high_pressure_or_BiPAP';
    return 'cpap_standard';
}

function burnSurgeryRisk(duration, bloodLoss, complications) {
    if (complications && complications !== 'none') return 'high';
    if (bloodLoss && bloodLoss > 1000) return 'high';
    if (duration && duration > 240) return 'moderate';
    return 'low';
}

function burnsReconstructionType(procedure) {
    const map = { 'reconstruction': 'functional', 'burn_grafting': 'acute_care', 'scar_revision': 'revision', 'flap': 'complex',
                  'filler': 'cosmetic', 'botox': 'cosmetic', 'laser': 'cosmetic', 'liposuction': 'cosmetic',
                  'tumor_excision': 'oncologic', 'cosmetic': 'cosmetic' };
    return map[procedure] || 'other';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'sleep-psych-burns',
        endpoints: [
            'GET /sleep/studies',
            'POST /sleep/studies',
            'GET /sleep/engine-assessments',
            'POST /sleep/engine-assessments',
            'GET /psych/visits',
            'POST /psych/visits',
            'GET /psych/engine-assessments',
            'POST /psych/engine-assessments',
            'GET /plastic-burns/surgical-logs',
            'POST /plastic-burns/surgical-logs',
            'GET /phq9',
            'GET /gad7',
            'GET /ahi',
            'GET /cpap-recommendation',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SLEEP STUDIES (PSG) =====
router.get('/sleep/studies', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM sleep_studies s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sleep/studies', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, ahi, spo2_nadir, sleep_efficiency, recommendations, cpap_pressure, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (ahi !== undefined && ahi < 0) return res.status(400).json({ ok: false, error: 'invalid_ahi' });
        if (spo2_nadir !== undefined && (spo2_nadir < 0 || spo2_nadir > 100)) return res.status(400).json({ ok: false, error: 'spo2_out_of_range_0_100' });
        if (sleep_efficiency !== undefined && (sleep_efficiency < 0 || sleep_efficiency > 100)) return res.status(400).json({ ok: false, error: 'efficiency_out_of_range_0_100' });
        if (cpap_pressure !== undefined && (cpap_pressure < 4 || cpap_pressure > 25)) return res.status(400).json({ ok: false, error: 'cpap_pressure_out_of_range_4_25' });

        const r = await db.query(
            `INSERT INTO sleep_studies (tenant_id, patient_id, encounter_id, ahi, spo2_nadir, sleep_efficiency, recommendations, cpap_pressure, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             ahi ?? null, spo2_nadir ?? null, sleep_efficiency ?? null, recommendations || null, cpap_pressure ?? null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({
            ok: true, study: r.rows[0],
            computed: {
                ahi_severity: ahiSeverity(ahi),
                oxygen_severity: oxygenSeverity(spo2_nadir),
                sleep_efficiency_band: sleepEfficiencyScore(sleep_efficiency),
                cpap_recommendation: cpapPressureRecommendation(ahi, spo2_nadir)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SLEEP MEDICINE ENGINE ASSESSMENTS =====
router.get('/sleep/engine-assessments', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM sleep_medicine_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sleep/engine-assessments', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO sleep_medicine_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PSYCHIATRY VISITS (PHQ-9 + GAD-7) =====
router.get('/psych/visits', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, diagnosis, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM psychiatry_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (diagnosis) { sql += ` AND v.diagnosis ILIKE $${params.length + 1}`; params.push(`%${diagnosis}%`); }
        if (since) { sql += ` AND v.created_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/psych/visits', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, phq9_score, gad7_score, diagnosis, medications, risk_assessment, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (phq9_score !== undefined && (phq9_score < 0 || phq9_score > 27)) return res.status(400).json({ ok: false, error: 'phq9_out_of_range_0_27' });
        if (gad7_score !== undefined && (gad7_score < 0 || gad7_score > 21)) return res.status(400).json({ ok: false, error: 'gad7_out_of_range_0_21' });

        const r = await db.query(
            `INSERT INTO psychiatry_visits (tenant_id, patient_id, encounter_id, phq9_score, gad7_score, diagnosis, medications, risk_assessment, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             phq9_score ?? null, gad7_score ?? null, diagnosis || null, medications || null, risk_assessment || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({
            ok: true, visit: r.rows[0],
            computed: {
                phq9_severity: phq9Score(phq9_score),
                gad7_severity: gad7Score(gad7_score),
                suicidal_risk_flag: suicidalRiskFlag(phq9_score),
                anxiety_comorbidity: anxietyComorbidityFlag(gad7_score)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PSYCHIATRY ENGINE ASSESSMENTS =====
router.get('/psych/engine-assessments', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM psychiatry_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/psych/engine-assessments', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO psychiatry_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PLASTIC-BURNS SURGICAL LOGS =====
router.get('/plastic-burns/surgical-logs', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT l.*, p.full_name AS patient_name FROM plastic_burns_surgical_logs l LEFT JOIN patients p ON p.id::text = l.patient_id WHERE l.tenant_id = $1`;
        if (patient_id) { sql += ` AND l.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND l.procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY l.operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/plastic-burns/surgical-logs', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (procedure_type && !VALID_PROCEDURE_TYPE.includes(procedure_type)) return res.status(400).json({ ok: false, error: 'invalid_procedure_type' });
        if (approach && !VALID_APPROACH.includes(approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (complications && !VALID_BURN_COMPLICATION.includes(complications)) return res.status(400).json({ ok: false, error: 'invalid_complication' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (blood_loss_ml !== undefined && blood_loss_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_blood_loss' });

        const r = await db.query(
            `INSERT INTO plastic_burns_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : (req.user?.id ? String(req.user.id) : null),
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             duration_minutes ?? null, blood_loss_ml ?? null, complications || null]
        );
        res.status(201).json({
            ok: true, log: r.rows[0],
            computed: {
                risk: burnSurgeryRisk(duration_minutes, blood_loss_ml, complications),
                reconstruction_type: burnsReconstructionType(procedure_type)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/phq9', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        const s = parseInt(score);
        res.json({ ok: true, score: s, severity: phq9Score(s), suicidal_risk_flag: suicidalRiskFlag(s) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gad7', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        const s = parseInt(score);
        res.json({ ok: true, score: s, severity: gad7Score(s), comorbidity_flag: anxietyComorbidityFlag(s) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ahi', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { ahi } = req.query;
        if (ahi === undefined) return res.status(400).json({ ok: false, error: 'ahi_required' });
        res.json({ ok: true, ahi: parseFloat(ahi), severity: ahiSeverity(parseFloat(ahi)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cpap-recommendation', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { ahi, spo2_nadir } = req.query;
        if (ahi === undefined || spo2_nadir === undefined) return res.status(400).json({ ok: false, error: 'ahi_and_spo2_required' });
        res.json({ ok: true, ahi: parseFloat(ahi), spo2_nadir: parseFloat(spo2_nadir), recommendation: cpapPressureRecommendation(parseFloat(ahi), parseFloat(spo2_nadir)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const sleep = await db.query(`SELECT AVG(ahi) AS avg_ahi, AVG(spo2_nadir) AS avg_spo2, AVG(sleep_efficiency) AS avg_eff, COUNT(*) AS studies FROM sleep_studies WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const psych = await db.query(`SELECT AVG(phq9_score) AS avg_phq9, AVG(gad7_score) AS avg_gad7, COUNT(*) AS visits, COUNT(*) FILTER (WHERE phq9_score >= 20) AS high_risk_visits FROM psychiatry_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const burns = await db.query(`SELECT procedure_type, complications, COUNT(*) AS count, AVG(blood_loss_ml) AS avg_blood_loss FROM plastic_burns_surgical_logs WHERE tenant_id = $1 GROUP BY procedure_type, complications ORDER BY count DESC`, [req.tenantId]);
        res.json({ ok: true, sleep_90d: sleep.rows[0], psych_90d: psych.rows[0], burns_distribution: burns.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
