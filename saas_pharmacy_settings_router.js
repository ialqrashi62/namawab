'use strict';
// Wave 117 — SaaS billing (customers/subscriptions/payments) + Pharmacy (dispense/queue/reviews) + Tenant settings/branding + CME
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PROVIDER = ['stripe','paypal','moyasar','hyperpay','tap','manual','local'];
const VALID_SUB_STATUS = ['trialing','active','past_due','paused','canceled','incomplete','unpaid','expired'];
const VALID_TX_STATUS = ['pending','succeeded','failed','refunded','partially_refunded','disputed','canceled','requires_action'];
const VALID_CUSTOMER_STATUS = ['active','inactive','suspended','fraudulent','deleted'];
const VALID_PAY_METHOD = ['card','bank_transfer','wallet','apple_pay','mada','stc_pay','sadad','other'];
const VALID_REVIEW_TYPE = ['medication_reconciliation','renal_dosing','antimicrobial_stewardship','adverse_drug_reaction','drug_interaction','polypharmacy','therapeutic_drug_monitoring','other'];
const VALID_REVIEW_SEVERITY = ['informational','low','moderate','high','critical'];
const VALID_REVIEW_STATUS = ['pending','in_progress','completed','escalated','cancelled'];
const VALID_DISPENSE_STATUS = ['queued','verified','dispensed','partial','returned','cancelled','on_hold'];
const VALID_QUEUE_STATUS = ['pending','in_progress','ready','dispensed','cancelled','on_hold','returned'];
const VALID_CME_CATEGORY = ['clinical','research','ethics','safety','leadership','technology','quality','patient_experience','other'];
const VALID_CME_STATUS = ['scheduled','ongoing','completed','cancelled','full'];
const VALID_RISK = ['low','moderate','high','critical'];

function saasAmount(amountMinor, currency) {
    if (amountMinor === undefined || amountMinor === null) return null;
    const major = amountMinor / 100;
    return { amount_minor: amountMinor, amount_major: major, currency: currency || 'USD' };
}

function subStatusValidity(status, currentPeriodEnd) {
    const now = new Date();
    const expiresSoon = currentPeriodEnd && (new Date(currentPeriodEnd) - now) < (7 * 24 * 60 * 60 * 1000);
    if (status === 'active' && expiresSoon) return 'active_renewal_due';
    if (status === 'trialing') return 'in_trial';
    if (status === 'past_due') return 'payment_overdue';
    if (status === 'canceled' || status === 'expired') return 'inactive';
    return status;
}

function drugInteractionSeverity(severity) {
    return severity || null;
}

function cmeCompletionStatus(registered, max) {
    if (registered === undefined || max === undefined) return null;
    if (registered >= max) return 'full';
    const pct = registered / max;
    if (pct >= 0.8) return 'nearly_full';
    if (pct >= 0.5) return 'half_full';
    return 'low_enrollment';
}

function colorHexValid(hex) {
    if (!hex) return null;
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function emailValid(email) {
    if (!email) return false;
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function polyPharmacyFlag(medications) {
    if (!Array.isArray(medications)) return null;
    const count = medications.length;
    if (count >= 10) return 'severe_polypharmacy';
    if (count >= 5) return 'polypharmacy';
    return 'standard';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'saas-pharmacy-settings',
        endpoints: [
            'GET /saas/billing/customers',
            'POST /saas/billing/customers',
            'GET /saas/billing/subscriptions',
            'POST /saas/billing/subscriptions',
            'GET /saas/billing/payment-transactions',
            'POST /saas/billing/payment-transactions',
            'GET /pharmacy/dispense',
            'POST /pharmacy/dispense',
            'GET /pharmacy/prescriptions-queue',
            'POST /pharmacy/prescriptions-queue',
            'GET /pharmacy/clinical-reviews',
            'POST /pharmacy/clinical-reviews',
            'GET /tenant/settings',
            'POST /tenant/settings',
            'GET /tenant/branding',
            'POST /tenant/branding',
            'GET /company-settings',
            'POST /company-settings',
            'GET /cme/activities',
            'POST /cme/activities',
            'POST /cme/activities/:id/register',
            'GET /amount',
            'GET /subscription-status',
            'GET /color-hex',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SAAS BILLING CUSTOMERS =====
router.get('/saas/billing/customers', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { provider, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM saas_billing_customers WHERE tenant_id = $1`;
        if (provider) { sql += ` AND provider = $${params.length + 1}`; params.push(provider); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/billing/customers', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { provider, provider_customer_id_hash, billing_email_masked, status } = req.body;
        if (!provider || !VALID_PROVIDER.includes(provider)) return res.status(400).json({ ok: false, error: 'invalid_provider' });
        if (!provider_customer_id_hash) return res.status(400).json({ ok: false, error: 'provider_customer_id_required' });
        if (status && !VALID_CUSTOMER_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO saas_billing_customers (tenant_id, provider, provider_customer_id_hash, billing_email_masked, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, provider, provider_customer_id_hash, billing_email_masked || null, status || 'active', req.user?.id || null]
        );
        res.status(201).json({ ok: true, customer: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAAS BILLING SUBSCRIPTIONS =====
router.get('/saas/billing/subscriptions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_key, provider, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM saas_billing_subscriptions WHERE tenant_id = $1`;
        if (plan_key) { sql += ` AND plan_key = $${params.length + 1}`; params.push(plan_key); }
        if (provider) { sql += ` AND provider = $${params.length + 1}`; params.push(provider); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/billing/subscriptions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_key, provider, provider_subscription_id_hash, status, current_period_start, current_period_end, cancel_at_period_end, trial_start, trial_end } = req.body;
        if (!plan_key) return res.status(400).json({ ok: false, error: 'plan_key_required' });
        if (!provider || !VALID_PROVIDER.includes(provider)) return res.status(400).json({ ok: false, error: 'invalid_provider' });
        if (!provider_subscription_id_hash) return res.status(400).json({ ok: false, error: 'provider_subscription_id_required' });
        if (status && !VALID_SUB_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (current_period_start && current_period_end && new Date(current_period_end) <= new Date(current_period_start)) return res.status(400).json({ ok: false, error: 'period_end_must_be_after_start' });

        const r = await db.query(
            `INSERT INTO saas_billing_subscriptions (tenant_id, plan_key, provider, provider_subscription_id_hash, status, current_period_start, current_period_end, cancel_at_period_end, trial_start, trial_end, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, plan_key, provider, provider_subscription_id_hash, status || 'active',
             current_period_start || null, current_period_end || null, !!cancel_at_period_end,
             trial_start || null, trial_end || null, req.user?.id || null]
        );
        res.status(201).json({
            ok: true, subscription: r.rows[0],
            computed: { status_validity: subStatusValidity(status || 'active', current_period_end) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAAS BILLING PAYMENT TRANSACTIONS =====
router.get('/saas/billing/payment-transactions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { provider, status, idempotency_key, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM saas_billing_payment_transactions WHERE tenant_id = $1`;
        if (provider) { sql += ` AND provider = $${params.length + 1}`; params.push(provider); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (idempotency_key) { sql += ` AND idempotency_key = $${params.length + 1}`; params.push(idempotency_key); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/billing/payment-transactions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { provider, idempotency_key, provider_transaction_id_hash, amount_minor, currency, status, payment_method_type, failure_code, failure_message_safe } = req.body;
        if (!provider || !VALID_PROVIDER.includes(provider)) return res.status(400).json({ ok: false, error: 'invalid_provider' });
        if (!idempotency_key) return res.status(400).json({ ok: false, error: 'idempotency_key_required' });
        if (!amount_minor || amount_minor <= 0) return res.status(400).json({ ok: false, error: 'amount_required_positive' });
        if (status && !VALID_TX_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (payment_method_type && !VALID_PAY_METHOD.includes(payment_method_type)) return res.status(400).json({ ok: false, error: 'invalid_payment_method' });

        const r = await db.query(
            `INSERT INTO saas_billing_payment_transactions (tenant_id, provider, idempotency_key, provider_transaction_id_hash, amount_minor, currency, status, payment_method_type, failure_code, failure_message_safe)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, provider, idempotency_key, provider_transaction_id_hash || null,
             parseInt(amount_minor), currency || 'USD', status || 'pending',
             payment_method_type || null, failure_code || null, failure_message_safe || null]
        );
        res.status(201).json({
            ok: true, transaction: r.rows[0],
            computed: { amount: saasAmount(amount_minor, currency || 'USD') }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY DISPENSE =====
router.get('/pharmacy/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, drug_id, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT d.*, p.full_name AS patient_name FROM pharmacy_dispense d LEFT JOIN patients p ON p.id = d.patient_id WHERE d.tenant_id = $1`;
        if (patient_id) { sql += ` AND d.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (drug_id) { sql += ` AND d.drug_id = $${params.length + 1}`; params.push(parseInt(drug_id)); }
        if (status) { sql += ` AND d.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY d.dispensed_at DESC NULLS LAST, d.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { branch_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, verified_by, dispensed_by, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        if (!qty || qty <= 0) return res.status(400).json({ ok: false, error: 'qty_required_positive' });
        if (status && !VALID_DISPENSE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO pharmacy_dispense (tenant_id, branch_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, verified_by, verified_at, dispensed_by, dispensed_at, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $9::int IS NOT NULL THEN NOW() ELSE NULL END,$10,CASE WHEN $10::int IS NOT NULL THEN NOW() ELSE NULL END,$11) RETURNING *`,
            [req.tenantId, branch_id || null, prescription_id || null, parseInt(patient_id),
             drug_id || null, drug_batch_id || null, drug_name, parseInt(qty),
             verified_by || null, verified_by || null, dispensed_by || null, status || 'verified']
        );
        res.status(201).json({ ok: true, dispense: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY PRESCRIPTIONS QUEUE =====
router.get('/pharmacy/prescriptions-queue', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT q.*, p.full_name AS patient_name FROM pharmacy_prescriptions_queue q LEFT JOIN patients p ON p.id = q.patient_id WHERE q.tenant_id = $1`;
        if (patient_id) { sql += ` AND q.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (doctor_id) { sql += ` AND q.doctor_id = $${params.length + 1}`; params.push(parseInt(doctor_id)); }
        if (status) { sql += ` AND q.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/prescriptions-queue', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor_id, doctor, clinic_name, prescription_text, medication_name, dosage, quantity_per_day, frequency, duration, price, payment_method, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!medication_name) return res.status(400).json({ ok: false, error: 'medication_name_required' });
        if (price !== undefined && price < 0) return res.status(400).json({ ok: false, error: 'invalid_price' });
        if (status && !VALID_QUEUE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO pharmacy_prescriptions_queue (tenant_id, branch_id, patient_id, doctor_id, doctor, clinic_name, prescription_text, medication_name, dosage, quantity_per_day, frequency, duration, price, payment_method, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [req.tenantId, req.body.branch_id || null, parseInt(patient_id), doctor_id || req.user?.id || null,
             doctor || null, clinic_name || null, prescription_text || null,
             medication_name, dosage || null, quantity_per_day || null, frequency || null,
             duration || null, price ?? null, payment_method || null, status || 'pending']
        );
        res.status(201).json({ ok: true, prescription: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL PHARMACY REVIEWS =====
router.get('/pharmacy/clinical-reviews', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, review_type, severity, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_pharmacy_reviews WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (review_type) { sql += ` AND review_type = $${params.length + 1}`; params.push(review_type); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/clinical-reviews', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, patient_name, prescription_id, review_type, pharmacist, findings, recommendations, interventions, outcome, severity, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!review_type || !VALID_REVIEW_TYPE.includes(review_type)) return res.status(400).json({ ok: false, error: 'invalid_review_type' });
        if (severity && !VALID_REVIEW_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });
        if (status && !VALID_REVIEW_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO clinical_pharmacy_reviews (tenant_id, patient_id, patient_name, prescription_id, review_type, pharmacist, findings, recommendations, interventions, outcome, severity, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, parseInt(patient_id), patient_name || null, prescription_id || null,
             review_type, pharmacist || null, findings || null, recommendations || null,
             interventions || null, outcome || null, severity || null, status || 'pending']
        );
        res.status(201).json({ ok: true, review: r.rows[0], computed: { severity: drugInteractionSeverity(severity) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TENANT SETTINGS (key-value) =====
router.get('/tenant/settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { setting_key, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM tenant_settings WHERE tenant_id = $1`;
        if (setting_key) { sql += ` AND setting_key = $${params.length + 1}`; params.push(setting_key); }
        sql += ` ORDER BY setting_key LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/tenant/settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { setting_key, setting_value } = req.body;
        if (!setting_key) return res.status(400).json({ ok: false, error: 'setting_key_required' });
        if (setting_value === undefined) return res.status(400).json({ ok: false, error: 'setting_value_required' });

        const r = await db.query(
            `INSERT INTO tenant_settings (tenant_id, setting_key, setting_value) VALUES ($1,$2,$3) RETURNING *`,
            [req.tenantId, setting_key, setting_value]
        );
        res.status(201).json({ ok: true, setting: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TENANT BRANDING (one-row per tenant) =====
router.get('/tenant/branding', requireAuth, requireTenantScope, (req, res) => {
    db.query(`SELECT * FROM tenant_branding WHERE tenant_id = $1`, [req.tenantId])
        .then(r => {
            if (!r.rows.length) return res.json({ ok: true, branding: null });
            res.json({ ok: true, branding: r.rows[0], computed: { primary_color_valid: colorHexValid(r.rows[0].primary_color) } });
        })
        .catch(e => res.status(500).json({ ok: false, error: e.message }));
});

router.post('/tenant/branding', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { logo_url, favicon_url, primary_color, secondary_color, accent_color, facility_name_en, facility_name_ar, tagline_en, tagline_ar, contact_email, contact_phone, website, address_en, address_ar, custom_css } = req.body;
        if (primary_color && !colorHexValid(primary_color)) return res.status(400).json({ ok: false, error: 'invalid_primary_color_hex' });
        if (contact_email && !emailValid(contact_email)) return res.status(400).json({ ok: false, error: 'invalid_contact_email' });

        const r = await db.query(
            `INSERT INTO tenant_branding (tenant_id, logo_url, favicon_url, primary_color, secondary_color, accent_color, facility_name_en, facility_name_ar, tagline_en, tagline_ar, contact_email, contact_phone, website, address_en, address_ar, custom_css)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
             ON CONFLICT (tenant_id) DO UPDATE SET logo_url = EXCLUDED.logo_url, favicon_url = EXCLUDED.favicon_url, primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color, facility_name_en = EXCLUDED.facility_name_en, facility_name_ar = EXCLUDED.facility_name_ar, tagline_en = EXCLUDED.tagline_en, tagline_ar = EXCLUDED.tagline_ar, contact_email = EXCLUDED.contact_email, contact_phone = EXCLUDED.contact_phone, website = EXCLUDED.website, address_en = EXCLUDED.address_en, address_ar = EXCLUDED.address_ar, custom_css = EXCLUDED.custom_css, updated_at = NOW()
             RETURNING *`,
            [req.tenantId, logo_url || null, favicon_url || null, primary_color || null, secondary_color || null, accent_color || null,
             facility_name_en || null, facility_name_ar || null, tagline_en || null, tagline_ar || null,
             contact_email || null, contact_phone || null, website || null, address_en || null, address_ar || null, custom_css || null]
        );
        res.status(201).json({ ok: true, branding: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COMPANY SETTINGS (cross-tenant) =====
router.get('/company-settings', requireAuth, requireRole('super_admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM company_settings ORDER BY setting_key`);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/company-settings', requireAuth, requireRole('super_admin'), async (req, res) => {
    try {
        const { setting_key, setting_value, tenant_id } = req.body;
        if (!setting_key) return res.status(400).json({ ok: false, error: 'setting_key_required' });

        const r = await db.query(
            `INSERT INTO company_settings (tenant_id, setting_key, setting_value) VALUES ($1,$2,$3) RETURNING *`,
            [tenant_id || null, setting_key, setting_value || null]
        );
        res.status(201).json({ ok: true, setting: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CME ACTIVITIES =====
router.get('/cme/activities', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { category, status, since, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cme_activities WHERE 1=1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (since) { sql += ` AND activity_date >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY activity_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cme/activities', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { title, category, provider, credit_hours, activity_date, location, max_participants, description } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (category && !VALID_CME_CATEGORY.includes(category)) return res.status(400).json({ ok: false, error: 'invalid_category' });
        if (credit_hours !== undefined && credit_hours < 0) return res.status(400).json({ ok: false, error: 'invalid_credit_hours' });
        if (max_participants !== undefined && max_participants <= 0) return res.status(400).json({ ok: false, error: 'invalid_max_participants' });

        const r = await db.query(
            `INSERT INTO cme_activities (title, category, provider, credit_hours, activity_date, location, max_participants, status, description)
             VALUES ($1,$2,$3,$4,$5,$6,$7,'scheduled',$8) RETURNING *`,
            [title, category || null, provider || null, credit_hours ?? null, activity_date || null,
             location || null, max_participants || null, description || null]
        );
        res.status(201).json({ ok: true, activity: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cme/activities/:id/register', requireAuth, async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE cme_activities SET registered = COALESCE(registered, 0) + 1, status = CASE WHEN registered + 1 >= max_participants THEN 'full' ELSE status END WHERE id = $1 RETURNING *`,
            [req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'activity_not_found' });
        res.json({
            ok: true, activity: r.rows[0],
            computed: { enrollment_status: cmeCompletionStatus(r.rows[0].registered, r.rows[0].max_participants) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/amount', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { amount_minor, currency } = req.query;
        if (amount_minor === undefined) return res.status(400).json({ ok: false, error: 'amount_minor_required' });
        res.json({ ok: true, amount: saasAmount(parseInt(amount_minor), currency) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/subscription-status', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, current_period_end } = req.query;
        if (!status) return res.status(400).json({ ok: false, error: 'status_required' });
        res.json({ ok: true, status, validity: subStatusValidity(status, current_period_end) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/color-hex', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { hex } = req.query;
        res.json({ ok: true, hex, valid: colorHexValid(hex) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const subs = await db.query(`SELECT status, plan_key, COUNT(*) AS count FROM saas_billing_subscriptions WHERE tenant_id = $1 GROUP BY status, plan_key`, [req.tenantId]);
        const txs = await db.query(`SELECT status, currency, SUM(amount_minor) AS total_minor, COUNT(*) AS count FROM saas_billing_payment_transactions WHERE tenant_id = $1 GROUP BY status, currency`, [req.tenantId]);
        const dispense = await db.query(`SELECT status, COUNT(*) AS count FROM pharmacy_dispense WHERE tenant_id = $1 AND dispensed_at >= NOW() - INTERVAL '30 days' GROUP BY status`, [req.tenantId]);
        const reviews = await db.query(`SELECT severity, COUNT(*) AS count FROM clinical_pharmacy_reviews WHERE tenant_id = $1 GROUP BY severity`, [req.tenantId]);
        const cme = await db.query(`SELECT category, status, COUNT(*) AS count FROM cme_activities GROUP BY category, status`, [req.tenantId]);
        res.json({ ok: true, subscriptions: subs.rows, transactions: txs.rows, dispense_30d: dispense.rows, reviews: reviews.rows, cme: cme.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
