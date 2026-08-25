const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeWardsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/wards', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM wards WHERE tenant_id = $1 ORDER BY id'

            : 'SELECT * FROM wards ORDER BY id';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
