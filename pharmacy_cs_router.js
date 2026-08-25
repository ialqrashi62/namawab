// filepath: namaweb/pharmacy_cs_router.js
// Pharmacy: drug catalog, dispense, controlled-substances log (DEA-style audit).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Drug catalog lookup
router.get('/catalog', requireAuth, requireTenantScope, requireRole('pharmacist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { search, category, controlled_only } = req.query;
        let sql = `SELECT id, drug_name, active_ingredient, barcode, category, unit, selling_price, cost_price, stock_qty, min_qty, expiry_date, is_controlled, schedule_class FROM pharmacy_drug_catalog WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (search) { params.push(`%${search}%`); sql += ` AND (drug_name ILIKE $${params.length} OR active_ingredient ILIKE $${params.length} OR barcode = '${String(search).replace(/'/g, '')}')`; }
        if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
        if (controlled_only === 'true') sql += ` AND is_controlled = true`;
        sql += ` ORDER BY drug_name LIMIT 500`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, catalog: r.rows });
    } catch (err) { console.error('GET /api/phz/catalog', err); res.status(500).json({ error: 'internal_error' }); }
});

// Stock-low alert
router.get('/low-stock', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, category, stock_qty, min_qty, selling_price
            FROM pharmacy_drug_catalog WHERE tenant_id = $1 AND stock_qty <= min_qty AND is_active = true
            ORDER BY (stock_qty::numeric / NULLIF(min_qty, 1)) ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, low_stock: r.rows });
    } catch (err) { console.error('GET /api/phz/low-stock', err); res.status(500).json({ error: 'internal_error' }); }
});

// Expiring soon
router.get('/expiring', requireAuth, requireTenantScope, requireRole('pharmacist', 'admin'), async (req, res) => {
    try {
        const days = +(req.query.days || 90);
        const r = await db.query(`
            SELECT id, drug_name, category, stock_qty, expiry_date, EXTRACT(DAY FROM (expiry_date::timestamp - NOW())) as days_left
            FROM pharmacy_drug_catalog WHERE tenant_id = $1 AND expiry_date <= NOW() + ($2 || ' days')::interval AND stock_qty > 0 AND is_active = true
            ORDER BY expiry_date ASC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, total: r.rows.length, expiring: r.rows });
    } catch (err) { console.error('GET /api/phz/expiring', err); res.status(500).json({ error: 'internal_error' }); }
});

// Dispense drug (with auto stock decrement + refill tracking)
router.post('/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { prescription_id, patient_id, drug_id, drug_batch_id, qty, verified_by } = req.body;
        if (!patient_id || !drug_id || !qty) return res.status(400).json({ error: 'missing_required' });
        const d = await db.query(`SELECT drug_name, stock_qty, is_controlled FROM pharmacy_drug_catalog WHERE tenant_id = $1 AND id = $2`, [req.tenantId, drug_id]);
        if (!d.rows.length) return res.status(404).json({ error: 'drug_not_found' });
        if (+d.rows[0].stock_qty < +qty) return res.status(409).json({ error: 'insufficient_stock', available: d.rows[0].stock_qty });
        const r = await db.query(`
            INSERT INTO pharmacy_dispense (tenant_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, verified_by, verified_at, dispensed_by, dispensed_at, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,NOW(),'dispensed') RETURNING id
        `, [req.tenantId, prescription_id || null, patient_id, drug_id, drug_batch_id || null, d.rows[0].drug_name, qty, verified_by || req.userName || '', req.userName || '']);
        await db.query(`UPDATE pharmacy_drug_catalog SET stock_qty = GREATEST(0, COALESCE(stock_qty, 0) - $2) WHERE tenant_id = $1 AND id = $3`, [req.tenantId, qty, drug_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/phz/dispense', err); res.status(500).json({ error: 'internal_error' }); }
});

// Patient dispense history
router.get('/dispense/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, qty, verified_by, dispensed_by, status, verified_at, dispensed_at
            FROM pharmacy_dispense WHERE tenant_id = $1 AND patient_id = $2 ORDER BY dispensed_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, dispense: r.rows });
    } catch (err) { console.error('GET /api/phz/dispense', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Controlled substances log ---
router.post('/cs/transaction', requireAuth, requireTenantScope, requireRole('pharmacist', 'nurse'), async (req, res) => {
    try {
        const { cs_id, patient_id, patient_name, admission_id, transaction_type, quantity, witness1_name, witness2_name, witness1_id, witness2_id, administered_by, reason, waste_amount, waste_reason, is_signed } = req.body;
        if (!cs_id || !transaction_type || quantity == null) return res.status(400).json({ error: 'missing_required' });
        // Compute balance after
        const prev = await db.query(`SELECT COALESCE(closing_balance, 0) as prev FROM pharmacy_controlled_substances WHERE tenant_id = $1 AND id = $2`, [req.tenantId, cs_id]);
        const prevBal = +(prev.rows[0]?.prev || 0);
        let balanceAfter = prevBal;
        if (transaction_type === 'dispense') balanceAfter = prevBal - +quantity;
        else if (transaction_type === 'receive') balanceAfter = prevBal + +quantity;
        else if (transaction_type === 'waste' || transaction_type === 'loss') balanceAfter = prevBal - +quantity;
        else if (transaction_type === 'transfer_out') balanceAfter = prevBal - +quantity;
        else if (transaction_type === 'transfer_in') balanceAfter = prevBal + +quantity;
        const r = await db.query(`
            INSERT INTO pharmacy_cs_transactions (tenant_id, cs_id, patient_id, patient_name, admission_id, transaction_type, quantity, balance_after, witness1_name, witness2_name, witness1_id, witness2_id, administered_by, administered_at, reason, waste_amount, waste_reason, is_signed)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),$14,$15,$16,COALESCE($17,false)) RETURNING id, balance_after
        `, [req.tenantId, cs_id, patient_id || null, patient_name || '', admission_id || null, transaction_type, quantity, balanceAfter, witness1_name || '', witness2_name || '', witness1_id || '', witness2_id || '', administered_by || req.userName || '', reason || '', waste_amount || 0, waste_reason || '', is_signed]);
        // Update master record
        if (transaction_type === 'receive') await db.query(`UPDATE pharmacy_controlled_substances SET received_qty = COALESCE(received_qty, 0) + $2, closing_balance = COALESCE(closing_balance, 0) + $2 WHERE tenant_id = $1 AND id = $3`, [req.tenantId, quantity, cs_id]);
        else if (['dispense','waste','loss','transfer_out'].includes(transaction_type)) await db.query(`UPDATE pharmacy_controlled_substances SET dispensed_qty = COALESCE(dispensed_qty, 0) + $2, wasted_qty = COALESCE(wasted_qty, 0) + $3, closing_balance = GREATEST(0, COALESCE(closing_balance, 0) - $2) WHERE tenant_id = $1 AND id = $4`, [req.tenantId, quantity, transaction_type === 'waste' ? quantity : 0, cs_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id, balance_after: r.rows[0].balance_after });
    } catch (err) { console.error('POST /api/phz/cs/transaction', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/cs/transactions/:cs_id', requireAuth, requireTenantScope, requireRole('pharmacist', 'pharmacy_director', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, transaction_type, quantity, balance_after, witness1_name, witness2_name, administered_by, reason, waste_amount, waste_reason, is_signed, administered_at
            FROM pharmacy_cs_transactions WHERE tenant_id = $1 AND cs_id = $2 ORDER BY administered_at DESC LIMIT 200
        `, [req.tenantId, req.params.cs_id]);
        res.json({ ok: true, total: r.rows.length, transactions: r.rows });
    } catch (err) { console.error('GET /api/phz/cs/transactions', err); res.status(500).json({ error: 'internal_error' }); }
});

// CS discrepancy flag (running vs actual)
router.get('/cs/discrepancies', requireAuth, requireTenantScope, requireRole('pharmacy_director', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drug_name, schedule_class, opening_balance, received_qty, dispensed_qty, wasted_qty, closing_balance,
                   ((COALESCE(opening_balance,0) + COALESCE(received_qty,0)) - (COALESCE(dispensed_qty,0) + COALESCE(wasted_qty,0))) as expected,
                   ((COALESCE(opening_balance,0) + COALESCE(received_qty,0)) - (COALESCE(dispensed_qty,0) + COALESCE(wasted_qty,0)) - COALESCE(closing_balance, 0)) as discrepancy
            FROM pharmacy_controlled_substances WHERE tenant_id = $1
            HAVING ((COALESCE(opening_balance,0) + COALESCE(received_qty,0)) - (COALESCE(dispensed_qty,0) + COALESCE(wasted_qty,0)) - COALESCE(closing_balance, 0)) != 0
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, discrepancies: r.rows });
    } catch (err) { console.error('GET /api/phz/cs/discrepancies', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['catalog', 'low-stock', 'expiring', 'dispense', 'cs/transaction', 'cs/transactions', 'cs/discrepancies'], timestamp: new Date().toISOString() });
});

module.exports = router;
