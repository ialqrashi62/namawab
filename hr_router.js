// filepath: namaweb/hr_router.js
// HR management: employees, attendance, leave, shifts, competency (CME).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Employee directory
router.get('/employees', requireAuth, requireTenantScope, requireRole('hr', 'admin', 'manager'), async (req, res) => {
    try {
        const { department, active_only } = req.query;
        let sql = `SELECT id, emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, contract_end, basic_salary, housing_allowance, transport_allowance, is_active FROM hr_employees WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (department) { params.push(department); sql += ` AND department = $${params.length}`; }
        if (active_only !== 'false') sql += ` AND is_active = true`;
        sql += ` ORDER BY name_en LIMIT 500`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, employees: r.rows });
    } catch (err) { console.error('GET /api/hr/employees', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/employees/:id', requireAuth, requireTenantScope, requireRole('hr', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM hr_employees WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, employee: r.rows[0] });
    } catch (err) { console.error('GET /api/hr/employees/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

// Attendance
router.post('/attendance', requireAuth, requireTenantScope, requireRole('hr', 'manager'), async (req, res) => {
    try {
        const { employee_id, attendance_date, check_in, check_out, status, source } = req.body;
        if (!employee_id || !attendance_date) return res.status(400).json({ error: 'missing_required' });
        const totalHours = (check_in && check_out) ? Math.max(0, (new Date(check_out) - new Date(check_in)) / 3600000) : null;
        const r = await db.query(`
            INSERT INTO hr_attendance (tenant_id, employee_id, attendance_date, check_in, check_out, total_hours, status, source)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (tenant_id, employee_id, attendance_date) DO UPDATE SET check_in = COALESCE(EXCLUDED.check_in, hr_attendance.check_in), check_out = COALESCE(EXCLUDED.check_out, hr_attendance.check_out), total_hours = EXCLUDED.total_hours
            RETURNING id
        `, [req.tenantId, employee_id, attendance_date, check_in || null, check_out || null, totalHours, status || 'present', source || 'manual']);
        res.status(201).json({ ok: true, id: r.rows[0].id, total_hours: totalHours });
    } catch (err) { console.error('POST /api/hr/attendance', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/attendance/:employee_id', requireAuth, requireTenantScope, requireRole('hr', 'manager'), async (req, res) => {
    try {
        const r = await db.query(`SELECT attendance_date, check_in, check_out, total_hours, status FROM hr_attendance WHERE tenant_id = $1 AND employee_id = $2 ORDER BY attendance_date DESC LIMIT 90`, [req.tenantId, req.params.employee_id]);
        res.json({ ok: true, total: r.rows.length, attendance: r.rows });
    } catch (err) { console.error('GET /api/hr/attendance', err); res.status(500).json({ error: 'internal_error' }); }
});

// Shifts
router.post('/shifts', requireAuth, requireTenantScope, requireRole('hr', 'manager'), async (req, res) => {
    try {
        const { employee_id, shift_date, shift_name, start_time, end_time, department, notes } = req.body;
        if (!employee_id || !shift_date || !shift_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO hr_shifts (tenant_id, employee_id, shift_date, shift_name, start_time, end_time, department, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [req.tenantId, employee_id, shift_date, shift_name, start_time || null, end_time || null, department || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/hr/shifts', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/shifts/:employee_id', requireAuth, requireTenantScope, requireRole('hr', 'manager', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, shift_date, shift_name, start_time, end_time, department, status FROM hr_shifts WHERE tenant_id = $1 AND employee_id = $2 ORDER BY shift_date DESC LIMIT 60`, [req.tenantId, req.params.employee_id]);
        res.json({ ok: true, total: r.rows.length, shifts: r.rows });
    } catch (err) { console.error('GET /api/hr/shifts', err); res.status(500).json({ error: 'internal_error' }); }
});

// Competency / CME tracking
router.post('/competency', requireAuth, requireTenantScope, requireRole('hr', 'training_officer'), async (req, res) => {
    try {
        const { employee_id, competency_name, cme_hours, required_hours, period_start, period_end } = req.body;
        if (!employee_id || !competency_name) return res.status(400).json({ error: 'missing_required' });
        const status = cme_hours >= required_hours ? 'compliant' : 'pending';
        const r = await db.query(`INSERT INTO hr_competencies (tenant_id, employee_id, competency_name, cme_hours, required_hours, period_start, period_end, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [req.tenantId, employee_id, competency_name, cme_hours || 0, required_hours || 0, period_start || null, period_end || null, status]);
        res.status(201).json({ ok: true, id: r.rows[0].id, status });
    } catch (err) { console.error('POST /api/hr/competency', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/competency/:employee_id', requireAuth, requireTenantScope, requireRole('hr', 'training_officer'), async (req, res) => {
    try {
        const r = await db.query(`SELECT competency_name, cme_hours, required_hours, status, period_start, period_end FROM hr_competencies WHERE tenant_id = $1 AND employee_id = $2 ORDER BY period_start DESC LIMIT 50`, [req.tenantId, req.params.employee_id]);
        res.json({ ok: true, total: r.rows.length, competencies: r.rows });
    } catch (err) { console.error('GET /api/hr/competency', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/workforce', requireAuth, requireTenantScope, requireRole('hr', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT department, COUNT(*) as headcount, COUNT(*) FILTER (WHERE is_active = true) as active,
                   SUM(basic_salary + COALESCE(housing_allowance,0) + COALESCE(transport_allowance,0)) as total_compensation
            FROM hr_employees WHERE tenant_id = $1 GROUP BY department ORDER BY headcount DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, departments: r.rows });
    } catch (err) { console.error('GET /api/hr/workforce', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['employees', 'attendance', 'shifts', 'competency', 'workforce'], timestamp: new Date().toISOString() });
});

module.exports = router;
