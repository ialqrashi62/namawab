// filepath: namaweb/vendor_router.js
// Vendor + Purchase Order management.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/vendor?is_active=true&is_approved=true
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist', 'finance'), async (req, res) => {
    try {
        const { is_active, is_approved, vendor_type, q } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (is_active === 'true') conditions.push('is_active = true');
        if (is_active === 'false') conditions.push('is_active = false');
        if (is_approved === 'true') conditions.push('is_approved = true');
        if (is_approved === 'false') conditions.push('is_approved = false');
        if (vendor_type) { params.push(vendor_type); conditions.push(`vendor_type = $${params.length}`); }
        if (q) { params.push(`%${q}%`); conditions.push(`(vendor_name_en ILIKE $${params.length} OR vendor_name_ar ILIKE $${params.length} OR vendor_code ILIKE $${params.length})`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, vendor_code, vendor_name_en, vendor_name_ar, vendor_type, contact_person,
                   phone, email, vat_number, currency, credit_limit, total_outstanding,
                   rating, is_approved, is_active, contract_start, contract_end
            FROM vendors WHERE ${conditions.join(' AND ')}
            ORDER BY vendor_name_en LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, vendors: r.rows });
    } catch (err) { console.error('GET /api/vendor', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/vendor
router.post('/', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist'), async (req, res) => {
    try {
        const { vendor_code, vendor_name_en, vendor_name_ar, vendor_type, contact_person, phone, email, address, city, country, vat_number, commercial_register, iban, bank_name, payment_terms, currency, credit_limit } = req.body;
        if (!vendor_name_en) return res.status(400).json({ error: 'missing_required', required: ['vendor_name_en'] });
        const r = await db.query(`
            INSERT INTO vendors (tenant_id, vendor_code, vendor_name_en, vendor_name_ar, vendor_type, contact_person, phone, email, address, city, country, vat_number, commercial_register, iban, bank_name, payment_terms, currency, credit_limit, is_active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,true) RETURNING id
        `, [req.tenantId, vendor_code || null, vendor_name_en, vendor_name_ar || '', vendor_type || 'general', contact_person || '', phone || '', email || '', address || '', city || '', country || 'SA', vat_number || '', commercial_register || '', iban || '', bank_name || '', payment_terms || 'net_30', currency || 'SAR', credit_limit || 0]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/vendor', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/vendor/:id/approve
router.post('/:id/approve', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE vendors SET is_approved = true, approved_by = $3, approved_at = NOW()
            WHERE id = $1 AND tenant_id = $2 RETURNING id, vendor_name_en, is_approved, approved_at
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/vendor/:id/approve', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/vendor/:id/purchase-history
router.get('/:id/purchase-history', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, po_number, supplier_name, status, total_amount, created_at
            FROM purchase_orders
            WHERE tenant_id = $1 AND supplier_id = $2
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.params.id]);
        const summary = await db.query(`
            SELECT COUNT(*) as total_pos,
                   SUM(total_amount) FILTER (WHERE status IN ('approved', 'received', 'completed')) as total_value,
                   MAX(created_at) as last_purchase_date
            FROM purchase_orders WHERE tenant_id = $1 AND supplier_id = $2
        `, [req.tenantId, req.params.id]);
        res.json({ ok: true, summary: summary.rows[0], purchase_orders: r.rows });
    } catch (err) { console.error('GET /api/vendor/:id/purchase-history', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/purchase-orders?status=pending
router.get('/purchase-orders/list', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist', 'finance'), async (req, res) => {
    try {
        const { status, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, po_number, supplier_id, supplier_name, status, total_amount, notes, created_by, approved_by, approved_at, created_at
            FROM purchase_orders WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, purchase_orders: r.rows });
    } catch (err) { console.error('GET /api/purchase-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/purchase-orders
router.post('/purchase-orders', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { supplier_id, supplier_name, items, notes } = req.body;
        if (!supplier_id || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'missing_required', required: ['supplier_id', 'items[]'] });
        const po_number = 'PO-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);
        const total = items.reduce((sum, it) => sum + (it.qty_ordered || 0) * (it.unit_cost || 0), 0);
        const r = await db.query(`
            INSERT INTO purchase_orders (tenant_id, po_number, supplier_id, supplier_name, status, total_amount, notes, created_by)
            VALUES ($1,$2,$3,$4,'pending',$5,$6,$7) RETURNING id
        `, [req.tenantId, po_number, supplier_id, supplier_name || '', total, notes || '', req.userId]);
        const po_id = r.rows[0].id;
        // Insert line items
        for (const it of items) {
            await db.query(`
                INSERT INTO purchase_order_items (tenant_id, po_id, item_id, qty_ordered, qty_received, unit_cost)
                VALUES ($1,$2,$3,$4,0,$5)
            `, [req.tenantId, po_id, it.item_id || null, it.qty_ordered || 0, it.unit_cost || 0]);
        }
        res.status(201).json({ ok: true, id: po_id, po_number, total_amount: total });
    } catch (err) { console.error('POST /api/purchase-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/purchase-orders/:id/approve
router.post('/purchase-orders/:id/approve', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE purchase_orders SET status = 'approved', approved_by = $3, approved_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status = 'pending' RETURNING id, po_number, status, approved_at
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_pending' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/purchase-orders/:id/approve', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/purchase-orders/:id/receive
router.post('/purchase-orders/:id/receive', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { received_items } = req.body;
        if (!Array.isArray(received_items)) return res.status(400).json({ error: 'missing_required', required: ['received_items[]'] });
        for (const it of received_items) {
            await db.query(`
                UPDATE purchase_order_items SET qty_received = qty_received + $3 WHERE id = $1 AND tenant_id = $2 AND po_id = $4
            `, [it.item_id, req.tenantId, it.qty_received || 0, req.params.id]);
        }
        const r = await db.query(`UPDATE purchase_orders SET status = 'received' WHERE id = $1 AND tenant_id = $2 RETURNING id, status`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/purchase-orders/:id/receive', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/purchase-orders/pending-approval
router.get('/purchase-orders/pending-approval', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, po_number, supplier_name, total_amount, created_by, created_at
            FROM purchase_orders WHERE tenant_id = $1 AND status = 'pending'
            ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, pending: r.rows });
    } catch (err) { console.error('GET /api/purchase-orders/pending-approval', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/purchase-orders/:id/items
router.get('/purchase-orders/:id/items', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, item_id, qty_ordered, qty_received, unit_cost,
                   (qty_ordered - qty_received) as qty_outstanding,
                   (qty_ordered * unit_cost) as line_total
            FROM purchase_order_items
            WHERE tenant_id = $1 AND po_id = $2 ORDER BY id
        `, [req.tenantId, req.params.id]);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/purchase-orders/:id/items', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/vendor/stats
router.get('/stats/summary', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const v = await db.query(`
            SELECT COUNT(*) as total_vendors,
                   COUNT(*) FILTER (WHERE is_approved) as approved_vendors,
                   COUNT(*) FILTER (WHERE is_active) as active_vendors,
                   COUNT(*) FILTER (WHERE contract_end < CURRENT_DATE) as contracts_expired,
                   COUNT(*) FILTER (WHERE contract_end IS NOT NULL AND contract_end BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as contracts_expire_30d,
                   SUM(credit_limit) as total_credit_limit,
                   SUM(total_outstanding) as total_outstanding
            FROM vendors WHERE tenant_id = $1
        `, [req.tenantId]);
        const po = await db.query(`
            SELECT COUNT(*) as total_pos,
                   COUNT(*) FILTER (WHERE status = 'pending') as pending_approval,
                   COUNT(*) FILTER (WHERE status = 'approved') as approved,
                   COUNT(*) FILTER (WHERE status = 'received') as received,
                   SUM(total_amount) FILTER (WHERE status IN ('approved', 'received')) as committed_value
            FROM purchase_orders WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, vendors: v.rows[0], purchase_orders: po.rows[0] });
    } catch (err) { console.error('GET /api/vendor/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'create', 'approve', 'purchase-history', 'purchase-orders', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
