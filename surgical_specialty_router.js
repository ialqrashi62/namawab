'use strict';
// Wave 128 — Surgical suite + Cosmetic + Ortho + Neuro + Vascular/Thoracic + Transplant + Oncology + Urology + Memory/Movement + MS
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_SURGERY_STATUS = ['scheduled','arrived','in_progress','completed','cancelled','postponed','on_hold'];
const VALID_PRIORITY = ['elective','urgent','emergent','stat'];
const VALID_ASA = ['I','II','III','IV','V','VI','E'];
const VALID_JOINT = ['hip','knee','shoulder','elbow','ankle','wrist'];
const VALID_SIDE = ['left','right','bilateral','NA'];
const VALID_MOVEMENT = ['flexion','extension','abduction','adduction','rotation','circumduction'];
const VALID_ASIA = ['A','B','C','D','E'];
const VALID_SPINE_LEVEL = ['C1-C7','T1-T12','L1-L5','S1-S5','cervical','thoracic','lumbar','sacral','lumbosacral'];
const VALID_GLEASON = ['6','7','3+4','4+3','8','9','10'];
const VALID_TUMOR_GRADE = ['G1','G2','G3','G4','Gleason_6','Gleason_7','Gleason_8','Gleason_9','Gleason_10'];
const VALID_TREATMENT_RESP = ['CR','PR','SD','PD','NE'];
const VALID_STONE_LOC = ['renal_calyx','renal_pelvis','upper_ureter','mid_ureter','lower_ureter','bladder','urethra'];
const VALID_STONE_COMP = ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','unknown'];
const VALID_REDUCTION_TYPE = ['closed','open','minimally_invasive','percutaneous','endoscopic'];
const VALID_REDUCTION_STATUS = ['anatomic','acceptable','malreduced','failed','pending'];
const VALID_FIXATION = ['plating','nailing','external_fixator','K_wires','IM_nail','screws','tension_band','none','cast','brace'];
const VALID_REGIMEN_STATUS = ['planned','active','paused','completed','discontinued','delayed'];
const VALID_PROBLEM_TYPE = ['diagnosis','symptom','finding','complaint','risk_factor','chronic_condition'];
const VALID_PROBLEM_SEVERITY = ['mild','moderate','severe','critical','life_threatening'];
const VALID_PROBLEM_STATUS = ['active','inactive','resolved','chronic','recurrence','remission'];
const VALID_HEALING = ['excellent','good','fair','poor','delayed','complicated'];
const VALID_DBS = ['none','planned','post_op','ineffective','effective','complications'];
const VALID_MS_DMT = ['interferon_beta','glatiramer','dimethyl_fumarate','fingolimod','natalizumab','ocrelizumab','alemtuzumab','cladribine','none'];
const VALID_MM_STAGE = ['no_impairment','very_mild','mild','moderate','moderately_severe','severe','very_severe'];
const VALID_COSMETIC_CONSENT = ['signed','pending','declined','revoked','expired'];

function asaRisk(asaClass) {
    if (!asaClass) return null;
    const map = { 'I': 'healthy', 'II': 'mild_systemic', 'III': 'severe_systemic', 'IV': 'severe_constant_threat', 'V': 'moribund', 'VI': 'brain_dead' };
    return map[asaClass] || null;
}

function romRestriction(degrees, normalMax) {
    const d = parseFloat(degrees);
    const n = parseFloat(normalMax);
    if (isNaN(d) || isNaN(n) || n <= 0) return null;
    const pct = (d / n) * 100;
    if (pct >= 90) return 'normal';
    if (pct >= 70) return 'mild_restriction';
    if (pct >= 50) return 'moderate_restriction';
    return 'severe_restriction';
}

function gleasonRisk(g) {
    if (!g) return null;
    if (g === '6' || g === '3+4') return 'low_risk';
    if (g === '4+3' || g === '7') return 'intermediate_risk';
    if (g === '8') return 'high_risk';
    if (g === '9' || g === '10') return 'very_high_risk';
    return null;
}

function psaRisk(psa) {
    const v = parseFloat(psa);
    if (isNaN(v)) return null;
    if (v < 4) return 'normal';
    if (v < 10) return 'gray_zone';
    if (v < 20) return 'elevated';
    return 'highly_elevated';
}

function asiaComplete(level) {
    if (!level) return null;
    return level === 'A';
}

function surgeryDuration(scheduledStart, scheduledEnd) {
    if (!scheduledStart || !scheduledEnd) return null;
    const s = new Date(scheduledStart);
    const e = new Date(scheduledEnd);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return Math.round((e - s) / 60000);
}

function preopCompleteness(assessment) {
    if (!assessment) return 0;
    const required = ['npo_confirmed','allergies_reviewed','medications_reviewed','labs_reviewed','imaging_reviewed','blood_type_confirmed','consent_signed','anesthesia_clearance','nursing_assessment'];
    const completed = required.filter(k => assessment[k] === 1 || assessment[k] === true).length;
    return Math.round((completed / required.length) * 100);
}

function whoChecklistStatus(who) {
    if (!who) return null;
    return {
        sign_in: who.sign_in_completed === 1,
        time_out: who.time_out_completed === 1,
        sign_out: who.sign_out_completed === 1,
        complete: who.sign_in_completed === 1 && who.time_out_completed === 1 && who.sign_out_completed === 1
    };
}

function cdrDementiaStage(cdr) {
    const c = parseFloat(cdr);
    if (isNaN(c)) return null;
    if (c === 0) return 'normal';
    if (c === 0.5) return 'very_mild';
    if (c === 1) return 'mild';
    if (c === 2) return 'moderate';
    return 'severe';
}

function edssSeverity(score) {
    const s = parseFloat(score);
    if (isNaN(s)) return null;
    if (s < 1.5) return 'minimal';
    if (s < 4) return 'mild';
    if (s < 6) return 'moderate';
    if (s < 7) return 'severe_walk';
    return 'severe_restricted';
}

function das28Severity(das28) {
    const d = parseFloat(das28);
    if (isNaN(d)) return null;
    if (d < 2.6) return 'remission';
    if (d < 3.2) return 'low_activity';
    if (d < 5.1) return 'moderate_activity';
    return 'high_activity';
}

function mmseInterpretation(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s >= 24) return 'normal';
    if (s >= 19) return 'mild_impairment';
    if (s >= 11) return 'moderate_impairment';
    return 'severe_impairment';
}

function mocaInterpretation(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s >= 26) return 'normal';
    if (s >= 18) return 'mild_impairment';
    return 'moderate_impairment';
}

function preopReadiness(assessment) {
    const completion = preopCompleteness(assessment);
    if (completion === 100) return 'fully_ready';
    if (completion >= 80) return 'mostly_ready';
    if (completion >= 50) return 'partially_ready';
    return 'not_ready';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'surgical-specialty',
        endpoints: [
            'GET/POST /surgeries',
            'GET/POST /operative-notes',
            'GET/POST /preop/assessments',
            'GET/POST /preop/tests',
            'GET/POST /who-checklist',
            'GET/POST /count-sheets',
            'GET/POST /anesthesia-records',
            'GET/POST /or-slots',
            'GET/POST /or-consumption',
            'GET/POST /surgical-checklists',
            'GET/POST /cosmetic/procedures',
            'GET/POST /cosmetic/cases',
            'GET/POST /cosmetic/consents',
            'GET/POST /cosmetic/photos',
            'GET/POST /cosmetic/followups',
            'GET/POST /ortho/implants',
            'GET/POST /joint-replacements',
            'GET/POST /joint-assessments',
            'GET/POST /joint-rom',
            'GET/POST /fracture-management',
            'GET/POST /ortho-surgery',
            'GET/POST /spine-stability',
            'GET/POST /neuro-surgery',
            'GET/POST /vascular-surgery',
            'GET/POST /thoracic-surgery',
            'GET/POST /transplant',
            'GET/POST /oncology/regimens',
            'GET/POST /gyn-oncology',
            'GET/POST /urology/assessments',
            'GET/POST /urology/oncology',
            'GET/POST /urology/stones',
            'GET/POST /urology-surgery',
            'GET/POST /ep-ablation',
            'GET/POST /problems',
            'GET/POST /patient-problem-list',
            'GET/POST /ms-relapses',
            'GET/POST /movement/clinical',
            'GET/POST /movement/assessments',
            'GET/POST /memory-clinic',
            'GET /asa-risk',
            'GET /rom-restriction',
            'GET /gleason-risk',
            'GET /psa-risk',
            'GET /asia-complete',
            'GET /surgery-duration',
            'GET /preop-completeness',
            'GET /who-checklist-status',
            'GET /cdr-stage',
            'GET /edss-severity',
            'GET /das28-severity',
            'GET /mmse-interpretation',
            'GET /moca-interpretation',
            'GET /preop-readiness',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SURGERIES =====
router.get('/surgeries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, status, priority, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgeries WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (surgeon_id) { sql += ` AND surgeon_id = $${params.length + 1}`; params.push(parseInt(surgeon_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY scheduled_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surgeries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_name) return res.status(400).json({ ok: false, error: 'procedure_name_required' });
        if (priority && !VALID_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority', valid: VALID_PRIORITY });
        if (status && !VALID_SURGERY_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_SURGERY_STATUS });
        const r = await db.query(
            `INSERT INTO surgeries (patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [parseInt(patient_id), patient_name || null, surgeon_id || null, surgeon_name || null,
             anesthetist_id || null, anesthetist_name || null, procedure_name, procedure_name_ar || null,
             surgery_type || null, operating_room || null, priority || 'elective',
             scheduled_date || null, scheduled_time || null, estimated_duration || 60,
             status || 'scheduled', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OPERATIVE NOTES =====
router.get('/operative-notes', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM operative_notes WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/operative-notes', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen, surgeon_signature } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ ok: false, error: 'surgery_id_and_patient_id_required' });
        const r = await db.query(
            `INSERT INTO operative_notes (tenant_id, surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen, surgeon_signature)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(surgery_id), parseInt(patient_id), procedure_description || null,
             findings || null, complications || null, blood_loss_final || 0, counts_verified || null,
             specimen || null, surgeon_signature || null]
        );
        res.status(201).json({ ok: true, op_note: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PREOP ASSESSMENTS =====
router.get('/preop/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, overall_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_preop_assessments WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (overall_status) { sql += ` AND overall_status = $${params.length + 1}`; params.push(overall_status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, completion_pct: preopCompleteness(a), readiness: preopReadiness(a) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/preop/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ ok: false, error: 'surgery_id_and_patient_id_required' });
        const r = await db.query(
            `INSERT INTO surgery_preop_assessments (surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,
            [parseInt(surgery_id), parseInt(patient_id), npo_confirmed?1:0, allergies_reviewed?1:0,
             allergies_notes || null, medications_reviewed?1:0, medications_notes || null,
             labs_reviewed?1:0, labs_notes || null, imaging_reviewed?1:0, imaging_notes || null,
             blood_type_confirmed?1:0, blood_reserved?1:0, consent_signed?1:0, anesthesia_clearance?1:0,
             nursing_assessment?1:0, nursing_notes || null, cardiac_clearance?1:0, cardiac_notes || null,
             pulmonary_clearance?1:0, infection_screening?1:0, dvt_prophylaxis?1:0,
             overall_status || 'in_progress', req.tenantId]
        );
        res.status(201).json({ ok: true, preop: r.rows[0], completion_pct: preopCompleteness(r.rows[0]), readiness: preopReadiness(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PREOP TESTS =====
router.get('/preop/tests', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, is_completed, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_preop_tests WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_completed !== undefined) { sql += ` AND is_completed = $${params.length + 1}`; params.push(parseInt(is_completed)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/preop/tests', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, test_type, test_name, is_required, is_completed, result_summary, order_id, notes } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ ok: false, error: 'surgery_id_and_patient_id_required' });
        const r = await db.query(
            `INSERT INTO surgery_preop_tests (surgery_id, patient_id, test_type, test_name, is_required, is_completed, result_summary, order_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(surgery_id), parseInt(patient_id), test_type || null, test_name || null,
             is_required === undefined ? 1 : (is_required ? 1 : 0),
             is_completed ? 1 : 0, result_summary || null, order_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, preop_test: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WHO CHECKLIST =====
router.get('/who-checklist', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, state, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM who_surgical_checklist WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (state) { sql += ` AND state = $${params.length + 1}`; params.push(state); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(w => ({ ...w, status: whoChecklistStatus(w) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/who-checklist', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, sign_in_completed, sign_in_completed_by, time_out_completed, time_out_completed_by, sign_out_completed, sign_out_completed_by, state } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ ok: false, error: 'surgery_id_and_patient_id_required' });
        const r = await db.query(
            `INSERT INTO who_surgical_checklist (tenant_id, surgery_id, patient_id, sign_in_completed, sign_in_completed_by, time_out_completed, time_out_completed_by, sign_out_completed, sign_out_completed_by, state)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(surgery_id), parseInt(patient_id),
             sign_in_completed ? 1 : 0, sign_in_completed_by || null,
             time_out_completed ? 1 : 0, time_out_completed_by || null,
             sign_out_completed ? 1 : 0, sign_out_completed_by || null,
             state || 'in_progress']
        );
        res.status(201).json({ ok: true, who: r.rows[0], status: whoChecklistStatus(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGERY COUNT SHEETS =====
router.get('/count-sheets', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, counts_match, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_count_sheets WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (counts_match !== undefined) { sql += ` AND counts_match = $${params.length + 1}`; params.push(counts_match === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/count-sheets', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, counts_match, witness1_name, witness2_name, notes } = req.body;
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });
        const r = await db.query(
            `INSERT INTO surgery_count_sheets (surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, counts_match, witness1_name, witness2_name, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [parseInt(surgery_id), sponge_count_initial || 0, sponge_count_final || 0,
             needle_count_initial || 0, needle_count_final || 0,
             instrument_count_initial || 0, instrument_count_final || 0,
             counts_match !== false, witness1_name || null, witness2_name || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, count_sheet: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ANESTHESIA RECORDS =====
router.get('/anesthesia-records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, asa_class, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_anesthesia_records WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (asa_class) { sql += ` AND asa_class = $${params.length + 1}`; params.push(asa_class); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, asa_risk: asaRisk(a.asa_class) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/anesthesia-records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ ok: false, error: 'surgery_id_and_patient_id_required' });
        if (asa_class && !VALID_ASA.includes(asa_class)) return res.status(400).json({ ok: false, error: 'invalid_asa', valid: VALID_ASA });
        const r = await db.query(
            `INSERT INTO surgery_anesthesia_records (surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
            [parseInt(surgery_id), parseInt(patient_id), anesthetist_name || null, asa_class || null,
             anesthesia_type || null, airway_assessment || null, mallampati_score || null,
             premedication || null, induction_agents || null, maintenance_agents || null,
             muscle_relaxants || null, monitors_used || null, iv_access || null,
             fluid_given || null, blood_loss_ml || 0, complications || null,
             recovery_notes || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, anesthesia: r.rows[0], asa_risk: asaRisk(asa_class) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OR SLOTS =====
router.get('/or-slots', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { room_id, surgeon_id, slot_date, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM or_slots WHERE tenant_id = $1`;
        if (room_id) { sql += ` AND room_id = $${params.length + 1}`; params.push(parseInt(room_id)); }
        if (surgeon_id) { sql += ` AND surgeon_id = $${params.length + 1}`; params.push(parseInt(surgeon_id)); }
        if (slot_date) { sql += ` AND slot_date = $${params.length + 1}`; params.push(slot_date); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY slot_date DESC, slot_start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/or-slots', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes, status } = req.body;
        if (!slot_date) return res.status(400).json({ ok: false, error: 'slot_date_required' });
        const r = await db.query(
            `INSERT INTO or_slots (tenant_id, surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, surgery_id || null, room_id || null, surgeon_id || null,
             slot_date, slot_start_time || null, slot_end_time || null, duration_minutes || 60,
             status || 'available']
        );
        res.status(201).json({ ok: true, or_slot: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OR CONSUMPTION =====
router.get('/or-consumption', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { surgery_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM or_consumption WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(parseInt(surgery_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/or-consumption', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { surgery_id, item_id, qty_used, batch_id } = req.body;
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });
        const r = await db.query(
            `INSERT INTO or_consumption (tenant_id, surgery_id, item_id, qty_used, batch_id)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, parseInt(surgery_id), item_id || null, qty_used || 1, batch_id || null]
        );
        res.status(201).json({ ok: true, consumption: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGICAL CHECKLISTS =====
router.get('/surgical-checklists', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgical_checklists WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (doctor_id) { sql += ` AND doctor_id = $${params.length + 1}`; params.push(parseInt(doctor_id)); }
        sql += ` ORDER BY surgery_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surgical-checklists', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, surgery_date, procedure_name, sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO surgical_checklists (patient_id, doctor_id, surgery_date, procedure_name, sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, surgery_date || null,
             procedure_name || null, sign_in_confirmed ? true : false, time_out_confirmed ? true : false,
             sign_out_confirmed ? true : false, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, checklist: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COSMETIC: PROCEDURES =====
router.get('/cosmetic/procedures', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { category, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cosmetic_procedures WHERE 1=1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/procedures', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { name_en, name_ar, category, description, estimated_duration, anesthesia_type, average_cost, risks, recovery_days, is_active } = req.body;
        if (!name_en) return res.status(400).json({ ok: false, error: 'name_en_required' });
        const r = await db.query(
            `INSERT INTO cosmetic_procedures (name_en, name_ar, category, description, estimated_duration, anesthesia_type, average_cost, risks, recovery_days, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [name_en, name_ar || null, category || null, description || null,
             estimated_duration || null, anesthesia_type || null, parseFloat(average_cost || 0),
             risks || null, recovery_days || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, procedure: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COSMETIC: CASES =====
router.get('/cosmetic/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cosmetic_cases WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, procedure_id, procedure_name, surgeon, assistant, anesthetist, surgery_date, surgery_time, duration_minutes, anesthesia_type, operating_room, pre_op_notes, operative_notes, post_op_notes, complications, total_cost, payment_status, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cosmetic_cases (patient_id, patient_name, procedure_id, procedure_name, surgeon, assistant, anesthetist, surgery_date, surgery_time, duration_minutes, anesthesia_type, operating_room, pre_op_notes, operative_notes, post_op_notes, complications, total_cost, payment_status, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
            [parseInt(patient_id), patient_name || null, procedure_id || null, procedure_name || null,
             surgeon || null, assistant || null, anesthetist || null, surgery_date || null,
             surgery_time || null, duration_minutes || 0, anesthesia_type || null, operating_room || null,
             pre_op_notes || null, operative_notes || null, post_op_notes || null, complications || null,
             parseFloat(total_cost || 0), payment_status || 'pending', status || 'scheduled', req.tenantId]
        );
        res.status(201).json({ ok: true, case_row: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COSMETIC: CONSENTS =====
router.get('/cosmetic/consents', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cosmetic_consents WHERE tenant_id = $1`;
        if (case_id) { sql += ` AND case_id = $${params.length + 1}`; params.push(parseInt(case_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/consents', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_COSMETIC_CONSENT.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_COSMETIC_CONSENT });
        const r = await db.query(
            `INSERT INTO cosmetic_consents (case_id, patient_id, patient_name, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [case_id || null, parseInt(patient_id), patient_name || null, procedure_name || null,
             consent_type || null, surgeon || null, risks_explained || null, alternatives_explained || null,
             expected_results || null, limitations || null, patient_questions || null,
             is_photography_consent ? 1 : 0, is_anesthesia_consent ? 1 : 0, is_blood_transfusion_consent ? 1 : 0,
             witness_name || null, consent_date || null, status || 'pending', req.tenantId]
        );
        res.status(201).json({ ok: true, consent: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COSMETIC: PHOTOS =====
router.get('/cosmetic/photos', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, photo_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cosmetic_photos WHERE tenant_id = $1`;
        if (case_id) { sql += ` AND case_id = $${params.length + 1}`; params.push(parseInt(case_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (photo_type) { sql += ` AND photo_type = $${params.length + 1}`; params.push(photo_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/photos', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, photo_type, photo_angle, photo_date, photo_path, notes, taken_by } = req.body;
        if (!patient_id || !photo_path) return res.status(400).json({ ok: false, error: 'patient_id_and_photo_path_required' });
        const r = await db.query(
            `INSERT INTO cosmetic_photos (case_id, patient_id, photo_type, photo_angle, photo_date, photo_path, notes, taken_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [case_id || null, parseInt(patient_id), photo_type || null, photo_angle || null,
             photo_date || null, photo_path, notes || null, taken_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, photo: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COSMETIC: FOLLOWUPS =====
router.get('/cosmetic/followups', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, healing_status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cosmetic_followups WHERE tenant_id = $1`;
        if (case_id) { sql += ` AND case_id = $${params.length + 1}`; params.push(parseInt(case_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (healing_status) { sql += ` AND healing_status = $${params.length + 1}`; params.push(healing_status); }
        sql += ` ORDER BY followup_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cosmetic/followups', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (healing_status && !VALID_HEALING.includes(healing_status)) return res.status(400).json({ ok: false, error: 'invalid_healing', valid: VALID_HEALING });
        const r = await db.query(
            `INSERT INTO cosmetic_followups (case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [case_id || null, parseInt(patient_id), patient_name || null, followup_date || null,
             days_post_op || null, healing_status || null, pain_level || null, swelling || null,
             complications || null, patient_satisfaction || null, surgeon_notes || null,
             next_followup || null, surgeon || null, status || 'active', req.tenantId]
        );
        res.status(201).json({ ok: true, followup: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO: IMPLANTS =====
router.get('/ortho/implants', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, implant_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM orthopedic_implants WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (implant_type) { sql += ` AND implant_type = $${params.length + 1}`; params.push(implant_type); }
        sql += ` ORDER BY implant_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ortho/implants', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, implant_date, implant_type, manufacturer, model_name, serial_number, size_dimension, batch_lot_number, clinical_notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO orthopedic_implants (patient_id, doctor_id, implant_date, implant_type, manufacturer, model_name, serial_number, size_dimension, batch_lot_number, clinical_notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, implant_date || null,
             implant_type || null, manufacturer || null, model_name || null, serial_number || null,
             size_dimension || null, batch_lot_number || null, clinical_notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, implant: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO: JOINT REPLACEMENTS =====
router.get('/joint-replacements', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, joint_replaced, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM joint_replacement_registry WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (joint_replaced) { sql += ` AND joint_replaced = $${params.length + 1}`; params.push(joint_replaced); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/joint-replacements', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (joint_replaced && !VALID_JOINT.includes(joint_replaced)) return res.status(400).json({ ok: false, error: 'invalid_joint', valid: VALID_JOINT });
        const r = await db.query(
            `INSERT INTO joint_replacement_registry (tenant_id, patient_id, procedure_id, joint_replaced, implant_brand, implant_model, implant_serial_number, implant_size, alignment_angle, stability_grade)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             joint_replaced || null, implant_brand || null, implant_model || null,
             implant_serial_number || null, implant_size || null,
             alignment_angle !== undefined ? alignment_angle : null, stability_grade || null]
        );
        res.status(201).json({ ok: true, replacement: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO: JOINT ASSESSMENTS (DAS28) =====
router.get('/joint-assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM joint_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, das28_severity: das28Severity(a.das28_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/joint-assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO joint_assessments (patient_id, doctor_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, assessment_date || null,
             tender_joint_count || 0, swollen_joint_count || 0, vas_pain || 0,
             das28_score !== undefined ? das28_score : null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, joint_assessment: r.rows[0], das28_severity: das28Severity(das28_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO: JOINT ROM =====
router.get('/joint-rom', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, joint_name, lateral_side, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM joint_rom_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (joint_name) { sql += ` AND joint_name = $${params.length + 1}`; params.push(joint_name); }
        if (lateral_side) { sql += ` AND lateral_side = $${params.length + 1}`; params.push(lateral_side); }
        sql += ` ORDER BY assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/joint-rom', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (movement_type && !VALID_MOVEMENT.includes(movement_type)) return res.status(400).json({ ok: false, error: 'invalid_movement', valid: VALID_MOVEMENT });
        if (lateral_side && !VALID_SIDE.includes(lateral_side)) return res.status(400).json({ ok: false, error: 'invalid_side', valid: VALID_SIDE });
        const r = await db.query(
            `INSERT INTO joint_rom_assessments (patient_id, doctor_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, assessment_date || null,
             joint_name || null, lateral_side || null, movement_type || null,
             angle_degrees || 0, is_restricted ? true : false, req.tenantId]
        );
        res.status(201).json({ ok: true, rom: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO: FRACTURE MANAGEMENT =====
router.get('/fracture-management', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, fracture_site, reduction_status, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM fracture_management_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (fracture_site) { sql += ` AND fracture_site = $${params.length + 1}`; params.push(fracture_site); }
        if (reduction_status) { sql += ` AND reduction_status = $${params.length + 1}`; params.push(reduction_status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/fracture-management', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, fracture_site, ao_ota_classification, reduction_type, reduction_status, fixation_method } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (reduction_type && !VALID_REDUCTION_TYPE.includes(reduction_type)) return res.status(400).json({ ok: false, error: 'invalid_reduction_type', valid: VALID_REDUCTION_TYPE });
        if (reduction_status && !VALID_REDUCTION_STATUS.includes(reduction_status)) return res.status(400).json({ ok: false, error: 'invalid_reduction_status', valid: VALID_REDUCTION_STATUS });
        if (fixation_method && !VALID_FIXATION.includes(fixation_method)) return res.status(400).json({ ok: false, error: 'invalid_fixation', valid: VALID_FIXATION });
        const r = await db.query(
            `INSERT INTO fracture_management_logs (tenant_id, patient_id, fracture_site, ao_ota_classification, reduction_type, reduction_status, fixation_method)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), fracture_site || null, ao_ota_classification || null,
             reduction_type || null, reduction_status || null, fixation_method || null]
        );
        res.status(201).json({ ok: true, fracture: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ORTHO SURGICAL LOGS =====
router.get('/ortho-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM ortho_surgical_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ortho-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, intraop_findings, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO ortho_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, intraop_findings, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : null,
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             duration_minutes || null, blood_loss_ml || null, intraop_findings || null, complications || null]
        );
        res.status(201).json({ ok: true, surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SPINE STABILITY =====
router.get('/spine-stability', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, asia_impairment_grade, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM spine_stability_metrics WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (asia_impairment_grade) { sql += ` AND asia_impairment_grade = $${params.length + 1}`; params.push(asia_impairment_grade); }
        sql += ` ORDER BY assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({ ...s, complete_injury: asiaComplete(s.asia_impairment_grade) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/spine-stability', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, assessment_date, spinal_level, asia_impairment_grade, motor_score, sensory_score, stability_grade, fusion_recommended, surgeon_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (asia_impairment_grade && !VALID_ASIA.includes(asia_impairment_grade)) return res.status(400).json({ ok: false, error: 'invalid_asia', valid: VALID_ASIA });
        if (spinal_level && !VALID_SPINE_LEVEL.includes(spinal_level)) return res.status(400).json({ ok: false, error: 'invalid_level', valid: VALID_SPINE_LEVEL });
        const r = await db.query(
            `INSERT INTO spine_stability_metrics (tenant_id, patient_id, assessment_date, spinal_level, asia_impairment_grade, motor_score, sensory_score, stability_grade, fusion_recommended, surgeon_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), assessment_date || new Date().toISOString(),
             spinal_level || null, asia_impairment_grade || null, motor_score || null,
             sensory_score || null, stability_grade || null, fusion_recommended ? true : false,
             surgeon_id ? String(surgeon_id) : null]
        );
        res.status(201).json({ ok: true, spine: r.rows[0], complete_injury: asiaComplete(asia_impairment_grade) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NEURO SURGICAL LOGS =====
router.get('/neuro-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_type, side, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM neuro_surgical_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        if (side) { sql += ` AND side = $${params.length + 1}`; params.push(side); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/neuro-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, side, duration_minutes, blood_loss_ml, intraop_findings, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO neuro_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, side, duration_minutes, blood_loss_ml, intraop_findings, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : null,
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             side || null, duration_minutes || null, blood_loss_ml || null,
             intraop_findings || null, complications || null]
        );
        res.status(201).json({ ok: true, neuro_surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VASCULAR SURGERY ASSESSMENTS =====
router.get('/vascular-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM vascular_surgery_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/vascular-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO vascular_surgery_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, vascular: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== THORACIC SURGERY ASSESSMENTS =====
router.get('/thoracic-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM thoracic_surgery_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/thoracic-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO thoracic_surgery_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, thoracic: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRANSPLANT ASSESSMENTS =====
router.get('/transplant', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM transplant_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transplant', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO transplant_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, transplant: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ONCOLOGY: REGIMENS =====
router.get('/oncology/regimens', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM oncology_patient_regimens WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY start_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/oncology/regimens', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, regimen_name, cycle_number, status, start_date } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_REGIMEN_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_REGIMEN_STATUS });
        const r = await db.query(
            `INSERT INTO oncology_patient_regimens (patient_id, regimen_name, cycle_number, status, start_date, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), regimen_name || null, cycle_number || 1,
             status || 'active', start_date || null, req.tenantId]
        );
        res.status(201).json({ ok: true, regimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GYN ONCOLOGY =====
router.get('/gyn-oncology', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, diagnosis, stage, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM gyn_oncology_registry WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (diagnosis) { sql += ` AND diagnosis = $${params.length + 1}`; params.push(diagnosis); }
        if (stage) { sql += ` AND stage = $${params.length + 1}`; params.push(stage); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gyn-oncology', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, diagnosis, stage, grade, treatment_plan, surgery_type } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO gyn_oncology_registry (tenant_id, patient_id, diagnosis, stage, grade, treatment_plan, surgery_type)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), diagnosis || null, stage || null,
             grade || null, treatment_plan || null, surgery_type || null]
        );
        res.status(201).json({ ok: true, registry: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY: ASSESSMENTS =====
router.get('/urology/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM urology_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO urology_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, urology: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY: ONCOLOGY METRICS (PSA/Gleason) =====
router.get('/urology/oncology', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, gleason_score, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM urology_oncology_metrics WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (gleason_score) { sql += ` AND gleason_score = $${params.length + 1}`; params.push(gleason_score); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(u => ({ ...u, psa_risk: psaRisk(u.psa_level), gleason_risk: gleasonRisk(u.gleason_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/oncology', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, psa_level, gleason_score, tumor_grade, treatment_response } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (gleason_score && !VALID_GLEASON.includes(gleason_score)) return res.status(400).json({ ok: false, error: 'invalid_gleason', valid: VALID_GLEASON });
        if (tumor_grade && !VALID_TUMOR_GRADE.includes(tumor_grade)) return res.status(400).json({ ok: false, error: 'invalid_tumor_grade', valid: VALID_TUMOR_GRADE });
        if (treatment_response && !VALID_TREATMENT_RESP.includes(treatment_response)) return res.status(400).json({ ok: false, error: 'invalid_treatment_response', valid: VALID_TREATMENT_RESP });
        const r = await db.query(
            `INSERT INTO urology_oncology_metrics (tenant_id, patient_id, log_time, psa_level, gleason_score, tumor_grade, treatment_response)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             psa_level !== undefined ? psa_level : null, gleason_score || null, tumor_grade || null, treatment_response || null]
        );
        res.status(201).json({ ok: true, metric: r.rows[0], psa_risk: psaRisk(psa_level), gleason_risk: gleasonRisk(gleason_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY: STONES =====
router.get('/urology/stones', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, stone_location, stone_composition, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM urology_stone_registry WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (stone_location) { sql += ` AND stone_location = $${params.length + 1}`; params.push(stone_location); }
        if (stone_composition) { sql += ` AND stone_composition = $${params.length + 1}`; params.push(stone_composition); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology/stones', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, stone_location, stone_size_mm, stone_composition, fragmentation_success } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (stone_location && !VALID_STONE_LOC.includes(stone_location)) return res.status(400).json({ ok: false, error: 'invalid_location', valid: VALID_STONE_LOC });
        if (stone_composition && !VALID_STONE_COMP.includes(stone_composition)) return res.status(400).json({ ok: false, error: 'invalid_composition', valid: VALID_STONE_COMP });
        const r = await db.query(
            `INSERT INTO urology_stone_registry (tenant_id, patient_id, procedure_id, stone_location, stone_size_mm, stone_composition, fragmentation_success)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             stone_location || null, stone_size_mm !== undefined ? stone_size_mm : null,
             stone_composition || null, fragmentation_success ? true : false]
        );
        res.status(201).json({ ok: true, stone: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UROLOGY SURGICAL LOGS =====
router.get('/urology-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM urology_surgical_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/urology-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO urology_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : null,
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             duration_minutes || null, blood_loss_ml || null, complications || null]
        );
        res.status(201).json({ ok: true, surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== EP ABLATION =====
router.get('/ep-ablation', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { site_name, success_indicator, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM ep_ablation_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (site_name) { sql += ` AND site_name = $${params.length + 1}`; params.push(site_name); }
        if (success_indicator !== undefined) { sql += ` AND success_indicator = $${params.length + 1}`; params.push(success_indicator === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ep-ablation', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { procedure_id, site_name, energy_joules, duration_sec, modality, success_indicator } = req.body;
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        const r = await db.query(
            `INSERT INTO ep_ablation_logs (procedure_id, tenant_id, site_name, energy_joules, duration_sec, modality, success_indicator)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(procedure_id), String(req.tenantId), site_name || null,
             energy_joules !== undefined ? energy_joules : null, duration_sec !== undefined ? duration_sec : null,
             modality || null, success_indicator ? true : false]
        );
        res.status(201).json({ ok: true, ep_ablation: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PROBLEMS (legacy) =====
router.get('/problems', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM problems WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/problems', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_ref, icd10, snomed, description, status, onset_date } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO problems (tenant_id, patient_id, encounter_ref, icd10, snomed, description, status, onset_date, recorded_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_ref || null, icd10 || null, snomed || null,
             description || null, status || 'active', onset_date || null,
             req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATIENT PROBLEM LIST =====
router.get('/patient-problem-list', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, problem_type, is_active, principal_diagnosis, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_problem_list WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (problem_type) { sql += ` AND problem_type = $${params.length + 1}`; params.push(problem_type); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        if (principal_diagnosis !== undefined) { sql += ` AND principal_diagnosis = $${params.length + 1}`; params.push(principal_diagnosis === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/patient-problem-list', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity, status, is_active, principal_diagnosis, added_by, encounter_id, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (problem_type && !VALID_PROBLEM_TYPE.includes(problem_type)) return res.status(400).json({ ok: false, error: 'invalid_problem_type', valid: VALID_PROBLEM_TYPE });
        if (severity && !VALID_PROBLEM_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_PROBLEM_SEVERITY });
        if (status && !VALID_PROBLEM_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_PROBLEM_STATUS });
        const r = await db.query(
            `INSERT INTO patient_problem_list (patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity, status, is_active, principal_diagnosis, added_by, encounter_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [parseInt(patient_id), admission_id || null, icd10_code || null, icd10_description || null,
             snomed_code || null, problem_name || null, problem_type || 'diagnosis', onset_date || null,
             severity || null, status || 'active', is_active !== false, principal_diagnosis ? true : false,
             added_by || req.user?.username || null, encounter_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MS RELAPSES =====
router.get('/ms-relapses', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM ms_relapses WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY relapse_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(m => ({ ...m, edss_severity: edssSeverity(m.edss_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ms-relapses', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, edss_score, relapse_date, lesion_count, mri_findings, dmt } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (dmt && !VALID_MS_DMT.includes(dmt)) return res.status(400).json({ ok: false, error: 'invalid_dmt', valid: VALID_MS_DMT });
        const r = await db.query(
            `INSERT INTO ms_relapses (tenant_id, patient_id, encounter_id, edss_score, relapse_date, lesion_count, mri_findings, dmt)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             edss_score !== undefined ? edss_score : null, relapse_date || null,
             lesion_count || null, mri_findings || null, dmt || null]
        );
        res.status(201).json({ ok: true, relapse: r.rows[0], edss_severity: edssSeverity(edss_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MOVEMENT DISORDERS CLINICAL =====
router.get('/movement/clinical', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, disorder_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM movement_disorders_clinical WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (disorder_type) { sql += ` AND disorder_type = $${params.length + 1}`; params.push(disorder_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/movement/clinical', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, disorder_type, onset_age, family_history, dbs_status, meds } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (dbs_status && !VALID_DBS.includes(dbs_status)) return res.status(400).json({ ok: false, error: 'invalid_dbs', valid: VALID_DBS });
        const r = await db.query(
            `INSERT INTO movement_disorders_clinical (tenant_id, patient_id, encounter_id, disorder_type, onset_age, family_history, dbs_status, meds)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             disorder_type || null, onset_age || null, family_history || null,
             dbs_status || null, meds || null]
        );
        res.status(201).json({ ok: true, clinical: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MOVEMENT ASSESSMENTS (UPDRS) =====
router.get('/movement/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM movement_assessments WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/movement/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, updrs_score, tremor, rigidity, bradykinesia, gait, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO movement_assessments (tenant_id, patient_id, encounter_id, updrs_score, tremor, rigidity, bradykinesia, gait, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             updrs_score || null, tremor || null, rigidity || null, bradykinesia || null, gait || null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEMORY CLINIC ASSESSMENTS (MMSE/MoCA/CDR) =====
router.get('/memory-clinic', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, cdr_stage, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM memory_clinic_assessments WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (cdr_stage !== undefined) { sql += ` AND cdr_stage = $${params.length + 1}`; params.push(parseInt(cdr_stage)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(m => ({
            ...m,
            mmse_interpretation: mmseInterpretation(m.mmse_score),
            moca_interpretation: mocaInterpretation(m.moca_score),
            cdr_dementia_stage: cdrDementiaStage(m.cdr_stage)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/memory-clinic', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, mmse_score, moca_score, cdr_stage, behavioural_changes, caregiver, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO memory_clinic_assessments (tenant_id, patient_id, encounter_id, mmse_score, moca_score, cdr_stage, behavioural_changes, caregiver, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             mmse_score !== undefined ? mmse_score : null, moca_score !== undefined ? moca_score : null,
             cdr_stage !== undefined ? cdr_stage : null, behavioural_changes || null, caregiver || null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, memory: r.rows[0],
            mmse_interpretation: mmseInterpretation(mmse_score), moca_interpretation: mocaInterpretation(moca_score),
            cdr_dementia_stage: cdrDementiaStage(cdr_stage) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/asa-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { asa_class } = req.query;
        res.json({ ok: true, risk: asaRisk(asa_class) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/rom-restriction', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { degrees, normal_max } = req.query;
        if (degrees === undefined || normal_max === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, restriction: romRestriction(degrees, normal_max) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gleason-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { gleason } = req.query;
        res.json({ ok: true, risk: gleasonRisk(gleason) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/psa-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { psa } = req.query;
        if (psa === undefined) return res.status(400).json({ ok: false, error: 'psa_required' });
        res.json({ ok: true, risk: psaRisk(psa) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/asia-complete', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { level } = req.query;
        res.json({ ok: true, complete: asiaComplete(level) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/surgery-duration', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { scheduled_start, scheduled_end } = req.query;
        res.json({ ok: true, minutes: surgeryDuration(scheduled_start, scheduled_end) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/preop-completeness', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { assessment } = req.query;
        if (!assessment) return res.status(400).json({ ok: false, error: 'assessment_required' });
        let parsed = assessment;
        if (typeof assessment === 'string') {
            try { parsed = JSON.parse(assessment); } catch (e) {}
        }
        res.json({ ok: true, completeness_pct: preopCompleteness(parsed), readiness: preopReadiness(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/who-checklist-status', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { who } = req.query;
        if (!who) return res.status(400).json({ ok: false, error: 'who_required' });
        let parsed = who;
        if (typeof who === 'string') {
            try { parsed = JSON.parse(who); } catch (e) {}
        }
        res.json({ ok: true, status: whoChecklistStatus(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cdr-stage', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { cdr } = req.query;
        if (cdr === undefined) return res.status(400).json({ ok: false, error: 'cdr_required' });
        res.json({ ok: true, dementia_stage: cdrDementiaStage(cdr) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/edss-severity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { edss } = req.query;
        if (edss === undefined) return res.status(400).json({ ok: false, error: 'edss_required' });
        res.json({ ok: true, severity: edssSeverity(edss) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/das28-severity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { das28 } = req.query;
        if (das28 === undefined) return res.status(400).json({ ok: false, error: 'das28_required' });
        res.json({ ok: true, severity: das28Severity(das28) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mmse-interpretation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, interpretation: mmseInterpretation(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/moca-interpretation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, interpretation: mocaInterpretation(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/preop-readiness', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { assessment } = req.query;
        if (!assessment) return res.status(400).json({ ok: false, error: 'assessment_required' });
        let parsed = assessment;
        if (typeof assessment === 'string') {
            try { parsed = JSON.parse(assessment); } catch (e) {}
        }
        res.json({ ok: true, readiness: preopReadiness(parsed), completeness_pct: preopCompleteness(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const surg = await db.query(`SELECT status, priority, COUNT(*) AS count FROM surgeries WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY status, priority`, [req.tenantId]);
        const preop = await db.query(`SELECT overall_status, COUNT(*) AS count FROM surgery_preop_assessments WHERE tenant_id = $1 GROUP BY overall_status`, [req.tenantId]);
        const who = await db.query(`SELECT state, COUNT(*) AS count FROM who_surgical_checklist WHERE tenant_id = $1 GROUP BY state`, [req.tenantId]);
        const cs = await db.query(`SELECT status, COUNT(*) AS count FROM cosmetic_cases WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const ortho = await db.query(`SELECT COUNT(*) AS count FROM orthopedic_implants WHERE tenant_id = $1`, [req.tenantId]);
        const probs = await db.query(`SELECT status, COUNT(*) AS count FROM patient_problem_list WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const onc = await db.query(`SELECT status, COUNT(*) AS count FROM oncology_patient_regimens WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        res.json({
            ok: true,
            surgeries_30d: surg.rows,
            preop_status: preop.rows,
            who_checklist: who.rows,
            cosmetic_cases: cs.rows,
            orthopedic_implants: parseInt(ortho.rows[0].count),
            problem_list: probs.rows,
            oncology_regimens: onc.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
