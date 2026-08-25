// filepath: namaweb/inventory_router.js
// Inventory overview + stock levels + reorder alerts.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/items', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const { low_stock, category, q } = req.query;
        const conditions = ['tenant_id = $1', 'is_active = true'];
        const params = [req.tenantId];
        if (low_stock === 'true') conditions.push('(reorder_point IS NOT NULL AND stock_qty <= reorder_point)');
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (q) { params.push(`%${q}%`); conditions.push(`(item_name ILIKE $${params.length} OR item_code ILIKE $${params.length} OR barcode ILIKE $${params.length})`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, item_code, item_name, barcode, category, unit, cost_price,
                   stock_qty, min_qty, reorder_point
            FROM inventory_items
            WHERE ${conditions.join(' AND ')}
            ORDER BY item_name LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/inventory/items', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/low-stock', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, item_code, item_name, category, stock_qty, unit, reorder_point,
                   (reorder_point - stock_qty) as shortage
            FROM inventory_items
            WHERE tenant_id = $1 AND is_active = true
              AND reorder_point IS NOT NULL AND stock_qty <= reorder_point
            ORDER BY (reorder_point - stock_qty) DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/inventory/low-stock', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                COUNT(*) as total_items,
                COUNT(*) FILTER (WHERE stock_qty > 0) as in_stock,
                COUNT(*) FILTER (WHERE stock_qty = 0) as out_of_stock,
                COUNT(*) FILTER (WHERE reorder_point IS NOT NULL AND stock_qty <= reorder_point) as low_stock,
                COUNT(*) FILTER (WHERE stock_qty < min_qty) as below_min,
                SUM(stock_qty * cost_price) as total_value
            FROM inventory_items WHERE tenant_id = $1 AND is_active = true
        `, [req.tenantId]);
        const byCat = await db.query(`
            SELECT COALESCE(category, 'uncategorized') as category, COUNT(*) as items, SUM(stock_qty) as total_qty
            FROM inventory_items WHERE tenant_id = $1 AND is_active = true
            GROUP BY category ORDER BY items DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_category: byCat.rows });
    } catch (err) { console.error('GET /api/inventory/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stock-counts', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, count_date, counted_by, status, total_items, total_variance
            FROM inventory_stock_counts
            WHERE tenant_id = $1 ORDER BY count_date DESC LIMIT 50
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, counts: r.rows });
    } catch (err) { console.error('GET /api/inventory/stock-counts', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/purchases', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, purchase_number, supplier_name, purchase_date, total_amount, status, created_by
            FROM inventory_purchases
            WHERE tenant_id = $1 AND purchase_date >= CURRENT_DATE - $2
            ORDER BY purchase_date DESC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, purchases: r.rows });
    } catch (err) { console.error('GET /api/inventory/purchases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['items', 'low-stock', 'stats', 'stock-counts', 'purchases'], timestamp: new Date().toISOString() });
});

module.exports = router;
