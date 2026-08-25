'use strict';
// Wave 125 — Finance: GL / AR / AP / Commissions / Reports / ZATCA / Packages / Daily close / Beds / Transport
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PAYMENT_STATUS = ['pending','partial','paid','overdue','cancelled','disputed','written_off'];
const VALID_PAYMENT_METHOD = ['cash','card','bank_transfer','insurance','check','online','mobile_wallet'];
const VALID_AGING = ['current','1_30','31_60','61_90','91_120','over_120'];
const VALID_ACCOUNT_TYPE = ['asset','liability','equity','revenue','expense'];
const VALID_POSTING = ['draft','pending_approval','posted','reversed','voided'];
const VALID_ZATCA_TYPE = ['standard','simplified','debit_note','credit_note'];
const VALID_ZATCA_CLEARANCE = ['pending','submitted','cleared','rejected','failed'];
const VALID_DISCOUNT_TYPE = ['percentage','fixed','package','referral','employee','promotional'];
const VALID_PACKAGE_STATUS = ['active','inactive','retired','pending_approval'];
const VALID_TPORT_TYPE = ['wheelchair','stretcher','ambulatory','bed','oxygen','iv_pole','isolation'];
const VALID_TPORT_PRIORITY = ['routine','urgent','stat','emergency'];
const VALID_TPORT_STATUS = ['requested','assigned','in_progress','completed','cancelled','delayed'];
const VALID_BED_TRANSFER_REASON = ['clinical','administrative','isolation','discharge','admission','icu_stepdown','patient_request'];
const VALID_QUEUE_AD_STATUS = ['active','paused','expired','scheduled','draft'];

function journalBalance(debitLines, creditLines) {
    const d = (debitLines || []).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const c = (creditLines || []).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    return { total_debit: Math.round(d * 100) / 100, total_credit: Math.round(c * 100) / 100,
             balanced: Math.abs(d - c) < 0.01, variance: Math.round((d - c) * 100) / 100 };
}

function arAging(invoiceDate, today) {
    const d = new Date(invoiceDate);
    const t = new Date(today);
    if (isNaN(d.getTime())) return null;
    const days = Math.floor((t - d) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'current';
    if (days <= 30) return '1_30';
    if (days <= 60) return '31_60';
    if (days <= 90) return '61_90';
    if (days <= 120) return '91_120';
    return 'over_120';
}

function arPaymentProgress(collected, total) {
    const c = parseFloat(collected || 0);
    const t = parseFloat(total || 0);
    if (t <= 0) return 0;
    return Math.round((c / t) * 1000) / 10;
}

function apPaymentProgress(paid, total) {
    const p = parseFloat(paid || 0);
    const t = parseFloat(total || 0);
    if (t <= 0) return 0;
    return Math.round((p / t) * 1000) / 10;
}

function commissionCalc(revenue, rate) {
    const r = parseFloat(revenue || 0);
    const rt = parseFloat(rate || 0);
    return Math.round(r * (rt / 100) * 100) / 100;
}

function dailyCloseVariance(opening, closing, expected) {
    const o = parseFloat(opening || 0);
    const c = parseFloat(closing || 0);
    const e = parseFloat(expected || 0);
    const variance = c - e;
    const variancePct = e > 0 ? Math.round((variance / e) * 1000) / 10 : 0;
    return { variance: Math.round(variance * 100) / 100, variance_pct: variancePct, balanced: Math.abs(variance) < 1.0 };
}

function vatFromInclusive(amount, rate) {
    const a = parseFloat(amount || 0);
    const r = parseFloat(rate || 0.15);
    return Math.round((a * r / (1 + r)) * 100) / 100;
}

function zatcaHash(prevHash, currentHash) {
    return prevHash ? `${prevHash}|${currentHash}` : currentHash;
}

function packagePerSession(totalPrice, sessions) {
    const t = parseFloat(totalPrice || 0);
    const s = parseInt(sessions || 1);
    if (s <= 0) return 0;
    return Math.round((t / s) * 100) / 100;
}

function transportWaitTime(requestTime, pickupTime) {
    if (!requestTime || !pickupTime) return null;
    const r = new Date(requestTime);
    const p = new Date(pickupTime);
    if (isNaN(r.getTime()) || isNaN(p.getTime())) return null;
    return Math.round((p - r) / 60000); // minutes
}

function bedTurnover(fromTime, toTime) {
    if (!fromTime || !toTime) return null;
    const f = new Date(fromTime);
    const t = new Date(toTime);
    if (isNaN(f.getTime()) || isNaN(t.getTime())) return null;
    return Math.round((t - f) / (1000 * 60 * 60 * 24)); // days
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'finance-zatca-operations',
        endpoints: [
            'GET/POST /gl/chart-of-accounts',
            'GET/POST /gl/cost-centers',
            'GET/POST /gl/fiscal-years',
            'GET/POST /gl/journal-entries',
            'GET/POST /gl/journal-lines',
            'GET /gl/balance-check',
            'GET/POST /ar/invoices',
            'GET /ar/aging',
            'GET /ar/payment-progress',
            'GET/POST /ap/invoices',
            'GET /ap/payment-progress',
            'GET/POST /commissions',
            'GET /commission-calc',
            'GET/POST /reports/snapshots',
            'GET/POST /tax/declarations',
            'GET /vat-from-inclusive',
            'GET/POST /zatca/invoices',
            'GET/POST /zatca/credit-notes',
            'GET /zatca-hash-chain',
            'GET/POST /packages',
            'GET/POST /package-sessions',
            'GET /package-per-session',
            'GET/POST /discount-rules',
            'GET/POST /daily-close',
            'GET /daily-close-variance',
            'GET/POST /bed/status-history',
            'GET/POST /bed/transfers',
            'GET/POST /transport/requests',
            'GET/POST /queue/ads',
            'GET /transport-wait',
            'GET /bed-turnover',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== GL: CHART OF ACCOUNTS =====
router.get('/gl/chart-of-accounts', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { account_type, is_active, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_chart_of_accounts WHERE tenant_id = $1`;
        if (account_type) { sql += ` AND account_type = $${params.length + 1}`; params.push(account_type); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY account_code LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gl/chart-of-accounts', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, is_active, account_class, opening_balance } = req.body;
        if (!account_code) return res.status(400).json({ ok: false, error: 'account_code_required' });
        if (account_type && !VALID_ACCOUNT_TYPE.includes(account_type)) return res.status(400).json({ ok: false, error: 'invalid_account_type', valid: VALID_ACCOUNT_TYPE });
        const r = await db.query(
            `INSERT INTO finance_chart_of_accounts (account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, is_active, account_class, opening_balance, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [account_code, account_name_ar || null, account_name_en || null,
             parent_id || null, account_level || 1, account_type || 'asset',
             is_active === undefined ? 1 : (is_active ? 1 : 0),
             account_class || null, opening_balance || 0, req.tenantId]
        );
        res.status(201).json({ ok: true, account: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GL: COST CENTERS =====
router.get('/gl/cost-centers', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_active, clinic_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_cost_centers WHERE tenant_id = $1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        if (clinic_id) { sql += ` AND clinic_id = $${params.length + 1}`; params.push(parseInt(clinic_id)); }
        sql += ` ORDER BY center_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gl/cost-centers', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { center_name, center_code, clinic_id, is_active, budget_amount } = req.body;
        if (!center_name) return res.status(400).json({ ok: false, error: 'center_name_required' });
        const r = await db.query(
            `INSERT INTO finance_cost_centers (center_name, center_code, clinic_id, is_active, budget_amount, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [center_name, center_code || null, clinic_id || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0),
             budget_amount || 0, req.tenantId]
        );
        res.status(201).json({ ok: true, cost_center: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GL: FISCAL YEARS =====
router.get('/gl/fiscal-years', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_closed, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_fiscal_years WHERE tenant_id = $1`;
        if (is_closed !== undefined) { sql += ` AND is_closed = $${params.length + 1}`; params.push(parseInt(is_closed)); }
        sql += ` ORDER BY start_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gl/fiscal-years', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { year_name, start_date, end_date, is_closed } = req.body;
        if (!year_name) return res.status(400).json({ ok: false, error: 'year_name_required' });
        const r = await db.query(
            `INSERT INTO finance_fiscal_years (year_name, start_date, end_date, is_closed, tenant_id)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [year_name, start_date || null, end_date || null,
             is_closed ? 1 : 0, req.tenantId]
        );
        res.status(201).json({ ok: true, fiscal_year: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GL: JOURNAL ENTRIES =====
router.get('/gl/journal-entries', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { posting_status, is_posted, fiscal_year_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_journal_entries WHERE tenant_id = $1`;
        if (posting_status) { sql += ` AND posting_status = $${params.length + 1}`; params.push(posting_status); }
        if (is_posted !== undefined) { sql += ` AND is_posted = $${params.length + 1}`; params.push(parseInt(is_posted)); }
        if (fiscal_year_id) { sql += ` AND fiscal_year_id = $${params.length + 1}`; params.push(parseInt(fiscal_year_id)); }
        sql += ` ORDER BY entry_date DESC, id DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gl/journal-entries', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { entry_number, entry_date, description, reference, is_auto, fiscal_year_id, posting_status, source_type } = req.body;
        if (!entry_number) return res.status(400).json({ ok: false, error: 'entry_number_required' });
        if (posting_status && !VALID_POSTING.includes(posting_status)) return res.status(400).json({ ok: false, error: 'invalid_posting_status', valid: VALID_POSTING });
        const r = await db.query(
            `INSERT INTO finance_journal_entries (entry_number, entry_date, description, reference, is_auto, fiscal_year_id, posting_status, source_type, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [entry_number, entry_date || null, description || null, reference || null,
             is_auto ? 1 : 0, fiscal_year_id || null, posting_status || 'draft',
             source_type || 'manual', req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, entry: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GL: JOURNAL LINES =====
router.get('/gl/journal-lines', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { entry_id, account_id, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_journal_lines WHERE tenant_id = $1`;
        if (entry_id) { sql += ` AND entry_id = $${params.length + 1}`; params.push(parseInt(entry_id)); }
        if (account_id) { sql += ` AND account_id = $${params.length + 1}`; params.push(parseInt(account_id)); }
        sql += ` ORDER BY entry_id, id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/gl/journal-lines', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { entry_id, account_id, debit, credit, cost_center_id, notes } = req.body;
        if (!entry_id) return res.status(400).json({ ok: false, error: 'entry_id_required' });
        if (!account_id) return res.status(400).json({ ok: false, error: 'account_id_required' });
        if ((debit || 0) > 0 && (credit || 0) > 0) return res.status(400).json({ ok: false, error: 'cannot_have_both_debit_credit' });
        const r = await db.query(
            `INSERT INTO finance_journal_lines (entry_id, account_id, debit, credit, cost_center_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(entry_id), parseInt(account_id), debit || 0, credit || 0,
             cost_center_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, line: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gl/balance-check', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { entry_id } = req.query;
        if (!entry_id) return res.status(400).json({ ok: false, error: 'entry_id_required' });
        const r = await db.query(`SELECT debit, credit FROM finance_journal_lines WHERE tenant_id = $1 AND entry_id = $2`, [req.tenantId, parseInt(entry_id)]);
        const debits = r.rows.map(x => parseFloat(x.debit || 0));
        const credits = r.rows.map(x => parseFloat(x.credit || 0));
        res.json({ ok: true, entry_id: parseInt(entry_id), balance: journalBalance(debits, credits), line_count: r.rows.length });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AR: ACCOUNTS RECEIVABLE =====
router.get('/ar/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, collection_status, aging_bucket, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_accounts_receivable WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (collection_status) { sql += ` AND collection_status = $${params.length + 1}`; params.push(collection_status); }
        if (aging_bucket) { sql += ` AND aging_bucket = $${params.length + 1}`; params.push(aging_bucket); }
        sql += ` ORDER BY invoice_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(inv => ({ ...inv,
            payment_progress_pct: arPaymentProgress(inv.collected_amount, inv.total_amount),
            outstanding: Math.round((parseFloat(inv.total_amount) - parseFloat(inv.collected_amount)) * 100) / 100
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ar/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, payer_type, payer_id, payer_name, invoice_number, visit_id, admission_id, invoice_date, due_date, subtotal, discount_amount, insurance_share, patient_share, vat_amount, total_amount, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const aging = arAging(invoice_date, new Date().toISOString().slice(0,10));
        const r = await db.query(
            `INSERT INTO finance_accounts_receivable (patient_id, patient_name, payer_type, payer_id, payer_name, invoice_number, visit_id, admission_id, invoice_date, due_date, subtotal, discount_amount, insurance_share, patient_share, vat_amount, total_amount, collected_amount, collection_status, aging_bucket, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING *`,
            [parseInt(patient_id), patient_name || null, payer_type || 'patient',
             payer_id || null, payer_name || null, invoice_number || null,
             visit_id || null, admission_id || null, invoice_date || null, due_date || null,
             subtotal || 0, discount_amount || 0, insurance_share || 0, patient_share || 0,
             vat_amount || 0, total_amount || 0, 0, 'pending', aging, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, ar_invoice: r.rows[0], aging_bucket: aging });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ar/aging', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { invoice_date } = req.query;
        if (!invoice_date) return res.status(400).json({ ok: false, error: 'invoice_date_required' });
        res.json({ ok: true, aging_bucket: arAging(invoice_date, new Date().toISOString().slice(0,10)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ar/payment-progress', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { collected, total } = req.query;
        if (collected === undefined || total === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, progress_pct: arPaymentProgress(parseFloat(collected), parseFloat(total)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AP: ACCOUNTS PAYABLE =====
router.get('/ap/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { vendor_id, payment_status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_accounts_payable WHERE tenant_id = $1`;
        if (vendor_id) { sql += ` AND vendor_id = $${params.length + 1}`; params.push(parseInt(vendor_id)); }
        if (payment_status) { sql += ` AND payment_status = $${params.length + 1}`; params.push(payment_status); }
        sql += ` ORDER BY invoice_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(inv => ({ ...inv,
            payment_progress_pct: apPaymentProgress(inv.paid_amount, inv.total_amount),
            outstanding: Math.round((parseFloat(inv.total_amount) - parseFloat(inv.paid_amount)) * 100) / 100
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ap/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { vendor_id, vendor_name, invoice_number, invoice_date, due_date, po_reference, description, subtotal, vat_amount, total_amount, gl_account_code, cost_center, notes } = req.body;
        if (!invoice_number) return res.status(400).json({ ok: false, error: 'invoice_number_required' });
        if (!total_amount) return res.status(400).json({ ok: false, error: 'total_amount_required' });
        const r = await db.query(
            `INSERT INTO finance_accounts_payable (vendor_id, vendor_name, invoice_number, invoice_date, due_date, po_reference, description, subtotal, vat_amount, total_amount, paid_amount, payment_status, gl_account_code, cost_center, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [vendor_id || null, vendor_name || null, invoice_number,
             invoice_date || null, due_date || null, po_reference || null, description || null,
             subtotal || 0, vat_amount || 0, parseFloat(total_amount), 0, 'pending',
             gl_account_code || null, cost_center || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, ap_invoice: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ap/payment-progress', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { paid, total } = req.query;
        if (paid === undefined || total === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, progress_pct: apPaymentProgress(parseFloat(paid), parseFloat(total)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COMMISSIONS =====
router.get('/commissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { doctor_id, period, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_doctor_commissions WHERE tenant_id = $1`;
        if (doctor_id) { sql += ` AND doctor_id = $${params.length + 1}`; params.push(parseInt(doctor_id)); }
        if (period) { sql += ` AND period = $${params.length + 1}`; params.push(period); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY period DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/commissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { doctor_id, period, total_revenue, commission_rate, status } = req.body;
        if (!doctor_id || !period) return res.status(400).json({ ok: false, error: 'doctor_id_and_period_required' });
        const commission_amount = commissionCalc(total_revenue, commission_rate);
        const r = await db.query(
            `INSERT INTO finance_doctor_commissions (doctor_id, period, total_revenue, commission_rate, commission_amount, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(doctor_id), period, parseFloat(total_revenue || 0),
             parseFloat(commission_rate || 0), commission_amount, status || 'pending', req.tenantId]
        );
        res.status(201).json({ ok: true, commission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/commission-calc', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { revenue, rate } = req.query;
        if (revenue === undefined || rate === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, commission: commissionCalc(parseFloat(revenue), parseFloat(rate)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REPORTS =====
router.get('/reports/snapshots', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { report_type, status, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_report_snapshots WHERE tenant_id = $1`;
        if (report_type) { sql += ` AND report_type = $${params.length + 1}`; params.push(report_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY generated_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/reports/snapshots', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { report_type, report_period_start, report_period_end, report_data, total_revenue, total_expenses, net_income, total_assets, total_liabilities, total_equity, status } = req.body;
        if (!report_type) return res.status(400).json({ ok: false, error: 'report_type_required' });
        const r = await db.query(
            `INSERT INTO finance_report_snapshots (report_type, report_period_start, report_period_end, generated_by, report_data, total_revenue, total_expenses, net_income, total_assets, total_liabilities, total_equity, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [report_type, report_period_start || null, report_period_end || null,
             req.user?.username || null, typeof report_data === 'object' ? JSON.stringify(report_data) : (report_data || null),
             total_revenue || 0, total_expenses || 0, net_income || 0,
             total_assets || 0, total_liabilities || 0, total_equity || 0,
             status || 'draft', req.tenantId]
        );
        res.status(201).json({ ok: true, snapshot: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TAX DECLARATIONS =====
router.get('/tax/declarations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM finance_tax_declarations WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY period_start DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/tax/declarations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { period_start, period_end, total_sales, total_vat, status, submitted_at } = req.body;
        if (!period_start || !period_end) return res.status(400).json({ ok: false, error: 'period_required' });
        const r = await db.query(
            `INSERT INTO finance_tax_declarations (period_start, period_end, total_sales, total_vat, status, submitted_at, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [period_start, period_end, parseFloat(total_sales || 0), parseFloat(total_vat || 0),
             status || 'draft', submitted_at || null, req.tenantId]
        );
        res.status(201).json({ ok: true, declaration: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/vat-from-inclusive', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { amount, rate } = req.query;
        if (amount === undefined) return res.status(400).json({ ok: false, error: 'amount_required' });
        res.json({ ok: true, gross: parseFloat(amount), vat: vatFromInclusive(amount, rate), net: Math.round((parseFloat(amount) - vatFromInclusive(amount, rate)) * 100) / 100 });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ZATCA INVOICES =====
router.get('/zatca/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { invoice_type, clearance_status, submission_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat, qr_code, xml_hash, submission_status, submission_date, clearance_status, created_at, tenant_id, facility_id FROM zatca_invoices WHERE tenant_id = $1`;
        if (invoice_type) { sql += ` AND invoice_type = $${params.length + 1}`; params.push(invoice_type); }
        if (clearance_status) { sql += ` AND clearance_status = $${params.length + 1}`; params.push(clearance_status); }
        if (submission_status) { sql += ` AND submission_status = $${params.length + 1}`; params.push(submission_status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/zatca/invoices', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat, submission_status, clearance_status } = req.body;
        if (!invoice_number) return res.status(400).json({ ok: false, error: 'invoice_number_required' });
        if (invoice_type && !VALID_ZATCA_TYPE.includes(invoice_type)) return res.status(400).json({ ok: false, error: 'invalid_invoice_type', valid: VALID_ZATCA_TYPE });
        const r = await db.query(
            `INSERT INTO zatca_invoices (invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat, submission_status, clearance_status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id, invoice_id, invoice_number, invoice_type, seller_name, total_with_vat, submission_status, clearance_status, created_at`,
            [invoice_id || null, invoice_number, invoice_type || 'standard',
             seller_name || null, seller_vat || null, buyer_name || null, buyer_vat || null,
             total_before_vat || 0, vat_amount || 0, total_with_vat || 0,
             submission_status || 'pending', clearance_status || 'pending', req.tenantId]
        );
        res.status(201).json({ ok: true, invoice: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ZATCA CREDIT NOTES =====
router.get('/zatca/credit-notes', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { clearance_status, original_invoice_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat, clearance_status, submission_status, invoice_counter, created_at, tenant_id FROM zatca_credit_notes WHERE tenant_id = $1`;
        if (clearance_status) { sql += ` AND clearance_status = $${params.length + 1}`; params.push(clearance_status); }
        if (original_invoice_id) { sql += ` AND original_invoice_id = $${params.length + 1}`; params.push(parseInt(original_invoice_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/zatca/credit-notes', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat } = req.body;
        if (!credit_note_number) return res.status(400).json({ ok: false, error: 'credit_note_number_required' });
        const r = await db.query(
            `INSERT INTO zatca_credit_notes (original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, credit_note_number, total_with_vat, clearance_status, submission_status, created_at`,
            [original_invoice_id || null, credit_note_number, buyer_name || null, buyer_vat || null,
             credit_reason || null, credit_reason_code || null,
             subtotal || 0, vat_amount || 0, total_with_vat || 0, req.tenantId]
        );
        res.status(201).json({ ok: true, credit_note: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/zatca-hash-chain', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { prev_hash, current_hash } = req.query;
        res.json({ ok: true, hash_chain: zatcaHash(prev_hash, current_hash) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PACKAGES =====
router.get('/packages', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM packages WHERE 1=1`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY package_name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, per_session: packagePerSession(p.price, p.total_sessions) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/packages', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { package_name_ar, package_name_en, department, total_sessions, price, is_active } = req.body;
        if (!package_name_en) return res.status(400).json({ ok: false, error: 'package_name_required' });
        const r = await db.query(
            `INSERT INTO packages (package_name_ar, package_name_en, department, total_sessions, price, is_active)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [package_name_ar || null, package_name_en, department || null,
             total_sessions || 1, parseFloat(price || 0),
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, package: r.rows[0], per_session: packagePerSession(price, total_sessions) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/package-sessions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { package_id, patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM package_sessions WHERE tenant_id = $1`;
        if (package_id) { sql += ` AND package_id = $${params.length + 1}`; params.push(parseInt(package_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY session_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/package-sessions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { package_id, patient_id, session_number, session_date, status, notes, performed_by } = req.body;
        if (!package_id || !patient_id) return res.status(400).json({ ok: false, error: 'package_id_and_patient_id_required' });
        const r = await db.query(
            `INSERT INTO package_sessions (package_id, patient_id, session_number, session_date, status, notes, performed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(package_id), parseInt(patient_id), session_number || 1, session_date || null,
             status || 'scheduled', notes || null, performed_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/package-per-session', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { price, sessions } = req.query;
        if (price === undefined || sessions === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, per_session: packagePerSession(parseFloat(price), parseInt(sessions)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DISCOUNT RULES =====
router.get('/discount-rules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_active, discount_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM discount_rules WHERE 1=1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        if (discount_type) { sql += ` AND discount_type = $${params.length + 1}`; params.push(discount_type); }
        sql += ` ORDER BY rule_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/discount-rules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { rule_name, discount_type, discount_value, applies_to, min_amount, max_discount, start_date, end_date, is_active } = req.body;
        if (!rule_name) return res.status(400).json({ ok: false, error: 'rule_name_required' });
        if (discount_type && !VALID_DISCOUNT_TYPE.includes(discount_type)) return res.status(400).json({ ok: false, error: 'invalid_discount_type', valid: VALID_DISCOUNT_TYPE });
        const r = await db.query(
            `INSERT INTO discount_rules (rule_name, discount_type, discount_value, applies_to, min_amount, max_discount, start_date, end_date, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [rule_name, discount_type || 'percentage', parseFloat(discount_value || 0),
             applies_to || 'all', parseFloat(min_amount || 0), parseFloat(max_discount || 0),
             start_date || null, end_date || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, rule: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DAILY CLOSE =====
router.get('/daily-close', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, days = 30, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM daily_close WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY close_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/daily-close', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { close_date, cashier, total_cash, total_card, total_insurance, total_transactions, opening_balance, closing_balance, status, notes } = req.body;
        if (!close_date) return res.status(400).json({ ok: false, error: 'close_date_required' });
        const expected = parseFloat(opening_balance || 0) + parseFloat(total_cash || 0) + parseFloat(total_card || 0);
        const variance = parseFloat(closing_balance || 0) - expected;
        const r = await db.query(
            `INSERT INTO daily_close (close_date, cashier, total_cash, total_card, total_insurance, total_transactions, opening_balance, closing_balance, variance, notes, status, closed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [close_date, cashier || null, parseFloat(total_cash || 0), parseFloat(total_card || 0),
             parseFloat(total_insurance || 0), parseInt(total_transactions || 0),
             parseFloat(opening_balance || 0), parseFloat(closing_balance || 0),
             variance, notes || null, status || 'open', req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, close: r.rows[0], variance_check: dailyCloseVariance(opening_balance, closing_balance, expected) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/daily-close-variance', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { opening, closing, expected } = req.query;
        if (opening === undefined || closing === undefined || expected === undefined) return res.status(400).json({ ok: false, error: 'all_required' });
        res.json({ ok: true, variance: dailyCloseVariance(opening, closing, expected) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BED STATUS HISTORY =====
router.get('/bed/status-history', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { bed_id, patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM bed_status_history WHERE tenant_id = $1`;
        if (bed_id) { sql += ` AND bed_id = $${params.length + 1}`; params.push(parseInt(bed_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY changed_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/bed/status-history', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { bed_id, admission_id, patient_id, from_status, to_status, reason } = req.body;
        if (!bed_id) return res.status(400).json({ ok: false, error: 'bed_id_required' });
        const r = await db.query(
            `INSERT INTO bed_status_history (bed_id, admission_id, patient_id, from_status, to_status, reason, changed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(bed_id), admission_id || null, patient_id || null,
             from_status || null, to_status || null, reason || null,
             req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, history: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BED TRANSFERS =====
router.get('/bed/transfers', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM bed_transfers WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY transfer_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/bed/transfers', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (transfer_reason && !VALID_BED_TRANSFER_REASON.includes(transfer_reason)) return res.status(400).json({ ok: false, error: 'invalid_reason', valid: VALID_BED_TRANSFER_REASON });
        const r = await db.query(
            `INSERT INTO bed_transfers (admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [admission_id || null, parseInt(patient_id), from_ward || null, from_bed || null,
             to_ward || null, to_bed || null, transfer_reason || null,
             transferred_by || req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, transfer: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRANSPORT REQUESTS =====
router.get('/transport/requests', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, status, transport_type, priority, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM transport_requests WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (transport_type) { sql += ` AND transport_type = $${params.length + 1}`; params.push(transport_type); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY request_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(t => ({ ...t, wait_minutes: transportWaitTime(t.request_time, t.pickup_time) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transport/requests', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, assigned_porter, special_needs, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (transport_type && !VALID_TPORT_TYPE.includes(transport_type)) return res.status(400).json({ ok: false, error: 'invalid_transport_type', valid: VALID_TPORT_TYPE });
        if (priority && !VALID_TPORT_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority', valid: VALID_TPORT_PRIORITY });
        const r = await db.query(
            `INSERT INTO transport_requests (patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, assigned_porter, special_needs, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), patient_name || null, from_location || null, to_location || null,
             transport_type || 'wheelchair', priority || 'routine',
             requested_by || req.user?.username || null, assigned_porter || null,
             special_needs || null, status || 'requested', req.tenantId]
        );
        res.status(201).json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transport-wait', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { request_time, pickup_time } = req.query;
        if (!request_time || !pickup_time) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, wait_minutes: transportWaitTime(request_time, pickup_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/bed-turnover', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { from_time, to_time } = req.query;
        if (!from_time || !to_time) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, turnover_days: bedTurnover(from_time, to_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUEUE ADVERTISEMENTS =====
router.get('/queue/ads', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM queue_advertisements WHERE tenant_id = $1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY display_order, created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/queue/ads', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { title, image_path, display_order, duration_seconds, is_active } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        const r = await db.query(
            `INSERT INTO queue_advertisements (title, image_path, display_order, duration_seconds, is_active, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [title, image_path || null, display_order || 0, duration_seconds || 10,
             is_active === undefined ? 1 : (is_active ? 1 : 0), req.tenantId]
        );
        res.status(201).json({ ok: true, ad: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const ar = await db.query(`SELECT collection_status, COUNT(*) AS count, SUM(total_amount - collected_amount) AS outstanding FROM finance_accounts_receivable WHERE tenant_id = $1 GROUP BY collection_status`, [req.tenantId]);
        const ap = await db.query(`SELECT payment_status, COUNT(*) AS count, SUM(total_amount - paid_amount) AS outstanding FROM finance_accounts_payable WHERE tenant_id = $1 GROUP BY payment_status`, [req.tenantId]);
        const zatca = await db.query(`SELECT clearance_status, COUNT(*) AS count FROM zatca_invoices WHERE tenant_id = $1 GROUP BY clearance_status`, [req.tenantId]);
        const cn = await db.query(`SELECT clearance_status, COUNT(*) AS count FROM zatca_credit_notes WHERE tenant_id = $1 GROUP BY clearance_status`, [req.tenantId]);
        const dc = await db.query(`SELECT status, COUNT(*) AS count FROM daily_close WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY status`, [req.tenantId]);
        const tport = await db.query(`SELECT status, transport_type, COUNT(*) AS count FROM transport_requests WHERE tenant_id = $1 GROUP BY status, transport_type`, [req.tenantId]);
        const pkg = await db.query(`SELECT status, COUNT(*) AS count FROM package_sessions WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        res.json({
            ok: true,
            ar: ar.rows, ap: ap.rows,
            zatca_invoices: zatca.rows, zatca_credit_notes: cn.rows,
            daily_close: dc.rows,
            transport: tport.rows,
            package_sessions: pkg.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
