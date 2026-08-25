'use strict';
// Wave 112 — Urology (visits/oncology/stones/surgery/urodynamics) + Consent forms + Controlled drug log
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_FORM_TYPE = ['surgery','anesthesia','blood_transfusion','research','procedure','general_treatment','photography','organ_donation','high_risk_medication','cosmetic','dental','obstetric','vaccination','other'];
const VALID_FORM_STATUS = ['drafted','pending_signature','signed','refused','revoked','expired','superseded'];
const VALID_LANGUAGE = ['ar','en','fr','ur','bilingual','other'];
const VALID_SCHEDULE = ['schedule_1','schedule_2','schedule_3','schedule_4','schedule_5','narcotic','psychotropic','precursor','uncontrolled'];
const VALID_TX_RESPONSE = ['complete_response','partial_response','stable_disease','progression','not_assessed','mixed','unknown'];
const VALID_GLEASON = ['6','7','8','9','10','3+3','3+4','4+3','4+4','4+5','5+4','5+5','ISUP_1','ISUP_2','ISUP_3','ISUP_4','ISUP_5','unknown'];
const VALID_TUMOR_GRADE = ['G1','G2','G3','G4','GX','low','intermediate','high','unknown'];
const VALID_STONE_LOC = ['kidney_upper_pole','kidney_mid_pole','kidney_lower_pole','renal_pelvis','UPJ','proximal_ureter','mid_ureter','distal_ureter','UVJ','bladder','urethra','prostatic'];
const VALID_STONE_COMP = ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','unknown','hydroxyapatite','brushite'];
const VALID_INTERPRETATION = ['normal','obstructive','stress_incontinence','urge_incontinence','mixed_incontinence','overflow','underactive_bladder','overactive_bladder','dysfunctional_voiding','other'];
const VALID_PROCEDURE = ['cystoscopy','prostate_biopsy','TURP','TURBT','nephrectomy','prostatectomy','cystectomy','ureteroscopy','lithotripsy','PCNL','circumcision','vasectomy','orchiectomy','other'];
const VALID_APPROACH = ['open','laparoscopic','robotic','endoscopic','percutaneous','transurethral','transvaginal','transperineal','other'];
const VALID_RISK = ['low','moderate','high','critical'];

function psaInterpretation(psa, age) {
    if (psa === undefined || psa === null) return null;
    if (age === undefined) {
        if (psa < 1) return 'normal';
        if (psa < 4) return 'borderline';
        if (psa < 10) return 'elevated';
        return 'highly_elevated';
    }
    if (age >= 60) {
        if (psa < 3) return 'age_appropriate';
        if (psa < 5) return 'borderline';
        if (psa < 10) return 'elevated';
        return 'highly_elevated';
    }
    if (age >= 50) {
        if (psa < 2.5) return 'age_appropriate';
        if (psa < 4) return 'borderline';
        if (psa < 10) return 'elevated';
        return 'highly_elevated';
    }
    if (psa < 1) return 'age_appropriate';
    if (psa < 2.5) return 'borderline';
    if (psa < 10) return 'elevated';
    return 'highly_elevated';
}

function ipssSeverity(score) {
    if (score === undefined || score === null) return null;
    if (score <= 7) return 'mild';
    if (score <= 19) return 'moderate';
    return 'severe';
}

function gleasonRiskGroup(gleason) {
    if (!gleason) return null;
    const map = { '6': 'ISUP_1', '3+3': 'ISUP_1', '3+4': 'ISUP_2', '7': 'ISUP_2_4', '4+3': 'ISUP_3',
                  '4+4': 'ISUP_4', '8': 'ISUP_4', '4+5': 'ISUP_5', '5+4': 'ISUP_5', '5+5': 'ISUP_5', '9': 'ISUP_5', '10': 'ISUP_5',
                  'ISUP_1': 'ISUP_1', 'ISUP_2': 'ISUP_2', 'ISUP_3': 'ISUP_3', 'ISUP_4': 'ISUP_4', 'ISUP_5': 'ISUP_5' };
    return map[gleason] || null;
}

function stoneSizeCategory(mm) {
    if (mm === undefined || mm === null) return null;
    if (mm < 5) return 'small_passable';
    if (mm < 10) return 'small_intervention';
    if (mm < 20) return 'medium';
    return 'large_pcnl_candidate';
}

function uroflowInterpretation(maxFlow) {
    if (maxFlow === undefined || maxFlow === null) return null;
    if (maxFlow < 10) return 'obstruction_likely';
    if (maxFlow < 15) return 'obstruction_possible';
    if (maxFlow < 20) return 'normal_low';
    return 'normal';
}

function postVoidResidual(pvr) {
    if (pvr === undefined || pvr === null) return null;
    if (pvr < 50) return 'normal';
    if (pvr < 150) return 'mild_retention';
    if (pvr < 300) return 'moderate_retention';
    return 'severe_retention';
}

function controlledDrugRisk(schedule, qty, balanceAfter) {
    if (!schedule) return null;
    if (schedule === 'schedule_1' || schedule === 'narcotic') return 'highest_oversight';
    if (schedule === 'schedule_2' || schedule === 'psychotropic') return 'high_oversight';
    if (schedule === 'schedule_3') return 'moderate_oversight';
    return 'standard_oversight';
}

function balanceVariance(balanceBefore, balanceAfter, qty) {
    if (balanceBefore === undefined || balanceAfter === undefined || qty === undefined) return null;
    const expected = parseFloat(balanceBefore) - parseFloat(qty);
    return parseFloat(balanceAfter) - expected;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'urology-consent-drug',
        endpoints: [
            'GET /urology/visits',
            'POST /urology/visits',
            'GET /urology/oncology-metrics',
            'POST /urology/oncology-metrics',
            'GET /urology/stones',
            'POST /urology/stones',
            'GET /urology/surgical-logs',
            'POST /urology/surgical-logs',
            'GET /urodynamic',
            'POST /urodynamic',
            'GET /consent-forms',
            'POST /consent-forms',
            'POST /controlled-drug',
            'GET /controlled-drug',
            'GET /psa',
            'GET /ipss',
            'GET /gleason',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== UROLOGY VISITS =====
router.get('/urology/visits', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM urology_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/visits', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, psa, ipss_score, prostate_volume_ml, uroflow_max, plan, age, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (psa !== undefined && psa < 0) return res.status(400).json({ ok: false, error: 'invalid_psa' });
        if (ipss_score !== undefined && (ipss_score < 0 || ipss_score > 35)) return res.status(400).json({ ok: false, error: 'ipss_out_of_range_0_35' });
        if (prostate_volume_ml !== undefined && prostate_volume_ml <= 0) return res.status(400).json({ ok: false, error: 'invalid_volume' });

        const r = await db.query(
            `INSERT INTO urology_visits (tenant_id, patient_id, encounter_id, psa, ipss_score, prostate_volume_ml, uroflow_max, plan, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             psa ?? null, ipss_score ?? null, prostate_volume_ml ?? null, uroflow_max ?? null, plan || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({
            ok: true, visit: r.rows[0],
            computed: {
                psa_interpretation: psaInterpretation(psa, age),
                ipss_severity: ipssSeverity(ipss_score),
                uroflow_interpretation: uroflowInterpretation(uroflow_max)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY ONCOLOGY METRICS (PSA + Gleason + treatment response) =====
router.get('/urology/oncology-metrics', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, treatment_response, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM urology_oncology_metrics WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (treatment_response) { sql += ` AND treatment_response = $${params.length + 1}`; params.push(treatment_response); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/oncology-metrics', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, log_time, psa_level, gleason_score, tumor_grade, treatment_response } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (psa_level !== undefined && psa_level < 0) return res.status(400).json({ ok: false, error: 'invalid_psa' });
        if (gleason_score && !VALID_GLEASON.includes(gleason_score)) return res.status(400).json({ ok: false, error: 'invalid_gleason' });
        if (tumor_grade && !VALID_TUMOR_GRADE.includes(tumor_grade)) return res.status(400).json({ ok: false, error: 'invalid_tumor_grade' });
        if (treatment_response && !VALID_TX_RESPONSE.includes(treatment_response)) return res.status(400).json({ ok: false, error: 'invalid_treatment_response' });

        const r = await db.query(
            `INSERT INTO urology_oncology_metrics (tenant_id, patient_id, log_time, psa_level, gleason_score, tumor_grade, treatment_response)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             psa_level ?? null, gleason_score || null, tumor_grade || null, treatment_response || null]
        );
        res.status(201).json({
            ok: true, metric: r.rows[0],
            computed: {
                psa_interpretation: psaInterpretation(psa_level),
                gleason_isup_grade: gleasonRiskGroup(gleason_score)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY STONE REGISTRY =====
router.get('/urology/stones', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, stone_location, fragmentation_success, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM urology_stone_registry WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (stone_location) { sql += ` AND stone_location = $${params.length + 1}`; params.push(stone_location); }
        if (fragmentation_success !== undefined) { sql += ` AND fragmentation_success = $${params.length + 1}`; params.push(fragmentation_success === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/stones', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, procedure_id, stone_location, stone_size_mm, stone_composition, fragmentation_success } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (stone_location && !VALID_STONE_LOC.includes(stone_location)) return res.status(400).json({ ok: false, error: 'invalid_location' });
        if (stone_size_mm !== undefined && stone_size_mm <= 0) return res.status(400).json({ ok: false, error: 'invalid_size' });
        if (stone_composition && !VALID_STONE_COMP.includes(stone_composition)) return res.status(400).json({ ok: false, error: 'invalid_composition' });

        const r = await db.query(
            `INSERT INTO urology_stone_registry (tenant_id, patient_id, procedure_id, stone_location, stone_size_mm, stone_composition, fragmentation_success)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             stone_location || null, stone_size_mm ?? null, stone_composition || null, fragmentation_success === undefined ? null : !!fragmentation_success]
        );
        res.status(201).json({
            ok: true, stone: r.rows[0],
            computed: { stone_size_category: stoneSizeCategory(stone_size_mm) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY SURGICAL LOGS =====
router.get('/urology/surgical-logs', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM urology_surgical_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/surgical-logs', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (procedure_type && !VALID_PROCEDURE.includes(procedure_type)) return res.status(400).json({ ok: false, error: 'invalid_procedure_type' });
        if (approach && !VALID_APPROACH.includes(approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (blood_loss_ml !== undefined && blood_loss_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_blood_loss' });

        const r = await db.query(
            `INSERT INTO urology_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : (req.user?.id ? String(req.user.id) : null),
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             duration_minutes ?? null, blood_loss_ml ?? null, complications || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== URODYNAMIC STUDIES =====
router.get('/urodynamic', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, interpretation, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT u.*, p.full_name AS patient_name FROM urodynamic_studies u LEFT JOIN patients p ON p.id = u.patient_id WHERE u.tenant_id = $1`;
        if (patient_id) { sql += ` AND u.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (interpretation) { sql += ` AND u.interpretation ILIKE $${params.length + 1}`; params.push(`%${interpretation}%`); }
        sql += ` ORDER BY u.study_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urodynamic', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, study_date, max_flow_rate, voided_volume, post_void_residual, detrusor_pressure, interpretation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (max_flow_rate !== undefined && max_flow_rate < 0) return res.status(400).json({ ok: false, error: 'invalid_max_flow' });
        if (voided_volume !== undefined && voided_volume < 0) return res.status(400).json({ ok: false, error: 'invalid_voided_volume' });
        if (post_void_residual !== undefined && post_void_residual < 0) return res.status(400).json({ ok: false, error: 'invalid_pvr' });
        if (detrusor_pressure !== undefined && detrusor_pressure < 0) return res.status(400).json({ ok: false, error: 'invalid_detrusor_pressure' });

        const r = await db.query(
            `INSERT INTO urodynamic_studies (tenant_id, patient_id, doctor_id, study_date, max_flow_rate, voided_volume, post_void_residual, detrusor_pressure, interpretation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, study_date || null,
             max_flow_rate ?? null, voided_volume ?? null, post_void_residual ?? null, detrusor_pressure ?? null, interpretation || null]
        );
        res.status(201).json({
            ok: true, study: r.rows[0],
            computed: {
                flow_interpretation: uroflowInterpretation(max_flow_rate),
                pvr_interpretation: postVoidResidual(post_void_residual)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CONSENT FORMS (bilingual + witness + status) =====
router.get('/consent-forms', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, form_type, status, surgery_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM consent_forms WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (form_type) { sql += ` AND form_type = $${params.length + 1}`; params.push(form_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/consent-forms', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, form_type, form_title, form_title_ar, content, doctor_name, witness_name, language, surgery_id, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!form_type || !VALID_FORM_TYPE.includes(form_type)) return res.status(400).json({ ok: false, error: 'invalid_form_type', valid: VALID_FORM_TYPE });
        if (!form_title) return res.status(400).json({ ok: false, error: 'form_title_required' });
        if (language && !VALID_LANGUAGE.includes(language)) return res.status(400).json({ ok: false, error: 'invalid_language' });
        if (status && !VALID_FORM_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO consent_forms (tenant_id, patient_id, form_type, form_title, form_title_ar, content, doctor_name, witness_name, language, surgery_id, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, patient_id, form_type, form_title, form_title_ar || null, content || null,
             doctor_name || null, witness_name || null, language || 'bilingual', surgery_id || null,
             status || 'drafted', notes || null]
        );
        res.status(201).json({ ok: true, consent: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CONTROLLED DRUG LOG (narcotic tracking) =====
router.get('/controlled-drug', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, drug_name, schedule_class, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM controlled_drug_log WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (drug_name) { sql += ` AND drug_name ILIKE $${params.length + 1}`; params.push(`%${drug_name}%`); }
        if (schedule_class) { sql += ` AND schedule_class = $${params.length + 1}`; params.push(schedule_class); }
        if (since) { sql += ` AND at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/controlled-drug', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { branch_id, drug_id, drug_name, drug_batch_id, dispense_id, prescription_id, patient_id, qty, balance_before, balance_after, schedule_class, dispensed_by, witnessed_by } = req.body;
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (qty === undefined || qty <= 0) return res.status(400).json({ ok: false, error: 'qty_required_positive' });
        if (balance_before === undefined || balance_after === undefined) return res.status(400).json({ ok: false, error: 'balance_required' });
        if (!schedule_class || !VALID_SCHEDULE.includes(schedule_class)) return res.status(400).json({ ok: false, error: 'invalid_schedule_class' });
        if (!dispensed_by) return res.status(400).json({ ok: false, error: 'dispenser_required' });
        if (!witnessed_by) return res.status(400).json({ ok: false, error: 'witness_required' });

        const variance = balanceVariance(balance_before, balance_after, qty);

        const r = await db.query(
            `INSERT INTO controlled_drug_log (tenant_id, branch_id, drug_id, drug_name, drug_batch_id, dispense_id, prescription_id, patient_id, qty, balance_before, balance_after, schedule_class, dispensed_by, witnessed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [req.tenantId, branch_id || null, drug_id || null, drug_name, drug_batch_id || null, dispense_id || null,
             prescription_id || null, patient_id, qty, balance_before, balance_after, schedule_class,
             dispensed_by, witnessed_by]
        );
        res.status(201).json({
            ok: true, log: r.rows[0],
            computed: {
                variance: variance,
                is_balanced: variance === 0,
                oversight_level: controlledDrugRisk(schedule_class, qty, balance_after)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/psa', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { psa, age } = req.query;
        if (psa === undefined) return res.status(400).json({ ok: false, error: 'psa_required' });
        res.json({ ok: true, psa: parseFloat(psa), age: age ? parseInt(age) : null, interpretation: psaInterpretation(parseFloat(psa), age ? parseInt(age) : undefined) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ipss', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score), severity: ipssSeverity(parseInt(score)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gleason', requireAuth, requireTenantScope, requireRole('urologist'), async (req, res) => {
    try {
        const { score } = req.query;
        if (!score) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score, isup_grade: gleasonRiskGroup(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const urology = await db.query(`SELECT COUNT(*) AS visits, AVG(psa) AS avg_psa, AVG(ipss_score) AS avg_ipss FROM urology_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const onco = await db.query(`SELECT treatment_response, COUNT(*) AS count FROM urology_oncology_metrics WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '90 days' GROUP BY treatment_response ORDER BY count DESC`, [req.tenantId]);
        const stones = await db.query(`SELECT stone_location, COUNT(*) AS count, SUM(CASE WHEN fragmentation_success THEN 1 ELSE 0 END) AS success_count FROM urology_stone_registry WHERE tenant_id = $1 GROUP BY stone_location`, [req.tenantId]);
        const cons = await db.query(`SELECT status, form_type, COUNT(*) AS count FROM consent_forms WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY status, form_type ORDER BY count DESC`, [req.tenantId]);
        const drugs = await db.query(`SELECT schedule_class, COUNT(*) AS count, SUM(qty) AS total_qty FROM controlled_drug_log WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '90 days' GROUP BY schedule_class`, [req.tenantId]);
        res.json({ ok: true, urology_90d: urology.rows[0], onco_response_90d: onco.rows, stone_distribution: stones.rows, consent_90d: cons.rows, controlled_drug_90d: drugs.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
