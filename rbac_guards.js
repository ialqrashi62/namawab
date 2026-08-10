/**
 * rbac_guards.js — Jumanasoft SaaS unified Auth/RBAC guards (Batch 2).
 *
 * One named, tested source of truth for the access-control checks that were previously
 * duplicated inline across server.js (`role !== 'Admin'`). Behavior-preserving: each guard
 * denies with the same HTTP status (401/403) and writes the same audit event used before,
 * just centralized so it can't drift between routes.
 *
 * Identity is ALWAYS read from the session (never from the request body).
 * Super Admin identity reuses super_admin.js (single definition; no duplicate allowlist logic):
 *   - tenant admin (role==='Admin') and super admin (env allowlist) are INDEPENDENT dimensions.
 *   - a tenant Admin is NOT a super admin -> no privilege escalation. Fail-closed everywhere.
 *
 * Pure predicate isTenantAdmin + makeGuards(deps) factory. No DB, no DDL.
 */
'use strict';

const { isSuperAdmin, parseAllowlist } = require('./super_admin');

// Pure: tenant admin iff the session user's role is exactly 'Admin' (ROLE_PERMISSIONS['Admin']='*').
function isTenantAdmin(user) {
    return !!(user && user.role === 'Admin');
}

function clientIpOf(req) {
    return (req && (req.headers && req.headers['x-forwarded-for']))
        || (req && req.connection && req.connection.remoteAddress)
        || (req && req.ip) || '';
}

/**
 * makeGuards({ logAudit }) -> { requireAuthenticated, requireTenantAdmin, requireSuperAdmin }
 * logAudit(userId, userName, action, module, details, ip) — optional; missing => no-op (never throws).
 */
function makeGuards(deps = {}) {
    const audit = typeof deps.logAudit === 'function' ? deps.logAudit : function () {};
    function safeAudit() { try { audit.apply(null, arguments); } catch (_) { /* audit must never break a request */ } }

    // Authentication only (session present). Mirrors requireAuth; provided for a consistent vocabulary.
    function requireAuthenticated(req, res, next) {
        if (req.session && req.session.user) return next();
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Tenant Admin gate. Factory so callers can preserve the exact audit action/module per route.
    function requireTenantAdmin(opts) {
        const action = (opts && opts.action) || 'BLOCKED_ADMIN_ONLY';
        const moduleName = (opts && opts.module) || 'Auth';
        return function (req, res, next) {
            const user = req.session && req.session.user;
            const ip = clientIpOf(req);
            if (!user) {
                safeAudit(null, 'Anonymous', 'BLOCKED_AUTHENTICATION', moduleName,
                    `Unauthenticated access to admin route ${req.method} ${req.originalUrl || req.url}`, ip);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            if (!isTenantAdmin(user)) {
                safeAudit(user.id, user.display_name, action, moduleName,
                    `Non-admin (role=${user.role || ''}) blocked from ${req.method} ${req.originalUrl || req.url}`, ip);
                return res.status(403).json({ error: 'Access denied: administrator only' });
            }
            return next();
        };
    }

    // Super Admin gate (platform-level, env allowlist). Identity via super_admin.isSuperAdmin (single source).
    // allowlistSource: comma-separated string OR a Set. Resolved once at construction (no per-request parse).
    function requireSuperAdmin(allowlistSource, opts) {
        const set = allowlistSource instanceof Set ? allowlistSource : parseAllowlist(allowlistSource);
        const moduleName = (opts && opts.module) || 'SuperAdmin';
        return function (req, res, next) {
            const user = req.session && req.session.user;
            const ip = clientIpOf(req);
            if (!isSuperAdmin(user, set)) {
                safeAudit(user && user.id, user && user.display_name, 'SUPER_ADMIN_DENY', moduleName,
                    `denied ${req.method} ${req.originalUrl || req.url}`, ip);
                return res.status(403).json({ error: 'Super Admin access required', code: 'SUPER_ADMIN_REQUIRED' });
            }
            return next();
        };
    }

    return { requireAuthenticated, requireTenantAdmin, requireSuperAdmin };
}

module.exports = { isTenantAdmin, clientIpOf, makeGuards };
