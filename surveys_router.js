// filepath: namaweb/surveys_router.js
// Patient surveys (NPS, CSAT, custom).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/surveys?is_active=true
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { is_active, survey_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (is_active === 'true') conditions.push('is_active = true');
        if (is_active === 'false') conditions.push('is_active = false');
        if (survey_type) { params.push(survey_type); conditions.push(`survey_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, survey_code, title, title_ar, description, description_ar,
                   survey_type, questions_json, is_active, start_date, end_date, created_at
            FROM patient_surveys
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, surveys: r.rows });
    } catch (err) { console.error('GET /api/surveys', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/surveys
router.post('/', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const { survey_code, title, title_ar, description, description_ar, survey_type, questions_json, start_date, end_date } = req.body;
        if (!survey_code || !title) return res.status(400).json({ error: 'missing_required', required: ['survey_code', 'title'] });
        const r = await db.query(`
            INSERT INTO patient_surveys (tenant_id, survey_code, title, title_ar, description, description_ar, survey_type, questions_json, start_date, end_date, is_active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) RETURNING id
        `, [req.tenantId, survey_code, title, title_ar || '', description || '', description_ar || '', survey_type || 'satisfaction', JSON.stringify(questions_json || []), start_date || null, end_date || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/surveys', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/surveys/:id/responses — submit response
router.post('/:id/responses', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, overall_score, nps_score, answers_json, comments } = req.body;
        const r = await db.query(`
            INSERT INTO survey_responses (tenant_id, survey_id, patient_id, overall_score, nps_score, answers_json, comments)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, req.params.id, patient_id || null, overall_score || null, nps_score || null, JSON.stringify(answers_json || {}), comments || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/surveys/:id/responses', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/surveys/:id/responses
router.get('/:id/responses', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, overall_score, nps_score, answers_json, comments, submitted_at
            FROM survey_responses
            WHERE tenant_id = $1 AND survey_id = $2 ORDER BY submitted_at DESC LIMIT 500
        `, [req.tenantId, req.params.id]);
        res.json({ ok: true, total: r.rows.length, responses: r.rows });
    } catch (err) { console.error('GET /api/surveys/:id/responses', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/surveys/nps — NPS score across all surveys
router.get('/nps', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                COUNT(*) FILTER (WHERE nps_score >= 9) as promoters,
                COUNT(*) FILTER (WHERE nps_score BETWEEN 7 AND 8) as passives,
                COUNT(*) FILTER (WHERE nps_score <= 6) as detractors,
                COUNT(*) FILTER (WHERE nps_score IS NOT NULL) as total_nps_responses,
                ROUND(AVG(CASE WHEN nps_score IS NOT NULL THEN nps_score END)::numeric, 2) as avg_nps,
                ROUND((COUNT(*) FILTER (WHERE nps_score >= 9)::numeric - COUNT(*) FILTER (WHERE nps_score <= 6)::numeric) / NULLIF(COUNT(*) FILTER (WHERE nps_score IS NOT NULL), 0) * 100, 2) as nps_score_calc
            FROM survey_responses WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0] });
    } catch (err) { console.error('GET /api/surveys/nps', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/surveys/csat — CSAT (avg overall_score 4-5 / total)
router.get('/csat', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                COUNT(*) FILTER (WHERE overall_score >= 4) as satisfied,
                COUNT(*) FILTER (WHERE overall_score <= 2) as unsatisfied,
                COUNT(*) FILTER (WHERE overall_score IS NOT NULL) as total_responses,
                ROUND(AVG(overall_score)::numeric, 2) as avg_score,
                ROUND(COUNT(*) FILTER (WHERE overall_score >= 4)::numeric / NULLIF(COUNT(*) FILTER (WHERE overall_score IS NOT NULL), 0) * 100, 2) as csat_percent
            FROM survey_responses WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0] });
    } catch (err) { console.error('GET /api/surveys/csat', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'create', 'responses', 'nps', 'csat'], timestamp: new Date().toISOString() });
});

module.exports = router;
