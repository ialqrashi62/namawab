// filepath: namaweb/finance2_router.js
// Finance module — GL, AP/AR, cost centers, commissions, tax declarations.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Chart of accounts
router.get('/chart-of-accounts', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, account_class, is_active, opening_balance
            FROM finance_chart_of_accounts WHERE tenant_id = $1 ORDER BY account_code LIMIT 500
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, accounts: r.rows });
    } catch (err) { console.error('GET /api/finance2/coa', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cost centers
router.get('/cost-centers', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, center_name, center_code, is_active, budget_amount FROM finance_cost_centers WHERE tenant_id = $1 ORDER BY center_name LIMIT 200`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, centers: r.rows });
    } catch (err) { console.error('GET /api/finance2/cost-centers', err); res.status(500).json({ error: 'internal_error' }); }
});

// Journal entries
router.get('/journal-entries', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { status, fiscal_year_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`posting_status = $${params.length}`); }
        if (fiscal_year_id) { params.push(fiscal_year_id); conditions.push(`fiscal_year_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`entry_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, entry_number, entry_date, description, reference, posting_status, is_posted, posted_by, posted_at, source_type, created_by, created_at
            FROM finance_journal_entries WHERE ${conditions.join(' AND ')}
            ORDER BY entry_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, entries: r.rows });
    } catch (err) { console.error('GET /api/finance2/journal-entries', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/journal-entries/:id/lines', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT l.id, l.entry_id, l.account_id, a.account_code, a.account_name_en, l.debit, l.credit, l.cost_center_id, l.notes
            FROM finance_journal_lines l
            LEFT JOIN finance_chart_of_accounts a ON a.id = l.account_id
            WHERE l.entry_id = $1 AND l.tenant_id = $2 ORDER BY l.id
        `, [req.params.id, req.tenantId]);
        const total = await db.query(`SELECT SUM(debit) as total_debit, SUM(credit) as total_credit FROM finance_journal_lines WHERE entry_id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        res.json({ ok: true, lines: r.rows, totals: total.rows[0] });
    } catch (err) { console.error('GET /api/finance2/journal-entries/lines', err); res.status(500).json({ error: 'internal_error' }); }
});

// Accounts payable (vendor bills)
router.get('/accounts-payable', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { payment_status, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (payment_status) { params.push(payment_status); conditions.push(`payment_status = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`invoice_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, vendor_id, vendor_name, invoice_number, invoice_date, due_date, total_amount, paid_amount, payment_status, payment_method, payment_date, cost_center
            FROM finance_accounts_payable WHERE ${conditions.join(' AND ')}
            ORDER BY invoice_date DESC LIMIT $${params.length}
        `, params);
        const summary = await db.query(`
            SELECT COUNT(*) as total_bills,
                   SUM(total_amount) as total_billed,
                   SUM(paid_amount) as total_paid,
                   SUM(total_amount - paid_amount) as outstanding,
                   COUNT(*) FILTER (WHERE payment_status = 'unpaid') as unpaid,
                   COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND payment_status != 'paid') as overdue
            FROM finance_accounts_payable WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, summary: summary.rows[0], bills: r.rows });
    } catch (err) { console.error('GET /api/finance2/ap', err); res.status(500).json({ error: 'internal_error' }); }
});

// Accounts receivable (insurance/patient receivables)
router.get('/accounts-receivable', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { payer_type, collection_status, aging_bucket } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (payer_type) { params.push(payer_type); conditions.push(`payer_type = $${params.length}`); }
        if (collection_status) { params.push(collection_status); conditions.push(`collection_status = $${params.length}`); }
        if (aging_bucket) { params.push(aging_bucket); conditions.push(`aging_bucket = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, payer_type, payer_name, invoice_number, invoice_date, due_date,
                   total_amount, collected_amount, collection_status, aging_bucket, last_payment_date, last_payment_amount
            FROM finance_accounts_receivable WHERE ${conditions.join(' AND ')}
            ORDER BY invoice_date DESC LIMIT $${params.length}
        `, params);
        const summary = await db.query(`
            SELECT COUNT(*) as total,
                   SUM(total_amount) as total_billed,
                   SUM(collected_amount) as total_collected,
                   SUM(total_amount - collected_amount) as outstanding,
                   COUNT(*) FILTER (WHERE aging_bucket = '0-30') as bucket_0_30,
                   COUNT(*) FILTER (WHERE aging_bucket = '31-60') as bucket_31_60,
                   COUNT(*) FILTER (WHERE aging_bucket = '61-90') as bucket_61_90,
                   COUNT(*) FILTER (WHERE aging_bucket = 'over_90') as bucket_over_90
            FROM finance_accounts_receivable WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, summary: summary.rows[0], receivables: r.rows });
    } catch (err) { console.error('GET /api/finance2/ar', err); res.status(500).json({ error: 'internal_error' }); }
});

// Doctor commissions
router.get('/doctor-commissions', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { doctor_id, period, status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (doctor_id) { params.push(doctor_id); conditions.push(`doctor_id = $${params.length}`); }
        if (period) { params.push(period); conditions.push(`period = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, doctor_id, period, total_revenue, commission_rate, commission_amount, status, created_at
            FROM finance_doctor_commissions WHERE ${conditions.join(' AND ')}
            ORDER BY period DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, commissions: r.rows });
    } catch (err) { console.error('GET /api/finance2/commissions', err); res.status(500).json({ error: 'internal_error' }); }
});

// Tax declarations (ZATCA/VAT)
router.get('/tax-declarations', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, period_start, period_end, total_sales, total_vat, status, submitted_at, created_at
            FROM finance_tax_declarations WHERE tenant_id = $1 ORDER BY period_start DESC LIMIT 50
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, declarations: r.rows });
    } catch (err) { console.error('GET /api/finance2/tax', err); res.status(500).json({ error: 'internal_error' }); }
});

// Fiscal years
router.get('/fiscal-years', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, year_name, start_date, end_date, is_closed, closed_at FROM finance_fiscal_years WHERE tenant_id = $1 ORDER BY start_date DESC`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, years: r.rows });
    } catch (err) { console.error('GET /api/finance2/fiscal-years', err); res.status(500).json({ error: 'internal_error' }); }
});

// P&L (income summary)
router.get('/pl/:fiscal_year_id', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                SUM(l.credit) FILTER (WHERE a.account_type = 'revenue') as total_revenue,
                SUM(l.debit) FILTER (WHERE a.account_type = 'expense') as total_expense,
                SUM(l.credit) FILTER (WHERE a.account_type = 'revenue') - SUM(l.debit) FILTER (WHERE a.account_type = 'expense') as net_income
            FROM finance_journal_lines l
            LEFT JOIN finance_chart_of_accounts a ON a.id = l.account_id
            LEFT JOIN finance_journal_entries je ON je.id = l.entry_id
            WHERE l.tenant_id = $1 AND je.fiscal_year_id = $2 AND je.posting_status = 'posted'
        `, [req.tenantId, req.params.fiscal_year_id]);
        res.json({ ok: true, pl: r.rows[0] });
    } catch (err) { console.error('GET /api/finance2/pl', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const gl = await db.query(`SELECT COUNT(*) FILTER (WHERE posting_status = 'posted') as posted_entries, COUNT(*) FILTER (WHERE posting_status = 'draft') as drafts FROM finance_journal_entries WHERE tenant_id = $1`, [req.tenantId]);
        const coa = await db.query(`SELECT COUNT(*) as accounts, COUNT(*) FILTER (WHERE is_active) as active FROM finance_chart_of_accounts WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, gl: gl.rows[0], chart_of_accounts: coa.rows[0] });
    } catch (err) { console.error('GET /api/finance2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['chart-of-accounts', 'cost-centers', 'journal-entries', 'accounts-payable', 'accounts-receivable', 'doctor-commissions', 'tax-declarations', 'pl', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
