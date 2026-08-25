// filepath: namaweb/pharmacy_router.js
// Pharmacy: prescriptions + dispensing + controlled substances.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/pharmacy/queue — prescriptions awaiting dispense
router.get('/queue', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        else conditions.push(`status = 'pending'`);
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, prescription_id, patient_id, doctor_id, clinic_name, medication_name, dosage,
                   quantity_per_day, frequency, duration, price, payment_method, status, created_at
            FROM pharmacy_prescriptions_queue WHERE ${conditions.join(' AND ')}
            ORDER BY created_at ASC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, prescriptions: r.rows });
    } catch (err) { console.error('GET /api/pharmacy/queue', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/pharmacy/dispense — dispense medication
router.post('/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { prescription_id, patient_id, drug_id, drug_name, drug_batch_id, qty } = req.body;
        if (!prescription_id || !qty) return res.status(400).json({ error: 'missing_required', required: ['prescription_id', 'qty'] });
        // Record dispense
        const r = await db.query(`
            INSERT INTO pharmacy_dispense (tenant_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, status, dispensed_by, dispensed_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,'dispensed',$8,NOW()) RETURNING id
        `, [req.tenantId, prescription_id, patient_id, drug_id || null, drug_batch_id || null, drug_name || '', qty, req.userId]);
        // Update prescription status
        await db.query(`UPDATE pharmacy_prescriptions_queue SET status = 'dispensed' WHERE tenant_id = $1 AND prescription_id = $2`, [req.tenantId, prescription_id]);
        res.status(201).json({ ok: true, dispense_id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pharmacy/dispense', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/pharmacy/controlled — controlled substance log
router.get('/controlled', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin', 'quality'), async (req, res) => {
    try {
        const { schedule, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (schedule) { params.push(schedule); conditions.push(`schedule_class = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, drug_id, drug_name, prescription_id, dispense_id, patient_id,
                   qty, balance_before, balance_after, schedule_class, dispensed_by, witnessed_by, at
            FROM controlled_drug_log WHERE ${conditions.join(' AND ')}
            ORDER BY at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, log: r.rows });
    } catch (err) { console.error('GET /api/pharmacy/controlled', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/pharmacy/controlled — log controlled transaction
router.post('/controlled', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { drug_id, drug_name, drug_batch_id, prescription_id, dispense_id, patient_id, qty, balance_before, schedule_class, witnessed_by } = req.body;
        if (!drug_id || !qty || !schedule_class || !witnessed_by) return res.status(400).json({ error: 'missing_required', required: ['drug_id', 'qty', 'schedule_class', 'witnessed_by'] });
        const balance_after = balance_before - qty;
        const r = await db.query(`
            INSERT INTO controlled_drug_log (tenant_id, drug_id, drug_name, drug_batch_id, prescription_id, dispense_id, patient_id, qty, balance_before, balance_after, schedule_class, dispensed_by, witnessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id, balance_after
        `, [req.tenantId, drug_id, drug_name || '', drug_batch_id || null, prescription_id || null, dispense_id || null, patient_id || null, qty, balance_before || 0, balance_after, schedule_class, req.userId, witnessed_by]);
        res.status(201).json({ ok: true, id: r.rows[0].id, balance_after: r.rows[0].balance_after });
    } catch (err) { console.error('POST /api/pharmacy/controlled', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/pharmacy/controlled/balance/:drug_id
router.get('/controlled/balance/:drug_id', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT balance_after FROM controlled_drug_log
            WHERE tenant_id = $1 AND drug_id = $2 ORDER BY at DESC LIMIT 1
        `, [req.tenantId, req.params.drug_id]);
        const balance = r.rows.length > 0 ? r.rows[0].balance_after : 0;
        res.json({ ok: true, drug_id: +req.params.drug_id, current_balance: balance });
    } catch (err) { console.error('GET /api/pharmacy/controlled/balance', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/pharmacy/catalog?q=paracetamol
router.get('/catalog', requireAuth, requireTenantScope, requireRole('pharmacist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { q, category, is_controlled } = req.query;
        const conditions = ['tenant_id = $1', 'is_active = true'];
        const params = [req.tenantId];
        if (q) { params.push(`%${q}%`); conditions.push(`(drug_name ILIKE $${params.length} OR active_ingredient ILIKE $${params.length} OR barcode ILIKE $${params.length})`); }
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (is_controlled === 'true') conditions.push('is_controlled = true');
        if (is_controlled === 'false') conditions.push('is_controlled = false');
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, drug_name, active_ingredient, barcode, category, unit, strength,
                   selling_price, cost_price, stock_qty, expiry_date, is_controlled, schedule_class
            FROM pharmacy_drug_catalog WHERE ${conditions.join(' AND ')}
            ORDER BY drug_name LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, drugs: r.rows });
    } catch (err) { console.error('GET /api/pharmacy/catalog', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/pharmacy/low-stock — below threshold
router.get('/low-stock', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, stock_qty, min_qty, category
            FROM pharmacy_drug_catalog
            WHERE tenant_id = $1 AND is_active = true AND stock_qty < min_qty
            ORDER BY stock_qty ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/pharmacy/low-stock', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/pharmacy/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const queue = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   COUNT(*) FILTER (WHERE status = 'dispensed') as dispensed,
                   COUNT(*) FILTER (WHERE verified_by IS NOT NULL) as verified,
                   COUNT(*) FILTER (WHERE verified_at >= CURRENT_DATE) as verified_today,
                   COUNT(*) as total
            FROM pharmacy_prescriptions_queue WHERE tenant_id = $1
        `, [req.tenantId]);
        const catalog = await db.query(`
            SELECT COUNT(*) as total_drugs,
                   COUNT(*) FILTER (WHERE is_controlled) as controlled,
                   COUNT(*) FILTER (WHERE stock_qty < min_qty) as low_stock,
                   COUNT(*) FILTER (WHERE expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '30 days') as expiring_30d
            FROM pharmacy_drug_catalog WHERE tenant_id = $1 AND is_active = true
        `, [req.tenantId]);
        const ctl = await db.query(`
            SELECT schedule_class, COUNT(*) as transactions_today, SUM(qty) as total_qty_today
            FROM controlled_drug_log
            WHERE tenant_id = $1 AND at >= CURRENT_DATE GROUP BY schedule_class
        `, [req.tenantId]);
        res.json({ ok: true, queue: queue.rows[0], catalog: catalog.rows[0], controlled_today: ctl.rows });
    } catch (err) { console.error('GET /api/pharmacy/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['queue', 'dispense', 'controlled', 'catalog', 'low-stock', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
