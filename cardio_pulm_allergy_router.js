'use strict';
// Wave 111 — Cardiology (visits/procedures/cath) + Pulmonology (encounters/bronch/PFT) + Pulm-rehab + Allergy assessments
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BLOCKAGE = ['none','mild','moderate','severe','total'];
const VALID_CARDIO_PROC = ['echo','stress_test','holter','ekg','cath','angiography','ablation','pacemaker_implant','icd_implant','tilt_table','cardioversion','tee','mri'];
const VALID_SMOKING = ['never','former','current','passive','unknown'];
const VALID_PFT_INTERPRETATION = ['normal','obstructive','restrictive','mixed','normal_variant','uninterpretable'];
const VALID_GOLD_STAGE = ['0','I','II','III','IV','A','B','C','D','unknown'];
const VALID_BRONCH_FINDING = ['normal','inflammation','mass','stricture','bleeding','foreign_body','infection','mucus_plug','other'];
const VALID_DYSPNEA = ['0','1','2','3','4','5','6','7','8','9','10'];
const VALID_OXYGEN = ['none','intermittent','continuous','night_only','exercise_only','prn'];
const VALID_SEVERITY = ['mild','moderate','severe','life_threatening','fatal'];
const VALID_REACTION = ['urticaria','rash','angioedema','wheezing','anaphylaxis','rhinitis','vomiting','diarrhea','eczema','other'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_STATUS = ['active','inactive','planned','completed','cancelled'];

function efSeverity(ef) {
    if (ef === undefined || ef === null) return null;
    if (ef >= 55) return 'normal';
    if (ef >= 45) return 'mildly_reduced';
    if (ef >= 35) return 'moderately_reduced';
    if (ef >= 25) return 'severely_reduced';
    return 'very_severe';
}

function blockageSeverity(pct) {
    if (pct === undefined || pct === null) return null;
    if (pct === 0) return 'normal';
    if (pct < 30) return 'mild';
    if (pct < 60) return 'moderate';
    if (pct < 90) return 'severe';
    return 'critical';
}

function packYearRisk(packYears) {
    if (packYears === undefined || packYears === null) return null;
    if (packYears < 1) return 'minimal';
    if (packYears < 10) return 'low';
    if (packYears < 20) return 'moderate';
    if (packYears < 30) return 'high';
    if (packYears < 50) return 'very_high';
    return 'extreme';
}

function goldFromFEV1(fev1Pct) {
    if (fev1Pct === undefined || fev1Pct === null) return null;
    if (fev1Pct >= 80) return 'I';
    if (fev1Pct >= 50) return 'II';
    if (fev1Pct >= 30) return 'III';
    if (fev1Pct < 30) return 'IV';
    return null;
}

function pftObstruction(fev1FvcRatio) {
    if (fev1FvcRatio === undefined || fev1FvcRatio === null) return null;
    if (fev1FvcRatio < 0.7) return 'obstructive_pattern';
    return 'non_obstructive';
}

function sixMinWalkDistance(meters) {
    if (meters === undefined || meters === null) return null;
    if (meters < 150) return 'severely_impaired';
    if (meters < 250) return 'moderately_impaired';
    if (meters < 350) return 'mildly_impaired';
    if (meters < 450) return 'normal_low';
    return 'normal';
}

function dyspneaSeverity(score) {
    if (score === undefined || score === null) return null;
    if (score === 0) return 'none';
    if (score <= 3) return 'mild';
    if (score <= 6) return 'moderate';
    if (score <= 9) return 'severe';
    return 'very_severe';
}

function mapSeverity(map) {
    if (map === undefined || map === null) return null;
    if (map >= 70) return 'normal';
    if (map >= 60) return 'low';
    return 'critical';
}

function anaphylaxisRisk(reaction, severity) {
    if (severity === 'life_threatening' || severity === 'fatal') return 'critical';
    if (reaction === 'anaphylaxis') return 'high';
    if (severity === 'severe') return 'high';
    if (severity === 'moderate') return 'moderate';
    return 'low';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'cardio-pulm-allergy',
        endpoints: [
            'GET /cardiology/visits',
            'POST /cardiology/visits',
            'GET /cardiology/procedures',
            'POST /cardiology/procedures',
            'GET /cardiology/cath-reports',
            'POST /cardiology/cath-reports',
            'GET /cardiology/medications',
            'POST /cardiology/medications',
            'GET /pulmonology/encounters',
            'POST /pulmonology/encounters',
            'GET /pulmonology/bronchoscopy',
            'POST /pulmonology/bronchoscopy',
            'GET /pulmonology/pft',
            'POST /pulmonology/pft',
            'GET /pulm-rehab/sessions',
            'POST /pulm-rehab/sessions',
            'GET /allergy-assessments',
            'POST /allergy-assessments',
            'GET /ef-severity',
            'GET /gold-stage',
            'GET /6mwt',
            'GET /pack-years',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== CARDIOLOGY VISITS =====
router.get('/cardiology/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM cardiology_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (since) { sql += ` AND v.created_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardiology/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (bp_systolic !== undefined && (bp_systolic < 50 || bp_systolic > 300)) return res.status(400).json({ ok: false, error: 'invalid_sbp' });
        if (bp_diastolic !== undefined && (bp_diastolic < 30 || bp_diastolic > 200)) return res.status(400).json({ ok: false, error: 'invalid_dbp' });
        if (heart_rate !== undefined && (heart_rate < 20 || heart_rate > 250)) return res.status(400).json({ ok: false, error: 'invalid_hr' });
        if (ef_percentage !== undefined && (ef_percentage < 0 || ef_percentage > 100)) return res.status(400).json({ ok: false, error: 'ef_out_of_range' });

        const computedMap = (bp_systolic && bp_diastolic) ? Math.round((2 * parseFloat(bp_diastolic) + parseFloat(bp_systolic)) / 3) : null;

        const r = await db.query(
            `INSERT INTO cardiology_visits (tenant_id, patient_id, doctor_id, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : (req.user?.id ? String(req.user.id) : null),
             bp_systolic ?? null, bp_diastolic ?? null, heart_rate ?? null, ef_percentage ?? null, notes || null]
        );
        res.status(201).json({
            ok: true, visit: r.rows[0],
            computed: { map_value: computedMap, map_severity: mapSeverity(computedMap), ef_severity: efSeverity(ef_percentage) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY PROCEDURES =====
router.get('/cardiology/procedures', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT pr.*, p.full_name AS patient_name FROM cardiology_procedures pr LEFT JOIN patients p ON p.id = pr.patient_id WHERE pr.tenant_id = $1`;
        if (patient_id) { sql += ` AND pr.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (procedure_type) { sql += ` AND pr.procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY pr.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardiology/procedures', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, procedure_type, findings, recommendations } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_type) return res.status(400).json({ ok: false, error: 'procedure_type_required' });
        if (procedure_type && !VALID_CARDIO_PROC.includes(procedure_type)) return res.status(400).json({ ok: false, error: 'invalid_procedure_type' });

        const r = await db.query(
            `INSERT INTO cardiology_procedures (tenant_id, patient_id, doctor_id, procedure_type, findings, recommendations)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, procedure_type, findings || null, recommendations || null]
        );
        res.status(201).json({ ok: true, procedure: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY CATH REPORTS (coronary anatomy) =====
router.get('/cardiology/cath-reports', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, blockage_lad_min, blockage_rca_min, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name FROM cardiology_cath_reports c LEFT JOIN patients p ON p.id = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (blockage_lad_min) { sql += ` AND c.blockage_lad >= $${params.length + 1}`; params.push(parseInt(blockage_lad_min)); }
        if (blockage_rca_min) { sql += ` AND c.blockage_rca >= $${params.length + 1}`; params.push(parseInt(blockage_rca_min)); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardiology/cath-reports', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, blockage_lad, blockage_lcx, blockage_rca, findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (blockage_lad !== undefined && (blockage_lad < 0 || blockage_lad > 100)) return res.status(400).json({ ok: false, error: 'blockage_lad_out_of_range' });
        if (blockage_lcx !== undefined && (blockage_lcx < 0 || blockage_lcx > 100)) return res.status(400).json({ ok: false, error: 'blockage_lcx_out_of_range' });
        if (blockage_rca !== undefined && (blockage_rca < 0 || blockage_rca > 100)) return res.status(400).json({ ok: false, error: 'blockage_rca_out_of_range' });

        const r = await db.query(
            `INSERT INTO cardiology_cath_reports (tenant_id, patient_id, blockage_lad, blockage_lcx, blockage_rca, findings)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, patient_id, blockage_lad ?? null, blockage_lcx ?? null, blockage_rca ?? null, findings || null]
        );
        const total = [blockage_lad, blockage_lcx, blockage_rca].reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        const max = Math.max(blockage_lad || 0, blockage_lcx || 0, blockage_rca || 0);
        res.status(201).json({
            ok: true, report: r.rows[0],
            computed: {
                total_blockage: total,
                max_single_vessel: max,
                lad_severity: blockageSeverity(blockage_lad),
                lcx_severity: blockageSeverity(blockage_lcx),
                rca_severity: blockageSeverity(blockage_rca)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIAC MEDICATIONS =====
router.get('/cardiology/medications', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, drug_name, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cardiac_medications WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (drug_name) { sql += ` AND drug_name ILIKE $${params.length + 1}`; params.push(`%${drug_name}%`); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY start_date DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardiology/medications', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, drug_name, dosage, frequency, start_date, end_date, is_active } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        if (!dosage) return res.status(400).json({ ok: false, error: 'dosage_required' });
        if (start_date && end_date && new Date(end_date) < new Date(start_date)) return res.status(400).json({ ok: false, error: 'end_before_start' });

        const r = await db.query(
            `INSERT INTO cardiac_medications (tenant_id, patient_id, drug_name, dosage, frequency, start_date, end_date, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), drug_name, dosage, frequency || null,
             start_date || null, end_date || null, is_active === undefined ? true : !!is_active]
        );
        res.status(201).json({ ok: true, medication: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY ENCOUNTERS =====
router.get('/pulmonology/encounters', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { patient_id, smoking_status, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT e.*, p.full_name AS patient_name FROM pulmonology_encounters e LEFT JOIN patients p ON p.id::text = e.patient_id WHERE e.tenant_id = $1`;
        if (patient_id) { sql += ` AND e.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (smoking_status) { sql += ` AND e.smoking_status = $${params.length + 1}`; params.push(smoking_status); }
        if (status) { sql += ` AND e.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY e.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/encounters', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, encounter_date, chief_complaint, respiratory_history, smoking_status, pack_years, diagnosis_code, treatment_plan, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (smoking_status && !VALID_SMOKING.includes(smoking_status)) return res.status(400).json({ ok: false, error: 'invalid_smoking_status' });
        if (pack_years !== undefined && pack_years < 0) return res.status(400).json({ ok: false, error: 'invalid_pack_years' });

        const r = await db.query(
            `INSERT INTO pulmonology_encounters (tenant_id, patient_id, doctor_id, encounter_date, chief_complaint, respiratory_history, smoking_status, pack_years, diagnosis_code, treatment_plan, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : (req.user?.id ? String(req.user.id) : null),
             encounter_date || new Date().toISOString(), chief_complaint || null, respiratory_history || null,
             smoking_status || null, pack_years ?? null, diagnosis_code || null, treatment_plan || null,
             status || 'active']
        );
        res.status(201).json({ ok: true, encounter: r.rows[0], computed: { pack_year_risk: packYearRisk(pack_years) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY BRONCHOSCOPY =====
router.get('/pulmonology/bronchoscopy', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { encounter_id, biopsy_taken, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pulmonology_bronchoscopy WHERE tenant_id = $1`;
        if (encounter_id) { sql += ` AND encounter_id = $${params.length + 1}`; params.push(String(encounter_id)); }
        if (biopsy_taken !== undefined) { sql += ` AND biopsy_taken = $${params.length + 1}`; params.push(biopsy_taken === 'true'); }
        sql += ` ORDER BY procedure_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/bronchoscopy', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { encounter_id, procedure_date, findings, biopsy_taken, specimen_details, complications } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        if (!procedure_date) return res.status(400).json({ ok: false, error: 'procedure_date_required' });

        const r = await db.query(
            `INSERT INTO pulmonology_bronchoscopy (tenant_id, encounter_id, procedure_date, findings, biopsy_taken, specimen_details, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(encounter_id), procedure_date, findings || null, !!biopsy_taken, specimen_details || null, complications || null]
        );
        res.status(201).json({ ok: true, bronch: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY PFT (spirometry + DLCO + GOLD staging) =====
router.get('/pulmonology/pft', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { encounter_id, gold_stage, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pulmonology_pft_results WHERE tenant_id = $1`;
        if (encounter_id) { sql += ` AND encounter_id = $${params.length + 1}`; params.push(String(encounter_id)); }
        if (gold_stage) { sql += ` AND gold_stage = $${params.length + 1}`; params.push(gold_stage); }
        sql += ` ORDER BY test_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/pft', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { encounter_id, test_date, fev1_predicted, fev1_actual, fvc_predicted, fvc_actual, fev1_fvc_ratio, dlco_predicted, dlco_actual, interpretation, gold_stage } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        if (interpretation && !VALID_PFT_INTERPRETATION.includes(interpretation)) return res.status(400).json({ ok: false, error: 'invalid_interpretation' });
        if (gold_stage && !VALID_GOLD_STAGE.includes(gold_stage)) return res.status(400).json({ ok: false, error: 'invalid_gold_stage' });

        const fev1_pct = (fev1_predicted && fev1_actual) ? Math.round((parseFloat(fev1_actual) / parseFloat(fev1_predicted)) * 100) : null;
        const fvc_pct = (fvc_predicted && fvc_actual) ? Math.round((parseFloat(fvc_actual) / parseFloat(fvc_predicted)) * 100) : null;
        const dlco_pct = (dlco_predicted && dlco_actual) ? Math.round((parseFloat(dlco_actual) / parseFloat(dlco_predicted)) * 100) : null;
        const finalGold = gold_stage || goldFromFEV1(fev1_pct);
        const obstruction = pftObstruction(fev1_fvc_ratio);

        const r = await db.query(
            `INSERT INTO pulmonology_pft_results (tenant_id, encounter_id, test_date, fev1_predicted, fev1_actual, fvc_predicted, fvc_actual, fev1_fvc_ratio, dlco_predicted, dlco_actual, interpretation, gold_stage)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [String(req.tenantId), String(encounter_id), test_date || new Date().toISOString(),
             fev1_predicted ?? null, fev1_actual ?? null, fvc_predicted ?? null, fvc_actual ?? null,
             fev1_fvc_ratio ?? null, dlco_predicted ?? null, dlco_actual ?? null,
             interpretation || null, finalGold || null]
        );
        res.status(201).json({
            ok: true, pft: r.rows[0],
            computed: { fev1_pct_predicted: fev1_pct, fvc_pct_predicted: fvc_pct, dlco_pct_predicted: dlco_pct,
                        gold_stage: finalGold, obstruction_pattern: obstruction }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONARY REHAB SESSIONS (FEV1 + 6MWT + dyspnea) =====
router.get('/pulm-rehab/sessions', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM pulm_rehab_sessions s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulm-rehab/sessions', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, fev1, six_min_walk_m, dyspnea_scale, training, oxygen_use, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (fev1 !== undefined && (fev1 < 0 || fev1 > 100)) return res.status(400).json({ ok: false, error: 'fev1_out_of_range_0_100' });
        if (six_min_walk_m !== undefined && six_min_walk_m < 0) return res.status(400).json({ ok: false, error: 'invalid_6mwt' });
        if (dyspnea_scale !== undefined && (dyspnea_scale < 0 || dyspnea_scale > 10)) return res.status(400).json({ ok: false, error: 'dyspnea_out_of_range_0_10' });
        if (oxygen_use && !VALID_OXYGEN.includes(oxygen_use)) return res.status(400).json({ ok: false, error: 'invalid_oxygen_use' });

        const r = await db.query(
            `INSERT INTO pulm_rehab_sessions (tenant_id, patient_id, encounter_id, fev1, six_min_walk_m, dyspnea_scale, training, oxygen_use, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             fev1 ?? null, six_min_walk_m ?? null, dyspnea_scale ?? null, training || null, oxygen_use || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({
            ok: true, session: r.rows[0],
            computed: {
                gold_stage: goldFromFEV1(fev1),
                walk_distance_band: sixMinWalkDistance(six_min_walk_m),
                dyspnea_severity: dyspneaSeverity(dyspnea_scale)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ALLERGY ASSESSMENTS =====
router.get('/allergy-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, severity, anaphylaxis, allergen, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM allergy_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (anaphylaxis !== undefined) { sql += ` AND anaphylaxis = $${params.length + 1}`; params.push(anaphylaxis === 'true'); }
        if (allergen) { sql += ` AND allergen ILIKE $${params.length + 1}`; params.push(`%${allergen}%`); }
        sql += ` ORDER BY date_identified DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/allergy-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, allergen, severity, reaction, anaphylaxis, date_identified, notes, engine_name, input_payload, score, risk_level, recommendation, performed_by, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!allergen) return res.status(400).json({ ok: false, error: 'allergen_required' });
        if (severity && !VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });
        if (reaction && !VALID_REACTION.includes(reaction)) return res.status(400).json({ ok: false, error: 'invalid_reaction' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const finalAnaphylaxis = anaphylaxis !== undefined ? !!anaphylaxis : reaction === 'anaphylaxis';
        const finalRisk = risk_level || anaphylaxisRisk(reaction, severity);

        const r = await db.query(
            `INSERT INTO allergy_assessments (tenant_id, patient_id, encounter_id, allergen, severity, reaction, anaphylaxis, date_identified, notes, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             allergen, severity || null, reaction || null, finalAnaphylaxis,
             date_identified || null, notes || null,
             engine_name || null, input_payload || null, req.body.output_payload || null,
             score ?? null, finalRisk, recommendation || null,
             performed_by || null, created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { risk: finalRisk, epi_pen_indicated: finalAnaphylaxis || severity === 'life_threatening' || severity === 'severe' } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/ef-severity', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { ef } = req.query;
        if (ef === undefined) return res.status(400).json({ ok: false, error: 'ef_required' });
        res.json({ ok: true, ef: parseFloat(ef), severity: efSeverity(parseFloat(ef)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gold-stage', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { fev1_pct } = req.query;
        if (fev1_pct === undefined) return res.status(400).json({ ok: false, error: 'fev1_pct_required' });
        res.json({ ok: true, fev1_pct: parseFloat(fev1_pct), gold_stage: goldFromFEV1(parseFloat(fev1_pct)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/6mwt', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { meters } = req.query;
        if (meters === undefined) return res.status(400).json({ ok: false, error: 'meters_required' });
        res.json({ ok: true, meters: parseInt(meters), band: sixMinWalkDistance(parseInt(meters)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pack-years', requireAuth, requireTenantScope, requireRole('pulmonologist'), async (req, res) => {
    try {
        const { pack_years } = req.query;
        if (pack_years === undefined) return res.status(400).json({ ok: false, error: 'pack_years_required' });
        res.json({ ok: true, pack_years: parseFloat(pack_years), risk: packYearRisk(parseFloat(pack_years)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const cardio = await db.query(`SELECT COUNT(*) AS total_visits, AVG(ef_percentage) AS avg_ef, AVG(bp_systolic) AS avg_sbp FROM cardiology_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const cath = await db.query(`SELECT AVG((COALESCE(blockage_lad,0)+COALESCE(blockage_lcx,0)+COALESCE(blockage_rca,0))/3) AS avg_blockage FROM cardiology_cath_reports WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const pulm = await db.query(`SELECT smoking_status, COUNT(*) AS count FROM pulmonology_encounters WHERE tenant_id = $1 GROUP BY smoking_status`, [req.tenantId]);
        const pft = await db.query(`SELECT gold_stage, interpretation, COUNT(*) AS count FROM pulmonology_pft_results WHERE tenant_id = $1 GROUP BY gold_stage, interpretation`, [req.tenantId]);
        const allergy = await db.query(`SELECT severity, COUNT(*) AS count, SUM(CASE WHEN anaphylaxis THEN 1 ELSE 0 END) AS anaphylaxis_count FROM allergy_assessments WHERE tenant_id = $1 GROUP BY severity`, [req.tenantId]);
        res.json({ ok: true, cardio_90d: cardio.rows[0], cath_90d: cath.rows[0], pulm_distribution: pulm.rows, pft_distribution: pft.rows, allergy_breakdown: allergy.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
