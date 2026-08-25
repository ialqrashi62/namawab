// filepath: namaweb/audit_trail_router.js
// Read-only audit trail viewer.
// Filters by tenant + user + action + date range. No PHI in logs.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/audit-trail?user_id=X&action=Y&from=ISO&to=ISO&limit=N
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), async (req, res) => {
    try {
        const { user_id, action, entity_type, from, to } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (user_id) { params.push(+user_id); conditions.push(`user_id = $${params.length}`); }
        if (action) { params.push(action); conditions.push(`action = $${params.length}`); }
        if (entity_type) { params.push(entity_type); conditions.push(`entity_type = $${params.length}`); }
        if (from) { params.push(from); conditions.push(`created_at >= $${params.length}`); }
        if (to) { params.push(to); conditions.push(`created_at <= $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        // Try common audit_trail column patterns
        let result;
        try {
            result = await db.query(`
                SELECT id, user_id, action, entity_type, entity_id, ip_address, created_at, prev_hash, curr_hash
                FROM audit_trail WHERE ${conditions.join(' AND ')}
                ORDER BY created_at DESC LIMIT $${params.length}
            `, params);
        } catch (colErr) {
            // Fallback to minimal columns
            result = await db.query(`
                SELECT id, user_id, action, created_at FROM audit_trail
                WHERE ${conditions.join(' AND ')}
                ORDER BY created_at DESC LIMIT $${params.length}
            `, params);
        }
        res.json({ ok: true, total: result.rows.length, entries: result.rows });
    } catch (err) {
        console.error('GET /api/audit-trail', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/audit-trail/verify
// Verify hash chain integrity
router.get('/verify', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, prev_hash, curr_hash, created_at FROM audit_trail
            WHERE tenant_id = $1 ORDER BY id ASC LIMIT 1000
        `, [req.tenantId]);
        const entries = result.rows;
        let broken = 0;
        let lastHash = null;
        for (const e of entries) {
            if (lastHash !== null && e.prev_hash !== lastHash) broken++;
            lastHash = e.curr_hash;
        }
        res.json({
            ok: true,
            verified_entries: entries.length,
            broken_chain_count: broken,
            chain_integrity: broken === 0 ? 'INTACT' : 'BROKEN',
            verified_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('GET /api/audit-trail/verify', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/audit-trail/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT action, COUNT(*) as cnt,
                   COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as last_24h,
                   COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as last_7d
            FROM audit_trail WHERE tenant_id = $1
            GROUP BY action ORDER BY cnt DESC LIMIT 20
        `, [req.tenantId]);
        res.json({ ok: true, actions: result.rows });
    } catch (err) {
        console.error('GET /api/audit-trail/stats', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'verify', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;