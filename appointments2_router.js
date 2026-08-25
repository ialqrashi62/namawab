// filepath: namaweb/appointments2_router.js
// Appointments + Insurance eligibility/preauth + Medical certificates.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/appointments', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'receptionist'), async (req, res) => {
    try {
        const { date, doctor_name, department, status, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (date) { params.push(date); conditions.push(`appt_date = $${params.length}`); }
        if (doctor_name) { params.push(doctor_name); conditions.push(`doctor_name = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, status, notes, created_at
            FROM appointments WHERE ${conditions.join(' AND ')}
            ORDER BY appt_date, appt_time LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, appointments: r.rows });
    } catch (err) { console.error('GET /api/apt2', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/appointments/today', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor_name, department, appt_time, status
            FROM appointments WHERE tenant_id = $1 AND appt_date = CURRENT_DATE
            ORDER BY appt_time LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, appointments: r.rows });
    } catch (err) { console.error('GET /api/apt2/today', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/appointments', requireAuth, requireTenantScope, requireRole('receptionist', 'nurse', 'admin', 'doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes } = req.body;
        if (!patient_name || !doctor_name || !appt_date) return res.status(400).json({ error: 'missing_required', required: ['patient_name', 'doctor_name', 'appt_date'] });
        const r = await db.query(`
            INSERT INTO appointments (tenant_id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled') RETURNING id
        `, [req.tenantId, patient_id || null, patient_name, doctor_name, department || 'general', appt_date, appt_time, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/apt2', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/appointments/:id/cancel', requireAuth, requireTenantScope, requireRole('receptionist', 'admin', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(`
            UPDATE appointments SET status = 'cancelled', notes = COALESCE(notes || E'\n[CANCEL] ', '') || $3
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, reason || 'No reason given']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/apt2/cancel', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/certificates', requireAuth, requireTenantScope, requireRole('doctor', 'admin', 'nurse'), async (req, res) => {
    try {
        const { cert_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (cert_type) { params.push(cert_type); conditions.push(`cert_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor_name, cert_type, diagnosis, start_date, end_date, days, created_at
            FROM medical_certificates WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, certificates: r.rows });
    } catch (err) { console.error('GET /api/apt2/certificates', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/certificates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, cert_type, diagnosis, start_date, end_date, days, notes } = req.body;
        if (!patient_id || !cert_type || !start_date || !end_date) return res.status(400).json({ error: 'missing_required' });
        const computedDays = days || Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
        const r = await db.query(`
            INSERT INTO medical_certificates (tenant_id, patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, start_date, end_date, days, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', req.userId, req.userName || '', cert_type, diagnosis || '', start_date, end_date, computedDays, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, days: computedDays });
    } catch (err) { console.error('POST /api/apt2/certificates', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/insurance/eligibility', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'doctor'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, insurance_company_id, policy_number, status, coverage_amount,
                   checked_by, created_at
            FROM insurance_eligibility_checks WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, checks: r.rows });
    } catch (err) { console.error('GET /api/apt2/insurance/eligibility', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/insurance/eligibility', requireAuth, requireTenantScope, requireRole('receptionist', 'admin', 'finance'), async (req, res) => {
    try {
        const { patient_id, insurance_company_id, policy_number, coverage_amount } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO insurance_eligibility_checks (tenant_id, patient_id, insurance_company_id, policy_number, coverage_amount, status, checked_by)
            VALUES ($1, $2, $3, $4, $5, 'verified', $6) RETURNING id
        `, [req.tenantId, patient_id, insurance_company_id || null, policy_number || '', coverage_amount || 0, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, status: 'verified' });
    } catch (err) { console.error('POST /api/apt2/insurance/eligibility', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/insurance/preauth', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'doctor'), async (req, res) => {
    try {
        const { auth_status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (auth_status) { params.push(auth_status); conditions.push(`auth_status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, admission_id, insurance_company_id, requested_amount, approved_amount,
                   auth_status, auth_number, clinical_justification, requested_by, decided_at, created_at
            FROM insurance_pre_authorizations WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, preauths: r.rows });
    } catch (err) { console.error('GET /api/apt2/insurance/preauth', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/insurance/preauth', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, admission_id, insurance_company_id, requested_amount, clinical_justification } = req.body;
        if (!patient_id || !requested_amount) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO insurance_pre_authorizations (tenant_id, patient_id, admission_id, insurance_company_id, requested_amount, clinical_justification, auth_status, requested_by)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7) RETURNING id
        `, [req.tenantId, patient_id, admission_id || null, insurance_company_id || null, requested_amount, clinical_justification || '', req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, auth_status: 'pending' });
    } catch (err) { console.error('POST /api/apt2/insurance/preauth', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/insurance/preauth/:id/decide', requireAuth, requireTenantScope, requireRole('admin', 'finance'), async (req, res) => {
    try {
        const { approved_amount, auth_number, decision } = req.body;
        if (!['approved', 'denied'].includes(decision)) return res.status(400).json({ error: 'invalid_decision', allowed: ['approved', 'denied'] });
        const r = await db.query(`
            UPDATE insurance_pre_authorizations SET auth_status = $3, approved_amount = COALESCE($4, 0), auth_number = $5, decided_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND auth_status = 'pending' RETURNING id, auth_status, auth_number, decided_at
        `, [req.params.id, req.tenantId, decision, approved_amount, auth_number || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_decided' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/apt2/insurance/preauth/:id/decide', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'receptionist'), async (req, res) => {
    try {
        const apt = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE appt_date = CURRENT_DATE) as today,
                   COUNT(*) FILTER (WHERE appt_date >= CURRENT_DATE AND status = 'scheduled') as upcoming,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                   COUNT(*) FILTER (WHERE status = 'no_show') as no_show
            FROM appointments WHERE tenant_id = $1
        `, [req.tenantId]);
        const cert = await db.query(`
            SELECT cert_type, COUNT(*) as cnt FROM medical_certificates
            WHERE tenant_id = $1 GROUP BY cert_type ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        const preauth = await db.query(`
            SELECT
                COUNT(*) FILTER (WHERE auth_status = 'pending') as pending,
                COUNT(*) FILTER (WHERE auth_status = 'approved') as approved,
                COUNT(*) FILTER (WHERE auth_status = 'denied') as denied
            FROM insurance_pre_authorizations WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, appointments: apt.rows[0], certificates_by_type: cert.rows, preauth: preauth.rows[0] });
    } catch (err) { console.error('GET /api/apt2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['appointments', 'certificates', 'insurance/eligibility', 'insurance/preauth', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
