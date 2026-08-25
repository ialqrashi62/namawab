'use strict';
// Wave 98 — Supply Chain: batch/FEFO expiry + movements + cold-chain + stock counts
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_MOVEMENT = ['receive','dispense','transfer','adjust','return','dispose','expired','wastage'];
const VALID_BATCH_STATUS = ['active','quarantine','expired','depleted','recalled'];

function daysUntil(date) {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function expiryStatus(daysToExpiry) {
    if (daysToExpiry === null) return 'unknown';
    if (daysToExpiry < 0) return 'expired';
    if (daysToExpiry <= 30) return 'critical';
    if (daysToExpiry <= 90) return 'warning';
    return 'ok';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'supply-chain',
        endpoints: [
            'GET /batches',
            'GET /batches/:id',
            'POST /batches',
            'GET /batches/expiring',
            'GET /batches/expired',
            'GET /movements',
            'POST /movements',
            'GET /movements/item/:itemId',
            'GET /stock-counts',
            'POST /stock-counts',
            'GET /metrics/reorder-alerts',
            'GET /metrics/cold-chain-alerts',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== BATCHES =====
router.get('/batches', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT b.*, i.name AS item_name, i.code AS item_code FROM inventory_batches b
                   LEFT JOIN inventory_items i ON i.id = b.item_id WHERE b.tenant_id = $1`;
        if (item_id) { sql += ` AND b.item_id = $${params.length + 1}`; params.push(item_id); }
        if (status) { sql += ` AND b.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY b.expiry_date ASC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => {
            const daysToExpiry = daysUntil(x.expiry_date);
            return { ...x, days_to_expiry: daysToExpiry, expiry_status: expiryStatus(daysToExpiry) };
        });
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/batches/:id', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT b.*, i.name AS item_name, i.code AS item_code FROM inventory_batches b
             LEFT JOIN inventory_items i ON i.id = b.item_id WHERE b.tenant_id = $1 AND b.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'batch_not_found' });
        const daysToExpiry = daysUntil(r.rows[0].expiry_date);
        res.json({ ok: true, batch: r.rows[0], days_to_expiry: daysToExpiry, expiry_status: expiryStatus(daysToExpiry) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/batches', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, lot_number, expiry_date, qty_received, unit_cost } = req.body;
        if (!item_id) return res.status(400).json({ ok: false, error: 'item_id_required' });
        if (!lot_number) return res.status(400).json({ ok: false, error: 'lot_number_required' });
        if (!qty_received || qty_received <= 0) return res.status(400).json({ ok: false, error: 'qty_received_positive' });

        const r = await db.query(
            `INSERT INTO inventory_batches (item_id, lot_number, expiry_date, qty_received, qty_on_hand, unit_cost, received_at, status, tenant_id)
             VALUES ($1,$2,$3,$4,$4,$5,NOW(),'active',$6) RETURNING *`,
            [item_id, lot_number, expiry_date || null, qty_received, unit_cost || 0, req.tenantId]
        );
        const daysToExpiry = daysUntil(r.rows[0].expiry_date);
        res.status(201).json({ ok: true, batch: r.rows[0], days_to_expiry: daysToExpiry, expiry_status: expiryStatus(daysToExpiry) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/batches/expiring', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { days = 90 } = req.query;
        const r = await db.query(
            `SELECT b.*, i.name AS item_name FROM inventory_batches b LEFT JOIN inventory_items i ON i.id = b.item_id
             WHERE b.tenant_id = $1 AND b.status = 'active' AND b.expiry_date IS NOT NULL
               AND b.expiry_date <= NOW() + ($2 || ' days')::INTERVAL
             ORDER BY b.expiry_date ASC LIMIT 200`,
            [req.tenantId, days]
        );
        const enriched = r.rows.map(x => {
            const d = daysUntil(x.expiry_date);
            return { ...x, days_to_expiry: d, expiry_status: expiryStatus(d) };
        });
        res.json({ ok: true, threshold_days: parseInt(days), count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/batches/expired', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT b.*, i.name AS item_name FROM inventory_batches b LEFT JOIN inventory_items i ON i.id = b.item_id
             WHERE b.tenant_id = $1 AND b.expiry_date IS NOT NULL AND b.expiry_date < NOW()
             ORDER BY b.expiry_date ASC LIMIT 200`,
            [req.tenantId]
        );
        const enriched = r.rows.map(x => ({ ...x, days_since_expiry: x.expiry_date ? Math.floor((Date.now() - new Date(x.expiry_date).getTime()) / 86400000) : null }));
        res.json({ ok: true, count: enriched.length, rows: enriched, action_required: 'Quarantine and dispose of expired batches per regulatory protocol.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MOVEMENTS =====
router.get('/movements', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, batch_id, movement_type, from_date, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT m.*, i.name AS item_name, u.full_name AS created_by_name FROM inventory_movements m
                   LEFT JOIN inventory_items i ON i.id = m.item_id LEFT JOIN users u ON u.id = m.created_by WHERE m.tenant_id = $1`;
        if (item_id) { sql += ` AND m.item_id = $${params.length + 1}`; params.push(item_id); }
        if (batch_id) { sql += ` AND m.batch_id = $${params.length + 1}`; params.push(batch_id); }
        if (movement_type) { sql += ` AND m.movement_type = $${params.length + 1}`; params.push(movement_type); }
        if (from_date) { sql += ` AND m.created_at >= $${params.length + 1}`; params.push(from_date); }
        sql += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/movements', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, batch_id, movement_type, qty_delta, reason, ref_table, ref_id, created_by } = req.body;
        if (!item_id) return res.status(400).json({ ok: false, error: 'item_id_required' });
        if (!movement_type) return res.status(400).json({ ok: false, error: 'movement_type_required' });
        if (!VALID_MOVEMENT.includes(movement_type)) return res.status(400).json({ ok: false, error: 'invalid_movement_type' });
        if (qty_delta === undefined || qty_delta === 0) return res.status(400).json({ ok: false, error: 'qty_delta_nonzero' });

        const current = await db.query(`SELECT COALESCE(SUM(qty_delta), 0) AS balance FROM inventory_movements WHERE tenant_id = $1 AND item_id = $2`, [req.tenantId, item_id]);
        const balance_after = parseInt(current.rows[0].balance) + parseInt(qty_delta);
        if (balance_after < 0) return res.status(400).json({ ok: false, error: 'insufficient_stock', current_balance: parseInt(current.rows[0].balance) });

        const r = await db.query(
            `INSERT INTO inventory_movements (item_id, batch_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [item_id, batch_id || null, movement_type, qty_delta, balance_after, ref_table || null, ref_id || null, reason || null,
             created_by || req.user?.id || null, req.tenantId]
        );
        if (batch_id) {
            await db.query(
                `UPDATE inventory_batches SET qty_on_hand = GREATEST(0, qty_on_hand + $2) WHERE tenant_id = $1 AND id = $3`,
                [req.tenantId, qty_delta, batch_id]
            );
        }
        res.status(201).json({ ok: true, movement: r.rows[0], balance_after });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/movements/item/:itemId', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM inventory_movements WHERE tenant_id = $1 AND item_id = $2 ORDER BY created_at DESC LIMIT 100`,
            [req.tenantId, req.params.itemId]
        );
        const totalIn = r.rows.filter(x => x.qty_delta > 0).reduce((a, b) => a + parseInt(b.qty_delta), 0);
        const totalOut = r.rows.filter(x => x.qty_delta < 0).reduce((a, b) => a + Math.abs(parseInt(b.qty_delta)), 0);
        res.json({ ok: true, count: r.rows.length, total_in: totalIn, total_out: totalOut, current_balance: totalIn - totalOut, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STOCK COUNTS =====
router.get('/stock-counts', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, from_date, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, i.name AS item_name FROM inventory_stock_count c LEFT JOIN inventory_items i ON i.id = c.item_id WHERE c.tenant_id = $1`;
        if (item_id) { sql += ` AND c.item_id = $${params.length + 1}`; params.push(item_id); }
        if (from_date) { sql += ` AND c.count_date >= $${params.length + 1}`; params.push(from_date); }
        sql += ` ORDER BY c.count_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/stock-counts', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { item_id, counted_qty, system_qty, count_date = new Date(), counted_by } = req.body;
        if (!item_id) return res.status(400).json({ ok: false, error: 'item_id_required' });
        if (counted_qty === undefined) return res.status(400).json({ ok: false, error: 'counted_qty_required' });
        const difference = parseInt(counted_qty) - (parseInt(system_qty) || 0);
        const r = await db.query(
            `INSERT INTO inventory_stock_count (item_id, counted_qty, system_qty, difference, count_date, counted_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [item_id, counted_qty, system_qty || 0, difference, count_date, counted_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, count: r.rows[0], discrepancy: difference });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SUPPLY CHAIN METRICS =====
router.get('/metrics/reorder-alerts', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT m.*, i.name AS item_name, i.code AS item_code FROM supply_chain_metrics m
             LEFT JOIN inventory_items i ON i.id = m.item_id
             WHERE m.tenant_id = $1 AND m.reorder_point_reached = true ORDER BY m.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/metrics/cold-chain-alerts', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT m.*, i.name AS item_name FROM supply_chain_metrics m LEFT JOIN inventory_items i ON i.id = m.item_id
             WHERE m.tenant_id = $1 AND m.temp_deviation_alert = true ORDER BY m.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Cold-chain temperature deviation detected. Investigate immediately.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const batches = await db.query(
            `SELECT status, COUNT(*) AS count FROM inventory_batches WHERE tenant_id = $1 GROUP BY status`,
            [req.tenantId]
        );
        const expiring = await db.query(
            `SELECT COUNT(*) AS expiring_90d FROM inventory_batches WHERE tenant_id = $1 AND status = 'active' AND expiry_date <= NOW() + INTERVAL '90 days'`,
            [req.tenantId]
        );
        const movements = await db.query(
            `SELECT movement_type, COUNT(*) AS count, SUM(qty_delta) AS total_qty FROM inventory_movements
             WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY movement_type`,
            [req.tenantId]
        );
        res.json({ ok: true, batches: batches.rows, expiring_90d: expiring.rows[0].expiring_90d, movements_90d: movements.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
