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

            res.on('finish', () => {
                try {
                    const user = getUser(req) || {};
                    const ip = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || req.ip || '';
                    const e = deriveAuditEntry(req.method, path);
                    logAudit(user.id || null, user.display_name || 'Anonymous', e.action, e.module,
                        `${e.detail} -> ${res.statusCode}`, ip);
                } catch (_) { /* audit must never break the request */ }
            });
            return next();
        } catch (_) {
            return next();
        }
    };
}

module.exports = { actionForMethod, moduleForPath, deriveAuditEntry, makeAuditMiddleware, MUTATING };
