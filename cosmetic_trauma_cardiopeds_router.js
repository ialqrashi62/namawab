'use strict';
// Wave 106 — Cosmetic surgery + Trauma + Interventional cardiology (PCI) + Pediatric subspecialties + Critical care unit visits
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PAYMENT = ['unpaid','partial','paid','refunded','disputed'];
const VALID_CASE_STATUS = ['scheduled','in_progress','completed','cancelled','postponed','on_hold'];
const VALID_CONSENT_STATUS = ['drafted','pending_signature','signed','revoked','superseded'];
const VALID_HEALING = ['excellent','good','fair','poor','complicated'];
const VALID_SWELLING = ['none','mild','moderate','severe'];
const VALID_TRAUMA_MECHANISM = ['mvc','fall','penetrating','blunt','burn','crush','assault','sports','industrial','other'];
const VALID_DISPOSITION = ['discharged','admitted_ward','admitted_icu','or','transferred','deceased','ama','observation'];
const VALID_ACCESS = ['radial','femoral','brachial','ulnar'];
const VALID_PCI_STATUS = ['scheduled','in_progress','successful','complicated','failed','aborted','completed'];
const VALID_CHD = ['VSD','ASD','TOF','TGA','HLHS','PDA','CoA','DORV','Truncus','PS','AS','PA','Ebstein','other'];
const VALID_MILESTONE = ['gross_motor','fine_motor','language','cognitive','social','adaptive','emotional','feeding','toileting'];
const VALID_MILESTONE_STATUS = ['not_yet','emerging','achieved','delayed','lost_skill'];
const VALID_DIALYSIS = ['peritoneal','hemodialysis','crrt','none','plasmapheresis'];
const VALID_PROTEINURIA = ['none','mild','moderate','severe','nephrotic'];
const VALID_SEIZURE = ['focal','generalized','absence','myoclonic','tonic_clonic','focal_to_bilateral','febrile','status','unknown'];
const VALID_ADMISSION = ['emergency','urgent','elective','transfer'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_CHOLE = ['cholera','low_risk','moderate_risk','high_risk'];
const VALID_FUNDUS = ['normal','abnormal','not_examined'];

function issSeverity(iss) {
    if (iss === undefined || iss === null) return null;
    if (iss === 0) return 'none';
    if (iss < 9) return 'minor';
    if (iss < 16) return 'moderate';
    if (iss < 25) return 'serious';
    if (iss < 50) return 'severe';
    return 'critical';
}

function gcsSeverity(gcs) {
    if (gcs === undefined || gcs === null) return null;
    if (gcs >= 13) return 'mild';
    if (gcs >= 9) return 'moderate';
    return 'severe';
}

function pelodMortality(pelod) {
    if (pelod === undefined || pelod === null) return null;
    if (pelod === 0) return 'low';
    if (pelod <= 10) return 'moderate';
    if (pelod <= 20) return 'high';
    if (pelod <= 30) return 'very_high';
    return 'critical';
}

function efSeverity(ef) {
    if (ef === undefined || ef === null) return null;
    if (ef >= 55) return 'normal';
    if (ef >= 45) return 'mildly_reduced';
    if (ef >= 35) return 'moderately_reduced';
    if (ef >= 25) return 'severely_reduced';
    return 'very_severe';
}

function zscoreInterpret(z) {
    if (z === undefined || z === null) return null;
    if (z < -3) return 'severely_low';
    if (z < -2) return 'moderately_low';
    if (z > 3) return 'severely_high';
    if (z > 2) return 'moderately_high';
    return 'normal';
}

function bmiForAge(weight, length, ageMonths) {
    if (!weight || !length || !ageMonths) return null;
    const heightM = parseFloat(length) / 100;
    return Math.round((parseFloat(weight) / (heightM * heightM)) * 10) / 10;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'cosmetic-trauma-cardiopeds',
        endpoints: [
            'GET /cosmetic/cases',
            'POST /cosmetic/cases',
            'GET /cosmetic/cases/:id/followups',
            'POST /cosmetic/cases/:id/followup',
            'POST /cosmetic/consents',
            'GET /trauma/assessments',
            'POST /trauma/assessments',
            'GET /trauma/surgery-assessments',
            'POST /trauma/surgery-assessments',
            'GET /pci/sessions',
            'POST /pci/sessions',
            'GET /pci/hemodynamics',
            'POST /pci/hemodynamics',
            'GET /peds/cardio',
            'POST /peds/cardio',
            'GET /peds/growth',
            'POST /peds/growth',
            'GET /peds/milestones',
            'POST /peds/milestones',
            'GET /peds/nephro',
            'POST /peds/nephro',
            'GET /peds/neuro',
            'POST /peds/neuro',
            'GET /ccu/visits',
            'POST /ccu/visits',
            'GET /cicu/visits',
            'POST /cicu/visits',
            'GET /picu/visits',
            'POST /picu/visits',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== COSMETIC CASES =====
router.get('/cosmetic/cases', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, status, payment_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_lookup FROM cosmetic_cases c LEFT JOIN patients p ON p.id = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND c.status = $${params.length + 1}`; params.push(status); }
        if (payment_status) { sql += ` AND c.payment_status = $${params.length + 1}`; params.push(payment_status); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/cases', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure_id, procedure_name, surgeon, assistant, anesthetist, surgery_date, surgery_time, duration_minutes, anesthesia_type, operating_room, pre_op_notes, operative_notes, post_op_notes, complications, total_cost, payment_status, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_name) return res.status(400).json({ ok: false, error: 'procedure_name_required' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (total_cost !== undefined && total_cost < 0) return res.status(400).json({ ok: false, error: 'invalid_cost' });
        if (payment_status && !VALID_PAYMENT.includes(payment_status)) return res.status(400).json({ ok: false, error: 'invalid_payment_status' });
        if (status && !VALID_CASE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO cosmetic_cases (tenant_id, patient_id, procedure_id, procedure_name, surgeon, assistant, anesthetist, surgery_date, surgery_time, duration_minutes, anesthesia_type, operating_room, pre_op_notes, operative_notes, post_op_notes, complications, total_cost, payment_status, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
            [req.tenantId, patient_id, procedure_id || null, procedure_name, surgeon || null, assistant || null, anesthetist || null,
             surgery_date || null, surgery_time || null, duration_minutes || null, anesthesia_type || null, operating_room || null,
             pre_op_notes || null, operative_notes || null, post_op_notes || null, complications || null,
             total_cost ?? null, payment_status || 'unpaid', status || 'scheduled']
        );
        res.status(201).json({ ok: true, case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cosmetic/cases/:id/followups', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM cosmetic_followups WHERE tenant_id = $1 AND case_id = $2 ORDER BY followup_date DESC`, [req.tenantId, req.params.id]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/cases/:id/followup', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (healing_status && !VALID_HEALING.includes(healing_status)) return res.status(400).json({ ok: false, error: 'invalid_healing' });
        if (swelling && !VALID_SWELLING.includes(swelling)) return res.status(400).json({ ok: false, error: 'invalid_swelling' });
        if (pain_level !== undefined && (pain_level < 0 || pain_level > 10)) return res.status(400).json({ ok: false, error: 'pain_out_of_range_0_10' });
        if (patient_satisfaction !== undefined && (patient_satisfaction < 1 || patient_satisfaction > 10)) return res.status(400).json({ ok: false, error: 'satisfaction_out_of_range_1_10' });

        const r = await db.query(
            `INSERT INTO cosmetic_followups (tenant_id, case_id, patient_id, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [req.tenantId, req.params.id, patient_id, followup_date || null, days_post_op ?? null, healing_status || null,
             pain_level ?? null, swelling || null, complications || null, patient_satisfaction ?? null,
             surgeon_notes || null, next_followup || null, surgeon || null, status || 'completed']
        );
        res.status(201).json({ ok: true, followup: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/consents', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { case_id, patient_id, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, consent_time, patient_signature, witness_signature, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_name) return res.status(400).json({ ok: false, error: 'procedure_name_required' });
        if (status && !VALID_CONSENT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (!witness_name) return res.status(400).json({ ok: false, error: 'witness_required' });

        const r = await db.query(
            `INSERT INTO cosmetic_consents (tenant_id, case_id, patient_id, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, consent_time, patient_signature, witness_signature, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
            [req.tenantId, case_id || null, patient_id, procedure_name, consent_type || null, surgeon || null,
             risks_explained || null, alternatives_explained || null, expected_results || null, limitations || null, patient_questions || null,
             is_photography_consent ? 1 : 0, is_anesthesia_consent ? 1 : 0, is_blood_transfusion_consent ? 1 : 0,
             witness_name, consent_date || null, consent_time || null, patient_signature || null, witness_signature || null,
             status || 'pending_signature']
        );
        res.status(201).json({ ok: true, consent: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRAUMA ASSESSMENTS (ISS + GCS) =====
router.get('/trauma/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, mechanism, disposition, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM trauma_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (mechanism) { sql += ` AND mechanism = $${params.length + 1}`; params.push(mechanism); }
        if (disposition) { sql += ` AND disposition = $${params.length + 1}`; params.push(disposition); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/trauma/assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, iss_score, gcs, mechanism, fast_findings, disposition, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (iss_score !== undefined && (iss_score < 0 || iss_score > 75)) return res.status(400).json({ ok: false, error: 'iss_out_of_range_0_75' });
        if (gcs !== undefined && (gcs < 3 || gcs > 15)) return res.status(400).json({ ok: false, error: 'gcs_out_of_range_3_15' });
        if (mechanism && !VALID_TRAUMA_MECHANISM.includes(mechanism)) return res.status(400).json({ ok: false, error: 'invalid_mechanism' });
        if (disposition && !VALID_DISPOSITION.includes(disposition)) return res.status(400).json({ ok: false, error: 'invalid_disposition' });

        const r = await db.query(
            `INSERT INTO trauma_assessments (tenant_id, patient_id, encounter_id, iss_score, gcs, mechanism, fast_findings, disposition, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             iss_score ?? null, gcs ?? null, mechanism || null, fast_findings || null, disposition || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { iss_severity: issSeverity(iss_score), gcs_severity: gcsSeverity(gcs) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/trauma/surgery-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM trauma_surgery_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/trauma/surgery-assessments', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO trauma_surgery_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PCI SESSIONS (Interventional cardiology) =====
router.get('/pci/sessions', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, access_site, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM pci_sessions s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (access_site) { sql += ` AND s.access_site = $${params.length + 1}`; params.push(access_site); }
        if (status) { sql += ` AND s.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pci/sessions', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, access_site, contrast_volume_ml, fluoroscopy_time_min, door_to_balloon_min, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (access_site && !VALID_ACCESS.includes(access_site)) return res.status(400).json({ ok: false, error: 'invalid_access_site' });
        if (status && !VALID_PCI_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (contrast_volume_ml !== undefined && contrast_volume_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_contrast' });
        if (fluoroscopy_time_min !== undefined && fluoroscopy_time_min < 0) return res.status(400).json({ ok: false, error: 'invalid_fluoro' });
        if (door_to_balloon_min !== undefined && door_to_balloon_min < 0) return res.status(400).json({ ok: false, error: 'invalid_d2b' });

        const r = await db.query(
            `INSERT INTO pci_sessions (tenant_id, patient_id, doctor_id, access_site, contrast_volume_ml, fluoroscopy_time_min, door_to_balloon_min, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : (req.user?.id ? String(req.user.id) : null),
             access_site || null, contrast_volume_ml ?? null, fluoroscopy_time_min ?? null, door_to_balloon_min ?? null, status || 'scheduled']
        );
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pci/hemodynamics', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { session_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pci_hemodynamics WHERE tenant_id = $1`;
        if (session_id) { sql += ` AND session_id = $${params.length + 1}`; params.push(String(session_id)); }
        sql += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pci/hemodynamics', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { session_id, systolic_bp, diastolic_bp, heart_rate, mean_ap, timestamp } = req.body;
        if (!session_id) return res.status(400).json({ ok: false, error: 'session_id_required' });
        if (systolic_bp !== undefined && (systolic_bp < 0 || systolic_bp > 300)) return res.status(400).json({ ok: false, error: 'invalid_sbp' });
        if (diastolic_bp !== undefined && (diastolic_bp < 0 || diastolic_bp > 200)) return res.status(400).json({ ok: false, error: 'invalid_dbp' });
        if (heart_rate !== undefined && (heart_rate < 0 || heart_rate > 250)) return res.status(400).json({ ok: false, error: 'invalid_hr' });

        const computedMap = mean_ap ?? (systolic_bp && diastolic_bp ? Math.round((2 * parseFloat(diastolic_bp) + parseFloat(systolic_bp)) / 3) : null);

        const r = await db.query(
            `INSERT INTO pci_hemodynamics (tenant_id, session_id, systolic_bp, diastolic_bp, heart_rate, mean_ap, timestamp)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(session_id), systolic_bp ?? null, diastolic_bp ?? null, heart_rate ?? null, computedMap, timestamp || new Date().toISOString()]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { mean_ap: computedMap } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PEDIATRIC SUBSPECIALTY LOGS =====
router.get('/peds/cardio', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, chd_diagnosis, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM peds_cardio_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (chd_diagnosis) { sql += ` AND chd_diagnosis = $${params.length + 1}`; params.push(chd_diagnosis); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/cardio', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, log_date, chd_diagnosis, aortic_zscore, pulmonary_zscore, ef_percent, echo_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (chd_diagnosis && !VALID_CHD.includes(chd_diagnosis)) return res.status(400).json({ ok: false, error: 'invalid_chd' });
        if (ef_percent !== undefined && (ef_percent < 0 || ef_percent > 100)) return res.status(400).json({ ok: false, error: 'ef_out_of_range_0_100' });

        const r = await db.query(
            `INSERT INTO peds_cardio_logs (tenant_id, patient_id, log_date, chd_diagnosis, aortic_zscore, pulmonary_zscore, ef_percent, echo_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             chd_diagnosis || null, aortic_zscore ?? null, pulmonary_zscore ?? null, ef_percent ?? null, echo_findings || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { ef_severity: efSeverity(ef_percent), aortic_z_interpret: zscoreInterpret(aortic_zscore), pulmonary_z_interpret: zscoreInterpret(pulmonary_zscore) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/growth', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM peds_growth_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/growth', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, log_date, weight_kg, length_cm, head_circ_cm, age_months, weight_zscore, length_zscore, head_zscore } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (weight_kg !== undefined && weight_kg <= 0) return res.status(400).json({ ok: false, error: 'invalid_weight' });

        const bmi = bmiForAge(weight_kg, length_cm, age_months);
        const r = await db.query(
            `INSERT INTO peds_growth_logs (tenant_id, patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_zscore, length_zscore, head_zscore)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             weight_kg ?? null, length_cm ?? null, head_circ_cm ?? null, bmi,
             weight_zscore ?? null, length_zscore ?? null, head_zscore ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { bmi, weight_z_interpret: zscoreInterpret(weight_zscore), length_z_interpret: zscoreInterpret(length_zscore) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/milestones', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, milestone_category, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM peds_milestone_tracking WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (milestone_category) { sql += ` AND milestone_category = $${params.length + 1}`; params.push(milestone_category); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/milestones', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, milestone_category, milestone_name, status, achievement_date, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!milestone_name) return res.status(400).json({ ok: false, error: 'milestone_name_required' });
        if (milestone_category && !VALID_MILESTONE.includes(milestone_category)) return res.status(400).json({ ok: false, error: 'invalid_category' });
        if (status && !VALID_MILESTONE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO peds_milestone_tracking (tenant_id, patient_id, milestone_category, milestone_name, status, achievement_date, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), milestone_category || null, milestone_name, status || 'emerging', achievement_date || null, notes || null]
        );
        res.status(201).json({ ok: true, milestone: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/nephro', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, dialysis_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM peds_nephro_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (dialysis_type) { sql += ` AND dialysis_type = $${params.length + 1}`; params.push(dialysis_type); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/nephro', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, log_date, gfr_calculated, proteinuria_grade, dialysis_type, dialysis_frequency_per_week } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (dialysis_type && !VALID_DIALYSIS.includes(dialysis_type)) return res.status(400).json({ ok: false, error: 'invalid_dialysis_type' });
        if (proteinuria_grade && !VALID_PROTEINURIA.includes(proteinuria_grade)) return res.status(400).json({ ok: false, error: 'invalid_proteinuria' });

        const r = await db.query(
            `INSERT INTO peds_nephro_logs (tenant_id, patient_id, log_date, gfr_calculated, proteinuria_grade, dialysis_type, dialysis_frequency_per_week)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             gfr_calculated ?? null, proteinuria_grade || null, dialysis_type || null, dialysis_frequency_per_week ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/peds/neuro', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, seizure_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM peds_neuro_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (seizure_type) { sql += ` AND seizure_type = $${params.length + 1}`; params.push(seizure_type); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/peds/neuro', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, log_date, seizure_type, seizure_frequency_per_day, bayley_iii_score, mri_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (seizure_type && !VALID_SEIZURE.includes(seizure_type)) return res.status(400).json({ ok: false, error: 'invalid_seizure_type' });
        if (seizure_frequency_per_day !== undefined && seizure_frequency_per_day < 0) return res.status(400).json({ ok: false, error: 'invalid_frequency' });

        const r = await db.query(
            `INSERT INTO peds_neuro_logs (tenant_id, patient_id, log_date, seizure_type, seizure_frequency_per_day, bayley_iii_score, mri_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             seizure_type || null, seizure_frequency_per_day ?? null, bayley_iii_score ?? null, mri_findings || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CRITICAL CARE UNIT VISITS =====
router.get('/ccu/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, admission_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM ccu_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (admission_type) { sql += ` AND v.admission_type = $${params.length + 1}`; params.push(admission_type); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ccu/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, admission_type, left_ventricle_ef, inotropic_support, iabp, mortality_risk, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (admission_type && !VALID_ADMISSION.includes(admission_type)) return res.status(400).json({ ok: false, error: 'invalid_admission_type' });
        if (left_ventricle_ef !== undefined && (left_ventricle_ef < 0 || left_ventricle_ef > 100)) return res.status(400).json({ ok: false, error: 'ef_out_of_range_0_100' });
        if (mortality_risk !== undefined && (mortality_risk < 0 || mortality_risk > 100)) return res.status(400).json({ ok: false, error: 'mortality_out_of_range_0_100' });

        const r = await db.query(
            `INSERT INTO ccu_visits (tenant_id, patient_id, encounter_id, admission_type, left_ventricle_ef, inotropic_support, iabp, mortality_risk, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             admission_type || null, left_ventricle_ef ?? null, !!inotropic_support, !!iabp, mortality_risk ?? null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], computed: { ef_severity: efSeverity(left_ventricle_ef) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cicu/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, surgical_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM cicu_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (surgical_status) { sql += ` AND v.surgical_status = $${params.length + 1}`; params.push(surgical_status); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cicu/visits', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, cardiac_diagnosis, surgical_status, echo_ef, vasoactive_drips, mech_circ_support, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (echo_ef !== undefined && (echo_ef < 0 || echo_ef > 100)) return res.status(400).json({ ok: false, error: 'ef_out_of_range_0_100' });

        const r = await db.query(
            `INSERT INTO cicu_visits (tenant_id, patient_id, encounter_id, cardiac_diagnosis, surgical_status, echo_ef, vasoactive_drips, mech_circ_support, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             cardiac_diagnosis || null, surgical_status || null, echo_ef ?? null, vasoactive_drips || null, !!mech_circ_support,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], computed: { ef_severity: efSeverity(echo_ef) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/picu/visits', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, primary_diagnosis, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_name FROM picu_visits v LEFT JOIN patients p ON p.id::text = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (primary_diagnosis) { sql += ` AND v.primary_diagnosis = $${params.length + 1}`; params.push(primary_diagnosis); }
        sql += ` ORDER BY v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/picu/visits', requireAuth, requireTenantScope, requireRole('pediatrician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, pelod_score, primary_diagnosis, mech_vent, vasoactive, picu_los_days, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (pelod_score !== undefined && (pelod_score < 0 || pelod_score > 71)) return res.status(400).json({ ok: false, error: 'pelod_out_of_range_0_71' });
        if (picu_los_days !== undefined && picu_los_days < 0) return res.status(400).json({ ok: false, error: 'invalid_los' });

        const r = await db.query(
            `INSERT INTO picu_visits (tenant_id, patient_id, encounter_id, pelod_score, primary_diagnosis, mech_vent, vasoactive, picu_los_days, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             pelod_score ?? null, primary_diagnosis || null, !!mech_vent, !!vasoactive, picu_los_days ?? null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], computed: { pelod_mortality: pelodMortality(pelod_score) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const cosmetic = await db.query(`SELECT status, payment_status, COUNT(*) AS count, AVG(total_cost) AS avg_cost FROM cosmetic_cases WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY status, payment_status`, [req.tenantId]);
        const trauma = await db.query(`SELECT mechanism, disposition, COUNT(*) AS count FROM trauma_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY mechanism, disposition ORDER BY count DESC`, [req.tenantId]);
        const pci = await db.query(`SELECT access_site, status, COUNT(*) AS count, AVG(door_to_balloon_min) AS avg_d2b FROM pci_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY access_site, status`, [req.tenantId]);
        const pedsGrowth = await db.query(`SELECT COUNT(*) AS total_assessments, AVG(weight_zscore) AS avg_wt_z FROM peds_growth_logs WHERE tenant_id = $1 AND log_date >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        const ccu = await db.query(`SELECT admission_type, AVG(left_ventricle_ef) AS avg_ef, AVG(mortality_risk) AS avg_mortality FROM ccu_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY admission_type`, [req.tenantId]);
        const picu = await db.query(`SELECT AVG(pelod_score) AS avg_pelod, AVG(picu_los_days) AS avg_los, COUNT(*) AS total_visits FROM picu_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        res.json({ ok: true, cosmetic_90d: cosmetic.rows, trauma_90d: trauma.rows, pci_90d: pci.rows, peds_growth_90d: pedsGrowth.rows[0], ccu_90d: ccu.rows, picu_90d: picu.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
