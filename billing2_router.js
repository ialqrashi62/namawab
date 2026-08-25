// filepath: namaweb/billing2_router.js
// Invoicing + Insurance claims + Vouchers.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/invoices', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'doctor'), async (req, res) => {
    try {
        const { status, days, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, invoice_number, patient_id, patient_name, invoice_date, due_date,
                   subtotal, vat_amount, discount, total_amount, paid_amount, balance,
                   status, payment_method, created_at
            FROM invoices WHERE ${conditions.join(' AND ')}
            ORDER BY invoice_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, invoices: r.rows });
    } catch (err) { console.error('GET /api/billing2/invoices', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/invoices/outstanding', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, invoice_number, patient_id, patient_name, invoice_date, due_date,
                   total_amount, paid_amount, balance,
                   EXTRACT(DAY FROM (CURRENT_DATE - due_date)) as days_overdue
            FROM invoices WHERE tenant_id = $1 AND status IN ('unpaid', 'partial', 'overdue')
            ORDER BY due_date ASC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, outstanding: r.rows });
    } catch (err) { console.error('GET /api/billing2/invoices/outstanding', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/claims', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'doctor'), async (req, res) => {
    try {
        const { status, insurance_company, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (insurance_company) { params.push(insurance_company); conditions.push(`insurance_company = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, claim_number, patient_id, encounter_id, insurance_company, payer_id,
                   total_amount, approved_amount, paid_amount, status, submission_date,
                   response_date, rejection_reason, created_at
            FROM insurance_claims WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, claims: r.rows });
    } catch (err) { console.error('GET /api/billing2/claims', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/claims/pending', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, claim_number, patient_id, insurance_company, total_amount, status, submission_date, created_at
            FROM insurance_claims WHERE tenant_id = $1 AND status IN ('draft', 'submitted', 'pending_review')
            ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, pending: r.rows });
    } catch (err) { console.error('GET /api/billing2/claims/pending', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/claims/:id/denials', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, code, reason, amount, remark, created_at
            FROM insurance_claim_denials WHERE claim_id = $1 AND tenant_id = $2 ORDER BY created_at
        `, [req.params.id, req.tenantId]);
        res.json({ ok: true, total: r.rows.length, denials: r.rows });
    } catch (err) { console.error('GET /api/billing2/claims/denials', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/vouchers', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { voucher_type, status, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (voucher_type) { params.push(voucher_type); conditions.push(`voucher_type = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`voucher_date >= CURRENT_DATE - $` + params.length + `::int`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, voucher_number, voucher_type, voucher_date, account_id, narration,
                   amount, status, prepared_by, approved_by, created_at
            FROM finance_vouchers WHERE ${conditions.join(' AND ')}
            ORDER BY voucher_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, vouchers: r.rows });
    } catch (err) { console.error('GET /api/billing2/vouchers', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/ar-aging', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                SUM(balance) FILTER (WHERE balance > 0 AND due_date >= CURRENT_DATE) as current_due,
                SUM(balance) FILTER (WHERE balance > 0 AND due_date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE) as days_0_30,
                SUM(balance) FILTER (WHERE balance > 0 AND due_date BETWEEN CURRENT_DATE - INTERVAL '60 days' AND CURRENT_DATE - INTERVAL '31 days') as days_31_60,
                SUM(balance) FILTER (WHERE balance > 0 AND due_date BETWEEN CURRENT_DATE - INTERVAL '90 days' AND CURRENT_DATE - INTERVAL '61 days') as days_61_90,
                SUM(balance) FILTER (WHERE balance > 0 AND due_date < CURRENT_DATE - INTERVAL '90 days') as days_over_90,
                SUM(balance) FILTER (WHERE balance > 0) as total_outstanding
            FROM invoices WHERE tenant_id = $1 AND status IN ('unpaid', 'partial', 'overdue')
        `, [req.tenantId]);
        res.json({ ok: true, aging: r.rows[0] });
    } catch (err) { console.error('GET /api/billing2/ar-aging', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const inv = await db.query(`
            SELECT COUNT(*) as total_invoices,
                   COUNT(*) FILTER (WHERE status = 'paid') as paid,
                   COUNT(*) FILTER (WHERE status = 'partial') as partial,
                   COUNT(*) FILTER (WHERE status IN ('unpaid', 'overdue')) as unpaid,
                   SUM(total_amount) as total_billed,
                   SUM(paid_amount) as total_collected,
                   SUM(balance) as total_outstanding
            FROM invoices WHERE tenant_id = $1
        `, [req.tenantId]);
        const cl = await db.query(`
            SELECT COUNT(*) as total_claims,
                   COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
                   COUNT(*) FILTER (WHERE status = 'approved') as approved,
                   COUNT(*) FILTER (WHERE status = 'denied') as denied,
                   SUM(approved_amount) as approved_value,
                   SUM(paid_amount) as paid_value
            FROM insurance_claims WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, invoices: inv.rows[0], claims: cl.rows[0] });
    } catch (err) { console.error('GET /api/billing2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['invoices', 'claims', 'vouchers', 'ar-aging', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
