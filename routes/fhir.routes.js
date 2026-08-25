const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeFhirRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/fhir/:resourceType/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { resourceType, id } = req.params;

        

        const r = await pool.query('SELECT * FROM fhir_resources WHERE resource_type=$1 AND resource_id=$2 AND tenant_id=$3 AND is_active=TRUE', [resourceType, id, tid]);

        if (!r.rows.length) return res.status(404).json({ error: 'FHIR resource not found' });

        res.json(r.rows[0].resource_json);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/fhir/:resourceType', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { resourceType } = req.params;

        const body = req.body;

        if (!body || !body.id) return res.status(400).json({ error: 'FHIR resource body with an id is required' });

        

        const r = await pool.query(

            `INSERT INTO fhir_resources (resource_type, resource_id, resource_json, last_updated, tenant_id)

             VALUES ($1, $2, $3, NOW(), $4)

             ON CONFLICT (resource_type, resource_id, tenant_id)

             DO UPDATE SET resource_json=$3, last_updated=NOW()

             RETURNING *`,

            [resourceType, body.id, JSON.stringify(body), tid]

        );

        res.json({ success: true, resource: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
