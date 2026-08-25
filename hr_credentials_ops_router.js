'use strict';
// Wave 122 — HR credentialing & facility operations hub
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_CRED_STATUS = ['pending','verified','expired','revoked','suspended'];
const VALID_EXPOSURE_RESULT = ['negative','positive','inconclusive','pending'];
const VALID_WASTE_TYPE = ['general','infectious','sharps','pharmaceutical','chemical','radioactive','pathological'];
const VALID_NOTIF_TYPE = ['info','warning','error','success','alert','reminder'];
const VALID_NOTIF_MODULE = ['lab','rad','pharmacy','billing','hr','appointment','admission','inventory','maintenance','finance','emr','system'];
const VALID_PRIORITY = ['low','normal','high','urgent','critical'];
const VALID_APPROVAL_STATUS = ['pending','approved','rejected','cancelled','expired'];

function licenseDaysToExpiry(expiryDate) {
    if (!expiryDate) return null;
    const exp = new Date(expiryDate);
    const now = new Date();
    return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
}

function licenseStatus(expiryDate, status) {
    if (status === 'revoked') return 'revoked';
    if (status === 'suspended') return 'suspended';
    const days = licenseDaysToExpiry(expiryDate);
    if (days === null) return 'unknown';
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring_soon';
    if (days <= 90) return 'expiring';
    return 'active';
}

function cmeCompliance(cmeHours, requiredHours) {
    if (cmeHours === undefined || cmeHours === null || requiredHours === undefined || requiredHours === null) return null;
    const pct = (parseFloat(cmeHours) / parseFloat(requiredHours)) * 100;
    return {
        cme_hours: parseFloat(cmeHours),
        required_hours: parseFloat(requiredHours),
        percentage: Math.round(pct * 10) / 10,
        compliant: cmeHours >= requiredHours,
        remaining_hours: Math.max(0, Math.round((requiredHours - cmeHours) * 10) / 10)
    };
}

function wasteCompliance(totalKgByType, monthlyTargetKg) {
    const total = Object.values(totalKgByType || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    return {
        total_kg: Math.round(total * 100) / 100,
        monthly_target: monthlyTargetKg,
        under_target: total <= monthlyTargetKg,
        by_type: totalKgByType
    };
}

function notificationPriorityBucket(priority) {
    if (priority === 'critical' || priority === 'urgent') return 'immediate';
    if (priority === 'high') return 'soon';
    if (priority === 'normal') return 'normal';
    return 'low';
}

function messageReadRate(total, read) {
    const t = parseInt(total) || 0;
    const r = parseInt(read) || 0;
    return t > 0 ? Math.round((r / t) * 1000) / 10 : 0;
}

function approvalAgeDays(requestDate) {
    if (!requestDate) return null;
    const d = new Date(requestDate);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((new Date() - d) / (1000 * 60 * 60 * 24));
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'hr-credentials-ops',
        endpoints: [
            'GET /credentials',
            'POST /credentials',
            'GET /licenses',
            'POST /licenses',
            'GET /license-status',
            'GET /competencies',
            'POST /competencies',
            'GET /cme-compliance',
            'GET /hcm-credentialing',
            'POST /hcm-credentialing',
            'GET /employee-exposures',
            'POST /employee-exposures',
            'GET /medical-waste',
            'POST /medical-waste',
            'GET /waste-compliance',
            'GET /notifications',
            'POST /notifications',
            'GET /messages',
            'POST /messages',
            'GET /approvals',
            'POST /approvals',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== HR CREDENTIALING =====
router.get('/credentials', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, verification_status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_credentialing WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(parseInt(employee_id)); }
        if (verification_status) { sql += ` AND verification_status = $${params.length + 1}`; params.push(verification_status); }
        sql += ` ORDER BY expiry_date NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, computed_status: licenseStatus(c.expiry_date, c.verification_status), days_to_expiry: licenseDaysToExpiry(c.expiry_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/credentials', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, employee_name, credential_number, credential_type, issue_date, expiry_date, verification_status, notes } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        if (credential_type && !VALID_CRED_STATUS.concat(['valid']).includes(credential_type)) {} // no enum check
        const r = await db.query(
            `INSERT INTO hr_credentialing (employee_id, employee_name, credential_number, credential_type, issue_date, expiry_date, verification_status, verified_by, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(employee_id), employee_name || null, credential_number || null, credential_type || null,
             issue_date || null, expiry_date || null, verification_status || 'pending', req.user?.username || null,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, credential: r.rows[0], computed: { status: licenseStatus(expiry_date, verification_status), days_to_expiry: licenseDaysToExpiry(expiry_date) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== HR LICENSES =====
router.get('/licenses', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_licenses WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(parseInt(employee_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY expiry_date NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(l => ({ ...l, days_to_expiry: licenseDaysToExpiry(l.expiry_date), alert: licenseDaysToExpiry(l.expiry_date) !== null && licenseDaysToExpiry(l.expiry_date) <= (l.alert_days || 30) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/licenses', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, license_type, license_number, authority, issue_date, expiry_date, alert_days, status, notes } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        const r = await db.query(
            `INSERT INTO hr_licenses (employee_id, license_type, license_number, authority, issue_date, expiry_date, alert_days, status, notes, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(employee_id), license_type || null, license_number || null, authority || null,
             issue_date || null, expiry_date || null, alert_days || 30, status || 'active',
             notes || null, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, license: r.rows[0], computed: { days_to_expiry: licenseDaysToExpiry(expiry_date), will_alert: licenseDaysToExpiry(expiry_date) !== null && licenseDaysToExpiry(expiry_date) <= (alert_days || 30) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/license-status', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { expiry_date, current_status } = req.query;
        res.json({ ok: true, computed_status: licenseStatus(expiry_date, current_status), days_to_expiry: licenseDaysToExpiry(expiry_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== HR COMPETENCIES (CME) =====
router.get('/competencies', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_competencies WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(parseInt(employee_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY period_end DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, compliance: cmeCompliance(c.cme_hours, c.required_hours) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/competencies', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, competency_name, cme_hours, required_hours, period_start, period_end, status, notes } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        const r = await db.query(
            `INSERT INTO hr_competencies (employee_id, competency_name, cme_hours, required_hours, period_start, period_end, status, notes, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(employee_id), competency_name || null, cme_hours || 0, required_hours || 0,
             period_start || null, period_end || null, status || 'in_progress',
             notes || null, req.user?.username || null, req.tenantId]
        );
        res.status(201).json({ ok: true, competency: r.rows[0], compliance: cmeCompliance(cme_hours, required_hours) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cme-compliance', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { cme_hours, required_hours } = req.query;
        if (cme_hours === undefined || required_hours === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, compliance: cmeCompliance(parseFloat(cme_hours), parseFloat(required_hours)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== HCM CREDENTIALING LOGS =====
router.get('/hcm-credentialing', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { physician_id, credentialing_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hcm_credentialing_logs WHERE tenant_id = $1`;
        if (physician_id) { sql += ` AND physician_id = $${params.length + 1}`; params.push(physician_id); }
        if (credentialing_status) { sql += ` AND credentialing_status = $${params.length + 1}`; params.push(credentialing_status); }
        sql += ` ORDER BY last_audit_date DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/hcm-credentialing', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { physician_id, license_expiry_date, credentialing_status, last_audit_date } = req.body;
        if (!physician_id) return res.status(400).json({ ok: false, error: 'physician_id_required' });
        const r = await db.query(
            `INSERT INTO hcm_credentialing_logs (tenant_id, physician_id, license_expiry_date, credentialing_status, last_audit_date)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, physician_id, license_expiry_date || null, credentialing_status || 'pending', last_audit_date || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== EMPLOYEE EXPOSURES (Needlestick, etc.) =====
router.get('/employee-exposures', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, exposure_type, result, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM employee_exposures WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(parseInt(employee_id)); }
        if (exposure_type) { sql += ` AND exposure_type = $${params.length + 1}`; params.push(exposure_type); }
        if (result) { sql += ` AND result = $${params.length + 1}`; params.push(result); }
        sql += ` ORDER BY exposure_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/employee-exposures', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { employee_id, employee_name, exposure_type, exposure_date, source_patient, body_fluid, ppe_worn, action_taken, followup_date, result, reported_by } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        const r = await db.query(
            `INSERT INTO employee_exposures (employee_id, employee_name, exposure_type, exposure_date, source_patient, body_fluid, ppe_worn, action_taken, followup_date, result, reported_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [parseInt(employee_id), employee_name || null, exposure_type || null, exposure_date || null,
             source_patient || null, body_fluid || null, ppe_worn || null, action_taken || null,
             followup_date || null, result || 'pending', reported_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, exposure: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEDICAL WASTE =====
router.get('/medical-waste', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { waste_type, days = 90, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM medical_waste_logs WHERE tenant_id = $1 AND logged_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (waste_type) { sql += ` AND waste_type = $${params.length + 1}`; params.push(waste_type); }
        sql += ` ORDER BY logged_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const byType = {};
        r.rows.forEach(w => { byType[w.waste_type] = (parseFloat(byType[w.waste_type] || 0) + parseFloat(w.weight_kg || 0)); });
        res.json({ ok: true, count: r.rows.length, rows: r.rows, summary_by_type: byType });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/medical-waste', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { waste_type, weight_kg, disposal_company, truck_number, notes } = req.body;
        if (waste_type && !VALID_WASTE_TYPE.includes(waste_type)) return res.status(400).json({ ok: false, error: 'invalid_waste_type', valid: VALID_WASTE_TYPE });
        const r = await db.query(
            `INSERT INTO medical_waste_logs (waste_type, weight_kg, disposal_company, truck_number, logged_by, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [waste_type || 'general', parseFloat(weight_kg || 0), disposal_company || null,
             truck_number || null, req.user?.username || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/waste-compliance', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { total_general, total_infectious, total_sharps, total_pharmaceutical, total_chemical, monthly_target = 500 } = req.query;
        const byType = {
            general: parseFloat(total_general || 0),
            infectious: parseFloat(total_infectious || 0),
            sharps: parseFloat(total_sharps || 0),
            pharmaceutical: parseFloat(total_pharmaceutical || 0),
            chemical: parseFloat(total_chemical || 0)
        };
        res.json({ ok: true, compliance: wasteCompliance(byType, parseFloat(monthly_target)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NOTIFICATIONS =====
router.get('/notifications', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { user_id, target_role, type, module, is_read, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM notifications WHERE tenant_id = $1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (target_role) { sql += ` AND target_role = $${params.length + 1}`; params.push(target_role); }
        if (type) { sql += ` AND type = $${params.length + 1}`; params.push(type); }
        if (module) { sql += ` AND module = $${params.length + 1}`; params.push(module); }
        if (is_read !== undefined) { sql += ` AND is_read = $${params.length + 1}`; params.push(parseInt(is_read)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/notifications', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { user_id, target_role, title, title_ar, message, body, body_ar, type, module, record_id } = req.body;
        if (!title && !title_ar) return res.status(400).json({ ok: false, error: 'title_required' });
        if (type && !VALID_NOTIF_TYPE.includes(type)) return res.status(400).json({ ok: false, error: 'invalid_type', valid: VALID_NOTIF_TYPE });
        if (module && !VALID_NOTIF_MODULE.includes(module)) return res.status(400).json({ ok: false, error: 'invalid_module', valid: VALID_NOTIF_MODULE });
        const r = await db.query(
            `INSERT INTO notifications (user_id, target_role, title, title_ar, message, body, body_ar, type, module, record_id, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [user_id ? parseInt(user_id) : null, target_role || null, title || null, title_ar || null,
             message || null, body || null, body_ar || null, type || 'info', module || null,
             record_id ? parseInt(record_id) : null, req.tenantId]
        );
        res.status(201).json({ ok: true, notification: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== INTERNAL MESSAGES =====
router.get('/messages', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { sender_id, receiver_id, is_read, priority, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM internal_messages WHERE tenant_id = $1`;
        if (sender_id) { sql += ` AND sender_id = $${params.length + 1}`; params.push(parseInt(sender_id)); }
        if (receiver_id) { sql += ` AND receiver_id = $${params.length + 1}`; params.push(parseInt(receiver_id)); }
        if (is_read !== undefined) { sql += ` AND is_read = $${params.length + 1}`; params.push(parseInt(is_read)); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const total = r.rows.length;
        const read = r.rows.filter(m => m.is_read === 1).length;
        res.json({ ok: true, count: total, rows: r.rows, read_rate_pct: messageReadRate(total, read) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/messages', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { receiver_id, subject, body, priority } = req.body;
        if (!receiver_id) return res.status(400).json({ ok: false, error: 'receiver_id_required' });
        if (priority && !VALID_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority', valid: VALID_PRIORITY });
        const r = await db.query(
            `INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.user?.id || null, parseInt(receiver_id), subject || null, body || null,
             priority || 'normal', req.tenantId]
        );
        res.status(201).json({ ok: true, message: r.rows[0], priority_bucket: notificationPriorityBucket(priority) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== APPROVALS (insurance pre-auth, service) =====
router.get('/approvals', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, service_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM approvals WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (service_id) { sql += ` AND service_id = $${params.length + 1}`; params.push(parseInt(service_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY request_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, age_days: approvalAgeDays(a.request_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/approvals', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, service_id, request_date, status, approval_number, response_date } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_APPROVAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_APPROVAL_STATUS });
        const r = await db.query(
            `INSERT INTO approvals (patient_id, service_id, request_date, status, approval_number, response_date, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(patient_id), service_id ? parseInt(service_id) : null, request_date || null,
             status || 'pending', approval_number || null, response_date || null, req.tenantId]
        );
        res.status(201).json({ ok: true, approval: r.rows[0], age_days: approvalAgeDays(request_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const cred = await db.query(`SELECT verification_status, COUNT(*) AS count FROM hr_credentialing WHERE tenant_id = $1 GROUP BY verification_status`, [req.tenantId]);
        const lic = await db.query(`SELECT status, COUNT(*) AS count FROM hr_licenses WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const comp = await db.query(`SELECT status, COUNT(*) AS count FROM hr_competencies WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const exp = await db.query(`SELECT result, COUNT(*) AS count FROM employee_exposures WHERE tenant_id = $1 GROUP BY result`, [req.tenantId]);
        const waste = await db.query(`SELECT waste_type, COUNT(*) AS count, SUM(weight_kg) AS total_kg FROM medical_waste_logs WHERE tenant_id = $1 GROUP BY waste_type`, [req.tenantId]);
        const notif = await db.query(`SELECT is_read, COUNT(*) AS count FROM notifications WHERE tenant_id = $1 GROUP BY is_read`, [req.tenantId]);
        const msgs = await db.query(`SELECT is_read, COUNT(*) AS count FROM internal_messages WHERE tenant_id = $1 GROUP BY is_read`, [req.tenantId]);
        const appr = await db.query(`SELECT status, COUNT(*) AS count FROM approvals WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        res.json({
            ok: true,
            credentials: cred.rows,
            licenses: lic.rows,
            competencies: comp.rows,
            exposures: exp.rows,
            waste: waste.rows,
            notifications: notif.rows,
            messages: msgs.rows,
            approvals: appr.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
