'use strict';
// Wave 90 — Audit Query: read-only hash-chained audit trail inspection
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'audit-query',
        endpoints: [
            'GET /entries',
            'GET /entries/:id',
            'GET /entries/user/:userId',
            'GET /entries/module/:module',
            'GET /entries/record/:recordId',
            'GET /chain-integrity',
            'GET /actions',
            'GET /modules',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/entries', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, module, action, record_id, from_date, to_date, limit = 100, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, user_id, username, user_name, action, module, record_id, ip_address, chain_idx, created_at
                   FROM audit_trail WHERE tenant_id = $1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(user_id); }
        if (module) { sql += ` AND module = $${params.length + 1}`; params.push(module); }
        if (action) { sql += ` AND action = $${params.length + 1}`; params.push(action); }
        if (record_id) { sql += ` AND record_id = $${params.length + 1}`; params.push(record_id); }
        if (from_date) { sql += ` AND created_at >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND created_at <= $${params.length + 1}`; params.push(to_date); }
        sql += ` ORDER BY chain_idx DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/entries/:id', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM audit_trail WHERE tenant_id = $1 AND id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'entry_not_found' });
        res.json({ ok: true, entry: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/entries/user/:userId', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT id, action, module, record_id, ip_address, created_at FROM audit_trail
             WHERE tenant_id = $1 AND user_id = $2 ORDER BY created_at DESC LIMIT 100`,
            [req.tenantId, req.params.userId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/entries/module/:module', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT id, user_id, username, action, record_id, ip_address, created_at FROM audit_trail
             WHERE tenant_id = $1 AND module = $2 ORDER BY created_at DESC LIMIT 200`,
            [req.tenantId, req.params.module]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/entries/record/:recordId', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT id, user_id, username, action, module, old_values, new_values, ip_address, created_at FROM audit_trail
             WHERE tenant_id = $1 AND record_id = $2 ORDER BY created_at ASC`,
            [req.tenantId, req.params.recordId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/chain-integrity', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT chain_idx, row_hash FROM audit_trail WHERE tenant_id = $1 ORDER BY chain_idx DESC LIMIT 1`,
            [req.tenantId]
        );
        if (!r.rows.length) return res.json({ ok: true, integrity: 'empty', latest_chain_idx: null, latest_hash: null });
        const latest = r.rows[0];
        res.json({ ok: true, latest_chain_idx: latest.chain_idx, latest_hash: latest.row_hash, note: 'Use hash-verification utility to validate chain. This endpoint exposes only the latest entry for diagnostic checks.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/actions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT action, COUNT(*) AS count FROM audit_trail WHERE tenant_id = $1 GROUP BY action ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, actions: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/modules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT module, COUNT(*) AS count FROM audit_trail WHERE tenant_id = $1 GROUP BY module ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, modules: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_entries, COUNT(DISTINCT user_id) AS unique_users,
                    COUNT(DISTINCT module) AS unique_modules, MIN(created_at) AS first_entry, MAX(created_at) AS last_entry,
                    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS last_24h
             FROM audit_trail WHERE tenant_id = $1`,
            [req.tenantId]
        );
        res.json({ ok: true, summary: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
