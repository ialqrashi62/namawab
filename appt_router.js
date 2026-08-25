// filepath: namaweb/appt_router.js
// Appointment scheduling: list, create, reschedule, cancel, no-show, day grid, department load.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// List appointments for a date (day grid)
router.get('/', requireAuth, requireTenantScope, requireRole('receptionist', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { date, department, doctor_name, status } = req.query;
        let sql = `SELECT id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, status, notes FROM appointments WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (date) { params.push(date); sql += ` AND appt_date = $${params.length}`; }
        if (department) { params.push(department); sql += ` AND department = $${params.length}`; }
        if (doctor_name) { params.push(doctor_name); sql += ` AND doctor_name = $${params.length}`; }
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
        sql += ` ORDER BY appt_date ASC, appt_time ASC LIMIT 300`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, appointments: r.rows });
    } catch (err) { console.error('GET /api/appt', err); res.status(500).json({ error: 'internal_error' }); }
});

// Book a new appointment (conflict check by doctor + date + time)
router.post('/', requireAuth, requireTenantScope, requireRole('receptionist', 'doctor', 'admin', 'nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes } = req.body;
        if (!patient_id || !doctor_name || !appt_date || !appt_time) return res.status(400).json({ error: 'missing_required' });
        const c = await db.query(`
            SELECT id FROM appointments WHERE tenant_id = $1 AND doctor_name = $2 AND appt_date = $3 AND appt_time = $4 AND status != 'cancelled'
        `, [req.tenantId, doctor_name, appt_date, appt_time]);
        if (c.rows.length) return res.status(409).json({ error: 'time_slot_conflict', conflicting_appointment_id: c.rows[0].id });
        const r = await db.query(`
            INSERT INTO appointments (tenant_id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'scheduled') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', doctor_name, department || '', appt_date, appt_time, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/appt', err); res.status(500).json({ error: 'internal_error' }); }
});

// Reschedule
router.post('/:id/reschedule', requireAuth, requireTenantScope, requireRole('receptionist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { appt_date, appt_time } = req.body;
        if (!appt_date || !appt_time) return res.status(400).json({ error: 'missing_required' });
        const old = await db.query(`SELECT doctor_name FROM appointments WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!old.rows.length) return res.status(404).json({ error: 'not_found' });
        // Conflict check
        const c = await db.query(`SELECT id FROM appointments WHERE tenant_id = $1 AND doctor_name = $2 AND appt_date = $3 AND appt_time = $4 AND id != $5 AND status != 'cancelled'`, [req.tenantId, old.rows[0].doctor_name, appt_date, appt_time, req.params.id]);
        if (c.rows.length) return res.status(409).json({ error: 'time_slot_conflict' });
        const r = await db.query(`UPDATE appointments SET appt_date = $2, appt_time = $3, status = 'rescheduled' WHERE tenant_id = $1 AND id = $4 RETURNING id`, [req.tenantId, appt_date, appt_time, req.params.id]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/appt/reschedule', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cancel
router.post('/:id/cancel', requireAuth, requireTenantScope, requireRole('receptionist', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(`UPDATE appointments SET status = 'cancelled', notes = COALESCE(notes,'') || ' | cancelled: ' || $2 WHERE tenant_id = $1 AND id = $3 RETURNING id`, [req.tenantId, reason || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/appt/cancel', err); res.status(500).json({ error: 'internal_error' }); }
});

// Mark arrived / completed / no-show
router.post('/:id/status', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['arrived', 'in_consultation', 'completed', 'no_show'];
        if (!allowed.includes(status)) return res.status(400).json({ error: 'invalid_status' });
        const r = await db.query(`UPDATE appointments SET status = $2 WHERE tenant_id = $1 AND id = $3 RETURNING id`, [req.tenantId, status, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/appt/status', err); res.status(500).json({ error: 'internal_error' }); }
});

// Doctor day grid (free/busy)
router.get('/doctor/:doctor_name', requireAuth, requireTenantScope, requireRole('receptionist', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { date } = req.query;
        const d = date || new Date().toISOString().slice(0, 10);
        const r = await db.query(`SELECT id, appt_time, status, patient_name FROM appointments WHERE tenant_id = $1 AND doctor_name = $2 AND appt_date = $3 ORDER BY appt_time ASC`, [req.tenantId, req.params.doctor_name, d]);
        res.json({ ok: true, date: d, total: r.rows.length, slots: r.rows });
    } catch (err) { console.error('GET /api/appt/doctor', err); res.status(500).json({ error: 'internal_error' }); }
});

// Department load analytics
router.get('/load', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT department, appt_date, COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'no_show') as no_show,
                   COUNT(*) FILTER (WHERE status IN ('cancelled','rescheduled')) as cancelled
            FROM appointments WHERE tenant_id = $1 AND appt_date >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY department, appt_date ORDER BY appt_date DESC, total DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, load: r.rows });
    } catch (err) { console.error('GET /api/appt/load', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'receptionist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE appt_date = CURRENT_DATE) as today,
                   COUNT(*) FILTER (WHERE status = 'no_show' AND appt_date >= CURRENT_DATE - INTERVAL '30 days') as no_shows_30d,
                   COUNT(*) FILTER (WHERE status = 'rescheduled' AND appt_date >= CURRENT_DATE - INTERVAL '30 days') as rescheduled_30d,
                   COUNT(*) FILTER (WHERE appt_date >= CURRENT_DATE) as upcoming
            FROM appointments WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, stats: r.rows[0] });
    } catch (err) { console.error('GET /api/appt/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'book', 'reschedule', 'cancel', 'status', 'doctor', 'load', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
