// filepath: namaweb/patient_portal_router.js
// Patient-facing self-service portal endpoints.
// Read-only access to: own appointments, own labs, own active prescriptions/messages, request appt.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Helper: resolve patient_id from session.user (assumes patient users have linked patient_id)
async function getPatientFromSession(req) {
    if (req.user && req.user.patient_id) return req.user.patient_id;
    // Fallback: lookup by national_id or phone
    const r = await db.query(`SELECT id FROM patients WHERE tenant_id = $1 AND phone = $2 LIMIT 1`, [req.tenantId, req.user?.phone || '']);
    return r.rows.length > 0 ? r.rows[0].id : null;
}

// ============================================================
// GET /api/patient-portal/me
// Current patient identity (or 404 if not linked)
// ============================================================
router.get('/me', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const patientId = await getPatientFromSession(req);
        if (!patientId) return res.status(404).json({ error: 'patient_record_not_linked' });
        const r = await db.query(`
            SELECT id, name_en, name_ar, age, sex, dob, phone, national_id
            FROM patients WHERE id = $1 AND tenant_id = $2
        `, [patientId, req.tenantId]);
        res.json({ ok: true, patient: r.rows[0] || null });
    } catch (err) {
        console.error('GET /api/patient-portal/me', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient-portal/appointments
// ============================================================
router.get('/appointments', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const patientId = await getPatientFromSession(req);
        if (!patientId) return res.status(404).json({ error: 'patient_record_not_linked' });
        const result = await db.query(`
            SELECT id, doctor_name, department, appt_date, appt_time, status, notes
            FROM appointments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY appt_date DESC, appt_time DESC LIMIT 50
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, appointments: result.rows });
    } catch (err) {
        console.error('GET /api/patient-portal/appointments', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/patient-portal/appointments/request
// Patient self-service appointment request
// ============================================================
router.post('/appointments/request', requireAuth, requireTenantScope, requireRole('patient'), async (req, res) => {
    try {
        const patientId = await getPatientFromSession(req);
        if (!patientId) return res.status(404).json({ error: 'patient_record_not_linked' });
        const { appt_date, appt_time, department, reason } = req.body;
        if (!appt_date || !appt_time || !department) return res.status(400).json({ error: 'missing_required', required: ['appt_date', 'appt_time', 'department'] });
        // Insert as 'scheduled' but flagged for staff confirmation
        const result = await db.query(`
            INSERT INTO appointments (tenant_id, patient_id, department, appt_date, appt_time, notes, status)
            VALUES ($1,$2,$3,$4,$5,$6,'scheduled') RETURNING id
        `, [req.tenantId, patientId, department, appt_date, appt_time, `[Patient Request] ${reason || ''}`]);
        res.status(201).json({ ok: true, id: result.rows[0].id, status: 'awaiting_staff_confirmation' });
    } catch (err) {
        console.error('POST /api/patient-portal/appointments/request', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient-portal/labs
// Recent lab results (last 30 days, abnormal first)
// ============================================================
router.get('/labs', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = await getPatientFromSession(req);
        if (!patientId) return res.status(404).json({ error: 'patient_record_not_linked' });
        const result = await db.query(`
            SELECT test_name, value, unit, ref_low, ref_high, abnormal_flag, is_critical, reported_at
            FROM lab_results WHERE tenant_id = $1 AND patient_id = $2
              AND reported_at >= NOW() - INTERVAL '90 days'
            ORDER BY abnormal_flag DESC NULLS LAST, reported_at DESC LIMIT 100
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, results: result.rows });
    } catch (err) {
        console.error('GET /api/patient-portal/labs', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient-portal/allergies
// ============================================================
router.get('/allergies', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = await getPatientFromSession(req);
        if (!patientId) return res.status(404).json({ error: 'patient_record_not_linked' });
        const result = await db.query(`
            SELECT allergen, allergen_type, reaction, severity FROM allergies
            WHERE tenant_id = $1 AND patient_id = $2 AND active = TRUE
            ORDER BY CASE severity WHEN 'anaphylaxis' THEN 1 WHEN 'severe' THEN 2 ELSE 3 END
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, allergies: result.rows });
    } catch (err) {
        console.error('GET /api/patient-portal/allergies', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient-portal/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['me', 'appointments', 'appointments/request', 'labs', 'allergies'], timestamp: new Date().toISOString() });
});

module.exports = router;