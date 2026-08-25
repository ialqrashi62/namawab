// filepath: namaweb/waitlist_router.js
// Patient waitlist management. Queue patients awaiting admission/appointment/procedure.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_PRIORITY = ['urgent', 'high', 'normal', 'low'];
const VALID_STATUS = ['waiting', 'scheduled', 'admitted', 'cancelled', 'expired'];
const PRIORITY_RANK = { urgent: 1, high: 2, normal: 3, low: 4 };

// GET /api/waitlist?status=waiting
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist', 'admin'), async (req, res) => {
    try {
        const { status, department, priority } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (priority) { params.push(priority); conditions.push(`priority = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        // Order by priority rank + created_at
        const r = await db.query(`
            SELECT w.id, w.patient_id, p.name_en, p.name_ar, w.department, w.priority, w.reason, w.status,
                   w.scheduled_for, w.expires_at, w.created_at, w.updated_at,
                   EXTRACT(EPOCH FROM (NOW() - w.created_at))::int as waiting_seconds
            FROM waitlist w
            LEFT JOIN patients p ON p.id = w.patient_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY
                CASE w.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END,
                w.created_at ASC
            LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, waitlist: r.rows });
    } catch (err) {
        console.error('GET /api/waitlist', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/waitlist
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const { patient_id, department, priority, reason, scheduled_for, expires_at, notes } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_patient_id' });
        if (priority && !VALID_PRIORITY.includes(priority)) return res.status(400).json({ error: 'invalid_priority', valid: VALID_PRIORITY });
        const r = await db.query(`
            INSERT INTO waitlist (tenant_id, patient_id, department, priority, reason, scheduled_for, expires_at, notes, requested_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, department || '', priority || 'normal', reason || '', scheduled_for || null, expires_at || null, notes || '', req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) {
        console.error('POST /api/waitlist', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/waitlist/:id/status  Body: { status, scheduled_for? }
router.post('/:id/status', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'receptionist'), async (req, res) => {
    try {
        const { status, scheduled_for } = req.body;
        if (!VALID_STATUS.includes(status)) return res.status(400).json({ error: 'invalid_status', valid: VALID_STATUS });
        const updates = ['status = $3', 'updated_at = NOW()'];
        const params = [req.params.id, req.tenantId, status];
        if (scheduled_for !== undefined) { updates.push(`scheduled_for = $${params.length + 1}`); params.push(scheduled_for); }
        const r = await db.query(`UPDATE waitlist SET ${updates.join(', ')} WHERE id = $1 AND tenant_id = $2 RETURNING id, status`, params);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/waitlist/status', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/waitlist/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT status, priority, COUNT(*) as cnt,
                   AVG(EXTRACT(EPOCH FROM (NOW() - created_at))::int)::int as avg_wait_seconds
            FROM waitlist WHERE tenant_id = $1
            GROUP BY status, priority
            ORDER BY status, priority
        `, [req.tenantId]);
        // Total waiting
        const tot = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'waiting') as total_waiting,
                   COUNT(*) FILTER (WHERE priority = 'urgent' AND status = 'waiting') as urgent_waiting,
                   COUNT(*) FILTER (WHERE priority = 'high' AND status = 'waiting') as high_waiting
            FROM waitlist WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, breakdown: r.rows, summary: tot.rows[0] });
    } catch (err) {
        console.error('GET /api/waitlist/stats', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', valid_priority: VALID_PRIORITY, valid_status: VALID_STATUS, timestamp: new Date().toISOString() });
});

module.exports = router;