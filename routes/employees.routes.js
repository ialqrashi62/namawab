const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEmployeesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, EMPLOYEE_DIRECTORY_COLS, isHrOrAdmin }) {
    const router = express.Router();
router.get('/api/employees', requireAuth, async (req, res) => {

    try {

        const cols = isHrOrAdmin(req.session.user) ? '*' : EMPLOYEE_DIRECTORY_COLS;

        const { role } = req.query;

        if (role) { res.json((await pool.query(`SELECT ${cols} FROM employees WHERE role LIKE $1 ORDER BY name`, [`%${role}%`])).rows); }

        else { res.json((await pool.query(`SELECT ${cols} FROM employees ORDER BY id DESC`)).rows); }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/employees', requireAuth, requireRole('hr'), async (req, res) => {

    try {

        const { name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value } = req.body;

        const result = await pool.query('INSERT INTO employees (name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',

            [name || name_en, name_ar || '', name_en || '', role || 'Staff', department_ar || '', department_en || '', salary || 0, commission_type || 'percentage', parseFloat(commission_value) || 0]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_EMPLOYEE', 'HR', `Created employee #${result.rows[0].id} (${name_en || name || ''})`, req.ip);

        res.json((await pool.query('SELECT * FROM employees WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/employees/:id', requireAuth, requireRole('hr'), async (req, res) => {

    try {

        await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'DELETE_EMPLOYEE', 'HR', `Deleted employee #${req.params.id}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
