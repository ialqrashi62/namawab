const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBedTransfersRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/bed-transfers', requireAuth, requireTenantScope, async (req, res) => {

    // E8 SHADOW-PATH CLOSURE: legacy transfer occupied/freed beds WITHOUT FOR UPDATE locks and did

    // not reject an occupied destination (double-occupy race). Transfers must now go through

    // POST /api/adt/transfer (atomic, locked, rejects occupied dest). Fails closed.

    const { tenantId } = getRequestTenantContext(req);

    if (!tenantId && process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Tenant scope required' });

    return res.status(409).json({ error: 'Use POST /api/adt/transfer', use: '/api/adt/transfer' });

});


    return router;
}
