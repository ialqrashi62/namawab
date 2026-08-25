'use strict';
// Wave 113 — Admissions (inpatient lifecycle) + Daily rounds (SOAP) + Clinical records/photos/templates + Medical coding
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ADM_TYPE = ['emergency','urgent','elective','transfer','observation','day_care','same_day_surgery','obstetric'];
const VALID_DISCHARGE_TYPE = ['home','against_medical_advice','transfer','expired','hospice','rehab','AMA','referred','absconded'];
const VALID_ACTIVITY = ['bed_rest','up_ad_lib','ambulate','wheelchair','NPO','strict_bed_rest','bathroom_privileges','isolation'];
const VALID_DIET = ['NPO','clear_liquids','full_liquids','soft','regular','diabetic','cardiac','renal','low_sodium','low_fat','high_protein','tube_feeding','TPN','other'];
const VALID_ADMISSION_STATUS = ['admitted','in_treatment','discharge_planned','discharged','transferred','expired','AMA','on_leave'];
const VALID_DVT = ['none','LMWH','UFH','warfarin','DOAC','mechanical','aspirin','combined'];
const VALID_BODY_REGION = ['head','face','neck','chest','abdomen','back','upper_extremity','lower_extremity','genitalia','perineum','other'];
const VALID_CODE_SYSTEM = ['ICD-10','ICD-10-CM','ICD-10-PCS','ICD-9','SNOMED-CT','LOINC','RxNorm','CPT','HCPCS','DRG','local'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_TEMPLATE_STATUS = ['active','deprecated','draft','archived'];

function losDays(admissionDate, dischargeDate) {
    if (!admissionDate) return null;
    const end = dischargeDate ? new Date(dischargeDate) : new Date();
    return Math.ceil((end - new Date(admissionDate)) / (1000 * 60 * 60 * 24));
}

function losVariance(actual, expected) {
    if (actual === null || expected === undefined) return null;
    return actual - parseInt(expected);
}

function soapCompleteness(subjective, objective, assessment, plan) {
    let score = 0;
    if (subjective && subjective.trim()) score += 25;
    if (objective && objective.trim()) score += 25;
    if (assessment && assessment.trim()) score += 25;
    if (plan && plan.trim()) score += 25;
    return score;
}

function dvtProphylaxisRisk(score, status) {
    if (status === 'discharged' || status === 'expired') return 'not_applicable';
    if (score === 'none' || score === undefined) return 'high';
    return 'protected';
}

function photoConfidentialityFlag(is_confidential, body_region) {
    if (is_confidential) return 'restricted_access';
    const sensitive = ['genitalia', 'perineum', 'face'];
    if (sensitive.includes(body_region)) return 'sensitive';
    return 'standard';
}

function diagnosisIcdValidation(code) {
    if (!code) return null;
    const icd10 = /^[A-TV-Z][0-9][0-9AB](\.[0-9A-Z]{1,4})?$/;
    return icd10.test(code) ? 'valid_icd10' : 'unknown_format';
}

function templateVersionBump(currentVersion) {
    if (!currentVersion) return '1.0.0';
    const parts = currentVersion.split('.').map(Number);
    if (parts.length !== 3) return currentVersion;
    parts[2] += 1;
    return parts.join('.');
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'admission-coding',
        endpoints: [
            'GET /admissions',
            'POST /admissions',
            'GET /admissions/:id/rounds',
            'POST /admissions/:id/rounds',
            'GET /admissions/:id/discharge',
            'POST /admissions/:id/discharge',
            'GET /clinical-records',
            'POST /clinical-records',
            'GET /clinical-photos',
            'POST /clinical-photos',
            'GET /clinical-templates',
            'POST /clinical-templates',
            'GET /clinical-smart-templates',
            'POST /clinical-smart-templates',
            'GET /coding',
            'POST /coding',
            'GET /los',
            'GET /dvt-risk',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== ADMISSIONS =====
router.get('/admissions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, status, admission_type, ward_id, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_lookup FROM admissions a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND a.status = $${params.length + 1}`; params.push(status); }
        if (admission_type) { sql += ` AND a.admission_type = $${params.length + 1}`; params.push(admission_type); }
        if (ward_id) { sql += ` AND a.ward_id = $${params.length + 1}`; params.push(parseInt(ward_id)); }
        if (since) { sql += ` AND a.admission_date >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY a.admission_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/admissions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!admission_type || !VALID_ADM_TYPE.includes(admission_type)) return res.status(400).json({ ok: false, error: 'invalid_admission_type' });
        if (diet_order && !VALID_DIET.includes(diet_order)) return res.status(400).json({ ok: false, error: 'invalid_diet' });
        if (activity_level && !VALID_ACTIVITY.includes(activity_level)) return res.status(400).json({ ok: false, error: 'invalid_activity' });
        if (dvt_prophylaxis && !VALID_DVT.includes(dvt_prophylaxis)) return res.status(400).json({ ok: false, error: 'invalid_dvt_prophylaxis' });
        if (status && !VALID_ADMISSION_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (icd10_code && diagnosisIcdValidation(icd10_code) === 'unknown_format') return res.status(400).json({ ok: false, error: 'invalid_icd10_format' });

        const r = await db.query(
            `INSERT INTO admissions (tenant_id, patient_id, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [req.tenantId, patient_id, admission_type, admission_date || new Date().toISOString(),
             admitting_doctor || null, attending_doctor || null, department || null, ward_id || null, bed_id || null,
             diagnosis || null, icd10_code || null, admission_orders || null, diet_order || null,
             activity_level || null, dvt_prophylaxis || null, expected_los ?? null, insurance_auth || null,
             status || 'admitted']
        );
        res.status(201).json({
            ok: true, admission: r.rows[0],
            computed: { los_days: losDays(admission_date, null), icd10_format: diagnosisIcdValidation(icd10_code) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DAILY ROUNDS (SOAP notes) =====
router.get('/admissions/:id/rounds', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM admission_daily_rounds WHERE tenant_id = $1 AND admission_id = $2 ORDER BY round_date DESC, round_time DESC`, [req.tenantId, req.params.id]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/admissions/:id/rounds', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!round_date) return res.status(400).json({ ok: false, error: 'round_date_required' });
        if (!doctor_name) return res.status(400).json({ ok: false, error: 'doctor_required' });

        const soapScore = soapCompleteness(subjective, objective, assessment, plan);

        const r = await db.query(
            `INSERT INTO admission_daily_rounds (tenant_id, admission_id, patient_id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, req.params.id, patient_id, round_date, round_time || null, doctor_name,
             subjective || null, objective || null, assessment || null, plan || null,
             vitals_summary || null, orders || null, diet_changes || null]
        );
        res.status(201).json({
            ok: true, round: r.rows[0],
            computed: { soap_completeness_pct: soapScore, is_complete_soap: soapScore === 100 }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DISCHARGE (single-step workflow) =====
router.post('/admissions/:id/discharge', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { discharge_date, discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor } = req.body;
        if (!discharge_type || !VALID_DISCHARGE_TYPE.includes(discharge_type)) return res.status(400).json({ ok: false, error: 'invalid_discharge_type' });
        if (!discharge_summary) return res.status(400).json({ ok: false, error: 'discharge_summary_required' });

        const adm = await db.query(`SELECT admission_date FROM admissions WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!adm.rows.length) return res.status(404).json({ ok: false, error: 'admission_not_found' });
        const actualLOS = losDays(adm.rows[0].admission_date, discharge_date || new Date().toISOString());

        const newStatus = discharge_type === 'expired' ? 'expired' : 'discharged';

        const r = await db.query(
            `UPDATE admissions SET discharge_date = $1, discharge_type = $2, discharge_summary = $3, discharge_instructions = $4, discharge_medications = $5, followup_date = $6, followup_doctor = $7, status = $8
             WHERE tenant_id = $9 AND id = $10 RETURNING *`,
            [discharge_date || new Date().toISOString(), discharge_type, discharge_summary,
             discharge_instructions || null, discharge_medications || null, followup_date || null, followup_doctor || null,
             newStatus, req.tenantId, req.params.id]
        );
        res.json({ ok: true, admission: r.rows[0], computed: { actual_los_days: actualLOS } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL RECORDS (templated JSON) =====
router.get('/clinical-records', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, template_id, is_locked, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_records WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (template_id) { sql += ` AND template_id = $${params.length + 1}`; params.push(parseInt(template_id)); }
        if (is_locked !== undefined) { sql += ` AND is_locked = $${params.length + 1}`; params.push(parseInt(is_locked)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-records', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, template_id, record_data, is_locked, signature } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!template_id) return res.status(400).json({ ok: false, error: 'template_id_required' });

        const r = await db.query(
            `INSERT INTO clinical_records (tenant_id, patient_id, template_id, record_data, is_locked, signature, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, parseInt(patient_id), parseInt(template_id), record_data || null, is_locked ? 1 : 0, signature || null, req.user?.id || null]
        );
        res.status(201).json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL PHOTOS METADATA =====
router.get('/clinical-photos', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, body_region, is_confidential, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_photos_meta WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (body_region) { sql += ` AND body_region = $${params.length + 1}`; params.push(body_region); }
        if (is_confidential !== undefined) { sql += ` AND is_confidential = $${params.length + 1}`; params.push(is_confidential === 'true'); }
        sql += ` ORDER BY photo_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-photos', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor_id, photo_date, body_region, description, is_confidential } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!photo_date) return res.status(400).json({ ok: false, error: 'photo_date_required' });
        if (body_region && !VALID_BODY_REGION.includes(body_region)) return res.status(400).json({ ok: false, error: 'invalid_body_region' });

        const accessFlag = photoConfidentialityFlag(is_confidential, body_region);

        const r = await db.query(
            `INSERT INTO clinical_photos_meta (tenant_id, patient_id, doctor_id, photo_date, body_region, description, is_confidential)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, parseInt(patient_id), doctor_id || req.user?.id || null, photo_date,
             body_region || null, description || null, is_confidential === true]
        );
        res.status(201).json({ ok: true, photo: r.rows[0], computed: { access_classification: accessFlag } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL TEMPLATES =====
router.get('/clinical-templates', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { department_id, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_templates WHERE tenant_id = $1`;
        if (department_id) { sql += ` AND department_id = $${params.length + 1}`; params.push(parseInt(department_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY template_name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-templates', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department_id, version, form_structure, is_active, template_name_en, template_name_ar } = req.body;
        if (!template_name_en) return res.status(400).json({ ok: false, error: 'template_name_required' });
        const finalVersion = version || templateVersionBump('1.0.0');

        const r = await db.query(
            `INSERT INTO clinical_templates (tenant_id, department_id, version, form_structure, is_active, template_name_en, template_name_ar)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, department_id || null, finalVersion, form_structure || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0), template_name_en, template_name_ar || null]
        );
        res.status(201).json({ ok: true, template: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL SMART TEMPLATES (autocomplete shortcuts) =====
router.get('/clinical-smart-templates', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { doctor_id, shortcut, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_smart_templates WHERE tenant_id = $1`;
        if (doctor_id) { sql += ` AND doctor_id = $${params.length + 1}`; params.push(parseInt(doctor_id)); }
        if (shortcut) { sql += ` AND shortcut ILIKE $${params.length + 1}`; params.push(`%${shortcut}%`); }
        sql += ` ORDER BY shortcut LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-smart-templates', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { doctor_id, shortcut, template_text } = req.body;
        if (!shortcut) return res.status(400).json({ ok: false, error: 'shortcut_required' });
        if (!template_text) return res.status(400).json({ ok: false, error: 'template_text_required' });
        if (shortcut.length < 2) return res.status(400).json({ ok: false, error: 'shortcut_too_short_min_2' });

        const r = await db.query(
            `INSERT INTO clinical_smart_templates (tenant_id, doctor_id, shortcut, template_text)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [req.tenantId, doctor_id || req.user?.id || null, shortcut.toLowerCase(), template_text]
        );
        res.status(201).json({ ok: true, smart_template: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEDICAL CODING =====
router.get('/coding', requireAuth, requireTenantScope, requireRole('medical_coder'), async (req, res) => {
    try {
        const { patient_id, code_system, code, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM coding WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (code_system) { sql += ` AND code_system = $${params.length + 1}`; params.push(code_system); }
        if (code) { sql += ` AND code ILIKE $${params.length + 1}`; params.push(`%${code}%`); }
        if (since) { sql += ` AND created_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/coding', requireAuth, requireTenantScope, requireRole('medical_coder'), async (req, res) => {
    try {
        const { patient_id, encounter_ref, code_system, code, description } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!code_system || !VALID_CODE_SYSTEM.includes(code_system)) return res.status(400).json({ ok: false, error: 'invalid_code_system', valid: VALID_CODE_SYSTEM });
        if (!code) return res.status(400).json({ ok: false, error: 'code_required' });

        let formatResult = null;
        if (code_system === 'ICD-10' || code_system === 'ICD-10-CM' || code_system === 'ICD-10-PCS') {
            formatResult = diagnosisIcdValidation(code);
        }

        const r = await db.query(
            `INSERT INTO coding (tenant_id, patient_id, encounter_ref, code_system, code, description, coder_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_ref || null, code_system, code, description || null, req.user?.id || null]
        );
        res.status(201).json({ ok: true, code_entry: r.rows[0], computed: { code_format: formatResult } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/los', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { admission_date, discharge_date, expected_los } = req.query;
        if (!admission_date) return res.status(400).json({ ok: false, error: 'admission_date_required' });
        const actual = losDays(admission_date, discharge_date || null);
        const variance = expected_los ? losVariance(actual, expected_los) : null;
        res.json({ ok: true, los_days: actual, expected_los: expected_los ? parseInt(expected_los) : null, variance_days: variance });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/dvt-risk', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { prophylaxis, status } = req.query;
        res.json({ ok: true, prophylaxis, status, risk: dvtProphylaxisRisk(prophylaxis, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const adm = await db.query(`SELECT admission_type, status, COUNT(*) AS count, AVG(expected_los) AS avg_los FROM admissions WHERE tenant_id = $1 AND admission_date >= NOW() - INTERVAL '90 days' GROUP BY admission_type, status ORDER BY count DESC`, [req.tenantId]);
        const rounds = await db.query(`SELECT COUNT(*) AS total_rounds, AVG(LENGTH(CONCAT(COALESCE(subjective,''),COALESCE(objective,''),COALESCE(assessment,''),COALESCE(plan,'')))) AS avg_doc_length FROM admission_daily_rounds WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const codes = await db.query(`SELECT code_system, COUNT(*) AS count FROM coding WHERE tenant_id = $1 GROUP BY code_system ORDER BY count DESC`, [req.tenantId]);
        const photos = await db.query(`SELECT body_region, is_confidential, COUNT(*) AS count FROM clinical_photos_meta WHERE tenant_id = $1 GROUP BY body_region, is_confidential`, [req.tenantId]);
        const templates = await db.query(`SELECT COUNT(*) AS total_templates, COUNT(*) FILTER (WHERE is_active = 1) AS active_templates FROM clinical_templates WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, admissions_90d: adm.rows, rounds_90d: rounds.rows[0], codes_breakdown: codes.rows, photos_breakdown: photos.rows, templates: templates.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
