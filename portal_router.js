// filepath: namaweb/portal_router.js
// Patient portal: messages, feedback, surveys, NPS.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Patient portal messages (inbox + reply)
router.get('/messages/:patient_id', requireAuth, requireTenantScope, requireRole('portal_user', 'doctor', 'nurse', 'admin', 'receptionist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, sender_type, sender_name, subject, body, department, is_read, replied_at, replied_by, reply_body, created_at FROM portal_messages WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 100`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/portal/messages', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/messages', requireAuth, requireTenantScope, requireRole('portal_user', 'patient', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, sender_type, sender_name, subject, body, department } = req.body;
        if (!patient_id || !subject || !body) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO portal_messages (tenant_id, patient_id, sender_type, sender_name, subject, body, department) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [req.tenantId, patient_id, sender_type || 'patient', sender_name || req.userName || '', subject, body, department || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/portal/messages', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/messages/:id/reply', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { reply_body } = req.body;
        if (!reply_body) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`UPDATE portal_messages SET reply_body = $2, replied_by = $3, replied_at = NOW(), is_read = true WHERE tenant_id = $1 AND id = $4 RETURNING id`, [req.tenantId, reply_body, req.userName || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/portal/messages/reply', err); res.status(500).json({ error: 'internal_error' }); }
});

// Feedback (post-visit)
router.post('/feedback', requireAuth, requireTenantScope, requireRole('portal_user', 'patient'), async (req, res) => {
    try {
        const { patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar } = req.body;
        if (!patient_id || !feedback_type || !rating) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO patient_feedback (tenant_id, patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, department || '', feedback_type, rating, comment || '', comment_ar || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/portal/feedback', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/feedback', requireAuth, requireTenantScope, requireRole('admin', 'patient_experience'), async (req, res) => {
    try {
        const { department, feedback_type, is_resolved } = req.query;
        let sql = `SELECT id, patient_id, encounter_id, department, feedback_type, rating, comment, is_resolved, resolved_by, created_at FROM patient_feedback WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (department) { params.push(department); sql += ` AND department = $${params.length}`; }
        if (feedback_type) { params.push(feedback_type); sql += ` AND feedback_type = $${params.length}`; }
        if (is_resolved !== undefined) { params.push(is_resolved === 'true'); sql += ` AND is_resolved = $${params.length}`; }
        sql += ` ORDER BY created_at DESC LIMIT 200`;
        const r = await db.query(sql, params);
        const avg = r.rows.length ? (r.rows.reduce((s, x) => s + (+x.rating || 0), 0) / r.rows.length).toFixed(2) : 0;
        res.json({ ok: true, total: r.rows.length, avg_rating: +avg, feedback: r.rows });
    } catch (err) { console.error('GET /api/portal/feedback', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/feedback/:id/resolve', requireAuth, requireTenantScope, requireRole('admin', 'patient_experience'), async (req, res) => {
    try {
        const { resolution_notes } = req.body;
        const r = await db.query(`UPDATE patient_feedback SET is_resolved = true, resolved_by = $2, resolved_at = NOW(), resolution_notes = $3 WHERE tenant_id = $1 AND id = $4 RETURNING id`, [req.tenantId, req.userName || '', resolution_notes || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/portal/feedback/resolve', err); res.status(500).json({ error: 'internal_error' }); }
});

// Surveys (with NPS scoring 0-10)
router.post('/surveys/submit', requireAuth, requireTenantScope, requireRole('portal_user', 'patient'), async (req, res) => {
    try {
        const { survey_id, patient_id, overall_score, nps_score, answers, comments } = req.body;
        if (!survey_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO survey_responses (tenant_id, survey_id, patient_id, overall_score, nps_score, answers_json, comments, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`, [req.tenantId, survey_id, patient_id, overall_score || null, nps_score != null ? +nps_score : null, JSON.stringify(answers || {}), comments || '']);
        // NPS bucketing: 0-6 detractor, 7-8 passive, 9-10 promoter
        const bucket = nps_score == null ? null : (nps_score <= 6 ? 'detractor' : nps_score <= 8 ? 'passive' : 'promoter');
        res.status(201).json({ ok: true, id: r.rows[0].id, nps_bucket: bucket });
    } catch (err) { console.error('POST /api/portal/surveys/submit', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/surveys/nps', requireAuth, requireTenantScope, requireRole('admin', 'patient_experience'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE nps_score BETWEEN 0 AND 6) as detractors,
                   COUNT(*) FILTER (WHERE nps_score BETWEEN 7 AND 8) as passives,
                   COUNT(*) FILTER (WHERE nps_score BETWEEN 9 AND 10) as promoters,
                   ROUND(AVG(nps_score)::numeric, 2) as avg_nps,
                   ROUND(AVG(overall_score)::numeric, 2) as avg_overall
            FROM survey_responses WHERE tenant_id = $1 AND submitted_at >= NOW() - INTERVAL '90 days'
        `, [req.tenantId]);
        const s = r.rows[0];
        const total = +s.detractors + +s.passives + +s.promoters;
        const nps = total > 0 ? Math.round(100 * (+s.promoters - +s.detractors) / total) : 0;
        res.json({ ok: true, nps_score: nps, response_count: total, ...s });
    } catch (err) { console.error('GET /api/portal/surveys/nps', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['messages', 'feedback', 'feedback-resolve', 'surveys/submit', 'surveys/nps'], timestamp: new Date().toISOString() });
});

module.exports = router;
