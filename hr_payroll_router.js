'use strict';
// Wave 99 — HR Payroll: KSA-compliant payroll slips with GOSI deductions
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_LEAVE_TYPES = ['annual','sick','maternity','paternity','bereavement','emergency','unpaid','study'];
const VALID_LEAVE_STATUS = ['pending','approved','rejected','cancelled','taken'];
const VALID_SHIFT_STATUS = ['scheduled','confirmed','completed','missed','swapped'];
const VALID_ATTENDANCE_STATUS = ['present','absent','late','half_day','on_leave','sick_leave'];
const VALID_ATTENDANCE_SOURCE = ['manual','biometric','gps','qr_code','mobile_app'];
const VALID_PAYROLL_STATUS = ['draft','approved','posted','paid','cancelled'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'hr-payroll',
        endpoints: [
            'GET /shifts',
            'GET /shifts/:id',
            'POST /shifts',
            'PUT /shifts/:id',
            'GET /attendance',
            'POST /attendance/check-in',
            'POST /attendance/check-out',
            'GET /leave-requests',
            'POST /leave-requests',
            'POST /leave-requests/:id/approve',
            'POST /leave-requests/:id/reject',
            'GET /payroll',
            'GET /payroll/:id',
            'POST /payroll',
            'POST /payroll/:id/post',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SHIFTS =====
router.get('/shifts', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, from_date, to_date, status, department, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_shifts WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(employee_id); }
        if (from_date) { sql += ` AND shift_date >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND shift_date <= $${params.length + 1}`; params.push(to_date); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY shift_date DESC, start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/shifts/:id', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM hr_shifts WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'shift_not_found' });
        res.json({ ok: true, shift: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/shifts', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, shift_date, shift_name, start_time, end_time, department, notes, created_by } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        if (!shift_date) return res.status(400).json({ ok: false, error: 'shift_date_required' });
        if (!start_time) return res.status(400).json({ ok: false, error: 'start_time_required' });
        if (!end_time) return res.status(400).json({ ok: false, error: 'end_time_required' });
        const r = await db.query(
            `INSERT INTO hr_shifts (employee_id, shift_date, shift_name, start_time, end_time, department, status, notes, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,'scheduled',$7,$8,$9) RETURNING *`,
            [employee_id, shift_date, shift_name || null, start_time, end_time, department || null, notes || null, created_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, shift: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/shifts/:id', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const allowed = ['shift_name','start_time','end_time','department','status','notes'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'status' && !VALID_SHIFT_STATUS.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_status' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(`UPDATE hr_shifts SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`, params);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'shift_not_found' });
        res.json({ ok: true, shift: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ATTENDANCE =====
router.get('/attendance', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, from_date, to_date, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_attendance WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(employee_id); }
        if (from_date) { sql += ` AND attendance_date >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND attendance_date <= $${params.length + 1}`; params.push(to_date); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY attendance_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/attendance/check-in', requireAuth, requireTenantScope, requireRole('employee'), async (req, res) => {
    try {
        const { employee_id, attendance_date = new Date(), check_in = new Date(), source = 'mobile_app' } = req.body;
        const empId = employee_id || req.user?.id;
        if (!empId) return res.status(400).json({ ok: false, error: 'employee_id_required' });

        const day = new Date(attendance_date).toISOString().split('T')[0];
        const existing = await db.query(
            `SELECT id, check_in FROM hr_attendance WHERE tenant_id = $1 AND employee_id = $2 AND attendance_date::date = $3`,
            [req.tenantId, empId, day]
        );
        if (existing.rows.length && existing.rows[0].check_in) {
            return res.status(409).json({ ok: false, error: 'already_checked_in', existing: existing.rows[0] });
        }

        const r = existing.rows.length
            ? await db.query(`UPDATE hr_attendance SET check_in = $3, source = $4 WHERE tenant_id = $1 AND id = $2 RETURNING *`, [req.tenantId, existing.rows[0].id, check_in, source])
            : await db.query(`INSERT INTO hr_attendance (tenant_id, employee_id, attendance_date, check_in, status, source) VALUES ($1,$2,$3,$4,'present',$5) RETURNING *`, [req.tenantId, empId, day, check_in, source]);
        res.status(existing.rows.length ? 200 : 201).json({ ok: true, attendance: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/attendance/check-out', requireAuth, requireTenantScope, requireRole('employee'), async (req, res) => {
    try {
        const { employee_id, check_out = new Date() } = req.body;
        const empId = employee_id || req.user?.id;
        if (!empId) return res.status(400).json({ ok: false, error: 'employee_id_required' });

        const day = new Date().toISOString().split('T')[0];
        const existing = await db.query(
            `SELECT * FROM hr_attendance WHERE tenant_id = $1 AND employee_id = $2 AND attendance_date::date = $3`,
            [req.tenantId, empId, day]
        );
        if (!existing.rows.length) return res.status(404).json({ ok: false, error: 'no_check_in_record' });
        const row = existing.rows[0];
        if (!row.check_in) return res.status(409).json({ ok: false, error: 'no_check_in_record' });
        if (row.check_out) return res.status(409).json({ ok: false, error: 'already_checked_out' });

        const totalHours = Math.round(((new Date(check_out) - new Date(row.check_in)) / 3600000) * 100) / 100;
        const r = await db.query(
            `UPDATE hr_attendance SET check_out = $3, total_hours = $4 WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            [req.tenantId, row.id, check_out, totalHours]
        );
        res.json({ ok: true, attendance: r.rows[0], total_hours: totalHours });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LEAVE REQUESTS =====
router.get('/leave-requests', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, status, leave_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_leave_requests WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(employee_id); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (leave_type) { sql += ` AND leave_type = $${params.length + 1}`; params.push(leave_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/leave-requests', requireAuth, requireTenantScope, requireRole('employee'), async (req, res) => {
    try {
        const { employee_id, leave_type, start_date, end_date, days, reason, requested_by } = req.body;
        const empId = employee_id || req.user?.id;
        if (!empId) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        if (!leave_type) return res.status(400).json({ ok: false, error: 'leave_type_required' });
        if (!VALID_LEAVE_TYPES.includes(leave_type)) return res.status(400).json({ ok: false, error: 'invalid_leave_type' });
        if (!start_date || !end_date) return res.status(400).json({ ok: false, error: 'start_and_end_date_required' });
        if (new Date(end_date) < new Date(start_date)) return res.status(400).json({ ok: false, error: 'end_before_start' });
        const computedDays = days || Math.ceil((new Date(end_date) - new Date(start_date)) / 86400000) + 1;

        const r = await db.query(
            `INSERT INTO hr_leave_requests (employee_id, leave_type, start_date, end_date, days, status, reason, requested_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,$8) RETURNING *`,
            [empId, leave_type, start_date, end_date, computedDays, reason || null, requested_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/leave-requests/:id/approve', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE hr_leave_requests SET status = 'approved', approved_by = $3, approved_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'pending' RETURNING *`,
            [req.tenantId, req.params.id, req.user?.id || null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_approve' });
        res.json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/leave-requests/:id/reject', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { denial_reason } = req.body;
        if (!denial_reason) return res.status(400).json({ ok: false, error: 'denial_reason_required' });
        const r = await db.query(
            `UPDATE hr_leave_requests SET status = 'rejected', approved_by = $3, approved_at = NOW(), denial_reason = $4
             WHERE tenant_id = $1 AND id = $2 AND status = 'pending' RETURNING *`,
            [req.tenantId, req.params.id, req.user?.id || null, denial_reason]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_reject' });
        res.json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PAYROLL =====
router.get('/payroll', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, pay_month, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hr_payroll_slips WHERE tenant_id = $1`;
        if (employee_id) { sql += ` AND employee_id = $${params.length + 1}`; params.push(employee_id); }
        if (pay_month) { sql += ` AND pay_month = $${params.length + 1}`; params.push(pay_month); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY pay_month DESC, employee_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/payroll/:id', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM hr_payroll_slips WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'payroll_slip_not_found' });
        const row = r.rows[0];
        const verified = (row.basic + (row.housing_allowance || 0) + (row.transport_allowance || 0) + (row.other_allowances || 0)) === parseFloat(row.gross_earnings);
        const deductionsSum = (row.gosi_deduction || 0) + (row.advances_deducted || 0) + (row.other_deductions || 0);
        res.json({ ok: true, slip: row, integrity: { gross_breakdown_matches: verified, deductions_sum: deductionsSum, deductions_match_total: deductionsSum === parseFloat(row.total_deductions) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/payroll', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const { employee_id, pay_month, basic, housing_allowance = 0, transport_allowance = 0, other_allowances = 0, gosi_deduction = 0, advances_deducted = 0, other_deductions = 0, created_by } = req.body;
        if (!employee_id) return res.status(400).json({ ok: false, error: 'employee_id_required' });
        if (!pay_month) return res.status(400).json({ ok: false, error: 'pay_month_required' });

        const gross = parseFloat(basic) + parseFloat(housing_allowance) + parseFloat(transport_allowance) + parseFloat(other_allowances);
        const totalDeductions = parseFloat(gosi_deduction) + parseFloat(advances_deducted) + parseFloat(other_deductions);
        const net = gross - totalDeductions;

        const r = await db.query(
            `INSERT INTO hr_payroll_slips (employee_id, pay_month, basic, housing_allowance, transport_allowance, other_allowances, gross_earnings, gosi_deduction, advances_deducted, other_deductions, total_deductions, net_salary, status, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'draft',$13,$14) RETURNING *`,
            [employee_id, pay_month, basic, housing_allowance, transport_allowance, other_allowances, gross, gosi_deduction, advances_deducted, other_deductions, totalDeductions, net, created_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, slip: r.rows[0], computed: { gross, total_deductions: totalDeductions, net } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/payroll/:id/post', requireAuth, requireTenantScope, requireRole('hr_manager'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE hr_payroll_slips SET status = 'posted', posted = true, posted_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'draft' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_post' });
        res.json({ ok: true, slip: r.rows[0], posted_at: r.rows[0].posted_at });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_slips, COUNT(*) FILTER (WHERE status = 'posted') AS posted,
                    SUM(net_salary)::NUMERIC(14,2) AS total_net, AVG(net_salary)::NUMERIC(10,2) AS avg_net,
                    SUM(gosi_deduction)::NUMERIC(14,2) AS total_gosi
             FROM hr_payroll_slips WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const lr = await db.query(
            `SELECT leave_type, status, COUNT(*) AS count FROM hr_leave_requests WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY leave_type, status ORDER BY leave_type`,
            [req.tenantId]
        );
        const att = await db.query(
            `SELECT status, COUNT(*) AS count FROM hr_attendance WHERE tenant_id = $1 AND attendance_date >= NOW() - INTERVAL '30 days' GROUP BY status`,
            [req.tenantId]
        );
        res.json({ ok: true, payroll_90d: r.rows[0], leave_requests_90d: lr.rows, attendance_30d: att.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
