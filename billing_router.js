// filepath: namaweb/billing_router.js
// Billing + insurance claim lifecycle (NPHIES-style).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// List invoices
router.get('/invoices', requireAuth, requireTenantScope, requireRole('cashier', 'admin', 'accountant'), async (req, res) => {
    try {
        const { patient_id, status } = req.query;
        let sql = `SELECT id, invoice_number, patient_id, patient_name, total, paid, payment_method, service_type, description, created_at FROM invoices WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); sql += ` AND patient_id = $${params.length}`; }
        if (status) { params.push(status); sql += ` AND (amount = paid) IS ($${params.length} = 'paid')`; }
        sql += ` ORDER BY created_at DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, invoices: r.rows });
    } catch (err) { console.error('GET /api/bill/invoices', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/invoices', requireAuth, requireTenantScope, requireRole('cashier', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, total, paid, payment_method, service_type, description, invoice_number, amount, vat_amount } = req.body;
        if (!patient_id || total == null) return res.status(400).json({ error: 'missing_required' });
        const invNum = invoice_number || `INV-${Date.now()}`;
        const r = await db.query(`
            INSERT INTO invoices (tenant_id, patient_id, patient_name, total, paid, payment_method, service_type, description, invoice_number, amount, vat_amount)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, invoice_number
        `, [req.tenantId, patient_id, patient_name || '', total, paid || 0, payment_method || '', service_type || '', description || '', invNum, amount || total, vat_amount || 0]);
        res.status(201).json({ ok: true, id: r.rows[0].id, invoice_number: r.rows[0].invoice_number });
    } catch (err) { console.error('POST /api/bill/invoices', err); res.status(500).json({ error: 'internal_error' }); }
});

// Mark paid
router.post('/invoices/:id/pay', requireAuth, requireTenantScope, requireRole('cashier', 'admin'), async (req, res) => {
    try {
        const { paid_amount, payment_method } = req.body;
        const r = await db.query(`UPDATE invoices SET paid = COALESCE(paid, 0) + $2, payment_method = COALESCE(NULLIF($3, ''), payment_method) WHERE tenant_id = $1 AND id = $4 RETURNING id, paid, total`, [req.tenantId, paid_amount || 0, payment_method || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        const fully = +r.rows[0].paid >= +r.rows[0].total;
        res.json({ ok: true, fully_paid: fully });
    } catch (err) { console.error('POST /api/bill/invoices/pay', err); res.status(500).json({ error: 'internal_error' }); }
});

// Insurance claims
router.post('/claims', requireAuth, requireTenantScope, requireRole('doctor', 'cashier', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, insurance_company, claim_amount, contract_id, policy_id, ucaf_dcaf_data, waseel_status } = req.body;
        if (!patient_id || !claim_amount) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO insurance_claims (tenant_id, patient_id, patient_name, insurance_company, claim_amount, status, contract_id, policy_id, ucaf_dcaf_data, waseel_status, created_at)
            VALUES ($1, $2, $3, $4, $5, 'submitted', $6, $7, $8, $9, NOW()) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', insurance_company || '', claim_amount, contract_id || null, policy_id || null, ucaf_dcaf_data || null, waseel_status || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id, status: 'submitted' });
    } catch (err) { console.error('POST /api/bill/claims', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/claims', requireAuth, requireTenantScope, requireRole('doctor', 'cashier', 'admin', 'insurance_officer'), async (req, res) => {
    try {
        const { status, insurance_company } = req.query;
        let sql = `SELECT id, patient_id, patient_name, insurance_company, claim_amount, status, submitted_at, adjudicated_at, approved_amount FROM insurance_claims WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
        if (insurance_company) { params.push(insurance_company); sql += ` AND insurance_company = $${params.length}`; }
        sql += ` ORDER BY id DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, claims: r.rows });
    } catch (err) { console.error('GET /api/bill/claims', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/claims/:id/adjudicate', requireAuth, requireTenantScope, requireRole('insurance_officer', 'admin'), async (req, res) => {
    try {
        const { decision, approved_amount, denial_reason } = req.body;
        if (!['approved', 'denied', 'partially_approved'].includes(decision)) return res.status(400).json({ error: 'invalid_decision' });
        const r = await db.query(`UPDATE insurance_claims SET status = $2, approved_amount = $3, ucaf_dcaf_data = COALESCE(ucaf_dcaf_data, '') || ' | denied_reason: ' || $4, adjudicated_at = NOW() WHERE tenant_id = $1 AND id = $5 RETURNING id, status, approved_amount`, [req.tenantId, decision, approved_amount || 0, denial_reason || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, status: r.rows[0].status });
    } catch (err) { console.error('POST /api/bill/claims/adjudicate', err); res.status(500).json({ error: 'internal_error' }); }
});

// Add lines to a claim
router.post('/claims/:id/lines', requireAuth, requireTenantScope, requireRole('doctor', 'cashier', 'admin'), async (req, res) => {
    try {
        const { service_id, description, quantity, unit_price } = req.body;
        if (!service_id || quantity == null || unit_price == null) return res.status(400).json({ error: 'missing_required' });
        const line_amount = (+quantity) * (+unit_price);
        const r = await db.query(`INSERT INTO insurance_claim_lines (tenant_id, claim_id, service_id, description, quantity, unit_price, line_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [req.tenantId, req.params.id, service_id, description || '', quantity, unit_price, line_amount]);
        res.status(201).json({ ok: true, id: r.rows[0].id, line_amount });
    } catch (err) { console.error('POST /api/bill/claims/lines', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/claims/:id/lines', requireAuth, requireTenantScope, requireRole('doctor', 'cashier', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, service_id, description, quantity, unit_price, line_amount, approved_amount FROM insurance_claim_lines WHERE tenant_id = $1 AND claim_id = $2`, [req.tenantId, req.params.id]);
        res.json({ ok: true, total: r.rows.length, lines: r.rows, total_line_amount: r.rows.reduce((s,x)=>s+(+x.line_amount||0), 0) });
    } catch (err) { console.error('GET /api/bill/claims/lines', err); res.status(500).json({ error: 'internal_error' }); }
});

// Revenue stats
router.get('/revenue', requireAuth, requireTenantScope, requireRole('admin', 'accountant', 'cashier'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) as invoice_count,
                   ROUND(SUM(COALESCE(total,0))::numeric, 2) as gross_revenue,
                   ROUND(SUM(COALESCE(paid,0))::numeric, 2) as collected,
                   ROUND(SUM(COALESCE(total,0) - COALESCE(paid,0))::numeric, 2) as outstanding
            FROM invoices WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const claims = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'approved') as approved_claims,
                   COUNT(*) FILTER (WHERE status = 'denied') as denied_claims,
                   ROUND(SUM(approved_amount)::numeric, 2) as total_approved
            FROM insurance_claims WHERE tenant_id = $1 AND submitted_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        res.json({ ok: true, revenue_30d: r.rows[0], claims_30d: claims.rows[0] });
    } catch (err) { console.error('GET /api/bill/revenue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['invoices', 'claims', 'adjudicate', 'lines', 'revenue'], timestamp: new Date().toISOString() });
});

module.exports = router;
