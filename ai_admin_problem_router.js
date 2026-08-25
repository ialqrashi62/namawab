'use strict';
// Wave 118 — AI/RAG governance (cds/cost/prompt/voice) + Patient problem list + Social work + Wound care + Approvals + Branches + CME registrations + Admin resource logs
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_CTX_TYPE = ['encounter','order','lab','medication','note','admission','discharge','review','consult','other'];
const VALID_PROVIDER = ['openai','anthropic','google','azure','bedrock','cohere','local','other'];
const VALID_LOCALE = ['ar','en','fr','ur','bilingual','other'];
const VALID_ROLE = ['system','user','assistant','tool','developer'];
const VALID_FEEDBACK = [-2,-1,0,1,2];
const VALID_SESSION_TYPE = ['dictation','consultation','ambient','emergency','telemed','voice_command','voice_biomarker'];
const VALID_PROBLEM_TYPE = ['diagnosis','symptom','finding','risk_factor','condition','chronic','acute','resolved','inactive'];
const VALID_SEVERITY = ['mild','moderate','severe','critical','life_threatening','fatal'];
const VALID_PROBLEM_STATUS = ['active','inactive','resolved','ruled_out','entered_in_error'];
const VALID_CASE_TYPE = ['abuse_neglect','addiction','adjustment','adoption','bereavement','caregiver_stress','child_welfare','crisis','domestic_violence','end_of_life','financial_assistance','housing','immigration','mental_health','palliative','placement','protective_services','social_isolation','transportation','other'];
const VALID_CASE_STATUS = ['open','in_progress','on_hold','closed','referred','cancelled','escalated'];
const VALID_CASE_PRIORITY = ['low','medium','high','urgent'];
const VALID_ATTENDANCE = ['registered','attended','absent','partial','late','cancelled'];
const VALID_APPROVAL_STATUS = ['pending','approved','denied','expired','revoked','in_progress','completed'];
const VALID_BOTTLENECK = ['beds','staff','ORs','equipment','imaging','labs','pharmacy','discharge','none'];
const VALID_RISK = ['low','moderate','high','critical'];

function tokenCost(promptTokens, completionTokens, model) {
    if (!promptTokens && !completionTokens) return null;
    const rates = {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'claude-3-sonnet': { input: 0.003, output: 0.015 },
        'gemini-pro': { input: 0.001, output: 0.002 }
    };
    const rate = rates[model] || { input: 0.002, output: 0.002 };
    const usd = ((parseInt(promptTokens || 0) / 1000) * rate.input) + ((parseInt(completionTokens || 0) / 1000) * rate.output);
    return Math.round(usd * 1000000) / 1000000;
}

function cdsAcceptanceRate(accepted, total) {
    if (total === undefined || total === 0) return null;
    return Math.round((parseInt(accepted || 0) / parseInt(total)) * 1000) / 10;
}

function problemDuration(onset, resolved) {
    if (!onset) return null;
    const end = resolved ? new Date(resolved) : new Date();
    return Math.round((end - new Date(onset)) / (1000 * 60 * 60 * 24));
}

function problemChronicity(onset) {
    if (!onset) return null;
    const days = Math.round((Date.now() - new Date(onset)) / (1000 * 60 * 60 * 24));
    if (days >= 90) return 'chronic';
    if (days >= 30) return 'subacute';
    if (days >= 7) return 'recent';
    return 'acute';
}

function socialCaseWorkload(activeCases) {
    if (activeCases === undefined || activeCases === null) return null;
    if (activeCases >= 20) return 'overloaded';
    if (activeCases >= 15) return 'high_load';
    if (activeCases >= 10) return 'normal_load';
    if (activeCases >= 5) return 'low_load';
    return 'minimal_load';
}

function woundRiskScore(riskLevel, score) {
    if (riskLevel === 'critical') return 'critical';
    if (riskLevel === 'high') return 'high';
    if (score && score >= 7) return 'high';
    if (score && score >= 5) return 'moderate';
    if (riskLevel === 'low' && (!score || score < 5)) return 'low';
    return 'moderate';
}

function staffRatioRisk(ratio) {
    if (ratio === undefined || ratio === null) return null;
    if (ratio >= 6) return 'adequate';
    if (ratio >= 4) return 'stretched';
    if (ratio >= 2) return 'critical_shortage';
    return 'unsafe';
}

function bedOccupancyRisk(percent) {
    if (percent === undefined || percent === null) return null;
    if (percent < 60) return 'underutilized';
    if (percent < 80) return 'optimal';
    if (percent < 95) return 'high';
    return 'overflow_risk';
}

function approvalAge(requestDate, status) {
    if (!requestDate || status !== 'pending') return null;
    const days = Math.round((Date.now() - new Date(requestDate)) / (1000 * 60 * 60 * 24));
    if (days >= 7) return 'overdue';
    if (days >= 3) return 'urgent';
    if (days >= 1) return 'normal';
    return 'fresh';
}

function icd10Validation(code) {
    if (!code) return null;
    return /^[A-TV-Z][0-9][0-9AB](\.[0-9A-Z]{1,4})?$/.test(code) ? 'valid_icd10' : 'invalid_format';
}

function snomedValidation(code) {
    if (!code) return null;
    return /^[0-9]{6,18}$/.test(code) ? 'valid_snomed' : 'invalid_format';
}

function feedbackQuality(fb) {
    if (fb === undefined || fb === null) return null;
    if (fb >= 2) return 'thumbs_up';
    if (fb <= -2) return 'thumbs_down';
    if (fb > 0) return 'positive';
    if (fb < 0) return 'negative';
    return 'neutral';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'ai-admin-problem',
        endpoints: [
            'GET /ai/cds-log',
            'POST /ai/cds-log',
            'POST /ai/cds-log/:id/accept',
            'GET /ai/cost-log',
            'POST /ai/cost-log',
            'GET /ai/prompt-log',
            'POST /ai/prompt-log',
            'POST /ai/prompt-log/:id/feedback',
            'GET /ai/voice-sessions',
            'POST /ai/voice-sessions',
            'GET /patient/problem-list',
            'POST /patient/problem-list',
            'POST /patient/problem-list/:id/resolve',
            'GET /social-work/cases',
            'POST /social-work/cases',
            'GET /wound-care-assessments',
            'POST /wound-care-assessments',
            'GET /approvals',
            'POST /approvals',
            'GET /branches',
            'POST /branches',
            'GET /cme/registrations',
            'POST /cme/registrations',
            'GET /admin/resource-logs',
            'POST /admin/resource-logs',
            'GET /token-cost',
            'GET /staff-ratio',
            'GET /bed-occupancy',
            'GET /problem-chronicity',
            'GET /feedback-quality',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== AI CDS LOG =====
router.get('/ai/cds-log', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, context_type, ai_model, accepted, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_cds_log WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (context_type) { sql += ` AND context_type = $${params.length + 1}`; params.push(context_type); }
        if (ai_model) { sql += ` AND ai_model = $${params.length + 1}`; params.push(ai_model); }
        if (accepted !== undefined) { sql += ` AND accepted_by_clinician = $${params.length + 1}`; params.push(accepted === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/cds-log', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, user_id, context_type, input_data, ai_model, ai_response, recommendations, processing_time_ms, tokens_used } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!ai_model) return res.status(400).json({ ok: false, error: 'ai_model_required' });
        if (context_type && !VALID_CTX_TYPE.includes(context_type)) return res.status(400).json({ ok: false, error: 'invalid_context_type' });

        const r = await db.query(
            `INSERT INTO ai_cds_log (tenant_id, patient_id, user_id, context_type, input_data, ai_model, ai_response, recommendations, processing_time_ms, tokens_used)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), user_id || req.user?.id || null,
             context_type || null, input_data || null, ai_model,
             ai_response || null, recommendations || null, processing_time_ms ?? null, tokens_used ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/cds-log/:id/accept', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { accepted, override_reason } = req.body;
        const r = await db.query(
            `UPDATE ai_cds_log SET accepted_by_clinician = $1, override_reason = $2 WHERE tenant_id = $3 AND id = $4 RETURNING *`,
            [!!accepted, override_reason || null, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'log_not_found' });
        res.json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AI COST LOG =====
router.get('/ai/cost-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { provider, model, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_cost_log WHERE tenant_id = $1`;
        if (provider) { sql += ` AND provider = $${params.length + 1}`; params.push(provider); }
        if (model) { sql += ` AND model = $${params.length + 1}`; params.push(model); }
        if (since) { sql += ` AND ts >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY ts DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/cost-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, session_id, provider, model, prompt_tokens, completion_tokens, cost_usd } = req.body;
        if (!model) return res.status(400).json({ ok: false, error: 'model_required' });
        if (provider && !VALID_PROVIDER.includes(provider)) return res.status(400).json({ ok: false, error: 'invalid_provider' });
        const computedCost = cost_usd !== undefined ? parseFloat(cost_usd) : tokenCost(prompt_tokens, completion_tokens, model);

        const r = await db.query(
            `INSERT INTO ai_cost_log (tenant_id, user_id, session_id, provider, model, prompt_tokens, completion_tokens, cost_usd)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, user_id || null, session_id || null,
             provider || null, model,
             prompt_tokens ?? null, completion_tokens ?? null, computedCost]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { computed_cost_usd: computedCost } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AI PROMPT LOG (LLM observability) =====
router.get('/ai/prompt-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, prompt_key, role, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_prompt_log WHERE tenant_id = $1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (prompt_key) { sql += ` AND prompt_key = $${params.length + 1}`; params.push(prompt_key); }
        if (role) { sql += ` AND role = $${params.length + 1}`; params.push(role); }
        if (since) { sql += ` AND ts >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY ts DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/prompt-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, session_id, prompt_key, version, locale, role, input_hash, output_hash, latency_ms, prompt_tokens, completion_tokens, model, provider, citations } = req.body;
        if (role && !VALID_ROLE.includes(role)) return res.status(400).json({ ok: false, error: 'invalid_role' });
        if (locale && !VALID_LOCALE.includes(locale)) return res.status(400).json({ ok: false, error: 'invalid_locale' });
        if (provider && !VALID_PROVIDER.includes(provider)) return res.status(400).json({ ok: false, error: 'invalid_provider' });

        const r = await db.query(
            `INSERT INTO ai_prompt_log (tenant_id, user_id, session_id, prompt_key, version, locale, role, input_hash, output_hash, latency_ms, prompt_tokens, completion_tokens, model, provider, citations)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [req.tenantId, user_id || null, session_id || null, prompt_key || null,
             version || null, locale || null, role || null, input_hash || null, output_hash || null,
             latency_ms ?? null, prompt_tokens ?? null, completion_tokens ?? null,
             model || null, provider || null, citations || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/prompt-log/:id/feedback', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { feedback } = req.body;
        if (feedback === undefined || !VALID_FEEDBACK.includes(parseInt(feedback))) return res.status(400).json({ ok: false, error: 'invalid_feedback_-2_to_2' });
        const r = await db.query(
            `UPDATE ai_prompt_log SET feedback = $1 WHERE tenant_id = $2 AND id = $3 RETURNING *`,
            [parseInt(feedback), req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'log_not_found' });
        res.json({ ok: true, log: r.rows[0], computed: { feedback_quality: feedbackQuality(feedback) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AI VOICE SESSIONS =====
router.get('/ai/voice-sessions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { user_id, patient_id, session_type, is_finalized, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_voice_sessions WHERE tenant_id = $1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (session_type) { sql += ` AND session_type = $${params.length + 1}`; params.push(session_type); }
        if (is_finalized !== undefined) { sql += ` AND is_finalized = $${params.length + 1}`; params.push(is_finalized === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/voice-sessions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { user_id, patient_id, session_type, audio_duration_sec, transcript_raw, ai_model, confidence_score, draft_text, final_text, is_finalized } = req.body;
        if (session_type && !VALID_SESSION_TYPE.includes(session_type)) return res.status(400).json({ ok: false, error: 'invalid_session_type' });
        if (audio_duration_sec !== undefined && audio_duration_sec < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (confidence_score !== undefined && (confidence_score < 0 || confidence_score > 1)) return res.status(400).json({ ok: false, error: 'confidence_out_of_range_0_1' });

        const r = await db.query(
            `INSERT INTO ai_voice_sessions (tenant_id, user_id, user_name, patient_id, session_type, audio_duration_sec, transcript_raw, ai_model, confidence_score, draft_text, final_text, is_finalized, finalized_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CASE WHEN $12::boolean THEN NOW() ELSE NULL END) RETURNING *`,
            [req.tenantId, user_id || req.user?.id || null, req.user?.full_name || req.user?.username || null,
             patient_id || null, session_type || null, audio_duration_sec || null,
             transcript_raw || null, ai_model || null, confidence_score ?? null,
             draft_text || null, final_text || null, !!is_finalized]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATIENT PROBLEM LIST =====
router.get('/patient/problem-list', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, problem_type, is_active, principal_diagnosis, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT p.*, pt.full_name AS patient_name FROM patient_problem_list p LEFT JOIN patients pt ON pt.id = p.patient_id WHERE p.tenant_id = $1`;
        if (patient_id) { sql += ` AND p.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (problem_type) { sql += ` AND p.problem_type = $${params.length + 1}`; params.push(problem_type); }
        if (is_active !== undefined) { sql += ` AND p.is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        if (principal_diagnosis !== undefined) { sql += ` AND p.principal_diagnosis = $${params.length + 1}`; params.push(principal_diagnosis === 'true'); }
        sql += ` ORDER BY p.onset_date DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/patient/problem-list', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity, status, principal_diagnosis, notes, added_by_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!problem_name) return res.status(400).json({ ok: false, error: 'problem_name_required' });
        if (icd10_code && icd10Validation(icd10_code) === 'invalid_format') return res.status(400).json({ ok: false, error: 'invalid_icd10_format' });
        if (snomed_code && snomedValidation(snomed_code) === 'invalid_format') return res.status(400).json({ ok: false, error: 'invalid_snomed_format' });
        if (problem_type && !VALID_PROBLEM_TYPE.includes(problem_type)) return res.status(400).json({ ok: false, error: 'invalid_problem_type' });
        if (severity && !VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });
        if (status && !VALID_PROBLEM_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO patient_problem_list (tenant_id, patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity, status, principal_diagnosis, notes, added_by, added_by_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [req.tenantId, parseInt(patient_id), admission_id || null,
             icd10_code || null, icd10_description || null, snomed_code || null,
             problem_name, problem_type || null, onset_date || null,
             severity || null, status || 'active', !!principal_diagnosis,
             notes || null, req.user?.full_name || req.user?.username || null, added_by_id || req.user?.id || null]
        );
        res.status(201).json({
            ok: true, problem: r.rows[0],
            computed: {
                icd10_format: icd10Validation(icd10_code),
                snomed_format: snomedValidation(snomed_code),
                chronicity: problemChronicity(onset_date)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/patient/problem-list/:id/resolve', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { resolved_date } = req.body;
        const r = await db.query(
            `UPDATE patient_problem_list SET status = 'resolved', is_active = false, resolved_date = COALESCE($1, CURRENT_DATE), last_updated_by = $2 WHERE tenant_id = $3 AND id = $4 RETURNING *`,
            [resolved_date || null, req.user?.full_name || req.user?.username || null, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'problem_not_found' });
        res.json({
            ok: true, problem: r.rows[0],
            computed: { duration_days: problemDuration(r.rows[0].onset_date, resolved_date || new Date()) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SOCIAL WORK CASES =====
router.get('/social-work/cases', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const { patient_id, case_type, status, priority, social_worker, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM social_work_cases WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (case_type) { sql += ` AND case_type = $${params.length + 1}`; params.push(case_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        if (social_worker) { sql += ` AND social_worker ILIKE $${params.length + 1}`; params.push(`%${social_worker}%`); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/social-work/cases', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const { patient_id, patient_name, case_type, social_worker, assessment, plan, interventions, referrals, status, priority, follow_up_date, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (case_type && !VALID_CASE_TYPE.includes(case_type)) return res.status(400).json({ ok: false, error: 'invalid_case_type' });
        if (status && !VALID_CASE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (priority && !VALID_CASE_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority' });

        const r = await db.query(
            `INSERT INTO social_work_cases (tenant_id, patient_id, patient_name, case_type, social_worker, assessment, plan, interventions, referrals, status, priority, follow_up_date, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, parseInt(patient_id), patient_name || null,
             case_type || null, social_worker || null, assessment || null, plan || null,
             interventions || null, referrals || null, status || 'open', priority || 'medium',
             follow_up_date || null, notes || null]
        );
        res.status(201).json({ ok: true, case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WOUND CARE ASSESSMENTS (engine) =====
router.get('/wound-care-assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM wound_care_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/wound-care-assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO wound_care_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({
            ok: true, assessment: r.rows[0],
            computed: { risk_score: woundRiskScore(risk_level, score) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== APPROVALS =====
router.get('/approvals', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, status, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name FROM approvals a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND a.status = $${params.length + 1}`; params.push(status); }
        if (since) { sql += ` AND a.request_date >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY a.request_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/approvals', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, service_id, request_date, status, approval_number } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!request_date) return res.status(400).json({ ok: false, error: 'request_date_required' });
        if (status && !VALID_APPROVAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO approvals (tenant_id, patient_id, service_id, request_date, status, approval_number)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, parseInt(patient_id), service_id || null, request_date, status || 'pending', approval_number || null]
        );
        res.status(201).json({ ok: true, approval: r.rows[0], computed: { approval_age: approvalAge(request_date, status || 'pending') } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BRANCHES =====
router.get('/branches', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM branches WHERE 1=1`;
        if (facility_id) { sql += ` AND facility_id = $${params.length + 1}`; params.push(parseInt(facility_id)); }
        sql += ` ORDER BY name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/branches', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, name, address } = req.body;
        if (!name) return res.status(400).json({ ok: false, error: 'name_required' });
        const r = await db.query(
            `INSERT INTO branches (facility_id, name, address) VALUES ($1,$2,$3) RETURNING *`,
            [facility_id || null, name, address || null]
        );
        res.status(201).json({ ok: true, branch: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CME REGISTRATIONS =====
router.get('/cme/registrations', requireAuth, async (req, res) => {
    try {
        const { activity_id, employee_id, attendance_status, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cme_registrations WHERE 1=1`;
        if (activity_id) { sql += ` AND activity_id = $${params.length + 1}`; params.push(parseInt(activity_id)); }
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(parseInt(employee_id)); }
        if (attendance_status) { sql += ` AND attendance_status = $${params.length + 1}`; params.push(attendance_status); }
        sql += ` ORDER BY registration_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cme/registrations', requireAuth, async (req, res) => {
    try {
        const { activity_id, employee_id, employee_name, attendance_status, certificate_issued, notes } = req.body;
        if (!activity_id) return res.status(400).json({ ok: false, error: 'activity_id_required' });
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        if (attendance_status && !VALID_ATTENDANCE.includes(attendance_status)) return res.status(400).json({ ok: false, error: 'invalid_attendance' });

        const r = await db.query(
            `INSERT INTO cme_registrations (activity_id, employee_id, employee_name, registration_date, attendance_status, certificate_issued, notes)
             VALUES ($1,$2,$3,CURRENT_DATE,$4,$5,$6) RETURNING *`,
            [parseInt(activity_id), parseInt(employee_id), employee_name || null,
             attendance_status || 'registered', certificate_issued ? 1 : 0, notes || null]
        );
        res.status(201).json({ ok: true, registration: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ADMIN RESOURCE LOGS (operational metrics) =====
router.get('/admin/resource-logs', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { since, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM admin_resource_logs WHERE 1=1`;
        if (since) { sql += ` AND log_date >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/admin/resource-logs', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, log_date, bed_occupancy_percent, staff_patient_ratio, or_utilization_percent, resource_bottleneck } = req.body;
        if (bed_occupancy_percent !== undefined && (bed_occupancy_percent < 0 || bed_occupancy_percent > 100)) return res.status(400).json({ ok: false, error: 'occupancy_out_of_range' });
        if (staff_patient_ratio !== undefined && staff_patient_ratio < 0) return res.status(400).json({ ok: false, error: 'invalid_ratio' });
        if (resource_bottleneck && !VALID_BOTTLENECK.includes(resource_bottleneck)) return res.status(400).json({ ok: false, error: 'invalid_bottleneck' });

        const r = await db.query(
            `INSERT INTO admin_resource_logs (tenant_id, log_date, bed_occupancy_percent, staff_patient_ratio, or_utilization_percent, resource_bottleneck)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [tenant_id || null, log_date || new Date().toISOString(),
             bed_occupancy_percent ?? null, staff_patient_ratio ?? null,
             or_utilization_percent ?? null, resource_bottleneck || null]
        );
        res.status(201).json({
            ok: true, log: r.rows[0],
            computed: {
                bed_occupancy_risk: bedOccupancyRisk(bed_occupancy_percent),
                staff_ratio_risk: staffRatioRisk(staff_patient_ratio)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/token-cost', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { prompt_tokens, completion_tokens, model } = req.query;
        if (prompt_tokens === undefined && completion_tokens === undefined) return res.status(400).json({ ok: false, error: 'tokens_required' });
        res.json({ ok: true, prompt_tokens: parseInt(prompt_tokens || 0), completion_tokens: parseInt(completion_tokens || 0), model, cost_usd: tokenCost(prompt_tokens, completion_tokens, model) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/staff-ratio', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { ratio } = req.query;
        if (ratio === undefined) return res.status(400).json({ ok: false, error: 'ratio_required' });
        res.json({ ok: true, ratio: parseFloat(ratio), risk: staffRatioRisk(parseFloat(ratio)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/bed-occupancy', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { percent } = req.query;
        if (percent === undefined) return res.status(400).json({ ok: false, error: 'percent_required' });
        res.json({ ok: true, percent: parseFloat(percent), risk: bedOccupancyRisk(parseFloat(percent)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/problem-chronicity', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { onset_date } = req.query;
        if (!onset_date) return res.status(400).json({ ok: false, error: 'onset_date_required' });
        res.json({ ok: true, onset_date, chronicity: problemChronicity(onset_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/feedback-quality', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { feedback } = req.query;
        if (feedback === undefined) return res.status(400).json({ ok: false, error: 'feedback_required' });
        res.json({ ok: true, feedback: parseInt(feedback), quality: feedbackQuality(parseInt(feedback)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const cds = await db.query(`SELECT context_type, COUNT(*) AS count, AVG(processing_time_ms) AS avg_ms, SUM(CASE WHEN accepted_by_clinician THEN 1 ELSE 0 END) AS accepted FROM ai_cds_log WHERE tenant_id = $1 GROUP BY context_type ORDER BY count DESC`, [req.tenantId]);
        const cost = await db.query(`SELECT model, SUM(cost_usd) AS total_cost, SUM(prompt_tokens) AS total_input, SUM(completion_tokens) AS total_output FROM ai_cost_log WHERE tenant_id = $1 GROUP BY model ORDER BY total_cost DESC`, [req.tenantId]);
        const problems = await db.query(`SELECT problem_type, status, COUNT(*) AS count FROM patient_problem_list WHERE tenant_id = $1 GROUP BY problem_type, status`, [req.tenantId]);
        const social = await db.query(`SELECT case_type, status, COUNT(*) AS count FROM social_work_cases WHERE tenant_id = $1 GROUP BY case_type, status`, [req.tenantId]);
        res.json({ ok: true, cds_breakdown: cds.rows, ai_costs: cost.rows, problems: problems.rows, social_cases: social.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
