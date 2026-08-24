// Extracted from server.js (behavior-preserving). Pure helpers, no closures.

function getRequestTenantContext(req) {
    const headerTenant = req.headers['x-tenant-id'] || req.headers['x-tenant-id-key'] || null;
    const resolved = resolveTenantContext({
        headerTenant,
        sessionUser: req.session && req.session.user ? req.session.user : null,
        isProduction: process.env.NODE_ENV === 'production',
    });
    const ctx = { tenantId: resolved.tenantId, facilityId: resolved.facilityId, isProduction: resolved.isProduction };
    ctx.toPostgres = () => ctx.tenantId;
    ctx.valueOf = () => ctx.tenantId;
    ctx.toString = () => String(ctx.tenantId || '');
    return ctx;
}
function requireTenantScope(req, res, next) {
    const { tenantId, isProduction } = getRequestTenantContext(req);
    if (!tenantId && isProduction) {
        // Security: reject in production with 403 — never expose unscoped data
        return res.status(403).json({ error: 'Tenant scope required' });
    }
    next();
}
function requireTenantContext(req, res, next) {
    const { tenantId } = getRequestTenantContext(req);
    if (!tenantId) {
        return res.status(400).json({ error: 'Missing tenant context' });
    }
    req.tenantId = tenantId;
    next();
}
function requireFacilityContext(req, res, next) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) {
        return res.status(400).json({ error: 'Missing tenant context' });
    }
    if (!facilityId) {
        return res.status(400).json({ error: 'Missing facility context' });
    }
    req.tenantId = tenantId;
    req.facilityId = facilityId;
    next();
}
function withTenantFilter(queryText, params, tenantId) {
    if (!tenantId) return { queryText, params };
    const hasWhere = queryText.toLowerCase().includes('where');
    const separator = hasWhere ? ' AND ' : ' WHERE ';
    const paramIndex = params.length + 1;
    const modifiedQuery = queryText + separator + `tenant_id = $${paramIndex}`;
    const modifiedParams = [...params, tenantId];
    return { queryText: modifiedQuery, params: modifiedParams };
}
function e17RequireTenant(req) {
    const { tenantId, isProduction } = getRequestTenantContext(req);
    const tid = parseInt(tenantId, 10);
    if (!Number.isInteger(tid) || tid <= 0) {
        const err = new Error('Tenant scope required');
        err.statusCode = 403;
        throw err;
    }
    return tid;
}
function e11RequireTenant(req) {
    const { tenantId } = getRequestTenantContext(req);
    if (!tenantId) { const err = new Error('Tenant scope required'); err.e11Status = 403; throw err; }
    return tenantId;
}
function lisRequireTenant(req, res) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) { res.status(400).json({ error: 'Missing tenant context' }); return null; }
    return { tenantId, facilityId };
}
function e10RequireTenant(req) {
    const { tenantId } = getRequestTenantContext(req);
    if (!tenantId) { const err = new Error('Tenant scope required'); err.e10Status = 403; throw err; }
    return tenantId;
}
function e12RequireTenant(req) {
    const { tenantId, facilityId, isProduction } = getRequestTenantContext(req);
    if (!tenantId) {
        if (isProduction) {
            const err = new Error('Tenant scope required');
            err.statusCode = 403;
            throw err;
        }
    }
    return { tenantId: tenantId || null, facilityId: facilityId || null };
}
function e13RequireTenant(req) {
    const { tenantId, isProduction } = getRequestTenantContext(req);
    if (!tenantId) {
        const err = new Error('Tenant scope required');
        err.e13Status = 403;
        throw err;
    }
    // tenantId must be an integer (no string/padded-id coercion bypass — E6)
    const t = Number(tenantId);
    if (!Number.isInteger(t) || t <= 0) {
        const err = new Error('Invalid tenant scope');
        err.e13Status = 403;
        throw err;
    }
    return t;
}
function e13Respond(res, e) {
    if (e && e.e13Status) return res.status(e.e13Status).json({ error: e.message });
    console.error('bloodbank route error:', e && e.message);
    return res.status(500).json({ error: 'Server error' });
}
function e7RequireTenant(req) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) { const err = new Error('Tenant scope required'); err.e7Status = 403; throw err; }
    return { tenantId, facilityId };
}
function e8RequireTenant(req) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) { const err = new Error('Tenant scope required'); err.e8Status = 403; throw err; }
    return { tenantId, facilityId };
}
function e9RequireTenant(req) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) { const err = new Error('Tenant scope required'); err.e9Status = 403; throw err; }
    return { tenantId, facilityId };
}

function e18RequireTenant(req) {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (!tenantId) return { ok: false };               // fail-closed: no unscoped fallback
    return { ok: true, tenantId, facilityId };
}

function e14RequireTenant(req) {
    const { tenantId } = getRequestTenantContext(req);
    if (tenantId === null || tenantId === undefined || tenantId === '') return null;
    const t = parseInt(tenantId, 10);
    return Number.isInteger(t) ? t : null;
}

module.exports = { getRequestTenantContext, requireTenantScope, requireTenantContext, requireFacilityContext, withTenantFilter, e17RequireTenant, e11RequireTenant, lisRequireTenant, e10RequireTenant, e12RequireTenant, e13RequireTenant, e13Respond, e7RequireTenant, e8RequireTenant, e9RequireTenant, e18RequireTenant, e14RequireTenant };
