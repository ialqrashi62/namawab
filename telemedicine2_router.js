// filepath: namaweb/telemedicine2_router.js
// Telemedicine sessions + HL7 message queue + Knowledge base.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Telemedicine sessions
router.get('/sessions', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, speciality, session_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (speciality) { params.push(speciality); conditions.push(`speciality = $${params.length}`); }
        if (session_type) { params.push(session_type); conditions.push(`session_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`scheduled_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time,
                   duration_minutes, meeting_link, diagnosis, prescription, status, created_at
            FROM telemedicine_sessions WHERE ${conditions.join(' AND ')}
            ORDER BY scheduled_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, sessions: r.rows });
    } catch (err) { console.error('GET /api/tele2/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/sessions/upcoming', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, meeting_link, status
            FROM telemedicine_sessions WHERE tenant_id = $1 AND status = 'scheduled' AND scheduled_date >= CURRENT_DATE
            ORDER BY scheduled_date, scheduled_time LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, upcoming: r.rows });
    } catch (err) { console.error('GET /api/tele2/upcoming', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sessions', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, notes } = req.body;
        if (!patient_id || !doctor || !scheduled_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO telemedicine_sessions (tenant_id, patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, notes, status)
            VALUES ($1,$2,$3,$4,$5,COALESCE($6,'video'),$7,$8,COALESCE($9,30),$10,$11,'scheduled') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', doctor, speciality || 'general', session_type, scheduled_date, scheduled_time || null, duration_minutes, meeting_link || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/tele2/sessions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sessions/:id/complete', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { diagnosis, prescription } = req.body;
        const r = await db.query(`
            UPDATE telemedicine_sessions SET status = 'completed', diagnosis = COALESCE($3, diagnosis), prescription = COALESCE($4, prescription)
            WHERE id = $1 AND tenant_id = $2 AND status != 'completed' RETURNING id, status
        `, [req.params.id, req.tenantId, diagnosis, prescription]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_completed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/tele2/sessions/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

// HL7 messages
router.get('/hl7', requireAuth, requireTenantScope, requireRole('admin', 'integration', 'doctor'), async (req, res) => {
    try {
        const { processing_status, message_type, direction, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (processing_status) { params.push(processing_status); conditions.push(`processing_status = $${params.length}`); }
        if (message_type) { params.push(message_type); conditions.push(`message_type = $${params.length}`); }
        if (direction) { params.push(direction); conditions.push(`direction = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, message_type, message_control_id, sending_application, receiving_application,
                   sending_facility, message_datetime, patient_id, processing_status, ack_message, error_message,
                   retry_count, direction, interface_name, created_at
            FROM hl7_messages WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/tele2/hl7', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/hl7/stats', requireAuth, requireTenantScope, requireRole('admin', 'integration'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) as total_messages,
                   COUNT(*) FILTER (WHERE processing_status = 'received') as received,
                   COUNT(*) FILTER (WHERE processing_status = 'processed') as processed,
                   COUNT(*) FILTER (WHERE processing_status = 'failed') as failed,
                   ROUND(AVG(retry_count)::numeric, 2) as avg_retry
            FROM hl7_messages WHERE tenant_id = $1
        `, [req.tenantId]);
        const byType = await db.query(`
            SELECT message_type, COUNT(*) as cnt FROM hl7_messages
            WHERE tenant_id = $1 GROUP BY message_type ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_type: byType.rows });
    } catch (err) { console.error('GET /api/tele2/hl7/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

// Knowledge base articles
router.get('/kb', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'patient'), async (req, res) => {
    try {
        const { category, audience, q, published } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (audience) { params.push(audience); conditions.push(`audience = $${params.length}`); }
        if (published === 'true') conditions.push('published = true');
        if (published === 'false') conditions.push('published = false');
        if (q) { params.push(`%${q}%`); conditions.push(`(title_en ILIKE $${params.length} OR title_ar ILIKE $${params.length} OR body_en ILIKE $${params.length} OR tags ILIKE $${params.length})`); }
        params.push(Math.min(+req.query.limit || 20, 100));
        const r = await db.query(`
            SELECT id, slug, title_en, title_ar, category, summary_en, summary_ar, tags, audience, view_count, helpful_yes, helpful_no, published, created_at
            FROM knowledge_articles WHERE ${conditions.join(' AND ')}
            ORDER BY view_count DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, articles: r.rows });
    } catch (err) { console.error('GET /api/tele2/kb', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/kb', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { slug, title_en, title_ar, category, summary_en, summary_ar, body_en, body_ar, tags, audience } = req.body;
        if (!slug || !title_en || !body_en) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO knowledge_articles (tenant_id, slug, title_en, title_ar, category, summary_en, summary_ar, body_en, body_ar, tags, audience, published, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11,'clinical'),true,$12) RETURNING id
        `, [req.tenantId, slug, title_en, title_ar || '', category || 'general', summary_en || '', summary_ar || '', body_en, body_ar || '', tags || '', audience, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/tele2/kb', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/kb/:id/view', requireAuth, requireTenantScope, async (req, res) => {
    try {
        await db.query(`UPDATE knowledge_articles SET view_count = view_count + 1 WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/tele2/kb/view', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/kb/:id/helpful', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { helpful } = req.body;
        const col = helpful === true ? 'helpful_yes' : 'helpful_no';
        await db.query(`UPDATE knowledge_articles SET ${col} = ${col} + 1 WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/tele2/kb/helpful', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const ts = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE scheduled_date >= CURRENT_DATE AND status = 'scheduled') as scheduled,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE session_type = 'video') as video_sessions
            FROM telemedicine_sessions WHERE tenant_id = $1
        `, [req.tenantId]);
        const hl = await db.query(`SELECT COUNT(*) as total_messages, COUNT(*) FILTER (WHERE processing_status = 'failed') as failed FROM hl7_messages WHERE tenant_id = $1`, [req.tenantId]);
        const kb = await db.query(`SELECT COUNT(*) as total_articles, SUM(view_count) as total_views, SUM(helpful_yes + helpful_no) as total_feedback FROM knowledge_articles WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, telemedicine: ts.rows[0], hl7: hl.rows[0], kb: kb.rows[0] });
    } catch (err) { console.error('GET /api/tele2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['sessions', 'hl7', 'kb', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
