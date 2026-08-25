// filepath: namaweb/portal2_router.js
// Patient portal — appointments, secure messages, settings, queue-ads.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Portal users
router.get('/users', requireAuth, requireTenantScope, requireRole('admin', 'receptionist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, username, email, phone, is_active, last_login, created_at
            FROM portal_users WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, users: r.rows });
    } catch (err) { console.error('GET /api/portal2/users', err); res.status(500).json({ error: 'internal_error' }); }
});

// Portal appointments (request/booking)
router.get('/appointments', requireAuth, requireTenantScope, requireRole('admin', 'receptionist', 'doctor'), async (req, res) => {
    try {
        const { status, department, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes, created_at
            FROM portal_appointments WHERE ${conditions.join(' AND ')}
            ORDER BY preferred_date ASC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, appointments: r.rows });
    } catch (err) { console.error('GET /api/portal2/appointments', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/appointments/:id/confirm', requireAuth, requireTenantScope, requireRole('admin', 'receptionist', 'doctor'), async (req, res) => {
    try {
        const { confirmed_datetime } = req.body;
        const r = await db.query(`
            UPDATE portal_appointments SET status = 'confirmed', notes = COALESCE(notes || E'\n[CONFIRMED] ', '') || $3
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, confirmed_datetime ? `Confirmed for ${confirmed_datetime}` : 'Confirmed']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/portal2/appointments/confirm', err); res.status(500).json({ error: 'internal_error' }); }
});

// Portal messages (patient-to-clinic communication)
router.get('/messages', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const { is_read, department, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (is_read === 'true') conditions.push('is_read = true');
        if (is_read === 'false') conditions.push('is_read = false');
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, sender_type, sender_name, subject, body, department, is_read, replied_at, replied_by, reply_body, created_at
            FROM portal_messages WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/portal2/messages', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/messages/:id/reply', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { reply_body } = req.body;
        if (!reply_body) return res.status(400).json({ error: 'missing_required', required: ['reply_body'] });
        const r = await db.query(`
            UPDATE portal_messages SET is_read = true, replied_at = NOW(), replied_by = $3, reply_body = $4
            WHERE id = $1 AND tenant_id = $2 RETURNING id, replied_at, replied_by
        `, [req.params.id, req.tenantId, req.userName || req.userId, reply_body]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/portal2/messages/:id/reply', err); res.status(500).json({ error: 'internal_error' }); }
});

// User settings (key-value)
router.get('/settings', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, user_id, setting_key, setting_value, updated_at
            FROM hub_user_settings WHERE tenant_id = $1 AND user_id = $2 ORDER BY setting_key LIMIT 100
        `, [req.tenantId, req.query.user_id || req.userId]);
        res.json({ ok: true, total: r.rows.length, settings: r.rows });
    } catch (err) { console.error('GET /api/portal2/settings', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/settings', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { setting_key, setting_value } = req.body;
        if (!setting_key) return res.status(400).json({ error: 'missing_required', required: ['setting_key'] });
        const r = await db.query(`
            INSERT INTO hub_user_settings (tenant_id, user_id, setting_key, setting_value, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (tenant_id, user_id, setting_key) DO UPDATE SET setting_value = $4, updated_at = NOW()
            RETURNING id
        `, [req.tenantId, req.userId, setting_key, setting_value]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/portal2/settings', err); res.status(500).json({ error: 'internal_error' }); }
});

// Queue advertisements (waiting-room display)
router.get('/queue-ads', requireAuth, requireTenantScope, requireRole('admin', 'receptionist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, title, image_path, display_order, duration_seconds, is_active, created_at
            FROM queue_advertisements WHERE tenant_id = $1 ORDER BY display_order LIMIT 50
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, ads: r.rows });
    } catch (err) { console.error('GET /api/portal2/queue-ads', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/queue-ads', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { title, image_path, display_order, duration_seconds } = req.body;
        if (!title) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO queue_advertisements (tenant_id, title, image_path, display_order, duration_seconds, is_active)
            VALUES ($1, $2, $3, $4, COALESCE($5, 10), true) RETURNING id
        `, [req.tenantId, title, image_path || '', display_order || 0, duration_seconds]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/portal2/queue-ads', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const p = await db.query(`SELECT COUNT(*) FILTER (WHERE is_active) as active_portal_users, COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as active_7d FROM portal_users WHERE tenant_id = $1`, [req.tenantId]);
        const a = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'pending') as pending_appts, COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed, COUNT(*) FILTER (WHERE status = 'completed') as completed FROM portal_appointments WHERE tenant_id = $1`, [req.tenantId]);
        const m = await db.query(`SELECT COUNT(*) FILTER (WHERE is_read = false) as unread_messages, COUNT(*) FILTER (WHERE replied_at IS NULL) as pending_replies FROM portal_messages WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, portal_users: p.rows[0], appointments: a.rows[0], messages: m.rows[0] });
    } catch (err) { console.error('GET /api/portal2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['users', 'appointments', 'messages', 'settings', 'queue-ads', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
