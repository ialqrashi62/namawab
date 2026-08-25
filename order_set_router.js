// filepath: namaweb/order_set_router.js
// Order set library (pre-bundled order templates for common conditions).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/order-set?q=sepsis
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { q } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (q) { params.push(`%${q}%`); conditions.push(`name ILIKE $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, name, items_json, created_at
            FROM order_sets
            WHERE ${conditions.join(' AND ')}
            ORDER BY name LIMIT $${params.length}
        `, params);
        // Parse items_json for each
        const result = r.rows.map(row => ({
            id: row.id,
            name: row.name,
            items: (() => { try { return JSON.parse(row.items_json || '[]'); } catch (e) { return []; } })(),
            item_count: (() => { try { return JSON.parse(row.items_json || '[]').length; } catch (e) { return 0; } })(),
            created_at: row.created_at
        }));
        res.json({ ok: true, total: result.length, order_sets: result });
    } catch (err) { console.error('GET /api/order-set', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/order-set/:id
router.get('/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, name, items_json, created_at FROM order_sets WHERE id = $1 AND tenant_id = $2
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        const row = r.rows[0];
        let items = [];
        try { items = JSON.parse(row.items_json || '[]'); } catch (e) {}
        res.json({ ok: true, id: row.id, name: row.name, items, created_at: row.created_at });
    } catch (err) { console.error('GET /api/order-set/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/order-set
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { name, items } = req.body;
        if (!name || !Array.isArray(items)) return res.status(400).json({ error: 'missing_required', required: ['name', 'items (array)'] });
        const r = await db.query(`
            INSERT INTO order_sets (tenant_id, name, items_json)
            VALUES ($1,$2,$3) RETURNING id
        `, [req.tenantId, name, JSON.stringify(items)]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/order-set', err); res.status(500).json({ error: 'internal_error' }); }
});

// DELETE /api/order-set/:id
router.delete('/:id', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(`DELETE FROM order_sets WHERE id = $1 AND tenant_id = $2 RETURNING id`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, deleted: r.rows[0].id });
    } catch (err) { console.error('DELETE /api/order-set/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'get', 'create', 'delete'], timestamp: new Date().toISOString() });
});

module.exports = router;
