'use strict';
// Wave 116 — Patient portal (users/appointments/messages) + Telemedicine + ZATCA e-invoicing + SaaS plans
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PORTAL_STATUS = ['active','inactive','locked','suspended','pending_verification'];
const VALID_APPT_STATUS = ['requested','confirmed','rescheduled','cancelled','completed','no_show','expired'];
const VALID_MSG_SENDER = ['patient','provider','system','admin','staff'];
const VALID_MSG_STATUS = ['unread','read','replied','archived','spam'];
const VALID_TELEMED_STATUS = ['scheduled','in_progress','completed','cancelled','no_show','rescheduled','technical_failure','patient_joined','provider_joined'];
const VALID_SESSION_TYPE = ['video','audio','chat','async_review','second_opinion'];
const VALID_ZATCA_TYPE = ['standard','simplified','exports','debit_note','credit_note'];
const VALID_SUBMISSION_STATUS = ['pending','submitted','cleared','rejected','reported','queued'];
const VALID_CLEARANCE = ['cleared','reported','not_cleared','pending'];
const VALID_CREDIT_REASON = ['return','discount','cancellation','error','price_adjustment','other'];
const VALID_RISK = ['low','moderate','high','critical'];

function telemedWaitMin(scheduledDate, scheduledTime) {
    if (!scheduledDate || !scheduledTime) return null;
    const sched = new Date(`${scheduledDate}T${scheduledTime}`);
    if (isNaN(sched.getTime())) return null;
    return Math.round((Date.now() - sched.getTime()) / 60000);
}

function telemedEngagement(scheduled, status, duration) {
    if (status === 'no_show' || status === 'cancelled') return 'no_engagement';
    if (status === 'completed' && duration >= 5) return 'meaningful_engagement';
    if (status === 'completed' && duration < 5) return 'brief_engagement';
    if (status === 'in_progress' || status === 'patient_joined' || status === 'provider_joined') return 'in_engagement';
    return 'pending';
}

function zatcaCompliance(status, clearance) {
    const compliant = ['cleared', 'reported'];
    if (compliant.includes(clearance)) return 'fully_compliant';
    if (status === 'submitted') return 'pending_review';
    if (status === 'rejected') return 'non_compliant';
    return 'not_submitted';
}

function vatFromInclusive(amount, rate) {
    if (!amount) return null;
    const num = parseFloat(amount);
    const r = parseFloat(rate || 0.15);
    return Math.round((num - num / (1 + r)) * 100) / 100;
}

function planTier(monthly) {
    if (monthly === undefined || monthly === null) return null;
    if (monthly < 100) return 'starter';
    if (monthly < 1000) return 'basic';
    if (monthly < 5000) return 'professional';
    if (monthly < 20000) return 'enterprise';
    return 'custom';
}

function portalLockoutRisk(lastLogin, isActive, status) {
    if (status === 'locked' || status === 'suspended') return 'high';
    if (!isActive) return 'high';
    if (!lastLogin) return 'moderate';
    const days = Math.round((Date.now() - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
    if (days > 90) return 'stale_account';
    return 'normal';
}

function messagePriority(subject, isRead) {
    if (isRead) return 'low';
    const urgent = ['urgent','asap','emergency','critical','911','stat','pain','bleeding'];
    if (subject && urgent.some(k => subject.toLowerCase().includes(k))) return 'urgent';
    return 'normal';
}

function creditNoteNumberCheck(originalInvNum, creditNum) {
    if (!originalInvNum || !creditNum) return null;
    return creditNum.includes(originalInvNum.replace(/[A-Z]/g, '')) ? 'valid_derived' : 'custom';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'portal-telemed-zatca',
        endpoints: [
            'GET /portal/users',
            'POST /portal/users',
            'GET /portal/appointments',
            'POST /portal/appointments',
            'GET /portal/messages',
            'POST /portal/messages',
            'POST /portal/messages/:id/reply',
            'GET /telemed/sessions',
            'POST /telemed/sessions',
            'POST /telemed/sessions/:id/complete',
            'GET /zatca/invoices',
            'POST /zatca/invoices',
            'GET /zatca/credit-notes',
            'POST /zatca/credit-notes',
            'GET /saas/plans',
            'POST /saas/plans',
            'GET /saas/plan-entitlements',
            'POST /saas/plan-entitlements',
            'GET /vat',
            'GET /plan-tier',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== PORTAL USERS =====
router.get('/portal/users', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, patient_id, username, email, phone, is_active, last_login, created_at FROM portal_users WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/users', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, username, password_hash, email, phone, is_active } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!username) return res.status(400).json({ ok: false, error: 'username_required' });
        if (!password_hash) return res.status(400).json({ ok: false, error: 'password_hash_required' });
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });

        const r = await db.query(
            `INSERT INTO portal_users (tenant_id, patient_id, username, password_hash, email, phone, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, patient_id, username, email, phone, is_active, created_at`,
            [req.tenantId, parseInt(patient_id), username, password_hash, email || null, phone || null, is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, user: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PORTAL APPOINTMENTS =====
router.get('/portal/appointments', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, status, department, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name FROM portal_appointments a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND a.status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND a.department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/appointments', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!preferred_date) return res.status(400).json({ ok: false, error: 'preferred_date_required' });
        if (!department) return res.status(400).json({ ok: false, error: 'department_required' });
        if (status && !VALID_APPT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO portal_appointments (tenant_id, patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), portal_user_id || null, department, preferred_date,
             preferred_time || null, reason || null, status || 'requested', notes || null]
        );
        res.status(201).json({ ok: true, appointment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PORTAL MESSAGES =====
router.get('/portal/messages', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, sender_type, is_read, department, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT m.*, p.full_name AS patient_name FROM portal_messages m LEFT JOIN patients p ON p.id = m.patient_id WHERE m.tenant_id = $1`;
        if (patient_id) { sql += ` AND m.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (sender_type) { sql += ` AND m.sender_type = $${params.length + 1}`; params.push(sender_type); }
        if (is_read !== undefined) { sql += ` AND m.is_read = $${params.length + 1}`; params.push(is_read === 'true'); }
        if (department) { sql += ` AND m.department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/messages', requireAuth, requireTenantScope, requireRole('patient_relations'), async (req, res) => {
    try {
        const { patient_id, sender_type, sender_name, subject, body, department } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!sender_type || !VALID_MSG_SENDER.includes(sender_type)) return res.status(400).json({ ok: false, error: 'invalid_sender_type' });
        if (!body) return res.status(400).json({ ok: false, error: 'body_required' });

        const r = await db.query(
            `INSERT INTO portal_messages (tenant_id, patient_id, sender_type, sender_name, subject, body, department, is_read)
             VALUES ($1,$2,$3,$4,$5,$6,$7,false) RETURNING *`,
            [req.tenantId, parseInt(patient_id), sender_type, sender_name || null, subject || null, body, department || null]
        );
        res.status(201).json({
            ok: true, message: r.rows[0],
            computed: { priority: messagePriority(subject, false) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/messages/:id/reply', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { reply_body, replied_by } = req.body;
        if (!reply_body) return res.status(400).json({ ok: false, error: 'reply_body_required' });
        const r = await db.query(
            `UPDATE portal_messages SET is_read = true, replied_at = NOW(), replied_by = $1, reply_body = $2 WHERE tenant_id = $3 AND id = $4 RETURNING *`,
            [replied_by || req.user?.full_name || req.user?.username || 'system', reply_body, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'message_not_found' });
        res.json({ ok: true, message: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TELEMEDICINE SESSIONS =====
router.get('/telemed/sessions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor, status, session_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_lookup FROM telemedicine_sessions s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (doctor) { sql += ` AND s.doctor ILIKE $${params.length + 1}`; params.push(`%${doctor}%`); }
        if (status) { sql += ` AND s.status = $${params.length + 1}`; params.push(status); }
        if (session_type) { sql += ` AND s.session_type = $${params.length + 1}`; params.push(session_type); }
        sql += ` ORDER BY s.scheduled_date DESC, s.scheduled_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/telemed/sessions', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!doctor) return res.status(400).json({ ok: false, error: 'doctor_required' });
        if (session_type && !VALID_SESSION_TYPE.includes(session_type)) return res.status(400).json({ ok: false, error: 'invalid_session_type' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });

        const r = await db.query(
            `INSERT INTO telemedicine_sessions (tenant_id, patient_id, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'scheduled',$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), doctor, speciality || null, session_type || 'video',
             scheduled_date || null, scheduled_time || null, duration_minutes || 30, meeting_link || null, notes || null]
        );
        res.status(201).json({
            ok: true, session: r.rows[0],
            computed: { waiting_minutes: telemedWaitMin(scheduled_date, scheduled_time) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/telemed/sessions/:id/complete', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { duration_minutes, diagnosis, prescription, notes } = req.body;
        const r = await db.query(
            `UPDATE telemedicine_sessions SET status = 'completed', duration_minutes = COALESCE($1, duration_minutes), diagnosis = COALESCE($2, diagnosis), prescription = COALESCE($3, prescription), notes = COALESCE($4, notes) WHERE tenant_id = $5 AND id = $6 RETURNING *`,
            [duration_minutes || null, diagnosis || null, prescription || null, notes || null, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({
            ok: true, session: r.rows[0],
            computed: { engagement: telemedEngagement(r.rows[0].scheduled_date, 'completed', parseInt(r.rows[0].duration_minutes) || 0) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ZATCA INVOICES (KSA e-invoicing) =====
router.get('/zatca/invoices', requireAuth, requireTenantScope, requireRole('finance'), async (req, res) => {
    try {
        const { submission_status, clearance_status, invoice_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM zatca_invoices WHERE tenant_id = $1`;
        if (submission_status) { sql += ` AND submission_status = $${params.length + 1}`; params.push(submission_status); }
        if (clearance_status) { sql += ` AND clearance_status = $${params.length + 1}`; params.push(clearance_status); }
        if (invoice_type) { sql += ` AND invoice_type = $${params.length + 1}`; params.push(invoice_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/zatca/invoices', requireAuth, requireTenantScope, requireRole('finance'), async (req, res) => {
    try {
        const { invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat } = req.body;
        if (!invoice_number) return res.status(400).json({ ok: false, error: 'invoice_number_required' });
        if (!invoice_type || !VALID_ZATCA_TYPE.includes(invoice_type)) return res.status(400).json({ ok: false, error: 'invalid_invoice_type' });
        if (!total_with_vat || total_with_vat < 0) return res.status(400).json({ ok: false, error: 'invalid_total' });
        if (vat_amount === undefined || vat_amount < 0) return res.status(400).json({ ok: false, error: 'invalid_vat' });
        const computedVAT = vat_amount !== undefined ? vat_amount : vatFromInclusive(total_with_vat, 0.15);

        const r = await db.query(
            `INSERT INTO zatca_invoices (tenant_id, invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat, submission_status, clearance_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending','pending') RETURNING *`,
            [req.tenantId, invoice_id || null, invoice_number, invoice_type,
             seller_name || null, seller_vat || null, buyer_name || null, buyer_vat || null,
             total_before_vat || null, vat_amount ?? computedVAT, total_with_vat]
        );
        res.status(201).json({
            ok: true, invoice: r.rows[0],
            computed: { computed_vat_15pct: vatFromInclusive(total_with_vat, 0.15), compliance: zatcaCompliance('pending', 'pending') }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ZATCA CREDIT NOTES =====
router.get('/zatca/credit-notes', requireAuth, requireTenantScope, requireRole('finance'), async (req, res) => {
    try {
        const { original_invoice_id, clearance_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM zatca_credit_notes WHERE tenant_id = $1`;
        if (original_invoice_id) { sql += ` AND original_invoice_id = $${params.length + 1}`; params.push(parseInt(original_invoice_id)); }
        if (clearance_status) { sql += ` AND clearance_status = $${params.length + 1}`; params.push(clearance_status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/zatca/credit-notes', requireAuth, requireTenantScope, requireRole('finance'), async (req, res) => {
    try {
        const { original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat } = req.body;
        if (!original_invoice_id) return res.status(400).json({ ok: false, error: 'original_invoice_id_required' });
        if (!credit_note_number) return res.status(400).json({ ok: false, error: 'credit_note_number_required' });
        if (!credit_reason || !VALID_CREDIT_REASON.includes(credit_reason)) return res.status(400).json({ ok: false, error: 'invalid_credit_reason' });
        if (total_with_vat === undefined || total_with_vat < 0) return res.status(400).json({ ok: false, error: 'invalid_total' });

        const orig = await db.query(`SELECT invoice_number FROM zatca_invoices WHERE tenant_id = $1 AND id = $2`, [req.tenantId, original_invoice_id]);
        const derivedCheck = orig.rows.length ? creditNoteNumberCheck(orig.rows[0].invoice_number, credit_note_number) : null;

        const r = await db.query(
            `INSERT INTO zatca_credit_notes (tenant_id, original_invoice_id, credit_note_number, buyer_name, buyer_vat, credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat, clearance_status, submission_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending','pending') RETURNING *`,
            [req.tenantId, parseInt(original_invoice_id), credit_note_number, buyer_name || null, buyer_vat || null,
             credit_reason, credit_reason_code || null, subtotal ?? null, vat_amount ?? null, total_with_vat]
        );
        res.status(201).json({
            ok: true, credit_note: r.rows[0],
            computed: { derivation: derivedCheck }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAAS PLANS =====
router.get('/saas/plans', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { active, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM plans WHERE 1=1`;
        if (active !== undefined) { sql += ` AND active = $${params.length + 1}`; params.push(active === 'true'); }
        sql += ` ORDER BY sort_order ASC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/plans', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_key, name_ar, name_en, description_ar, description_en, currency, monthly_price, yearly_price, trial_days, sort_order } = req.body;
        if (!plan_key) return res.status(400).json({ ok: false, error: 'plan_key_required' });
        if (!name_en) return res.status(400).json({ ok: false, error: 'name_en_required' });

        const r = await db.query(
            `INSERT INTO plans (plan_key, name_ar, name_en, description_ar, description_en, currency, monthly_price, yearly_price, trial_days, sort_order, active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) RETURNING *`,
            [plan_key, name_ar || null, name_en, description_ar || null, description_en || null,
             currency || 'SAR', monthly_price ?? null, yearly_price ?? null, trial_days || 14, sort_order || 0]
        );
        res.status(201).json({
            ok: true, plan: r.rows[0],
            computed: { tier: planTier(monthly_price) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAAS PLAN ENTITLEMENTS =====
router.get('/saas/plan-entitlements', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM plan_entitlements WHERE 1=1`;
        if (plan_id) { sql += ` AND plan_id = $${params.length + 1}`; params.push(parseInt(plan_id)); }
        sql += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/plan-entitlements', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_id, max_users, max_branches, max_invoices_per_month, modules_enabled, support_level, api_access, custom_domain } = req.body;
        if (!plan_id) return res.status(400).json({ ok: false, error: 'plan_id_required' });
        if (max_users !== undefined && max_users < 0) return res.status(400).json({ ok: false, error: 'invalid_max_users' });
        if (max_branches !== undefined && max_branches < 0) return res.status(400).json({ ok: false, error: 'invalid_max_branches' });

        const r = await db.query(
            `INSERT INTO plan_entitlements (plan_id, max_users, max_branches, max_invoices_per_month, modules_enabled, support_level, api_access, custom_domain)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(plan_id), max_users ?? null, max_branches ?? null, max_invoices_per_month ?? null,
             modules_enabled || null, support_level || null, !!api_access, !!custom_domain]
        );
        res.status(201).json({ ok: true, entitlement: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/vat', requireAuth, requireTenantScope, requireRole('finance'), async (req, res) => {
    try {
        const { amount, rate } = req.query;
        if (amount === undefined) return res.status(400).json({ ok: false, error: 'amount_required' });
        const r = parseFloat(rate || 0.15);
        const vat = vatFromInclusive(amount, r);
        const net = Math.round((parseFloat(amount) - vat) * 100) / 100;
        res.json({ ok: true, gross: parseFloat(amount), vat_rate: r, vat_amount: vat, net_amount: net });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/plan-tier', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { monthly_price } = req.query;
        if (monthly_price === undefined) return res.status(400).json({ ok: false, error: 'monthly_price_required' });
        res.json({ ok: true, monthly_price: parseFloat(monthly_price), tier: planTier(monthly_price) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const portal = await db.query(`SELECT is_active, COUNT(*) AS count FROM portal_users WHERE tenant_id = $1 GROUP BY is_active`, [req.tenantId]);
        const appts = await db.query(`SELECT status, COUNT(*) AS count FROM portal_appointments WHERE tenant_id = $1 GROUP BY status ORDER BY count DESC`, [req.tenantId]);
        const msg = await db.query(`SELECT is_read, sender_type, COUNT(*) AS count FROM portal_messages WHERE tenant_id = $1 GROUP BY is_read, sender_type`, [req.tenantId]);
        const telemed = await db.query(`SELECT status, session_type, COUNT(*) AS count FROM telemedicine_sessions WHERE tenant_id = $1 GROUP BY status, session_type`, [req.tenantId]);
        const zatca = await db.query(`SELECT clearance_status, submission_status, COUNT(*) AS count FROM zatca_invoices WHERE tenant_id = $1 GROUP BY clearance_status, submission_status`, [req.tenantId]);
        res.json({ ok: true, portal_users: portal.rows, portal_appointments: appts.rows, portal_messages: msg.rows, telemed_sessions: telemed.rows, zatca_invoices: zatca.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
