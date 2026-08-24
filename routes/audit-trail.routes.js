const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAuditTrailRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/audit-trail', requireAuth, requireRole('settings'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const lim = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 1000);

        const q = tenantId

            ? 'SELECT * FROM audit_trail WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT $2'

            : 'SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT $1';

        const params = tenantId ? [tenantId, lim] : [lim];

        logAudit(req.session.user.id, req.session.user.display_name, 'READ_AUDIT_LOGS', 'Settings', `Admin read audit logs (limit=${lim})`, req.ip);

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
