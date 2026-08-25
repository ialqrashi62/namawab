// filepath: namaweb/bill3_router.js
// Billing v3 — payer management + contracts + pricing + ZATCA credit notes.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Insurance companies
router.get('/companies', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'biller'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, name_en, name_ar, tpa_id, contact_info, created_at FROM insurance_companies WHERE tenant_id = $1 ORDER BY name_en`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, companies: r.rows });
    } catch (err) { console.error('GET /api/bill3/companies', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/companies', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { name_en, name_ar, tpa_id, contact_info } = req.body;
        if (!name_en) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO insurance_companies (tenant_id, name_en, name_ar, tpa_id, contact_info)
            VALUES ($1,$2,$3,$4,$5) RETURNING id
        `, [req.tenantId, name_en, name_ar || '', tpa_id || '', contact_info || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/bill3/companies', err); res.status(500).json({ error: 'internal_error' }); }
});

// Insurance contracts
router.get('/contracts', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'biller'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, company_id, contract_name, valid_from, valid_to, discount_percentage, file_path, created_at
            FROM insurance_contracts WHERE tenant_id = $1 ORDER BY valid_to DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, contracts: r.rows });
    } catch (err) { console.error('GET /api/bill3/contracts', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/contracts', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { company_id, contract_name, valid_from, valid_to, discount_percentage } = req.body;
        if (!company_id || !contract_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO insurance_contracts (tenant_id, company_id, contract_name, valid_from, valid_to, discount_percentage)
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING id
        `, [req.tenantId, company_id, contract_name, valid_from || null, valid_to || null, discount_percentage || 0]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/bill3/contracts', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/contracts/active', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'biller'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT c.id, c.company_id, cmp.name_en, c.contract_name, c.discount_percentage, c.valid_from, c.valid_to
            FROM insurance_contracts c
            LEFT JOIN insurance_companies cmp ON cmp.id = c.company_id
            WHERE c.tenant_id = $1 AND (c.valid_from IS NULL OR c.valid_from <= CURRENT_DATE) AND (c.valid_to IS NULL OR c.valid_to >= CURRENT_DATE)
            ORDER BY c.discount_percentage DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, active: r.rows });
    } catch (err) { console.error('GET /api/bill3/contracts/active', err); res.status(500).json({ error: 'internal_error' }); }
});

// Payer pricing (per service)
router.get('/pricing/:company_id', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, service_id, payer_price, effective_from, is_active
            FROM insurance_payer_pricing WHERE tenant_id = $1 AND insurance_company_id = $2 AND is_active = true
            ORDER BY service_id LIMIT 500
        `, [req.tenantId, req.params.company_id]);
        res.json({ ok: true, total: r.rows.length, pricing: r.rows });
    } catch (err) { console.error('GET /api/bill3/pricing', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/pricing', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { insurance_company_id, service_id, payer_price, effective_from } = req.body;
        if (!insurance_company_id || !service_id || !payer_price) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO insurance_payer_pricing (tenant_id, insurance_company_id, service_id, payer_price, effective_from, is_active, created_by)
            VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), true, $6) RETURNING id
        `, [req.tenantId, insurance_company_id, service_id, payer_price, effective_from, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/bill3/pricing', err); res.status(500).json({ error: 'internal_error' }); }
});

// ZATCA credit notes
router.get('/credit-notes', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'biller'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code,
                   subtotal, vat_amount, total_with_vat, clearance_status, submission_status, zatca_response, qr_code,
                   invoice_counter, prev_invoice_hash, created_at
            FROM zatca_credit_notes WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, credit_notes: r.rows });
    } catch (err) { console.error('GET /api/bill3/credit-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/credit-notes', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { original_invoice_id, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount } = req.body;
        if (!original_invoice_id || !credit_reason || subtotal == null || vat_amount == null) return res.status(400).json({ error: 'missing_required' });
        const total_with_vat = subtotal + vat_amount;
        const r = await db.query(`
            INSERT INTO zatca_credit_notes (tenant_id, original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat, clearance_status, submission_status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'draft','pending') RETURNING id, credit_note_number
        `, [req.tenantId, original_invoice_id, `CN-${Date.now()}`, buyer_name || '', buyer_vat || '', credit_reason, credit_reason_code || '', subtotal, vat_amount, total_with_vat]);
        res.status(201).json({ ok: true, id: r.rows[0].id, credit_note_number: r.rows[0].credit_note_number, total_with_vat });
    } catch (err) { console.error('POST /api/bill3/credit-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/credit-notes/:id/clear', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { zatca_response } = req.body;
        const r = await db.query(`
            UPDATE zatca_credit_notes SET clearance_status = 'cleared', submission_status = 'submitted', zatca_response = $3
            WHERE id = $1 AND tenant_id = $2 AND clearance_status = 'draft' RETURNING id, clearance_status, submission_status
        `, [req.params.id, req.tenantId, zatca_response || 'submitted']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_cleared' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/bill3/credit-notes/clear', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const c = await db.query(`
            SELECT COUNT(*) as total_companies,
                   COUNT(*) FILTER (WHERE (valid_to IS NULL OR valid_to >= CURRENT_DATE) AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)) as active_contracts
            FROM insurance_companies cmp LEFT JOIN insurance_contracts c ON c.company_id = cmp.id
            WHERE cmp.tenant_id = $1
        `, [req.tenantId]);
        const cn = await db.query(`
            SELECT COUNT(*) as total_credit_notes,
                   SUM(total_with_vat) as total_credit_value,
                   COUNT(*) FILTER (WHERE clearance_status = 'cleared') as cleared,
                   COUNT(*) FILTER (WHERE clearance_status = 'draft') as drafts
            FROM zatca_credit_notes WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, companies_contracts: c.rows[0], credit_notes: cn.rows[0] });
    } catch (err) { console.error('GET /api/bill3/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['companies', 'contracts', 'pricing', 'credit-notes', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
