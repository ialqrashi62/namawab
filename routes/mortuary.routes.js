const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMortuaryRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/mortuary/cases', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM mortuary_cases WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/mortuary/cases', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, attending_physician, next_of_kin, next_of_kin_phone, notes } = req.body;

        const result = await pool.query('INSERT INTO mortuary_cases (patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, attending_physician, next_of_kin, next_of_kin_phone, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',

            [patient_id || 0, deceased_name || '', date_of_death || new Date().toISOString().split('T')[0], time_of_death || '', cause_of_death || '', attending_physician || '', next_of_kin || '', next_of_kin_phone || '', notes || '', tenantId, facilityId]);

        logAudit(req.session.user.id, req.session.user.name, 'DEATH_RECORD', 'Mortuary', `Death record for ${deceased_name}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/mortuary/cases/:id', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { release_status, released_to, death_certificate_number } = req.body;

        await pool.query('UPDATE mortuary_cases SET release_status=$1, released_to=$2, released_date=$3, death_certificate_number=$4 WHERE id=$5 AND tenant_id=$6',

            [release_status || 'Released', released_to || '', new Date().toISOString().split('T')[0], death_certificate_number || '', req.params.id, tenantId]);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
