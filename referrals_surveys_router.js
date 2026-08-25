'use strict';
// Wave 120 — Patient referrals + Patient feedback + Surveys + Survey responses (care coordination + experience)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_URGENCY = ['routine','urgent','emergent','stat','elective','expedited'];
const VALID_REFERRAL_STATUS = ['pending','accepted','declined','scheduled','completed','cancelled','expired','redirected','in_consultation','awaiting_response'];
const VALID_FEEDBACK_TYPE = ['compliment','complaint','suggestion','concern','complaint_resolved','complaint_escalated','experience','facility','staff','cleanliness','food','wait_time','billing','other'];
const VALID_SURVEY_TYPE = ['nps','csat','ces','experience','feedback','post_visit','pre_visit','specialty_specific','staff_specific','facility','general'];
const VALID_SURVEY_STATUS = ['active','expired','scheduled','paused','archived','draft','under_review'];
const VALID_NPS = ['detractor','passive','promoter'];
const VALID_RISK = ['low','moderate','high','critical'];

function referralWaitDays(createdAt, status) {
    if (!createdAt || status === 'completed' || status === 'cancelled' || status === 'declined') return null;
    return Math.round((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
}

function referralWaitSeverity(days, urgency) {
    if (days === null) return null;
    const limits = { stat: 1, emergent: 2, urgent: 7, expedited: 14, elective: 30, routine: 30 };
    const limit = limits[urgency || 'routine'] || 30;
    const ratio = days / limit;
    if (ratio > 2) return 'critical_overdue';
    if (ratio > 1) return 'overdue';
    if (ratio > 0.5) return 'approaching_due';
    return 'within_target';
}

function referralFlow(status) {
    const order = ['pending', 'accepted', 'scheduled', 'in_consultation', 'completed'];
    if (status === 'declined' || status === 'cancelled') return 'closed';
    if (status === 'redirected') return 'redirected';
    const idx = order.indexOf(status);
    return { step: idx + 1, total: order.length, percent: Math.round(((idx + 1) / order.length) * 100) };
}

function npsCategory(score) {
    if (score === undefined || score === null) return null;
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
}

function csatCategory(score) {
    if (score === undefined || score === null) return null;
    if (score >= 4) return 'satisfied';
    if (score === 3) return 'neutral';
    return 'dissatisfied';
}

function surveyValidation(questionsJson) {
    if (!questionsJson) return 'missing_questions';
    try {
        const parsed = JSON.parse(questionsJson);
        if (!Array.isArray(parsed)) return 'invalid_format_not_array';
        return parsed.length > 0 ? 'valid' : 'empty_array';
    } catch (e) {
        return 'invalid_json';
    }
}

function patientSatisfactionScore(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) return null;
    const sum = ratings.reduce((acc, r) => acc + parseInt(r || 0), 0);
    const avg = sum / ratings.length;
    return Math.round(avg * 10) / 10;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'referrals-surveys',
        endpoints: [
            'GET /referrals',
            'POST /referrals',
            'POST /referrals/:id/accept',
            'POST /referrals/:id/complete',
            'GET /referrals/overdue',
            'GET /feedback',
            'POST /feedback',
            'POST /feedback/:id/resolve',
            'GET /surveys',
            'POST /surveys',
            'GET /surveys/active',
            'POST /survey-responses',
            'GET /survey-responses',
            'GET /referral-wait',
            'GET /nps-category',
            'GET /csat-category',
            'GET /survey-validate',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== PATIENT REFERRALS =====
router.get('/referrals', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, urgency, status, to_department, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_lookup FROM patient_referrals r LEFT JOIN patients p ON p.id = r.patient_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (urgency) { sql += ` AND r.urgency = $${params.length + 1}`; params.push(urgency); }
        if (status) { sql += ` AND r.status = $${params.length + 1}`; params.push(status); }
        if (to_department) { sql += ` AND r.to_department = $${params.length + 1}`; params.push(to_department); }
        sql += ` ORDER BY CASE WHEN r.urgency = 'stat' THEN 0 WHEN r.urgency = 'emergent' THEN 1 WHEN r.urgency = 'urgent' THEN 2 ELSE 3 END, r.created_at ASC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/referrals', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, patient_name, from_doctor_id, from_doctor, to_department, to_doctor, reason, urgency, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!to_department && !to_doctor) return res.status(400).json({ ok: false, error: 'to_department_or_to_doctor_required' });
        if (!reason) return res.status(400).json({ ok: false, error: 'reason_required' });
        if (urgency && !VALID_URGENCY.includes(urgency)) return res.status(400).json({ ok: false, error: 'invalid_urgency' });
        if (status && !VALID_REFERRAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO patient_referrals (tenant_id, patient_id, patient_name, from_doctor_id, from_doctor, to_department, to_doctor, reason, urgency, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, parseInt(patient_id), patient_name || null,
             from_doctor_id || req.user?.id || null, from_doctor || null,
             to_department || null, to_doctor || null,
             reason, urgency || 'routine', status || 'pending', notes || null]
        );
        res.status(201).json({
            ok: true, referral: r.rows[0],
            computed: {
                wait_days: referralWaitDays(r.rows[0].created_at, r.rows[0].status),
                wait_severity: referralWaitSeverity(0, urgency || 'routine'),
                flow: referralFlow(status || 'pending')
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/referrals/:id/accept', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE patient_referrals SET status = 'accepted' WHERE tenant_id = $1 AND id = $2 AND status = 'pending' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'referral_not_pending' });
        res.json({ ok: true, referral: r.rows[0], computed: { flow: referralFlow('accepted') } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/referrals/:id/complete', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE patient_referrals SET status = 'completed' WHERE tenant_id = $1 AND id = $2 AND status NOT IN ('completed','cancelled','declined') RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'referral_not_completable' });
        res.json({ ok: true, referral: r.rows[0], computed: { flow: referralFlow('completed') } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/referrals/overdue', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM patient_referrals WHERE tenant_id = $1 AND status NOT IN ('completed','cancelled','declined') ORDER BY created_at ASC LIMIT 100`,
            [req.tenantId]
        );
        const annotated = r.rows.map(ref => ({
            ...ref,
            wait_days: referralWaitDays(ref.created_at, ref.status),
            wait_severity: referralWaitSeverity(referralWaitDays(ref.created_at, ref.status), ref.urgency)
        }));
        const overdue = annotated.filter(x => x.wait_severity === 'overdue' || x.wait_severity === 'critical_overdue');
        res.json({ ok: true, total_open: annotated.length, overdue_count: overdue.length, overdue_referrals: overdue });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATIENT FEEDBACK =====
router.get('/feedback', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, feedback_type, department, is_resolved, rating_min, rating_max, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT f.*, p.full_name AS patient_name FROM patient_feedback f LEFT JOIN patients p ON p.id = f.patient_id WHERE f.tenant_id = $1`;
        if (patient_id) { sql += ` AND f.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (feedback_type) { sql += ` AND f.feedback_type = $${params.length + 1}`; params.push(feedback_type); }
        if (department) { sql += ` AND f.department = $${params.length + 1}`; params.push(department); }
        if (is_resolved !== undefined) { sql += ` AND f.is_resolved = $${params.length + 1}`; params.push(is_resolved === 'true'); }
        if (rating_min) { sql += ` AND f.rating >= $${params.length + 1}`; params.push(parseInt(rating_min)); }
        if (rating_max) { sql += ` AND f.rating <= $${params.length + 1}`; params.push(parseInt(rating_max)); }
        sql += ` ORDER BY f.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/feedback', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!feedback_type || !VALID_FEEDBACK_TYPE.includes(feedback_type)) return res.status(400).json({ ok: false, error: 'invalid_feedback_type' });
        if (rating === undefined || (rating < 1 || rating > 5)) return res.status(400).json({ ok: false, error: 'rating_out_of_range_1_5' });

        const r = await db.query(
            `INSERT INTO patient_feedback (tenant_id, patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar, is_resolved)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id || null,
             department || null, feedback_type, parseInt(rating),
             comment || null, comment_ar || null]
        );
        res.status(201).json({ ok: true, feedback: r.rows[0], computed: { csat_category: csatCategory(rating) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/feedback/:id/resolve', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
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

// ===== SURVEYS (catalog) =====
router.get('/surveys', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { survey_type, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_surveys WHERE tenant_id = $1`;
        if (survey_type) { sql += ` AND survey_type = $${params.length + 1}`; params.push(survey_type); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surveys', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { survey_code, title, title_ar, description, description_ar, survey_type, questions_json, is_active, start_date, end_date } = req.body;
        if (!survey_code) return res.status(400).json({ ok: false, error: 'survey_code_required' });
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (survey_type && !VALID_SURVEY_TYPE.includes(survey_type)) return res.status(400).json({ ok: false, error: 'invalid_survey_type' });
        const validation = surveyValidation(questions_json);
        if (validation === 'invalid_json' || validation === 'missing_questions') return res.status(400).json({ ok: false, error: validation });

        const r = await db.query(
            `INSERT INTO patient_surveys (tenant_id, survey_code, title, title_ar, description, description_ar, survey_type, questions_json, is_active, start_date, end_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, survey_code, title, title_ar || null, description || null, description_ar || null,
             survey_type || 'general', questions_json || null, is_active === undefined ? true : is_active === 'true',
             start_date || null, end_date || null]
        );
        res.status(201).json({ ok: true, survey: r.rows[0], computed: { questions_validation: validation } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/surveys/active', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM patient_surveys WHERE tenant_id = $1 AND is_active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE) ORDER BY created_at DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURVEY RESPONSES =====
router.get('/survey-responses', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { survey_id, patient_id, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name, s.title AS survey_title FROM survey_responses r LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN patient_surveys s ON s.id = r.survey_id WHERE r.tenant_id = $1`;
        if (survey_id) { sql += ` AND r.survey_id = $${params.length + 1}`; params.push(parseInt(survey_id)); }
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (since) { sql += ` AND r.submitted_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY r.submitted_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/survey-responses', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { survey_id, patient_id, overall_score, nps_score, answers_json, comments } = req.body;
        if (!survey_id) return res.status(400).json({ ok: false, error: 'survey_id_required' });
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (nps_score !== undefined && (nps_score < 0 || nps_score > 10)) return res.status(400).json({ ok: false, error: 'nps_out_of_range_0_10' });
        if (overall_score !== undefined && (overall_score < 1 || overall_score > 5)) return res.status(400).json({ ok: false, error: 'overall_score_out_of_range_1_5' });

        const r = await db.query(
            `INSERT INTO survey_responses (tenant_id, survey_id, patient_id, overall_score, nps_score, answers_json, comments)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, parseInt(survey_id), parseInt(patient_id),
             overall_score ?? null, nps_score ?? null, answers_json || null, comments || null]
        );
        res.status(201).json({
            ok: true, response: r.rows[0],
            computed: {
                nps_category: npsCategory(nps_score),
                csat_category: csatCategory(overall_score)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/referral-wait', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { days, urgency } = req.query;
        if (days === undefined) return res.status(400).json({ ok: false, error: 'days_required' });
        res.json({ ok: true, days: parseInt(days), urgency, severity: referralWaitSeverity(parseInt(days), urgency) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nps-category', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score), category: npsCategory(parseInt(score)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/csat-category', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score), category: csatCategory(parseInt(score)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/survey-validate', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { questions_json } = req.query;
        res.json({ ok: true, validation: surveyValidation(questions_json) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const referrals = await db.query(`SELECT urgency, status, COUNT(*) AS count FROM patient_referrals WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY urgency, status ORDER BY count DESC`, [req.tenantId]);
        const feedback = await db.query(`SELECT feedback_type, AVG(rating) AS avg_rating, COUNT(*) AS count FROM patient_feedback WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY feedback_type`, [req.tenantId]);
        const surveys = await db.query(`SELECT survey_type, COUNT(*) AS count FROM patient_surveys WHERE tenant_id = $1 GROUP BY survey_type`, [req.tenantId]);
        const responses = await db.query(`SELECT AVG(nps_score) AS avg_nps, AVG(overall_score) AS avg_csat, COUNT(*) AS count FROM survey_responses WHERE tenant_id = $1 AND submitted_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
        res.json({ ok: true, referrals_90d: referrals.rows, feedback_90d: feedback.rows, surveys: surveys.rows, responses_90d: responses.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
