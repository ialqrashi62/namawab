// filepath: namaweb/phz2_router.js
// Pharmacy wholesale + suppliers + sales + opening balances + controlled substances extended.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Suppliers
router.get('/suppliers', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, company_name, contact_person, phone, email, address, tax_number, notes FROM pharmacy_suppliers WHERE tenant_id = $1 ORDER BY company_name`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, suppliers: r.rows });
    } catch (err) { console.error('GET /api/phz2/suppliers', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/suppliers', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist'), async (req, res) => {
    try {
        const { company_name, contact_person, phone, email, address, tax_number, notes } = req.body;
        if (!company_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO pharmacy_suppliers (tenant_id, company_name, contact_person, phone, email, address, tax_number, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, company_name, contact_person || '', phone || '', email || '', address || '', tax_number || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/phz2/suppliers', err); res.status(500).json({ error: 'internal_error' }); }
});

// Purchase orders
router.get('/purchase-orders', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, supplier_id, order_date, total_amount, discount, bonus_value, status, notes, created_at
            FROM pharmacy_purchase_orders WHERE ${conditions.join(' AND ')}
            ORDER BY order_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/phz2/purchase-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/purchase-orders', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { supplier_id, items, discount, notes } = req.body;
        if (!supplier_id || !Array.isArray(items)) return res.status(400).json({ error: 'missing_required' });
        const total = items.reduce((s, it) => s + (it.qty * it.unit_cost || 0), 0);
        const r = await db.query(`
            INSERT INTO pharmacy_purchase_orders (tenant_id, supplier_id, order_date, total_amount, discount, status, notes, created_by)
            VALUES ($1,$2,CURRENT_DATE,$3,COALESCE($4,0),'pending',$5,$6) RETURNING id
        `, [req.tenantId, supplier_id, total, discount, notes || '', req.userName || req.userId]);
        const orderId = r.rows[0].id;
        for (const it of items) {
            await db.query(`
                INSERT INTO pharmacy_purchase_items (tenant_id, purchase_id, drug_id, qty, unit_cost, bonus_qty, discount, expiry_date, batch_number)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `, [req.tenantId, orderId, it.drug_id, it.qty, it.unit_cost, it.bonus_qty || 0, it.discount || 0, it.expiry_date || null, it.batch_number || '']);
        }
        res.status(201).json({ ok: true, id: orderId, total_amount: total });
    } catch (err) { console.error('POST /api/phz2/purchase-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// Sales
router.get('/sales', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin', 'cashier'), async (req, res) => {
    try {
        const { sale_type, payment_method, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (sale_type) { params.push(sale_type); conditions.push(`sale_type = $${params.length}`); }
        if (payment_method) { params.push(payment_method); conditions.push(`payment_method = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share,
                   payment_method, cashier, invoice_number, created_at
            FROM pharmacy_sales WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, sales: r.rows });
    } catch (err) { console.error('GET /api/phz2/sales', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sales', requireAuth, requireTenantScope, requireRole('pharmacist', 'cashier'), async (req, res) => {
    try {
        const { patient_id, sale_type, items, discount, insurance_coverage, payment_method, cashier } = req.body;
        if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'missing_required' });
        const total = items.reduce((s, it) => s + (it.qty * it.unit_price || 0), 0);
        const patient_share = total - (insurance_coverage || 0);
        const r = await db.query(`
            INSERT INTO pharmacy_sales (tenant_id, patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share, payment_method, cashier, invoice_number)
            VALUES ($1, $2, COALESCE($3, 'retail'), $4, COALESCE($5, 0), COALESCE($6, 0), $7, $8, $9, $10) RETURNING id
        `, [req.tenantId, patient_id || null, sale_type, total, discount, insurance_coverage, patient_share, payment_method || 'cash', cashier || req.userName || '', `INV-${Date.now()}`]);
        res.status(201).json({ ok: true, id: r.rows[0].id, total_amount: total, patient_share });
    } catch (err) { console.error('POST /api/phz2/sales', err); res.status(500).json({ error: 'internal_error' }); }
});

// Opening balances (monthly controlled)
router.get('/opening-balances', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { record_date, location } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (record_date) { params.push(record_date); conditions.push(`record_date = $${params.length}`); }
        if (location) { params.push(location); conditions.push(`location = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, drug_name, drug_code, schedule_class, dosage_form, strength, unit, opening_balance,
                   received_qty, dispensed_qty, wasted_qty, closing_balance, discrepancy, location,
                   witnessed_by, verified_by, notes, record_date
            FROM pharmacy_opening_balances WHERE ${conditions.join(' AND ')}
            ORDER BY record_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, balances: r.rows });
    } catch (err) { console.error('GET /api/phz2/opening-balances', err); res.status(500).json({ error: 'internal_error' }); }
});

// Drug batches
router.get('/drug-batches', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_id, drug_name, lot, expiry_date, qty_received, qty_on_hand, cost_price, supplier_id, received_at
            FROM drug_batches WHERE tenant_id = $1 ORDER BY expiry_date ASC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, batches: r.rows });
    } catch (err) { console.error('GET /api/phz2/drug-batches', err); res.status(500).json({ error: 'internal_error' }); }
});

// FEFO (first-expiry-first-out) recommendation for a drug
router.get('/drug-batches/fefo/:drug_id', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, lot, expiry_date, qty_on_hand, received_at
            FROM drug_batches WHERE tenant_id = $1 AND drug_id = $2 AND qty_on_hand > 0
            ORDER BY expiry_date ASC LIMIT 10
        `, [req.tenantId, req.params.drug_id]);
        res.json({ ok: true, total: r.rows.length, batches: r.rows, strategy: 'FEFO' });
    } catch (err) { console.error('GET /api/phz2/fefo', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist'), async (req, res) => {
    try {
        const s = await db.query(`
            SELECT COUNT(*) as total_sales_30d,
                   SUM(total_amount) as total_revenue_30d,
                   SUM(insurance_coverage) as insurance_revenue,
                   SUM(patient_share) as patient_revenue
            FROM pharmacy_sales WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const p = await db.query(`
            SELECT COUNT(*) as purchase_orders,
                   SUM(total_amount) FILTER (WHERE status = 'received') as received_value,
                   SUM(discount) FILTER (WHERE status = 'received') as total_discount
            FROM pharmacy_purchase_orders WHERE tenant_id = $1
        `, [req.tenantId]);
        const b = await db.query(`
            SELECT COUNT(*) as total_batches,
                   COUNT(*) FILTER (WHERE expiry_date <= CURRENT_DATE + INTERVAL '90 days') as expiring_90d,
                   SUM(qty_on_hand) as total_stock
            FROM drug_batches WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, sales_30d: s.rows[0], purchases: p.rows[0], stock: b.rows[0] });
    } catch (err) { console.error('GET /api/phz2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['suppliers', 'purchase-orders', 'sales', 'opening-balances', 'drug-batches', 'fefo', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
