// filepath: namaweb/appointments_router.js
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Adapts to existing appointments table: id, patient_id, patient_name, doctor_name, department,
// appt_date, appt_time, notes, status, created_at, tenant_id, branch_id
const VALID_STATUS = ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'];

// POST /api/appointments
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status } = req.body;
        if (!patient_id || !appt_date || !appt_time) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'appt_date', 'appt_time'] });
        const st = status || 'scheduled';
        if (!VALID_STATUS.includes(st)) return res.status(400).json({ error: 'invalid_status', valid: VALID_STATUS });
        const conflict = await db.query(`
            SELECT id FROM appointments WHERE tenant_id = $1 AND patient_id = $2 AND appt_date = $3 AND appt_time = $4 AND status NOT IN ('cancelled', 'no_show')
            LIMIT 1
        `, [req.tenantId, patient_id, appt_date, appt_time]);
        if (conflict.rows.length > 0) return res.status(409).json({ error: 'patient_already_has_appointment_at_same_time' });
        const result = await db.query(`
            INSERT INTO appointments (tenant_id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', doctor_name || '', department || '', appt_date, appt_time, notes || '', st]);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/appointments', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist', 'admin'), async (req, res) => {
    try {
        const { patient_id, doctor_name, date, status, department } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (doctor_name) { params.push(doctor_name); conditions.push(`doctor_name = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (date) { params.push(date); conditions.push(`appt_date = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const result = await db.query(`
            SELECT id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, status, notes, created_at
            FROM appointments WHERE ${conditions.join(' AND ')}
            ORDER BY appt_date DESC, appt_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: result.rows.length, appointments: result.rows });
    } catch (err) {
        console.error('GET /api/appointments', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/today', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, status, notes
            FROM appointments WHERE tenant_id = $1 AND appt_date = CURRENT_DATE
            ORDER BY appt_time
        `, [req.tenantId]);
        res.json({ ok: true, total: result.rows.length, appointments: result.rows });
    } catch (err) {
        console.error('GET /api/appointments/today', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.post('/:id/status', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!VALID_STATUS.includes(status)) return res.status(400).json({ error: 'invalid_status', valid: VALID_STATUS });
        const result = await db.query(`
            UPDATE appointments SET status = $3 WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, status]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...result.rows[0] });
    } catch (err) {
        console.error('POST /api/appointments/status', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', valid_status: VALID_STATUS, timestamp: new Date().toISOString() });
});

module.exports = router;