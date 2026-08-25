// filepath: namaweb/messaging_router.js
// Internal secure messaging between staff.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/messaging/inbox
router.get('/inbox', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { is_read } = req.query;
        const conditions = ['tenant_id = $1', 'receiver_id = $2'];
        const params = [req.tenantId, req.userId];
        if (is_read === 'true') conditions.push('is_read = true');
        if (is_read === 'false') conditions.push('is_read = false');
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, sender_id, subject, body, priority, is_read, created_at
            FROM internal_messages WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/messaging/inbox', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/messaging/sent
router.get('/sent', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, receiver_id, subject, body, priority, is_read, created_at
            FROM internal_messages WHERE tenant_id = $1 AND sender_id = $2
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.userId]);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/messaging/sent', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/messaging/unread — unread + urgent
router.get('/unread', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, sender_id, subject, priority, created_at FROM internal_messages
            WHERE tenant_id = $1 AND receiver_id = $2 AND is_read = false
            ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
                     created_at LIMIT 50
        `, [req.tenantId, req.userId]);
        res.json({ ok: true, total: r.rows.length, messages: r.rows });
    } catch (err) { console.error('GET /api/messaging/unread', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/messaging/send
router.post('/send', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { receiver_id, subject, body, priority } = req.body;
        if (!receiver_id || !subject || !body) return res.status(400).json({ error: 'missing_required', required: ['receiver_id', 'subject', 'body'] });
        const r = await db.query(`
            INSERT INTO internal_messages (tenant_id, sender_id, receiver_id, subject, body, priority, is_read)
            VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id, created_at
        `, [req.tenantId, req.userId, receiver_id, subject, body, priority || 'normal']);
        res.status(201).json({ ok: true, id: r.rows[0].id, created_at: r.rows[0].created_at });
    } catch (err) { console.error('POST /api/messaging/send', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/messaging/:id/read
router.post('/:id/read', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE internal_messages SET is_read = true
            WHERE id = $1 AND tenant_id = $2 AND receiver_id = $3 RETURNING id, is_read
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_recipient' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/messaging/:id/read', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/messaging/broadcast — send to all doctors/nurses
router.post('/broadcast', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { subject, body, audience, priority } = req.body;
        if (!subject || !body) return res.status(400).json({ error: 'missing_required', required: ['subject', 'body'] });
        // Fetch receivers
        const roleFilter = audience === 'doctors' ? 'doctor' : audience === 'nurses' ? 'nurse' : null;
        const r = await db.query(roleFilter ?
            `SELECT id FROM users WHERE tenant_id = $1 AND role = $2` :
            `SELECT id FROM users WHERE tenant_id = $1`, roleFilter ? [req.tenantId, roleFilter] : [req.tenantId]);
        let sent = 0;
        for (const u of r.rows) {
            await db.query(`
                INSERT INTO internal_messages (tenant_id, sender_id, receiver_id, subject, body, priority, is_read)
                VALUES ($1, $2, $3, $4, $5, $6, false)
            `, [req.tenantId, req.userId, u.id, subject, body, priority || 'normal']);
            sent++;
        }
        res.status(201).json({ ok: true, sent });
    } catch (err) { console.error('POST /api/messaging/broadcast', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/messaging/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const inbox = await db.query(`
            SELECT COUNT(*) FILTER (WHERE receiver_id = $2 AND is_read = false) as unread,
                   COUNT(*) FILTER (WHERE receiver_id = $2) as inbox_total
            FROM internal_messages WHERE tenant_id = $1
        `, [req.tenantId, req.userId]);
        const sent = await db.query(`
            SELECT COUNT(*) as sent_total FROM internal_messages
            WHERE tenant_id = $1 AND sender_id = $2
        `, [req.tenantId, req.userId]);
        res.json({ ok: true, inbox: inbox.rows[0], sent: sent.rows[0] });
    } catch (err) { console.error('GET /api/messaging/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['inbox', 'sent', 'unread', 'send', 'read', 'broadcast', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
