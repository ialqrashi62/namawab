/**
 * audit_middleware.js — automatic, comprehensive audit logging for state-changing requests (GATE3-M1).
 *
 * Why: logAudit() was called manually in a subset of routes, so PHI/financial mutations could go
 * unrecorded. HIPAA §164.312(b) expects an audit trail covering access to / modification of ePHI.
 * This middleware AUTOMATICALLY records every mutating request (POST/PUT/PATCH/DELETE) on /api/*,
 * after the response, with the resolved user + derived (action, module) + status — complementing
 * (not replacing) the existing explicit logAudit() calls.
 *
 * Design:
 *   - Dependency-injected (logAudit, getUser) so the core is unit-testable WITHOUT a DB/server.
 *   - deriveAuditEntry(method, path) is a PURE function (no I/O) -> fully unit-tested.
 *   - The middleware logs on res 'finish' (never blocks the response; never throws into the chain).
 *   - INERT BY DEFAULT when wired behind an env flag (e.g. AUDIT_ALL_MUTATIONS) -> zero behavior change
 *     until explicitly enabled and validated on staging.
 *   - Never logs request bodies / secrets / PHI values — only method, path, status, user, ip.
 */
'use strict';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Map an HTTP method to a coarse audit action verb.
function actionForMethod(method) {
    switch (method) {
        case 'POST': return 'CREATE';
        case 'PUT':
        case 'PATCH': return 'UPDATE';
        case 'DELETE': return 'DELETE';
        default: return 'ACCESS';
    }
}

// Derive a stable "module" label from the API path: first meaningful /api/<segment>.
// e.g. /api/patients/123 -> 'patients' ; /api/finance/journal/5/post -> 'finance'
function moduleForPath(path) {
    const clean = String(path || '').split('?')[0];
    const parts = clean.split('/').filter(Boolean); // ['api','finance','journal',...]
    if (parts[0] === 'api' && parts[1]) return parts[1];
    return parts[0] || 'root';
}

// PURE: build the audit entry fields for a request (no side effects).
function deriveAuditEntry(method, path) {
    return {
        action: actionForMethod(method),
        module: moduleForPath(path),
        // details intentionally free of body/PHI — just the route shape + verb
        detail: `${method} ${String(path || '').split('?')[0]}`
    };
}

/**
 * makeAuditMiddleware({ logAudit, getUser, enabled })
 *   - logAudit(userId, userName, action, module, details, ip): the existing server.js helper.
 *   - getUser(req) -> { id, display_name } | null  (defaults to req.session.user).
 *   - enabled: boolean | () => boolean  (default: process.env.AUDIT_ALL_MUTATIONS === 'true').
 * Returns Express middleware that fires AFTER the response for mutating /api requests.
 */
function makeAuditMiddleware(deps = {}) {
    const {
        logAudit,
        getUser = (req) => (req.session && req.session.user) || null,
        // tenant binding: audit_trail.tenant_id DEFAULTs to current_setting('app.tenant_id'); since the
        // 'finish' handler runs OUTSIDE the per-request AsyncLocalStorage tenant context, we capture the
        // tenant id during the request and re-bind it when logging, so the audit row is correctly tagged
        // (otherwise tenant_id=NULL -> orphaned row invisible to tenant admins).
        getTenantId = (req) => (req.session && req.session.user && req.session.user.tenantId) || null,
        runWithTenant = (tenantId, fn) => fn(),   // default no-op; production passes tenantStore.run
        enabled = () => process.env.AUDIT_ALL_MUTATIONS === 'true'
    } = deps;
    if (typeof logAudit !== 'function') {
        throw new Error('makeAuditMiddleware requires { logAudit }');
    }
    const isEnabled = typeof enabled === 'function' ? enabled : () => !!enabled;

    return function auditMiddleware(req, res, next) {
        try {
            if (!isEnabled() || !MUTATING.has(req.method)) return next();
            const path = req.originalUrl || req.url || '';
            if (!/^\/api\b/.test(path.split('?')[0])) return next();

            // capture user + tenant NOW (request context is live), use them at 'finish'.
            const user = getUser(req) || {};
            const tenantId = getTenantId(req);

            res.on('finish', () => {
                try {
                    const ip = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || req.ip || '';
                    const e = deriveAuditEntry(req.method, path);
                    const write = () => logAudit(user.id || null, user.display_name || 'Anonymous', e.action, e.module,
                        `${e.detail} -> ${res.statusCode}`, ip);
                    // re-bind tenant so audit_trail.tenant_id default resolves to the right tenant
                    if (tenantId != null) { runWithTenant(tenantId, write); } else { write(); }
                } catch (_) { /* audit must never break the request */ }
            });
            return next();
        } catch (_) {
            return next();
        }
    };
}

module.exports = { actionForMethod, moduleForPath, deriveAuditEntry, makeAuditMiddleware, MUTATING };
