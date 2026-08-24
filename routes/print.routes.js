const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePrintRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/print/invoice/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        // IDOR: tenant-scope the invoice lookup (mirrors the prescription / lab-report print routes).
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const invParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const inv = (await pool.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck}`, invParams)).rows[0];
        if (!inv) return res.status(404).json({ error: 'Not found' });
        const settings = {};
        const settingsRows = (await pool.query('SELECT * FROM company_settings')).rows;
        settingsRows.forEach(s => settings[s.setting_key] = s.setting_value);
        res.json({ invoice: inv, company: settings });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/print/prescription/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND p.tenant_id=$2' : '';
        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const rx = (await pool.query(`SELECT p.*, m.name as med_name FROM prescriptions p LEFT JOIN medications m ON p.medication_id=m.id WHERE p.id=$1${tenantCheck}`, params)).rows[0];
        if (!rx) return res.status(404).json({ error: 'Not found' });
        const patientQuery = tenantId ?
            'SELECT * FROM patients WHERE id=$1 AND tenant_id=$2' :
            'SELECT * FROM patients WHERE id=$1';
        const patientParams = tenantId ? [rx.patient_id, tenantId] : [rx.patient_id];
        const patient = (await pool.query(patientQuery, patientParams)).rows[0];
        res.json({ prescription: rx, patient });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/print/lab-report/:id', requireAuth, async (req, res) => {
    try {
        // --- TENANT SCOPE: verify order belongs to current tenant (IDOR prevention) ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const order = (await pool.query(`SELECT * FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, params)).rows[0];
        if (!order) return res.status(404).json({ error: 'Not found' });
        const results = (await pool.query('SELECT lr.*, lt.test_name, lt.normal_range FROM lab_results lr LEFT JOIN lab_tests_catalog lt ON lr.test_id=lt.id WHERE lr.order_id=$1', [req.params.id])).rows;
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [order.patient_id])).rows[0];
        res.json({ order, results, patient });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
