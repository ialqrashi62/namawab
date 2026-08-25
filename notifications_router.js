// filepath: namaweb/notifications_router.js
// Real-time notifications hub.
// REST CRUD over existing `notifications` table + SSE stream for live updates.
// Used by: CDS alerts (critical), new lab results, new appointments, pathway milestones.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// SSE client registry: user_id → Set<res>
const sseClients = new Map();

function broadcast(userId, payload) {
    const clients = sseClients.get(userId);
    if (!clients) return 0;
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    let count = 0;
    for (const res of clients) {
        try { res.write(data); count++; } catch (e) { /* dead client */ }
    }
    return count;
}

function broadcastTenant(tenantId, payload) {
    let count = 0;
    for (const [userId, clients] of sseClients.entries()) {
        const data = `data: ${JSON.stringify(payload)}\n\n`;
        for (const res of clients) {
            try { res.write(data); count++; } catch (e) { /* skip */ }
        }
    }
    return count;
}

// ============================================================
// POST /api/notifications/send
// Body: { user_id?, target_role?, title, message, type, module?, record_id? }
// ============================================================
router.post('/send', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { user_id, target_role, title, title_ar, message, body, body_ar, type, module, record_id } = req.body;
        if (!title || !message) return res.status(400).json({ error: 'missing_required', required: ['title', 'message'] });
        let targetUserId = user_id;
        // If target_role given and no user_id, expand to all matching users in tenant
        if (!targetUserId && target_role) {
            const r = await db.query(`SELECT id FROM users WHERE tenant_id = $1 AND role = $2`, [req.tenantId, target_role]);
            const ids = r.rows.map(x => x.id);
            if (ids.length === 0) return res.status(404).json({ error: 'no_users_match_role' });
            targetUserId = ids;
        }
        if (!targetUserId) return res.status(400).json({ error: 'missing_user_id_or_target_role' });

        if (Array.isArray(targetUserId)) {
            // Bulk insert
            const values = targetUserId.map(uid => `($1, ${uid}, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`).join(', ');
            await db.query(`
                INSERT INTO notifications (tenant_id, user_id, target_role, title, title_ar, message, body, body_ar, type, module, record_id, created_at)
                VALUES ${values}
            `, [req.tenantId, target_role || null, title, title_ar || '', message, body || '', body_ar || '', type || 'info', module || '', record_id || null]);
            for (const uid of targetUserId) broadcast(uid, { type: 'notification', title, message, created_at: new Date().toISOString() });
            res.status(201).json({ ok: true, sent_to: targetUserId.length });
        } else {
            const r = await db.query(`
                INSERT INTO notifications (tenant_id, user_id, target_role, title, title_ar, message, body, body_ar, type, module, record_id, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) RETURNING id
            `, [req.tenantId, targetUserId, target_role || null, title, title_ar || '', message, body || '', body_ar || '', type || 'info', module || '', record_id || null]);
            broadcast(targetUserId, { id: r.rows[0].id, type: 'notification', title, message, created_at: new Date().toISOString() });
            res.status(201).json({ ok: true, id: r.rows[0].id });
        }
    } catch (err) {
        console.error('POST /api/notifications/send', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/notifications?unread_only=true
// ============================================================
router.get('/', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const unreadOnly = req.query.unread_only === 'true';
        const limit = Math.min(+req.query.limit || 50, 200);
        const where = unreadOnly ? 'AND is_read = 0' : '';
        const r = await db.query(`
            SELECT id, title, title_ar, message, body, body_ar, type, module, record_id, is_read, created_at
            FROM notifications
            WHERE tenant_id = $1 AND user_id = $2 ${where}
            ORDER BY created_at DESC LIMIT $3
        `, [req.tenantId, req.userId, limit]);
        const unread = r.rows.filter(x => x.is_read === 0).length;
        res.json({ ok: true, total: r.rows.length, unread, notifications: r.rows });
    } catch (err) {
        console.error('GET /api/notifications', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/notifications/:id/read
// ============================================================
router.post('/:id/read', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE notifications SET is_read = 1 WHERE id = $1 AND tenant_id = $2 AND user_id = $3
            RETURNING id, is_read
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/notifications/read', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/notifications/mark-all-read
// ============================================================
router.post('/mark-all-read', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE notifications SET is_read = 1 WHERE tenant_id = $1 AND user_id = $2 AND is_read = 0
            RETURNING id
        `, [req.tenantId, req.userId]);
        res.json({ ok: true, marked_read: r.rows.length });
    } catch (err) {
        console.error('POST /api/notifications/mark-all-read', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/notifications/stream — Server-Sent Events
// Browser: new EventSource('/api/notifications/stream', { withCredentials: true })
// ============================================================
router.get('/stream', requireAuth, requireTenantScope, (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();
    const uid = req.userId;
    if (!sseClients.has(uid)) sseClients.set(uid, new Set());
    sseClients.get(uid).add(res);
    // Initial heartbeat
    res.write(`: connected ${new Date().toISOString()}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);
    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
        try { res.write(`: hb ${Date.now()}\n\n`); } catch (e) { clearInterval(heartbeat); }
    }, 30000);
    req.on('close', () => {
        clearInterval(heartbeat);
        const set = sseClients.get(uid);
        if (set) {
            set.delete(res);
            if (set.size === 0) sseClients.delete(uid);
        }
    });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    const totalClients = Array.from(sseClients.values()).reduce((s, x) => s + x.size, 0);
    res.json({ ok: true, version: '1.0.0', active_sse_clients: totalClients, endpoints: ['send', 'list', 'read', 'mark-all-read', 'stream'], timestamp: new Date().toISOString() });
});

module.exports = router;