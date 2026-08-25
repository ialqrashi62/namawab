// filepath: namaweb/inventory_proc_router.js
// Inventory + procurement: items, batches, movements, purchases, dept issue, stock counts.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- Items ---
router.get('/items', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { search, category, low_stock_only } = req.query;
        let sql = `SELECT id, item_name, item_code, barcode, category, unit, cost_price, stock_qty, min_qty, is_active, reorder_point FROM inventory_items WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (search) { params.push(`%${search}%`); sql += ` AND (item_name ILIKE $${params.length} OR item_code ILIKE $${params.length} OR barcode = '${String(search).replace(/'/g, '')}')`; }
        if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
        if (low_stock_only === 'true') sql += ` AND stock_qty <= min_qty`;
        sql += ` ORDER BY item_name LIMIT 500`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/inv/items', err); res.status(500).json({ error: 'internal_error' }); }
});

// Batches (lot/expiry tracking)
router.get('/batches/:item_id', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, lot_number, expiry_date, qty_received, qty_on_hand, unit_cost, received_at, status FROM inventory_batches WHERE tenant_id = $1 AND item_id = $2 ORDER BY expiry_date ASC`, [req.tenantId, req.params.item_id]);
        res.json({ ok: true, total: r.rows.length, batches: r.rows });
    } catch (err) { console.error('GET /api/inv/batches', err); res.status(500).json({ error: 'internal_error' }); }
});

// Movement (any positive/negative change with reason + reference)
router.post('/movement', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const { item_id, batch_id, movement_type, qty_delta, ref_table, ref_id, reason } = req.body;
        if (!item_id || !movement_type || qty_delta == null) return res.status(400).json({ error: 'missing_required' });
        const balance = await db.query(`SELECT COALESCE(stock_qty, 0) as bal FROM inventory_items WHERE tenant_id = $1 AND id = $2`, [req.tenantId, item_id]);
        const prev = +(balance.rows[0]?.bal || 0);
        const balanceAfter = prev + +qty_delta;
        const r = await db.query(`INSERT INTO inventory_movements (tenant_id, item_id, batch_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, balance_after`, [req.tenantId, item_id, batch_id || null, movement_type, qty_delta, balanceAfter, ref_table || '', ref_id || null, reason || '', req.userName || '']);
        await db.query(`UPDATE inventory_items SET stock_qty = GREATEST(0, COALESCE(stock_qty, 0) + $2) WHERE tenant_id = $1 AND id = $3`, [req.tenantId, qty_delta, item_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id, balance_after: r.rows[0].balance_after });
    } catch (err) { console.error('POST /api/inv/movement', err); res.status(500).json({ error: 'internal_error' }); }
});

// Recent movements for an item (audit trail)
router.get('/movements/:item_id', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, created_at FROM inventory_movements WHERE tenant_id = $1 AND item_id = $2 ORDER BY created_at DESC LIMIT 100`, [req.tenantId, req.params.item_id]);
        res.json({ ok: true, total: r.rows.length, movements: r.rows });
    } catch (err) { console.error('GET /api/inv/movements', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Purchase orders ---
router.post('/purchases', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'admin', 'procurement'), async (req, res) => {
    try {
        const { supplier_id, total_amount, notes, items } = req.body;
        if (!supplier_id) return res.status(400).json({ error: 'supplier_required' });
        const r = await db.query(`INSERT INTO inventory_purchases (tenant_id, supplier_id, total_amount, status, notes) VALUES ($1, $2, $3, 'pending', $4) RETURNING id`, [req.tenantId, supplier_id, total_amount || 0, notes || '']);
        const purchaseId = r.rows[0].id;
        if (Array.isArray(items) && items.length) {
            for (const it of items) {
                await db.query(`INSERT INTO inventory_purchase_items (tenant_id, purchase_id, item_id, qty, unit_cost) VALUES ($1, $2, $3, $4, $5)`, [req.tenantId, purchaseId, it.item_id, it.qty, it.unit_cost]);
            }
        }
        res.status(201).json({ ok: true, id: purchaseId, items_logged: (items || []).length });
    } catch (err) { console.error('POST /api/inv/purchases', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/purchases/:id/receive', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE inventory_purchases SET status = 'received' WHERE tenant_id = $1 AND id = $2 RETURNING id`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/inv/purchases/receive', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Department issue (internal requisition) ---
router.post('/issue', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'nurse', 'admin'), async (req, res) => {
    try {
        const { department, issued_by, issue_date, notes } = req.body;
        if (!department || !issued_by) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO inventory_issue_to_dept (tenant_id, department, issued_by, issue_date, status, notes) VALUES ($1, $2, $3, COALESCE($4, NOW()), 'issued', $5) RETURNING id`, [req.tenantId, department, issued_by, issue_date || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/inv/issue', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Stock count (cycle count + variance reconciliation) ---
router.post('/stock-count', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'admin'), async (req, res) => {
    try {
        const { item_id, batch_id, system_qty, counted_qty, counted_by, count_date, notes } = req.body;
        if (!item_id || counted_qty == null) return res.status(400).json({ error: 'missing_required' });
        const diff = +counted_qty - (+system_qty || 0);
        const r = await db.query(`INSERT INTO inventory_stock_counts (tenant_id, item_id, batch_id, system_qty, counted_qty, difference, reconciled, counted_by, count_date, notes) VALUES ($1,$2,$3,$4,$5,$6,false,$7,$8,$9) RETURNING id`, [req.tenantId, item_id, batch_id || null, system_qty || 0, counted_qty, diff, counted_by || req.userName || '', count_date || new Date().toISOString().slice(0, 10), notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, difference: diff, needs_reconciliation: diff !== 0 });
    } catch (err) { console.error('POST /api/inv/stock-count', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/stock-count/:id/reconcile', requireAuth, requireTenantScope, requireRole('inventory_clerk', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE inventory_stock_counts SET reconciled = true WHERE tenant_id = $1 AND id = $2 RETURNING item_id, difference`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        // Auto-adjust stock to match counted quantity
        await db.query(`UPDATE inventory_items SET stock_qty = GREATEST(0, stock_qty + $2) WHERE tenant_id = $1 AND id = $3`, [req.tenantId, r.rows[0].difference, r.rows[0].item_id]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/inv/stock-count/reconcile', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/valuation', requireAuth, requireTenantScope, requireRole('admin', 'inventory_clerk', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`SELECT COUNT(*) as item_count, ROUND(SUM(stock_qty * COALESCE(cost_price,0))::numeric, 2) as total_value, SUM(stock_qty <= min_qty) as low_stock_count FROM inventory_items WHERE tenant_id = $1 AND is_active = true`, [req.tenantId]);
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('GET /api/inv/valuation', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['items', 'batches', 'movement', 'movements', 'purchases', 'issue', 'stock-count', 'reconcile', 'valuation'], timestamp: new Date().toISOString() });
});

module.exports = router;
