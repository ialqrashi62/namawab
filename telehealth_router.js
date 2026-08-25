'use strict';
// Wave 79 — Telehealth: video visit scheduling + lifecycle + analytics
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_STATUS = ['scheduled','in_progress','completed','cancelled','no_show','technical_failure'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'telehealth',
        endpoints: [
            'GET /sessions',
            'GET /sessions/:id',
            'POST /sessions',
            'POST /sessions/:id/start',
            'POST /sessions/:id/complete',
            'POST /sessions/:id/cancel',
            'GET /sessions/patient/:patientId',
            'GET /sessions/upcoming',
            'GET /sessions/in-progress',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, provider_id, status, from_date, to_date, limit = 100, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS provider_name FROM telehealth_sessions s
                   LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.provider_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (provider_id) { sql += ` AND s.provider_id = $${params.length + 1}`; params.push(provider_id); }
        if (status) { sql += ` AND s.status = $${params.length + 1}`; params.push(status); }
        if (from_date) { sql += ` AND s.scheduled_start >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND s.scheduled_start <= $${params.length + 1}`; params.push(to_date); }
        sql += ` ORDER BY s.scheduled_start DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS provider_name FROM telehealth_sessions s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.provider_id WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'session_not_found' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, provider_id, room_id, scheduled_start, scheduled_end, appointment_id, chief_complaint, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!scheduled_start) return res.status(400).json({ ok: false, error: 'scheduled_start_required' });

        const dur = scheduled_end ? Math.round((new Date(scheduled_end) - new Date(scheduled_start)) / 60000) : null;

        const r = await db.query(
            `INSERT INTO telehealth_sessions (tenant_id, patient_id, provider_id, room_id, status, scheduled_start, scheduled_end, appointment_id, chief_complaint, notes)
             VALUES ($1,$2,$3,$4,'scheduled',$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, provider_id || req.user?.id || null, room_id || null,
             scheduled_start, scheduled_end || null, appointment_id || null,
             chief_complaint || null, notes || null]
        );
        res.status(201).json({ ok: true, session: r.rows[0], duration_minutes: dur });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions/:id/start', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE telehealth_sessions SET status = 'in_progress', actual_start = NOW(), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'scheduled' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_start' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions/:id/complete', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { notes, recording_url } = req.body;
        const r = await db.query(
            `UPDATE telehealth_sessions SET status = 'completed', actual_end = NOW(),
                                            notes = COALESCE($3, notes), recording_url = COALESCE($4, recording_url),
                                            updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('in_progress','scheduled') RETURNING *`,
            [req.tenantId, req.params.id, notes || null, recording_url || null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_complete' });
        const dur = r.rows[0].actual_start && r.rows[0].actual_end
            ? Math.round((new Date(r.rows[0].actual_end) - new Date(r.rows[0].actual_start)) / 60000)
            : null;
        res.json({ ok: true, session: r.rows[0], actual_duration_minutes: dur });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sessions/:id/cancel', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(
            `UPDATE telehealth_sessions SET status = 'cancelled', notes = COALESCE($3, notes) || ' [Cancelled: ' || $3 || ']', updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('scheduled','in_progress') RETURNING *`,
            [req.tenantId, req.params.id, reason || 'not specified']
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_cancel' });
        res.json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, u.full_name AS provider_name FROM telehealth_sessions s LEFT JOIN users u ON u.id = s.provider_id
             WHERE s.tenant_id = $1 AND s.patient_id = $2 ORDER BY s.scheduled_start DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/upcoming', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { provider_id, hours = 24 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn FROM telehealth_sessions s LEFT JOIN patients p ON p.id = s.patient_id
                   WHERE s.tenant_id = $1 AND s.status = 'scheduled' AND s.scheduled_start >= NOW() AND s.scheduled_start <= NOW() + ($2 || ' hours')::INTERVAL`;
        params.push(hours);
        if (provider_id) { sql += ` AND s.provider_id = $${params.length + 1}`; params.push(provider_id); }
        sql += ` ORDER BY s.scheduled_start ASC LIMIT 100`;
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sessions/in-progress', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, u.full_name AS provider_name FROM telehealth_sessions s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.provider_id
             WHERE s.tenant_id = $1 AND s.status = 'in_progress' ORDER BY s.actual_start ASC`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT status, COUNT(*) AS count, AVG(EXTRACT(EPOCH FROM (actual_end - actual_start))/60)::NUMERIC(10,2) AS avg_actual_minutes
             FROM telehealth_sessions WHERE tenant_id = $1 AND scheduled_start >= NOW() - INTERVAL '90 days'
             GROUP BY status`,
            [req.tenantId]
        );
        const today = await db.query(
            `SELECT COUNT(*) AS today_total, COUNT(*) FILTER (WHERE status = 'completed') AS today_completed,
                    COUNT(*) FILTER (WHERE status = 'cancelled') AS today_cancelled,
                    COUNT(*) FILTER (WHERE status = 'no_show') AS today_no_show
             FROM telehealth_sessions WHERE tenant_id = $1 AND scheduled_start::date = CURRENT_DATE`,
            [req.tenantId]
        );
        res.json({ ok: true, status_breakdown: r.rows, today: today.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
