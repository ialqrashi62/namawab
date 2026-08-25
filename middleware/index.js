// middleware/index.js — production middleware for v5 dept routers.
// Exports: requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard
//
// Behaviour:
//   - requireAuth: 401 if no session.user (matches server.js's own requireAuth at L443)
//   - requireTenantScope: fail-closed in production (403); pass in dev (matches L684)
//   - requireRole:    RBAC check via session.user.role (matches L491 requireRole)
//   - validateBody:  runs validation.js schema if it has a matching schema; otherwise softPass
//   - idempotencyGuard: defers to middleware/idempotency.js if available

'use strict';

const safeRequire = (p) => { try { return require(p); } catch (_) { return null; } };

const tenantResolve = safeRequire('./tenant_resolve');
const validation    = safeRequire('./validation');
const idem          = safeRequire('./middleware/idempotency') || safeRequire('./idempotency');

function getRequestTenantContext(req) {
    const headerTenant = req.headers['x-tenant-id'] || req.headers['x-tenant-id-key'] || null;
    if (tenantResolve && tenantResolve.resolveTenantContext) {
        const resolved = tenantResolve.resolveTenantContext({
            headerTenant,
            sessionUser: req.session && req.session.user ? req.session.user : null,
            isProduction: process.env.NODE_ENV === 'production',
        });
        const ctx = {
            tenantId: resolved.tenantId,
            facilityId: resolved.facilityId,
            isProduction: resolved.isProduction,
        };
        ctx.toPostgres = () => ctx.tenantId;
        ctx.valueOf = () => ctx.tenantId;
        ctx.toString = () => String(ctx.tenantId || '');
        return ctx;
    }
    // Fallback: minimal context (no tenant_resolve on server)
    const sessTenant = req.session && req.session.user && (req.session.user.tenantId || req.session.user.tenant_id);
    const hdrTenant  = req.headers['x-tenant-id'];
    const tid = sessTenant || hdrTenant || null;
    return {
        tenantId: tid,
        facilityId: null,
        isProduction: process.env.NODE_ENV === 'production',
        toPostgres: () => tid,
        valueOf: () => tid,
        toString: () => String(tid || ''),
    };
}

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        // Mirror server.js convention so downstream routers can read either
        req.userId   = req.session.user.id || req.session.user.userId || null;
        req.tenantId = getRequestTenantContext(req).tenantId;
        req.user     = req.session.user;
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
}

function requireTenantScope(req, res, next) {
    const ctx = getRequestTenantContext(req);
    req.tenantId   = ctx.tenantId;
    req.facilityId = ctx.facilityId;
    if (!ctx.tenantId && ctx.isProduction) {
        return res.status(403).json({ error: 'Tenant scope required' });
    }
    return next();
}

function requireRole(...allowed) {
    return function (req, res, next) {
        const role = (req.session && req.session.user && req.session.user.role) || '';
        if (!role) return res.status(401).json({ error: 'Unauthorized' });
        // Allow any role in 'allowed' or '*'
        if (allowed.includes('*') || allowed.includes(role)) return next();
        return res.status(403).json({ error: 'Forbidden', required: allowed, actual: role });
    };
}

function validateBody(schema) {
    return function (req, res, next) {
        if (validation && validation.validate && typeof schema === 'object') {
            // Some routers pass the schema directly (already an object). Some pass a string name.
            const result = validation.validate(req.body || {}, schema);
            if (!result.valid) {
                return res.status(400).json({ error: 'validation_failed', detail: result.errors });
            }
            req.validated = result.value;
            return next();
        }
        // No real validator — pass body through as req.validated
        req.validated = req.body || {};
        return next();
    };
}

function idempotencyGuard(req, res, next) {
    if (idem && typeof idem.idempotencyGuard === 'function') {
        return idem.idempotencyGuard(req, res, next);
    }
    // No-op fallback (already-implemented routes use headers.idempotencyKey)
    return next();
}

module.exports = {
    requireAuth,
    requireTenantScope,
    requireRole,
    validateBody,
    idempotencyGuard,
    default: module.exports,
};
