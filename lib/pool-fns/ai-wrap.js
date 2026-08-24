// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.

const { getRequestTenantContext } = require('../tenant-context');

module.exports = function makePoolFns({ 
logAudit
 }) {
function _aiWrap(name, fn) {
    return async (req, res) => {
        try {
            const { tenantId, facilityId } = getRequestTenantContext(req);
            const out = await fn({
                ...req.body,
                tenant_id: tenantId,
                facility_id: facilityId,
                actor: { id: req.session.user?.id, name: req.session.user?.display_name || req.session.user?.name },
            });
            logAudit(req.session.user?.id, req.session.user?.display_name, 'AI_ORCHESTRATOR', 'AI',
                `Orchestrator ${name} called by user #${req.session.user?.id}`, req.ip);
            res.json({ ok: true, function: name, result: out });
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message || 'Server error' });
        }
    };
}
function _aiOrch(name) { return require('./' + name); }
    return { 
_aiWrap, _aiOrch
 };
}
