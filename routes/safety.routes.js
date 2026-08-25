const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSafetyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/safety/waste-logs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const r = await pool.query('SELECT * FROM medical_waste_logs WHERE tenant_id=$1 ORDER BY id DESC', [tenantId]);

        res.json(r.rows);

    } catch (e) {

        console.error('[WASTE LOGS GET]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/safety/waste-logs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { waste_type, weight_kg, disposal_company, truck_number, notes } = req.body;

        if (!waste_type) return res.status(422).json({ error: 'waste_type is required' });



        const r = await pool.query(

            `INSERT INTO medical_waste_logs (waste_type, weight_kg, disposal_company, truck_number, logged_by, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,

            [waste_type, parseFloat(weight_kg) || 0, disposal_company || '', truck_number || '', req.session.user?.display_name || 'Staff', tenantId]

        );

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_WASTE_LOG', 'Safety',

            `Logged waste ${waste_type} weight ${weight_kg}kg`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        console.error('[WASTE LOGS POST]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
