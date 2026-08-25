// filepath: namaweb/mh_router.js
// Mental / behavioral health: MSE-based psychiatric eval + PHQ-9 / GAD-7 + psychosocial SDOH log.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- PHQ-9 / GAD-7 scoring ---
function phq9Severity(score) {
    if (score == null) return null;
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    if (score <= 19) return 'moderately_severe';
    return 'severe';
}
function gad7Severity(score) {
    if (score == null) return null;
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
}

// Psychosocial / SDOH log with PHQ-9 + GAD-7
router.post('/psychosocial', requireAuth, requireTenantScope, requireRole('psychiatrist', 'psychologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, phq9_score, gad7_score, sdoh_markers, support_system_grade } = req.body;
        if (!patient_id || !log_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO psychosocial_support_logs (tenant_id, patient_id, log_date, phq9_score, gad7_score, sdoh_markers, support_system_grade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [req.tenantId, patient_id, log_date, phq9_score != null ? +phq9_score : null, gad7_score != null ? +gad7_score : null, sdoh_markers || '', support_system_grade || '']);
        // Auto-classify severity
        const phq9sev = phq9Severity(phq9_score);
        const gad7sev = gad7Severity(gad7_score);
        res.status(201).json({ ok: true, id: r.rows[0].id, phq9_severity: phq9sev, gad7_severity: gad7sev });
    } catch (err) { console.error('POST /api/mh/psychosocial', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/psychosocial/:patient_id', requireAuth, requireTenantScope, requireRole('psychiatrist', 'psychologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT log_date, phq9_score, gad7_score, sdoh_markers, support_system_grade FROM psychosocial_support_logs WHERE tenant_id = $1 AND patient_id = $2 ORDER BY log_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        const trend = r.rows.map(x => ({ ...x, phq9_severity: phq9Severity(x.phq9_score), gad7_severity: gad7Severity(x.gad7_score) }));
        res.json({ ok: true, total: trend.length, log: trend });
    } catch (err) { console.error('GET /api/mh/psychosocial', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Full MSE-based psychiatric evaluation ---
router.post('/eval', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, evaluation_date, mse_appearance, mse_behavior, mse_speech, mse_mood, mse_affect, mse_thought_process, mse_thought_content, mse_perception, mse_cognition, mse_insight, mse_judgment, diagnostic_summary } = req.body;
        if (!patient_id || !evaluation_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO psychiatric_evaluations (tenant_id, patient_id, evaluation_date, mse_appearance, mse_behavior, mse_speech, mse_mood, mse_affect, mse_thought_process, mse_thought_content, mse_perception, mse_cognition, mse_insight, mse_judgment, diagnostic_summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`, [req.tenantId, patient_id, evaluation_date, mse_appearance || '', mse_behavior || '', mse_speech || '', mse_mood || '', mse_affect || '', mse_thought_process || '', mse_thought_content || '', mse_perception || '', mse_cognition || '', mse_insight || '', mse_judgment || '', diagnostic_summary || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/mh/eval', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/eval/:patient_id', requireAuth, requireTenantScope, requireRole('psychiatrist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, evaluation_date, mse_mood, mse_affect, mse_thought_process, mse_thought_content, diagnostic_summary, created_at FROM psychiatric_evaluations WHERE tenant_id = $1 AND patient_id = $2 ORDER BY evaluation_date DESC LIMIT 20`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, evaluations: r.rows });
    } catch (err) { console.error('GET /api/mh/eval', err); res.status(500).json({ error: 'internal_error' }); }
});

// PHQ-9 screening (mini-form endpoint)
router.post('/screening/phq9', requireAuth, requireTenantScope, requireRole('psychiatrist', 'psychologist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, log_date, answers } = req.body;
        if (!patient_id || !Array.isArray(answers) || answers.length !== 9) return res.status(400).json({ error: 'phq9_requires_9_answers' });
        const score = answers.reduce((s, x) => s + (+x || 0), 0);
        const r = await db.query(`INSERT INTO psychosocial_support_logs (tenant_id, patient_id, log_date, phq9_score, sdoh_markers) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [req.tenantId, patient_id, log_date || new Date().toISOString().slice(0, 10), score, 'PHQ-9: ' + answers.join(',')]);
        const severity = phq9Severity(score);
        res.status(201).json({ ok: true, id: r.rows[0].id, score, severity, suicidal_ideation_q9_flag: +answers[8] >= 1 });
    } catch (err) { console.error('POST /api/mh/screening/phq9', err); res.status(500).json({ error: 'internal_error' }); }
});

// GAD-7 screening
router.post('/screening/gad7', requireAuth, requireTenantScope, requireRole('psychiatrist', 'psychologist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, log_date, answers } = req.body;
        if (!patient_id || !Array.isArray(answers) || answers.length !== 7) return res.status(400).json({ error: 'gad7_requires_7_answers' });
        const score = answers.reduce((s, x) => s + (+x || 0), 0);
        const r = await db.query(`INSERT INTO psychosocial_support_logs (tenant_id, patient_id, log_date, gad7_score, sdoh_markers) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [req.tenantId, patient_id, log_date || new Date().toISOString().slice(0, 10), score, 'GAD-7: ' + answers.join(',')]);
        const severity = gad7Severity(score);
        res.status(201).json({ ok: true, id: r.rows[0].id, score, severity });
    } catch (err) { console.error('POST /api/mh/screening/gad7', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/severity-tables', (req, res) => {
    res.json({ ok: true, phq9: { ranges: ['0-4 minimal', '5-9 mild', '10-14 moderate', '15-19 moderately severe', '20-27 severe'] }, gad7: { ranges: ['0-4 minimal', '5-9 mild', '10-14 moderate', '15-21 severe'] } });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['psychosocial', 'eval', 'screening/phq9', 'screening/gad7'], timestamp: new Date().toISOString() });
});

module.exports = router;
