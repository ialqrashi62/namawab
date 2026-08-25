// middleware/tenant_bind.js — wraps each v5 dept router request in runWithTenant.
// Mirrors the per-request tenant binding pattern used elsewhere on live.
//
// Usage (in server.js patch):
//   try { app.use('/api/cardiology', require('./middleware/tenant_bind'), require('./cardiology_router')); } ...
//
// Or as a standalone:
//   app.use('/api/cardiology', require('./middleware/tenant_bind'), require('./cardiology_router'));

'use strict';

const tenantCtx = require('../tenant_context');

function safeBigInt(value, fallback) {
    if (value === null || value === undefined) return fallback;
    const n = typeof value === 'bigint' ? value : Number(value);
    if (Number.isNaN(n)) return fallback;
    return n;
}

module.exports = function tenantBind(req, res, next) {
    // The auth+tenant middleware on the same chain has already populated req.tenantId.
    // If not (e.g. soft-auth path), fall back to header.
    const tid = req.tenantId
        || (req.session && req.session.user && (req.session.user.tenantId || req.session.user.tenant_id))
        || req.headers['x-tenant-id']
        || null;
    if (tid == null) {
        // No tenant context — let the route proceed; the db layer will fall back to plain pool.query
        // (no app.tenant_id GUC set). For new tables with FORCE RLS this will return 0 rows on
        // SELECT and fail WITH CHECK on INSERT. Caller can decide via req.tenantMissing flag.
        req.tenantMissing = true;
        return next();
    }
    req.tenantMissing = false;
    return tenantCtx.runWithTenant({ tenantId: safeBigInt(tid, tid) }, function () {
        next();
    });
};
