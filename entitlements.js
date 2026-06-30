/**
 * entitlements.js — Jumanasoft SaaS Entitlements Runtime Resolver (Batch 4A).
 *
 * Resolves a tenant's effective plan entitlements at runtime and exposes feature/limit checks.
 * FOUNDATION ONLY: no creation point is gated yet. Everything is flag-controlled and fail-open by default.
 *
 * Safety contract (do not break existing tenants):
 *   - ENTITLEMENTS_ENABLED=false (default) -> server never calls this; zero behavior change.
 *   - If e25 catalog tables (plans / plan_entitlements / tenant_plan_assignments) are ABSENT or any read
 *     fails -> resolveTenantEntitlements returns DEFAULT_ENTITLEMENTS (fail-open) with a documented reason.
 *     Never throws to the caller, never crashes a request.
 *   - ENFORCEMENT_MODE=observe (default) -> checkLimit NEVER blocks (reports would_block only).
 *     enforce -> checkLimit applies the comparison, but 4A wires NO enforcement point.
 *   - Unknown feature / limit keys are REJECTED (throw) — no silent pass-through.
 *
 * Pure core (mergeDefaults / hasFeature / checkLimit / pickEnforcement) is unit-tested with no DB.
 */
'use strict';

const { deriveCurrentPlan, KNOWN_MODULES } = require('./plans');
const KNOWN_MODULE_SET = new Set(KNOWN_MODULES);

const KNOWN_LIMITS = ['max_users', 'max_branches', 'max_invoices_per_month'];
const KNOWN_FEATURES = ['api_access', 'custom_domain'];
const ENFORCEMENT_MODES = ['observe', 'enforce'];
const FAIL_MODES = ['allow_existing', 'deny_new'];

// Safe, non-destructive defaults when no plan / no catalog: unlimited limits, no module gating, basic flags off.
const DEFAULT_ENTITLEMENTS = Object.freeze({
    max_users: null, max_branches: null, max_invoices_per_month: null,
    modules_enabled: [], support_level: 'standard', api_access: false, custom_domain: false
});

function defaults() {
    return { max_users: null, max_branches: null, max_invoices_per_month: null, modules_enabled: [], support_level: 'standard', api_access: false, custom_domain: false };
}

function toLimit(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 ? n : null;
}
function toBool(v) { return v === true || v === 1 || v === '1' || v === 't' || v === 'true'; }

// Normalize a plan_entitlements row (or null) into a complete entitlements object.
function mergeDefaults(entRow) {
    const out = defaults();
    if (!entRow) return out;
    out.max_users = toLimit(entRow.max_users);
    out.max_branches = toLimit(entRow.max_branches);
    out.max_invoices_per_month = toLimit(entRow.max_invoices_per_month);
    if (typeof entRow.modules_enabled === 'string') out.modules_enabled = entRow.modules_enabled.split(',').filter(Boolean);
    else if (Array.isArray(entRow.modules_enabled)) out.modules_enabled = entRow.modules_enabled.slice();
    out.support_level = entRow.support_level || 'standard';
    out.api_access = toBool(entRow.api_access);
    out.custom_domain = toBool(entRow.custom_domain);
    return out;
}

// Feature check. KNOWN_FEATURES are booleans; a known module name checks modules_enabled membership.
// Unknown key -> throw (no silent pass-through).
function hasFeature(entitlements, featureKey) {
    const ent = entitlements || defaults();
    if (KNOWN_FEATURES.includes(featureKey)) return !!ent[featureKey];
    if (KNOWN_MODULE_SET.has(featureKey)) return Array.isArray(ent.modules_enabled) && ent.modules_enabled.indexOf(featureKey) > -1;
    throw new Error('unknown feature: ' + featureKey);
}

// Limit check. Unknown key -> throw. null limit -> unlimited. In observe mode never blocks.
function checkLimit(entitlements, limitKey, currentUsage, mode) {
    if (!KNOWN_LIMITS.includes(limitKey)) throw new Error('unknown limit: ' + limitKey);
    const m = ENFORCEMENT_MODES.includes(mode) ? mode : 'observe';
    const ent = entitlements || defaults();
    const limit = ent[limitKey];
    const usage = Number(currentUsage) || 0;
    if (limit === null || limit === undefined) {
        return { allowed: true, unlimited: true, would_block: false, limit: null, usage: usage, mode: m };
    }
    const within = usage < Number(limit); // room for ONE more
    return {
        allowed: m === 'enforce' ? within : true, // observe never blocks
        unlimited: false, would_block: !within, limit: Number(limit), usage: usage, mode: m
    };
}

// Resolve enforcement config from an env-like object (server passes process.env). Safe defaults.
function pickEnforcement(env) {
    env = env || {};
    const enabled = String(env.ENTITLEMENTS_ENABLED) === 'true';
    let mode = String(env.ENTITLEMENTS_ENFORCEMENT_MODE || 'observe');
    if (!ENFORCEMENT_MODES.includes(mode)) mode = 'observe';
    let failMode = String(env.ENTITLEMENTS_FAIL_MODE || 'allow_existing');
    if (!FAIL_MODES.includes(failMode)) failMode = 'allow_existing';
    return { enabled: enabled, mode: mode, failMode: failMode };
}

// ---- Resolver factory (DB adapter) ----
// deps: { pool, logAudit, now?(->ms), cacheTtlMs? }
function makeEntitlementsResolver(deps = {}) {
    const { pool, logAudit } = deps;
    const now = typeof deps.now === 'function' ? deps.now : () => Date.now();
    const ttl = Number.isFinite(deps.cacheTtlMs) ? deps.cacheTtlMs : 30000;
    const cache = new Map(); // tenantId -> { at, value }
    const audit = (action, details) => { try { logAudit && logAudit(null, 'system', action, 'Entitlements', details, ''); } catch (_) {} };

    function fromCache(tenantId) {
        const hit = cache.get(tenantId);
        if (hit && (now() - hit.at) < ttl) return hit.value;
        return null;
    }
    function setCache(tenantId, value) { cache.set(tenantId, { at: now(), value: value }); return value; }
    function invalidate(tenantId) { if (tenantId === undefined) cache.clear(); else cache.delete(tenantId); }

    // Reads the tenant's current plan_key (or null). Fail-open (null) on absent tables / error.
    async function getTenantPlan(tenantId) {
        try {
            const rows = (await pool.query('SELECT * FROM tenant_plan_assignments WHERE tenant_id=$1', [tenantId])).rows;
            const cur = deriveCurrentPlan(rows);
            return cur ? { plan_key: cur.plan_key, source: cur.assignment_source || 'manual' } : null;
        } catch (e) {
            audit('ENTITLEMENT_RESOLVE_FAIL', `getTenantPlan tenant#${tenantId}: catalog unavailable`);
            return null;
        }
    }

    // Resolve effective entitlements. Always returns an object; never throws.
    async function resolveTenantEntitlements(tenantId) {
        const cached = fromCache(tenantId);
        if (cached) return cached;
        try {
            const plan = await getTenantPlan(tenantId);
            if (!plan) {
                return setCache(tenantId, { source: 'no_plan', plan_key: null, entitlements: defaults(), reason: 'no active plan assignment (fail-open defaults)' });
            }
            const entRow = (await pool.query(
                'SELECT pe.* FROM plan_entitlements pe JOIN plans p ON p.id = pe.plan_id WHERE p.plan_key = $1', [plan.plan_key]
            )).rows[0] || null;
            return setCache(tenantId, { source: 'plan', plan_key: plan.plan_key, entitlements: mergeDefaults(entRow), reason: 'resolved from plan' });
        } catch (e) {
            audit('ENTITLEMENT_RESOLVE_FAIL', `resolve tenant#${tenantId}: catalog unavailable (fail-open)`);
            // Do NOT cache failures (so a later provisioning is picked up promptly).
            return { source: 'default', plan_key: null, entitlements: defaults(), reason: 'catalog tables absent or read error (fail-open defaults)' };
        }
    }

    // Observe helper: compute a limit check and, in observe mode, record (never block) an over-limit event.
    async function observeLimit(tenantId, limitKey, currentUsage, mode) {
        const r = await resolveTenantEntitlements(tenantId);
        const chk = checkLimit(r.entitlements, limitKey, currentUsage, mode);
        if (chk.would_block && mode === 'observe') {
            audit('ENTITLEMENT_OBSERVE', `tenant#${tenantId} ${limitKey} usage=${chk.usage} limit=${chk.limit} (observe; not blocked)`);
        }
        return Object.assign({ plan_key: r.plan_key, source: r.source }, chk);
    }

    return { resolveTenantEntitlements, getTenantPlan, observeLimit, invalidate };
}

module.exports = {
    DEFAULT_ENTITLEMENTS, KNOWN_LIMITS, KNOWN_FEATURES, KNOWN_MODULES, ENFORCEMENT_MODES, FAIL_MODES,
    defaults, mergeDefaults, hasFeature, checkLimit, pickEnforcement,
    makeEntitlementsResolver
};
