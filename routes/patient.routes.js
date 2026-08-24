const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePatientRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/patient/:pid/results', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: verify patient belongs to current tenant + filter results ---

        const { tenantId } = getRequestTenantContext(req);

        const patientCheck = tenantId ?

            (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [req.params.pid, tenantId])).rows[0] :

            (await pool.query('SELECT id FROM patients WHERE id=$1', [req.params.pid])).rows[0];

        if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        const tenantFilter = tenantId ? ' AND tenant_id=$2' : '';

        const filterParams = tenantId ? [req.params.pid, tenantId] : [req.params.pid];

        const rows = (await pool.query(`SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND approval_status IN ('Approved','Paid')${tenantFilter} ORDER BY id DESC`, filterParams)).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
