// filepath: namaweb/mw.js
// Single-bundle middleware export for all 53 dept routers
// Pattern: nm-router-middleware
'use strict';

const db = require('./db_postgres');

// ============ Auth ============
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) return next();
    return res.status(401).json({ error: 'unauthenticated' });
}

// ============ Tenant Scope ============
function requireTenantScope(req, res, next) {
    const tenantId = req.session?.tenantId || req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'tenant_required' });
    req.tenantId = tenantId;
    next();
}

// ============ Role guard ============
function requireRole(...roles) {
    const allowed = new Set(roles.map(r => r.toLowerCase()));
    return (req, res, next) => {
        const role = (req.session?.role || req.headers['x-role'] || '').toLowerCase();
        if (!allowed.has(role) && role !== 'owner' && role !== 'admin') {
            return res.status(403).json({ error: 'forbidden', required: [...allowed] });
        }
        next();
    };
}

// ============ Body Validation ============
function validateBody(schema) {
    return (req, res, next) => {
        try {
            const body = req.body || {};
            const clean = {};
            for (const key of Object.keys(schema)) {
                const def = schema[key];
                let val = body[key];
                if (typeof def === 'function') {
                    if (def.required && (val === undefined || val === null)) {
                        return res.status(400).json({ error: 'validation', field: key });
                    }
                    if (val !== undefined) {
                        clean[key] = def.type(val);
                    }
                } else if (typeof def === 'object') {
                    if (def.required && (val === undefined || val === null)) {
                        return res.status(400).json({ error: 'validation', field: key });
                    }
                    if (val === undefined) continue;
                    if (def.type === 'string' && typeof val !== 'string') {
                        return res.status(400).json({ error: 'validation', field: key });
                    }
                    if (def.type === 'number') {
                        const n = Number(val);
                        if (isNaN(n)) return res.status(400).json({ error: 'validation', field: key });
                        if (def.min !== undefined && n < def.min) return res.status(400).json({ error: 'validation', field: key });
                        if (def.max !== undefined && n > def.max) return res.status(400).json({ error: 'validation', field: key });
                        clean[key] = n;
                    } else if (def.type === 'boolean') {
                        clean[key] = Boolean(val);
                    } else if (def.type === 'enum') {
                        if (!def.values.includes(val)) return res.status(400).json({ error: 'validation', field: key });
                        clean[key] = val;
                    } else {
                        clean[key] = val;
                    }
                }
            }
            req.validated = clean;
            next();
        } catch (err) {
            console.error('validateBody', err);
            res.status(400).json({ error: 'validation' });
        }
    };
}

// ============ Idempotency (GATE7) ============
function idempotencyGuard(req, res, next) {
    const key = req.headers['idempotency-key'];
    if (!key) return next(); // opt-in
    // In production: check Redis/DB for prior response
    // For now: pass-through with logging
    req.idempotencyKey = key;
    next();
}

module.exports = {
    requireAuth,
    requireTenantScope,
    requireRole,
    validateBody,
    idempotencyGuard,
};
