const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeHrRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e18, e18RequireTenant, e18BeginTenantTx, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/hr/employees', requireAuth, requireRole('hr'), async (req, res) => {

    try { res.json((await pool.query('SELECT * FROM hr_employees WHERE is_active=1 ORDER BY id DESC')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/hr/employees', requireAuth, requireRole('hr'), async (req, res) => {

    try {

        const { emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance } = req.body;

        const result = await pool.query('INSERT INTO hr_employees (emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',

            [emp_number || '', name_ar || '', name_en || '', national_id || '', phone || '', email || '', department || '', job_title || '', hire_date || '', basic_salary || 0, housing_allowance || 0, transport_allowance || 0]);

        res.json((await pool.query('SELECT * FROM hr_employees WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/salaries', requireAuth, requireRole('hr'), async (req, res) => {

    try { res.json((await pool.query('SELECT hs.*, he.name_en as employee_name FROM hr_salaries hs LEFT JOIN hr_employees he ON hs.employee_id=he.id ORDER BY hs.id DESC')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/leaves', requireAuth, requireRole('hr'), async (req, res) => {

    try { res.json((await pool.query('SELECT hl.*, he.name_en as employee_name FROM hr_leaves hl LEFT JOIN hr_employees he ON hl.employee_id=he.id ORDER BY hl.id DESC')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/attendance', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    // I1: tenant-scoped read — hr_attendance rows are stamped with tenant_id on write;

    // fail-closed if tenant cannot be resolved (mirrors all other E18 GET routes).

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query(

            'SELECT ha.*, he.name_en as employee_name FROM hr_attendance ha LEFT JOIN hr_employees he ON ha.employee_id=he.id WHERE ha.tenant_id=$1 ORDER BY ha.id DESC',

            [t.tenantId]

        )).rows);

    }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/licenses', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.query.employee_id);

        const params = [t.tenantId];

        let q = 'SELECT l.*, e.name_en AS employee_name FROM hr_licenses l LEFT JOIN hr_employees e ON l.employee_id=e.id WHERE l.tenant_id=$1';

        if (empId) { q += ' AND l.employee_id=$2'; params.push(empId); }

        q += ' ORDER BY l.expiry_date ASC NULLS LAST, l.id ASC';

        const rows = (await pool.query(q, params)).rows;

        // expiry computed SERVER-SIDE — client never decides validity

        const out = rows.map(r => {

            const c = e18.licenseStatus(r.expiry_date, r.alert_days);

            return { ...r, expiry_status: c.status, days_to_expiry: c.daysToExpiry };

        });

        res.json(out);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/licenses/alerts', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const rows = (await pool.query(

            'SELECT l.*, e.name_en AS employee_name FROM hr_licenses l LEFT JOIN hr_employees e ON l.employee_id=e.id WHERE l.tenant_id=$1 ORDER BY l.expiry_date ASC NULLS LAST',

            [t.tenantId])).rows;

        const out = rows.map(r => {

            const c = e18.licenseStatus(r.expiry_date, r.alert_days);

            return { ...r, expiry_status: c.status, days_to_expiry: c.daysToExpiry };

        }).filter(r => r.expiry_status === 'expired' || r.expiry_status === 'expiring' || r.expiry_status === 'unknown');

        res.json(out);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/hr/licenses', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        // verify employee belongs to this tenant (IDOR guard, integer-compared id)

        const own = (await pool.query('SELECT id FROM hr_employees WHERE id=$1 AND tenant_id=$2', [empId, t.tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Employee not found' });

        const { license_type, license_number, authority, issue_date, expiry_date, alert_days, notes } = req.body;

        const alert = e18.e18Num(alert_days);

        const result = await pool.query(

            `INSERT INTO hr_licenses (employee_id, license_type, license_number, authority, issue_date, expiry_date, alert_days, notes, created_by, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,

            [empId, license_type || 'SCFHS', license_number || '', authority || 'SCFHS', issue_date || null,

             expiry_date || null, (alert !== null && alert >= 0) ? Math.floor(alert) : 30, notes || '',

             req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_HR_LICENSE', 'HR', `License #${result.rows[0].id} for employee #${empId}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/shifts', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.query.employee_id);

        const params = [t.tenantId];

        let q = 'SELECT s.*, e.name_en AS employee_name FROM hr_shifts s LEFT JOIN hr_employees e ON s.employee_id=e.id WHERE s.tenant_id=$1';

        if (empId) { q += ' AND s.employee_id=$2'; params.push(empId); }

        q += ' ORDER BY s.shift_date DESC, s.start_time ASC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/hr/shifts', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        const { shift_date, shift_name, start_time, end_time, department, notes } = req.body;

        if (!shift_date) return res.status(422).json({ error: 'shift_date required' });

        // server-authoritative time validation (start<end)

        const v = e18.validateShift(start_time, end_time);

        if (!v.ok) return res.status(422).json({ error: 'Invalid shift time: ' + v.error });

        const client = await e18BeginTenantTx(t.tenantId);

        try {

            const own = (await client.query('SELECT id FROM hr_employees WHERE id=$1 AND tenant_id=$2', [empId, t.tenantId])).rows[0];

            if (!own) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Employee not found' }); }

            // lock same-day rows for this employee (ascending id) then overlap-check server-side

            const existing = (await client.query(

                'SELECT id, start_time, end_time FROM hr_shifts WHERE tenant_id=$1 AND employee_id=$2 AND shift_date=$3 AND status<>$4 ORDER BY id ASC FOR UPDATE',

                [t.tenantId, empId, shift_date, 'cancelled'])).rows;

            if (e18.hasShiftConflict(existing, { start_time, end_time })) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: 'Shift overlaps an existing shift for this employee on this date' });

            }

            const result = (await client.query(

                `INSERT INTO hr_shifts (employee_id, shift_date, shift_name, start_time, end_time, department, notes, created_by, tenant_id, facility_id)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,

                [empId, shift_date, shift_name || '', start_time, end_time, department || '', notes || '',

                 req.session.user?.display_name || '', t.tenantId, t.facilityId || null])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_HR_SHIFT', 'HR', `Shift #${result.id} for employee #${empId} on ${shift_date}`, req.ip);

            res.json(result);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/hr/attendance', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        const own = (await pool.query('SELECT id FROM hr_employees WHERE id=$1 AND tenant_id=$2', [empId, t.tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Employee not found' });

        const { attendance_date, check_in, check_out, status } = req.body;

        // SERVER computes total_hours — client cannot supply it (anti-spoof). null when incomplete.

        const total = e18.computeWorkedHours(check_in, check_out);

        const result = await pool.query(

            `INSERT INTO hr_attendance (employee_id, attendance_date, check_in, check_out, total_hours, status, source, tenant_id, branch_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,

            [empId, attendance_date || new Date().toISOString().slice(0, 10), check_in || '', check_out || '',

             total === null ? 0 : total, status || (check_out ? 'Present' : 'Open'), 'Manual', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RECORD_HR_ATTENDANCE', 'HR', `Attendance for employee #${empId}`, req.ip);

        res.json({ ...result.rows[0], computed_hours: total });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/leave-requests', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query(

            'SELECT r.*, e.name_en AS employee_name FROM hr_leave_requests r LEFT JOIN hr_employees e ON r.employee_id=e.id WHERE r.tenant_id=$1 ORDER BY r.id DESC',

            [t.tenantId])).rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/hr/leave-requests', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        const { leave_type, start_date, end_date, reason } = req.body;

        // server computes inclusive days; rejects inverted/invalid range

        const days = e18.leaveDays(start_date, end_date);

        if (days === null) return res.status(422).json({ error: 'Invalid leave date range' });

        const own = (await pool.query('SELECT id FROM hr_employees WHERE id=$1 AND tenant_id=$2', [empId, t.tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Employee not found' });

        // status is server-authoritative: a new request is ALWAYS 'requested' (client cannot pre-approve)

        const result = await pool.query(

            `INSERT INTO hr_leave_requests (employee_id, leave_type, start_date, end_date, days, status, reason, requested_by, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,'requested',$6,$7,$8,$9) RETURNING *`,

            [empId, leave_type || 'Annual', start_date, end_date, days, reason || '',

             req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_LEAVE_REQUEST', 'HR', `Leave request #${result.rows[0].id} for employee #${empId} (${days}d)`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/hr/leave-requests/:id/status', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const id = e18.e18IntId(req.params.id);

        if (id === null) return res.status(404).json({ error: 'Not found' });

        const target = String(req.body.status || '').trim();

        if (!e18.LEAVE_STATUSES.includes(target)) return res.status(422).json({ error: 'Invalid target status' });

        const client = await e18BeginTenantTx(t.tenantId);

        try {

            const row = (await client.query('SELECT id, status FROM hr_leave_requests WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [id, t.tenantId])).rows[0];

            if (!row) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Not found' }); }

            // SERVER-SIDE state machine: reject invalid transition with 409

            if (!e18.canTransitionLeave(row.status, target)) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `Invalid leave transition ${row.status} -> ${target}` });

            }

            const denial = target === 'denied' ? (req.body.denial_reason || '') : '';

            const upd = (await client.query(

                `UPDATE hr_leave_requests SET status=$1, approved_by=$2, approved_at=now(), denial_reason=$3

                 WHERE id=$4 AND tenant_id=$5 RETURNING *`,

                [target, req.session.user?.display_name || '', denial, id, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_LEAVE_STATUS', 'HR', `Leave #${id}: ${row.status} -> ${target}`, req.ip);

            res.json(upd);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/payroll-slips', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const month = String(req.query.month || '').trim();

        const params = [t.tenantId];

        let q = 'SELECT s.*, e.name_en AS employee_name FROM hr_payroll_slips s LEFT JOIN hr_employees e ON s.employee_id=e.id WHERE s.tenant_id=$1';

        if (month) { q += ' AND s.pay_month=$2'; params.push(month); }

        q += ' ORDER BY s.id DESC';

        res.json({ posting_enabled: e18.isPostingEnabled(), slips: (await pool.query(q, params)).rows });

    } catch (e) {

        if (optionalReadFallback(res, e, { posting_enabled: e18.isPostingEnabled(), slips: [] })) return;

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/hr/payroll-slips', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        const month = String(req.body.pay_month || '').trim();

        if (!month) return res.status(422).json({ error: 'pay_month required' });

        // pull authoritative salary components from the employee master (NOT from client body)

        const emp = (await pool.query(

            'SELECT id, name_en, basic_salary, housing_allowance, transport_allowance, national_id FROM hr_employees WHERE id=$1 AND tenant_id=$2',

            [empId, t.tenantId])).rows[0];

        if (!emp) return res.status(404).json({ error: 'Employee not found' });

        // is_saudi inferred from national_id (starts with 1 = Saudi national); advances/other from body but clamped >=0 in engine

        const isSaudi = String(emp.national_id || '').trim().startsWith('1');

        const slip = e18.computePayrollSlip({

            basic_salary: emp.basic_salary,

            housing_allowance: emp.housing_allowance,

            transport_allowance: emp.transport_allowance,

            other_allowances: req.body.other_allowances,

            advances_deducted: req.body.advances_deducted,

            other_deductions: req.body.other_deductions,

            is_saudi: isSaudi

        });

        if (!slip.ok) return res.status(422).json({ error: 'Cannot compute slip: ' + slip.error });

        // upsert draft (unique per tenant+employee+month). NEVER auto-post.

        const result = await pool.query(

            `INSERT INTO hr_payroll_slips

               (employee_id, pay_month, basic, housing_allowance, transport_allowance, other_allowances,

                gross_earnings, gosi_deduction, advances_deducted, other_deductions, total_deductions,

                net_salary, status, posted, created_by, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'draft',0,$13,$14,$15)

             ON CONFLICT (tenant_id, employee_id, pay_month)

               DO UPDATE SET basic=EXCLUDED.basic, housing_allowance=EXCLUDED.housing_allowance,

                 transport_allowance=EXCLUDED.transport_allowance, other_allowances=EXCLUDED.other_allowances,

                 gross_earnings=EXCLUDED.gross_earnings, gosi_deduction=EXCLUDED.gosi_deduction,

                 advances_deducted=EXCLUDED.advances_deducted, other_deductions=EXCLUDED.other_deductions,

                 total_deductions=EXCLUDED.total_deductions, net_salary=EXCLUDED.net_salary

               WHERE hr_payroll_slips.status='draft'

             RETURNING *`,

            [empId, month, slip.basic, slip.housing_allowance, slip.transport_allowance, slip.other_allowances,

             slip.gross_earnings, slip.gosi_deduction, slip.advances_deducted, slip.other_deductions,

             slip.total_deductions, slip.net_salary, req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

        if (!result.rows[0]) return res.status(409).json({ error: 'Slip exists and is not in draft (cannot recompute)' });

        logAudit(req.session.user?.id, req.session.user?.display_name, 'GENERATE_PAYROLL_SLIP', 'HR', `Draft slip #${result.rows[0].id} employee #${empId} ${month} net ${slip.net_salary}`, req.ip);

        res.json({ ...result.rows[0], posting_enabled: e18.isPostingEnabled() });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/hr/payroll-slips/:id/status', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const id = e18.e18IntId(req.params.id);

        if (id === null) return res.status(404).json({ error: 'Not found' });

        const target = String(req.body.status || '').trim();

        if (!e18.SLIP_STATUSES.includes(target)) return res.status(422).json({ error: 'Invalid target status' });

        // HARD GATE: posting to GL is disabled by default. Reject 'posted' unless flag explicitly ON.

        if (target === 'posted' && !e18.isPostingEnabled()) {

            return res.status(403).json({ error: 'Payroll GL posting is disabled (HR_PAYROLL_POSTING_ENABLED is off)' });

        }

        const client = await e18BeginTenantTx(t.tenantId);

        try {

            const row = (await client.query('SELECT id, status FROM hr_payroll_slips WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [id, t.tenantId])).rows[0];

            if (!row) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Not found' }); }

            if (!e18.canTransitionSlip(row.status, target)) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `Invalid slip transition ${row.status} -> ${target}` });

            }

            const setPosted = target === 'posted';

            const upd = (await client.query(

                `UPDATE hr_payroll_slips SET status=$1, posted=$2, posted_at=$3 WHERE id=$4 AND tenant_id=$5 RETURNING *`,

                [target, setPosted ? 1 : 0, setPosted ? new Date() : null, id, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_PAYROLL_SLIP_STATUS', 'HR', `Slip #${id}: ${row.status} -> ${target}`, req.ip);

            res.json(upd);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/competencies', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.query.employee_id);

        const params = [t.tenantId];

        let q = 'SELECT c.*, e.name_en AS employee_name FROM hr_competencies c LEFT JOIN hr_employees e ON c.employee_id=e.id WHERE c.tenant_id=$1';

        if (empId) { q += ' AND c.employee_id=$2'; params.push(empId); }

        q += ' ORDER BY c.id DESC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/hr/competencies', requireAuth, requireRole('hr'), requireTenantScope, async (req, res) => {

    try {

        const t = e18RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const empId = e18.e18IntId(req.body.employee_id);

        if (empId === null) return res.status(422).json({ error: 'Invalid employee_id' });

        const own = (await pool.query('SELECT id FROM hr_employees WHERE id=$1 AND tenant_id=$2', [empId, t.tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Employee not found' });

        const cme = Math.max(0, e18.e18Num(req.body.cme_hours) ?? 0);

        const required = Math.max(0, e18.e18Num(req.body.required_hours) ?? 0);

        // compliance computed server-side (client cannot self-declare 'compliant')

        const status = required > 0 ? (cme >= required ? 'compliant' : 'non_compliant') : 'in_progress';

        const result = await pool.query(

            `INSERT INTO hr_competencies (employee_id, competency_name, cme_hours, required_hours, period_start, period_end, status, notes, created_by, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,

            [empId, req.body.competency_name || '', cme, required, req.body.period_start || null, req.body.period_end || null,

             status, req.body.notes || '', req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_HR_COMPETENCY', 'HR', `Competency #${result.rows[0].id} for employee #${empId} (${status})`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/hr/credentialing', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { employee_id, status, expiring_days } = req.query;

        let q = 'SELECT c.*, COALESCE(e.name_en, e.name_ar, e.emp_number, c.employee_name) AS full_name, e.job_title AS specialization FROM hr_credentialing c LEFT JOIN hr_employees e ON c.employee_id=e.id WHERE c.tenant_id=$1';

        const params = [tid];

        if (employee_id) { params.push(parseInt(employee_id)); q += ` AND c.employee_id=$${params.length}`; }

        if (status) { params.push(status); q += ` AND c.verification_status=$${params.length}`; }

        if (expiring_days) {

            const days = parseInt(expiring_days) || 30;

            q += ` AND c.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'`;

        }

        q += ' ORDER BY c.expiry_date ASC NULLS LAST';

        const rows = await pool.query(q, params);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/hr/credentialing/alerts', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const rows = await pool.query(`

            SELECT c.*, COALESCE(e.name_en, e.name_ar, e.emp_number, c.employee_name) AS full_name, e.email

            FROM hr_credentialing c

            LEFT JOIN hr_employees e ON c.employee_id=e.id

            WHERE c.tenant_id=$1 AND c.is_active=TRUE

              AND c.expiry_date IS NOT NULL

              AND c.expiry_date <= CURRENT_DATE + INTERVAL '30 days'

            ORDER BY c.expiry_date ASC`, [tid]);

        // Mark alert_sent_7d / alert_sent_30d

        const expiring7 = rows.rows.filter(r => new Date(r.expiry_date) <= new Date(Date.now() + 7*86400000));

        const expiring30 = rows.rows.filter(r => new Date(r.expiry_date) <= new Date(Date.now() + 30*86400000));

        res.json({ total: rows.rows.length, expiring_7_days: expiring7.length, expiring_30_days: expiring30.length, credentials: rows.rows });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/hr/credentialing', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { employee_id, credential_type, credential_number, issuing_body, issue_date, expiry_date,

                privilege_area, privilege_level = 'Full', notes, document_url } = req.body;

        if (!employee_id || !credential_number) return res.status(400).json({ error: 'employee_id and credential_number required' });

        // IDOR: verify employee belongs to tenant

        const emp = (await pool.query('SELECT id, full_name FROM hr_employees WHERE id=$1 AND tenant_id=$2', [parseInt(employee_id), tid])).rows[0];

        if (!emp) return res.status(403).json({ error: 'Employee not found or access denied' });

        const r = await pool.query(

            `INSERT INTO hr_credentialing (employee_id, employee_name, credential_type, credential_number,

             issuing_body, issue_date, expiry_date, privilege_area, privilege_level, notes, document_url, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,

            [parseInt(employee_id), emp.full_name, credential_type||'Medical License', credential_number,

             issuing_body||'', issue_date||null, expiry_date||null, privilege_area||'', privilege_level,

             notes||'', document_url||'', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'HR_CRED_ADD', 'HR', `Credential ${credential_number} added for ${emp.full_name}`, tid);

        res.json({ success: true, credential: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.put('/api/hr/credentialing/:id/verify', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        const { verification_status = 'verified' } = req.body;

        const r = await pool.query(

            'UPDATE hr_credentialing SET verification_status=$1, verified_by=$2, verified_at=NOW() WHERE id=$3 AND tenant_id=$4 RETURNING *',

            [verification_status, req.session.user.display_name, id, tid]);

        if (!r.rows.length) return res.status(404).json({ error: 'Credential not found' });

        logAudit(req.session.user.id, req.session.user.display_name, 'HR_CRED_VERIFY', 'HR', `Credential #${id} marked ${verification_status}`, tid);

        res.json({ success: true, credential: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/hr/gosi', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { month_year } = req.query;

        let q = 'SELECT g.*, COALESCE(e.name_en, e.name_ar, e.emp_number, g.employee_name) AS full_name, e.national_id as emp_national_id FROM hr_gosi_records g LEFT JOIN hr_employees e ON g.employee_id=e.id WHERE g.tenant_id=$1';

        const params = [tid];

        if (month_year) { params.push(month_year); q += ` AND g.month_year=$${params.length}`; }

        q += ' ORDER BY g.month_year DESC, g.employee_name ASC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/hr/gosi/calculate', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { month_year } = req.body; // e.g. '2026-07-01'

        if (!month_year) return res.status(400).json({ error: 'month_year required (YYYY-MM-01)' });

        // Get all active employees

        const emps = (await pool.query(`

            SELECT e.id, e.full_name, e.nationality, e.national_id, e.iqama_number,

                   COALESCE(s.basic_salary, e.basic_salary, 0) basic_salary

            FROM hr_employees e

            LEFT JOIN hr_salaries s ON s.employee_id=e.id AND s.is_current=TRUE

            WHERE e.tenant_id=$1 AND e.employment_status='Active'`, [tid])).rows;

        const results = [];

        for (const emp of emps) {

            const is_saudi = /saudi|سعودي/i.test(emp.nationality || '');

            const basic = parseFloat(emp.basic_salary) || 0;

            // GOSI 2024 rates:

            // Saudi: Employee 9.75% (pension) + Employer 12% (pension 9% + OH 1% + unemployment 2%)

            // Non-Saudi: Employee 0% + Employer 2% (occupational hazard only)

            const emp_pct = is_saudi ? 9.75 : 0;

            const empl_pct = is_saudi ? 12.00 : 2.00;

            const emp_contribution = Math.round((basic * emp_pct / 100) * 100) / 100;

            const empl_contribution = Math.round((basic * empl_pct / 100) * 100) / 100;

            const total = emp_contribution + empl_contribution;

            // Upsert

            const r = await pool.query(

                `INSERT INTO hr_gosi_records (employee_id, employee_name, national_id, iqama_number, nationality,

                 is_saudi, basic_salary, gosi_base_salary, employee_share_pct, employer_share_pct,

                 employee_contribution, employer_contribution, total_contribution, month_year, tenant_id)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10,$11,$12,$13,$14)

                 ON CONFLICT (employee_id, month_year, tenant_id)

                 DO UPDATE SET employee_contribution=$10, employer_contribution=$11, total_contribution=$12

                 RETURNING *`,

                [emp.id, emp.full_name, emp.national_id||'', emp.iqama_number||'', emp.nationality||'',

                 is_saudi, basic, emp_pct, empl_pct, emp_contribution, empl_contribution, total, month_year, tid]

            );

            results.push(r.rows[0]);

        }

        const totalContrib = results.reduce((s, r) => s + parseFloat(r.total_contribution), 0);

        logAudit(req.session.user.id, req.session.user.display_name, 'GOSI_CALCULATE', 'HR', `GOSI calculated for ${month_year}: ${results.length} employees, SAR ${totalContrib.toFixed(2)} total`, tid);

        res.json({ success: true, month_year, employee_count: results.length, total_contributions: totalContrib.toFixed(2), records: results });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.get('/api/hr/gosi/summary/:month', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const r = await pool.query(`

            SELECT COUNT(*) total_employees,

                   COUNT(*) FILTER (WHERE is_saudi=TRUE) saudi_employees,

                   COUNT(*) FILTER (WHERE is_saudi=FALSE) non_saudi_employees,

                   COALESCE(SUM(employee_contribution),0) total_employee_share,

                   COALESCE(SUM(employer_contribution),0) total_employer_share,

                   COALESCE(SUM(total_contribution),0) grand_total,

                   COALESCE(SUM(basic_salary),0) total_payroll_base

            FROM hr_gosi_records WHERE tenant_id=$1 AND month_year=$2`, [tid, req.params.month]);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/hr/wps', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM hr_wps_files WHERE tenant_id=$1 ORDER BY payroll_month DESC LIMIT 24', [tid])).rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/hr/wps/generate', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { payroll_month, bank_code = 'RIBL', entity_id } = req.body;

        if (!payroll_month) return res.status(400).json({ error: 'payroll_month required' });

        // Get payroll slips for the month

        const slips = (await pool.query(`

            SELECT ps.*, e.national_id, e.iqama_number, e.bank_account_number, e.nationality

            FROM hr_payroll_slips ps

            LEFT JOIN hr_employees e ON ps.employee_id=e.id

            WHERE ps.tenant_id=$1 AND DATE_TRUNC('month', ps.pay_date)=DATE_TRUNC('month',$2::date)

              AND ps.status='Approved'

            ORDER BY e.full_name`, [tid, payroll_month])).rows;

        if (!slips.length) return res.status(400).json({ error: `No approved payroll slips for ${payroll_month}` });

        // Build SIF (Salary Information File) — MOL WPS format

        const sifHeader = `EMP|${entity_id||tid}|${payroll_month.slice(0,7)}|${slips.length}|${slips.reduce((s,r)=>s+parseFloat(r.net_salary||0),0).toFixed(2)}|SAR`;

        const sifLines = slips.map((s, i) => {

            const accountId = s.iqama_number || s.national_id || `EMP${s.employee_id}`;

            const netSalary = parseFloat(s.net_salary || 0).toFixed(2);

            return `SLR|${String(i+1).padStart(4,'0')}|${accountId}|${s.bank_account_number||''}|${bank_code}|SAR|${netSalary}|${payroll_month.slice(0,10)}|REG`;

        });

        const sifContent = [sifHeader, ...sifLines].join('\n');

        const totalWages = slips.reduce((s,r) => s + parseFloat(r.net_salary||0), 0);

        const fileRef = `WPS-${tid}-${payroll_month.slice(0,7)}-${Date.now().toString(36).toUpperCase()}`;

        const r = await pool.query(

            `INSERT INTO hr_wps_files (file_reference, payroll_month, total_employees, total_wages, sif_content, bank_code, entity_id, created_by, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

             ON CONFLICT (payroll_month, tenant_id) DO UPDATE SET sif_content=$5, total_employees=$3, total_wages=$4, file_reference=$1

             RETURNING *`,

            [fileRef, payroll_month, slips.length, totalWages.toFixed(2), sifContent, bank_code, entity_id||String(tid), req.session.user.display_name, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'WPS_GENERATE', 'HR', `WPS SIF generated for ${payroll_month}: ${slips.length} employees, SAR ${totalWages.toFixed(2)}`, tid);

        res.json({ success: true, wps_file: r.rows[0], preview: sifContent.split('\n').slice(0,3) });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.put('/api/hr/wps/:id/submit', requireAuth, requireRole('hr', 'finance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        const r = await pool.query(

            "UPDATE hr_wps_files SET submission_status='submitted', submitted_at=NOW(), mol_reference=$1 WHERE id=$2 AND tenant_id=$3 RETURNING *",

            [req.body.mol_reference||'', id, tid]);

        if (!r.rows.length) return res.status(404).json({ error: 'WPS file not found' });

        logAudit(req.session.user.id, req.session.user.display_name, 'WPS_SUBMIT', 'HR', `WPS file #${id} submitted to MOL`, tid);

        res.json({ success: true, wps_file: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/hr/nitaqat', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const latest = (await pool.query('SELECT * FROM hr_nitaqat_records WHERE tenant_id=$1 ORDER BY snapshot_date DESC LIMIT 12', [tid])).rows;

        res.json(latest);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/hr/nitaqat/calculate', requireAuth, requireRole('hr', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { required_pct = 0, activity_code = '', facility_size = 'Medium' } = req.body;

        // Count employees by nationality

        const counts = (await pool.query(`

            SELECT

                COUNT(*) total,

                COUNT(*) FILTER (WHERE nationality ILIKE '%saudi%' OR nationality ILIKE '%سعودي%') saudi_count,

                COUNT(*) FILTER (WHERE nationality NOT ILIKE '%saudi%' AND nationality NOT ILIKE '%سعودي%') non_saudi_count

            FROM hr_employees WHERE tenant_id=$1 AND employment_status='Active'`, [tid])).rows[0];

        const total = parseInt(counts.total);

        const saudi = parseInt(counts.saudi_count);

        const non_saudi = parseInt(counts.non_saudi_count);

        const pct = total > 0 ? Math.round((saudi / total) * 10000) / 100 : 0;

        const req_pct = parseFloat(required_pct) || 0;

        // Nitaqat band (simplified — healthcare sector)

        let band = 'Low';

        if (pct >= req_pct + 10) band = 'Excellent (بلاتيني)';

        else if (pct >= req_pct + 5) band = 'High (أخضر عالٍ)';

        else if (pct >= req_pct) band = 'Medium (أخضر)';

        else if (pct >= req_pct - 5) band = 'Low (أصفر)';

        else band = 'Déficiente (أحمر)';

        const r = await pool.query(

            `INSERT INTO hr_nitaqat_records (snapshot_date, total_employees, saudi_employees, non_saudi_employees,

             saudization_pct, required_pct, nitaqat_band, activity_code, facility_size, tenant_id)

             VALUES (CURRENT_DATE,$1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,

            [total, saudi, non_saudi, pct, req_pct, band, activity_code, facility_size, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'NITAQAT_CALCULATE', 'HR', `Nitaqat: ${pct}% Saudization, Band: ${band}`, tid);

        res.json({ success: true, snapshot: r.rows[0], summary: { total_employees: total, saudi_employees: saudi, non_saudi_employees: non_saudi, saudization_pct: pct, nitaqat_band: band, required_pct: req_pct, compliant: pct >= req_pct } });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});


    return router;
}
