const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOncologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/oncology/patient-regimens/:patient_id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.params;

        const result = await pool.query(

            'SELECT * FROM oncology_patient_regimens WHERE patient_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',

            [patient_id, tenantId]

        );

        res.json(result.rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/oncology/patient-regimens', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, regimen_name, cycle_number, status, start_date } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!patient_id || !regimen_name) {

            return res.status(400).json({ error: 'patient_id and regimen_name are required' });

        }

        const result = await pool.query(

            'INSERT INTO oncology_patient_regimens (patient_id, regimen_name, cycle_number, status, start_date, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',

            [patient_id, regimen_name, cycle_number || 1, status || 'Scheduled', start_date || new Date().toISOString().split('T')[0], tenantId, facilityId]

        );

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
