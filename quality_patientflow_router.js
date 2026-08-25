'use strict';
// Wave 108 — Quality/CAPA/Risk register + Patient feedback + ROI + Visit lifecycle + Drug education
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_SEVERITY = ['near_miss','minor','moderate','major','severe','sentinel','catastrophic'];
const VALID_HARM = ['no_harm','minor_harm','moderate_harm','severe_harm','death'];
const VALID_INCIDENT_TYPE = ['medication_error','patient_fall','surgical_complication','HAI','transfusion_reaction','wrong_site','retained_instrument','equipment_malfunction','pressure_injury','behavioral','documentation','other'];
const VALID_INCIDENT_STATUS = ['reported','under_review','investigation','action_plan','closed','reopened'];
const VALID_CAPA_TYPE = ['corrective','preventive','both'];
const VALID_CAPA_STATUS = ['open','in_progress','completed','verified','closed','cancelled'];
const VALID_RISK_LEVEL = ['very_low','low','moderate','high','extreme'];
const VALID_KPI_STATUS = ['on_target','at_risk','off_target','achieved','deprecated'];
const VALID_KPI_CATEGORY = ['clinical','safety','operational','financial','patient_experience','workforce','regulatory'];
const VALID_FEEDBACK_TYPE = ['compliment','complaint','suggestion','concern','complaint_resolved','complaint_escalated'];
const VALID_TRIAGE = [1,2,3,4,5];
const VALID_WAIT_STATUS = ['checked_in','triage_called','in_consult','waiting_lab','waiting_imaging','waiting_pharmacy','completed','left_without_being_seen','cancelled'];
const VALID_ROI_STATUS = ['drafted','pending_approval','approved','denied','released','expired','revoked'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_WORKFLOW_STATE = ['draft','submitted','in_review','action_plan','monitoring','closed'];

function riskScore(likelihood, impact) {
    if (likelihood === undefined || impact === undefined) return null;
    return parseInt(likelihood) * parseInt(impact);
}

function riskLevelFromScore(score) {
    if (score === null) return null;
    if (score <= 4) return 'very_low';
    if (score <= 9) return 'low';
    if (score <= 14) return 'moderate';
    if (score <= 19) return 'high';
    return 'extreme';
}

function kpiVariance(actual, target) {
    if (actual === undefined || target === undefined) return null;
    if (target === 0) return null;
    return Math.round(((parseFloat(actual) - parseFloat(target)) / parseFloat(target)) * 1000) / 10;
}

function triageWait(min) {
    if (min === undefined || min === null) return null;
    if (min < 15) return 'within_target';
    if (min < 30) return 'acceptable';
    if (min < 60) return 'delayed';
    return 'critically_delayed';
}

function painSeverity(pain) {
    if (pain === undefined || pain === null) return null;
    if (pain === 0) return 'no_pain';
    if (pain <= 3) return 'mild';
    if (pain <= 6) return 'moderate';
    if (pain <= 8) return 'severe';
    return 'worst';
}

function slaRemaining(due, status) {
    if (!due) return null;
    if (status === 'closed' || status === 'completed') return 'closed';
    const days = Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'overdue_' + Math.abs(days) + 'd';
    if (days < 7) return 'urgent_' + days + 'd';
    return 'on_track_' + days + 'd';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'quality-patientflow',
        endpoints: [
            'GET /quality/incidents',
            'POST /quality/incidents',
            'GET /quality/capa',
            'POST /quality/capa',
            'GET /quality/kpis',
            'POST /quality/kpis',
            'GET /quality/risk-register',
            'POST /quality/risk-register',
            'GET /patient-feedback',
            'POST /patient-feedback',
            'POST /drug-education',
            'GET /drug-education',
            'GET /roi-requests',
            'POST /roi-requests',
            'GET /visit-lifecycle',
            'POST /visit-lifecycle',
            'GET /waiting-queue',
            'POST /waiting-queue',
            'GET /risk-score',
            'GET /kpi-variance',
            'GET /triage-wait',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== QUALITY INCIDENTS =====
router.get('/quality/incidents', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { severity, status, incident_type, near_miss, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_incidents WHERE tenant_id = $1`;
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (incident_type) { sql += ` AND incident_type = $${params.length + 1}`; params.push(incident_type); }
        if (near_miss !== undefined) { sql += ` AND near_miss = $${params.length + 1}`; params.push(near_miss === 'true' ? 1 : 0); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/incidents', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by, assigned_to, root_cause, corrective_action, preventive_action, status, closed_date, harm_level, near_miss, confidential, encounter_id, visit_id, workflow_state } = req.body;
        if (!incident_type) return res.status(400).json({ ok: false, error: 'incident_type_required' });
        if (!VALID_INCIDENT_TYPE.includes(incident_type)) return res.status(400).json({ ok: false, error: 'invalid_incident_type' });
        if (severity && !VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });
        if (harm_level && !VALID_HARM.includes(harm_level)) return res.status(400).json({ ok: false, error: 'invalid_harm_level' });
        if (status && !VALID_INCIDENT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (workflow_state && !VALID_WORKFLOW_STATE.includes(workflow_state)) return res.status(400).json({ ok: false, error: 'invalid_workflow_state' });
        if (!description) return res.status(400).json({ ok: false, error: 'description_required' });

        const r = await db.query(
            `INSERT INTO quality_incidents (tenant_id, incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by, assigned_to, root_cause, corrective_action, preventive_action, status, closed_date, harm_level, near_miss, confidential, encounter_id, visit_id, workflow_state)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,
            [req.tenantId, incident_type, severity || null, incident_date || null, incident_time || null,
             department || null, location || null, patient_id || null, patient_name || null, description,
             immediate_action || null, reported_by || null, assigned_to || null, root_cause || null,
             corrective_action || null, preventive_action || null, status || 'reported', closed_date || null,
             harm_level || null, near_miss ? 1 : 0, confidential ? 1 : 0,
             encounter_id || null, visit_id || null, workflow_state || 'submitted']
        );
        res.status(201).json({ ok: true, incident: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY CAPA (Corrective & Preventive Action) =====
router.get('/quality/capa', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { status, capa_type, incident_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT *, (due_date - CURRENT_DATE) AS days_until_due FROM quality_capa WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (capa_type) { sql += ` AND capa_type = $${params.length + 1}`; params.push(capa_type); }
        if (incident_id) { sql += ` AND incident_id = $${params.length + 1}`; params.push(incident_id); }
        sql += ` ORDER BY due_date ASC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/capa', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { incident_id, capa_type, title, description, root_cause, owner_user_id, owner_name, due_date, status, completion_notes, completion_date, verified_by, created_by } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (!capa_type || !VALID_CAPA_TYPE.includes(capa_type)) return res.status(400).json({ ok: false, error: 'invalid_capa_type' });
        if (status && !VALID_CAPA_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (due_date && completion_date && new Date(completion_date) < new Date(due_date)) {
            // OK actually, completion can be after due (overdue)
        }

        const r = await db.query(
            `INSERT INTO quality_capa (tenant_id, incident_id, capa_type, title, description, root_cause, owner_user_id, owner_name, due_date, status, completion_notes, completion_date, verified_by, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [req.tenantId, incident_id || null, capa_type, title, description || null, root_cause || null,
             owner_user_id || null, owner_name || null, due_date || null, status || 'open',
             completion_notes || null, completion_date || null, verified_by || null, created_by || null]
        );
        res.status(201).json({ ok: true, capa: r.rows[0], computed: { sla_status: slaRemaining(due_date, status) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY KPIs =====
router.get('/quality/kpis', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { category, status, department, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_kpis WHERE tenant_id = $1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY kpi_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/kpis', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes } = req.body;
        if (!kpi_name) return res.status(400).json({ ok: false, error: 'kpi_name_required' });
        if (category && !VALID_KPI_CATEGORY.includes(category)) return res.status(400).json({ ok: false, error: 'invalid_category' });
        if (status && !VALID_KPI_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO quality_kpis (tenant_id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, kpi_name, kpi_name_ar || null, category || null, target_value ?? null, actual_value ?? null,
             unit || null, period || null, department || null, status || 'on_target', notes || null]
        );
        res.status(201).json({ ok: true, kpi: r.rows[0], computed: { variance_pct: kpiVariance(actual_value, target_value) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY RISK REGISTER =====
router.get('/quality/risk-register', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { risk_level, status, category, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_risk_register WHERE tenant_id = $1`;
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        sql += ` ORDER BY risk_score DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/risk-register', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { incident_id, risk_title, category, likelihood, impact, control_measure, residual_likelihood, residual_impact, owner_name, review_date, status, created_by } = req.body;
        if (!risk_title) return res.status(400).json({ ok: false, error: 'risk_title_required' });
        if (likelihood === undefined || (likelihood < 1 || likelihood > 5)) return res.status(400).json({ ok: false, error: 'likelihood_out_of_range_1_5' });
        if (impact === undefined || (impact < 1 || impact > 5)) return res.status(400).json({ ok: false, error: 'impact_out_of_range_1_5' });

        const rscore = riskScore(likelihood, impact);
        const rlevel = riskLevelFromScore(rscore);
        const resScore = riskScore(residual_likelihood, residual_impact);
        const resLevel = riskLevelFromScore(resScore);

        const r = await db.query(
            `INSERT INTO quality_risk_register (tenant_id, incident_id, risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, residual_likelihood, residual_impact, residual_score, owner_name, review_date, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [req.tenantId, incident_id || null, risk_title, category || null, likelihood, impact, rscore, rlevel,
             control_measure || null, residual_likelihood ?? null, residual_impact ?? null, resScore,
             owner_name || null, review_date || null, status || 'active', created_by || null]
        );
        res.status(201).json({
            ok: true, risk: r.rows[0],
            computed: { inherent_risk_level: rlevel, residual_risk_level: resLevel, inherent_score: rscore, residual_score: resScore }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATIENT FEEDBACK =====
router.get('/patient-feedback', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, department, feedback_type, is_resolved, rating_min, rating_max, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_feedback WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (feedback_type) { sql += ` AND feedback_type = $${params.length + 1}`; params.push(feedback_type); }
        if (is_resolved !== undefined) { sql += ` AND is_resolved = $${params.length + 1}`; params.push(is_resolved === 'true'); }
        if (rating_min) { sql += ` AND rating >= $${params.length + 1}`; params.push(parseInt(rating_min)); }
        if (rating_max) { sql += ` AND rating <= $${params.length + 1}`; params.push(parseInt(rating_max)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/patient-feedback', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!feedback_type || !VALID_FEEDBACK_TYPE.includes(feedback_type)) return res.status(400).json({ ok: false, error: 'invalid_feedback_type' });
        if (rating === undefined || (rating < 1 || rating > 5)) return res.status(400).json({ ok: false, error: 'rating_out_of_range_1_5' });

        const r = await db.query(
            `INSERT INTO patient_feedback (tenant_id, patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar, is_resolved)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, department || null, feedback_type, rating, comment || null, comment_ar || null]
        );
        res.status(201).json({ ok: true, feedback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/patient-feedback/:id/resolve', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { resolution_notes } = req.body;
        const r = await db.query(
            `UPDATE patient_feedback SET is_resolved = true, resolved_by = $1, resolved_at = NOW(), resolution_notes = $2 WHERE tenant_id = $3 AND id = $4 RETURNING *`,
            [req.user?.id || null, resolution_notes || null, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'feedback_not_found' });
        res.json({ ok: true, feedback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATIENT DRUG EDUCATION =====
router.get('/drug-education', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, medication, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_drug_education WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (medication) { sql += ` AND medication ILIKE $${params.length + 1}`; params.push(`%${medication}%`); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/drug-education', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, medication, instructions, side_effects, precautions, educated_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!medication) return res.status(400).json({ ok: false, error: 'medication_required' });

        const r = await db.query(
            `INSERT INTO patient_drug_education (tenant_id, patient_id, patient_name, medication, instructions, side_effects, precautions, educated_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, medication, instructions || null, side_effects || null, precautions || null, educated_by || null]
        );
        res.status(201).json({ ok: true, education: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ROI REQUESTS (Release of Information / PHI access) =====
router.get('/roi-requests', requireAuth, requireTenantScope, requireRole('medical_records'), async (req, res) => {
    try {
        const { patient_id, status, purpose, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM roi_requests WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (purpose) { sql += ` AND purpose ILIKE $${params.length + 1}`; params.push(`%${purpose}%`); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/roi-requests', requireAuth, requireTenantScope, requireRole('medical_records'), async (req, res) => {
    try {
        const { patient_id, requester, purpose, status, requested_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!requester) return res.status(400).json({ ok: false, error: 'requester_required' });
        if (!purpose) return res.status(400).json({ ok: false, error: 'purpose_required' });
        if (status && !VALID_ROI_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO roi_requests (tenant_id, patient_id, requester, purpose, status, requested_by)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, patient_id, requester, purpose, status || 'drafted', requested_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/roi-requests/:id/approve', requireAuth, requireTenantScope, requireRole('medical_records'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE roi_requests SET status = 'approved', approved_by = $1, released_at = NOW() WHERE tenant_id = $2 AND id = $3 AND status = 'pending_approval' RETURNING *`,
            [req.user?.id || null, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'roi_not_pending' });
        res.json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VISIT LIFECYCLE (patient flow: arrival→triage→consult) =====
router.get('/visit-lifecycle', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, status, stage, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM visit_lifecycle WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (stage) { sql += ` AND stage = $${params.length + 1}`; params.push(stage); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visit-lifecycle', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, appointment_id, doctor, department, status, stage, triage_level, pain_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (triage_level !== undefined && !VALID_TRIAGE.includes(parseInt(triage_level))) return res.status(400).json({ ok: false, error: 'invalid_triage_level_1_5' });
        if (pain_score !== undefined && (pain_score < 0 || pain_score > 10)) return res.status(400).json({ ok: false, error: 'pain_out_of_range_0_10' });

        const r = await db.query(
            `INSERT INTO visit_lifecycle (tenant_id, patient_id, patient_name, appointment_id, doctor, department, status, stage, triage_level, pain_score)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, appointment_id || null, doctor || null, department || null,
             status || 'arrived', stage || 'arrival', triage_level ?? null, pain_score ?? null]
        );
        res.status(201).json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WAITING QUEUE =====
router.get('/waiting-queue', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { department, status, triage_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT *, (CURRENT_TIMESTAMP - check_in_time) AS waiting_minutes FROM waiting_queue WHERE tenant_id = $1`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (triage_level) { sql += ` AND triage_level = $${params.length + 1}`; params.push(parseInt(triage_level)); }
        sql += ` ORDER BY triage_level ASC, check_in_time ASC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/waiting-queue', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor, department, status, triage_level, acuity_notes, exam_room_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (triage_level !== undefined && !VALID_TRIAGE.includes(parseInt(triage_level))) return res.status(400).json({ ok: false, error: 'invalid_triage_level' });
        if (status && !VALID_WAIT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO waiting_queue (tenant_id, patient_id, patient_name, doctor, department, status, triage_level, acuity_notes, exam_room_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, doctor || null, department || null,
             status || 'checked_in', triage_level ?? null, acuity_notes || null, exam_room_id || null]
        );
        res.status(201).json({ ok: true, queue: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/risk-score', requireAuth, requireTenantScope, requireRole('quality_officer'), async (req, res) => {
    try {
        const { likelihood, impact } = req.query;
        if (likelihood === undefined || impact === undefined) return res.status(400).json({ ok: false, error: 'likelihood_and_impact_required' });
        const l = parseInt(likelihood), i = parseInt(impact);
        if (l < 1 || l > 5 || i < 1 || i > 5) return res.status(400).json({ ok: false, error: 'both_must_be_1_to_5' });
        const score = riskScore(l, i);
        res.json({ ok: true, score, risk_level: riskLevelFromScore(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/kpi-variance', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { actual, target } = req.query;
        if (actual === undefined || target === undefined) return res.status(400).json({ ok: false, error: 'actual_and_target_required' });
        res.json({ ok: true, actual: parseFloat(actual), target: parseFloat(target), variance_pct: kpiVariance(actual, target) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/triage-wait', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { minutes } = req.query;
        if (minutes === undefined) return res.status(400).json({ ok: false, error: 'minutes_required' });
        res.json({ ok: true, minutes: parseInt(minutes), classification: triageWait(minutes) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const incidents = await db.query(`SELECT severity, harm_level, status, COUNT(*) AS count FROM quality_incidents WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY severity, harm_level, status ORDER BY count DESC`, [req.tenantId]);
        const capa = await db.query(`SELECT status, capa_type, COUNT(*) AS count FROM quality_capa WHERE tenant_id = $1 GROUP BY status, capa_type`, [req.tenantId]);
        const risk = await db.query(`SELECT risk_level, COUNT(*) AS count FROM quality_risk_register WHERE tenant_id = $1 GROUP BY risk_level`, [req.tenantId]);
        const feedback = await db.query(`SELECT feedback_type, AVG(rating) AS avg_rating, COUNT(*) AS count FROM patient_feedback WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY feedback_type`, [req.tenantId]);
        const queue = await db.query(`SELECT status, COUNT(*) AS count, AVG(CURRENT_TIMESTAMP - check_in_time) AS avg_wait_minutes FROM waiting_queue WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const roi = await db.query(`SELECT status, COUNT(*) AS count FROM roi_requests WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        res.json({ ok: true, incidents_90d: incidents.rows, capa_breakdown: capa.rows, risk_levels: risk.rows, feedback_90d: feedback.rows, waiting_queue: queue.rows, roi_breakdown: roi.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
