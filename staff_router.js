// filepath: namaweb/staff_router.js
// Staff scheduling + leave management.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/staff/shifts?date=2026-08-11&department=ICU
router.get('/shifts', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin', 'hr'), async (req, res) => {
    try {
        const { date, department, employee_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (date) { params.push(date); conditions.push(`shift_date = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (employee_id) { params.push(employee_id); conditions.push(`employee_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, employee_id, shift_date, shift_name, start_time, end_time, department, status, notes, created_at
            FROM hr_shifts WHERE ${conditions.join(' AND ')}
            ORDER BY shift_date, start_time LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, shifts: r.rows });
    } catch (err) { console.error('GET /api/staff/shifts', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/staff/shifts/today
router.get('/shifts/today', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin', 'hr'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, employee_id, shift_name, start_time, end_time, department, status
            FROM hr_shifts WHERE tenant_id = $1 AND shift_date = CURRENT_DATE
            ORDER BY start_time LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, date: new Date().toISOString().substring(0,10), total: r.rows.length, shifts: r.rows });
    } catch (err) { console.error('GET /api/staff/shifts/today', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/staff/shifts/coverage/:date — coverage by department
router.get('/shifts/coverage/:date', requireAuth, requireTenantScope, requireRole('admin', 'hr', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT department, shift_name, COUNT(*) as count,
                   COUNT(*) FILTER (WHERE status = 'active') as active_count,
                   COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
            FROM hr_shifts
            WHERE tenant_id = $1 AND shift_date = $2
            GROUP BY department, shift_name
            ORDER BY department, shift_name LIMIT 100
        `, [req.tenantId, req.params.date]);
        res.json({ ok: true, date: req.params.date, total: r.rows.length, coverage: r.rows });
    } catch (err) { console.error('GET /api/staff/shifts/coverage', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/staff/shifts — create shift
router.post('/shifts', requireAuth, requireTenantScope, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { employee_id, shift_date, shift_name, start_time, end_time, department } = req.body;
        if (!employee_id || !shift_date || !shift_name) return res.status(400).json({ error: 'missing_required', required: ['employee_id', 'shift_date', 'shift_name'] });
        const r = await db.query(`
            INSERT INTO hr_shifts (tenant_id, employee_id, shift_date, shift_name, start_time, end_time, department, status, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8) RETURNING id
        `, [req.tenantId, employee_id, shift_date, shift_name, start_time || null, end_time || null, department || '', req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/staff/shifts', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/staff/leaves?status=pending
router.get('/leaves', requireAuth, requireTenantScope, requireRole('admin', 'hr', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { status, leave_type, employee_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (leave_type) { params.push(leave_type); conditions.push(`leave_type = $${params.length}`); }
        if (employee_id) { params.push(employee_id); conditions.push(`employee_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, employee_id, leave_type, start_date, end_date, days, status, approved_by, notes, created_at
            FROM hr_leaves WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, leaves: r.rows });
    } catch (err) { console.error('GET /api/staff/leaves', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/staff/leaves/requests — pending leave requests
router.get('/leaves/requests', requireAuth, requireTenantScope, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, employee_id, leave_type, start_date, end_date, days, reason, requested_by, created_at
            FROM hr_leave_requests
            WHERE tenant_id = $1 AND status = 'pending'
            ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, requests: r.rows });
    } catch (err) { console.error('GET /api/staff/leaves/requests', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/staff/leaves/requests — submit leave request
router.post('/leaves/requests', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { employee_id, leave_type, start_date, end_date, reason } = req.body;
        if (!employee_id || !leave_type || !start_date || !end_date) return res.status(400).json({ error: 'missing_required', required: ['employee_id', 'leave_type', 'start_date', 'end_date'] });
        // Calculate days
        const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
        const r = await db.query(`
            INSERT INTO hr_leave_requests (tenant_id, employee_id, leave_type, start_date, end_date, days, status, reason, requested_by)
            VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8) RETURNING id
        `, [req.tenantId, employee_id, leave_type, start_date, end_date, days, reason || '', req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, days });
    } catch (err) { console.error('POST /api/staff/leaves/requests', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/staff/leaves/requests/:id/approve
router.post('/leaves/requests/:id/approve', requireAuth, requireTenantScope, requireRole('admin', 'hr'), async (req, res) => {
    try {
        // Approve in requests table
        const appr = await db.query(`
            UPDATE hr_leave_requests SET status = 'approved', approved_by = $3, approved_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status = 'pending' RETURNING id, employee_id, leave_type, start_date, end_date, days
        `, [req.params.id, req.tenantId, req.userId]);
        if (appr.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_pending' });
        // Mirror to hr_leaves
        const reqRow = appr.rows[0];
        await db.query(`
            INSERT INTO hr_leaves (tenant_id, employee_id, leave_type, start_date, end_date, days, status, approved_by)
            VALUES ($1,$2,$3,$4,$5,$6,'approved',$7)
        `, [req.tenantId, reqRow.employee_id, reqRow.leave_type, reqRow.start_date, reqRow.end_date, reqRow.days, req.userId]);
        res.json({ ok: true, id: appr.rows[0].id, status: 'approved' });
    } catch (err) { console.error('POST /api/staff/leaves/requests/:id/approve', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/staff/leaves/requests/:id/deny
router.post('/leaves/requests/:id/deny', requireAuth, requireTenantScope, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { denial_reason } = req.body;
        const r = await db.query(`
            UPDATE hr_leave_requests SET status = 'denied', approved_by = $3, approved_at = NOW(), denial_reason = $4
            WHERE id = $1 AND tenant_id = $2 AND status = 'pending' RETURNING id, status
        `, [req.params.id, req.tenantId, req.userId, denial_reason || '']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_pending' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/staff/leaves/requests/:id/deny', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/staff/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const sh = await db.query(`
            SELECT COUNT(*) as total_shifts,
                   COUNT(*) FILTER (WHERE shift_date >= CURRENT_DATE) as upcoming,
                   COUNT(*) FILTER (WHERE shift_date = CURRENT_DATE) as today,
                   COUNT(*) FILTER (WHERE status = 'active') as active,
                   COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
            FROM hr_shifts WHERE tenant_id = $1
        `, [req.tenantId]);
        const lv = await db.query(`
            SELECT COUNT(*) as total_leaves,
                   COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   COUNT(*) FILTER (WHERE status = 'approved') as approved,
                   COUNT(*) FILTER (WHERE status = 'denied') as denied,
                   SUM(days) FILTER (WHERE status = 'approved') as total_leave_days
            FROM hr_leave_requests WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, shifts: sh.rows[0], leaves: lv.rows[0] });
    } catch (err) { console.error('GET /api/staff/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['shifts', 'shifts/today', 'shifts/coverage', 'leaves', 'leaves/requests', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
