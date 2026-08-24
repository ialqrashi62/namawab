/**
 * plans.js — Jumanasoft SaaS Plans & Pricing / Entitlements foundation (Batch 3).
 *
 * Super Admin manages a plan CATALOG (identity + pricing + entitlements) and assigns a plan to a tenant.
 * NO real payment / checkout / webhook / capture / invoices / dunning / cron (out of scope, by design).
 *
 * Security:
 *   - Admin routes are mounted under /api/super-admin (Batch 2 requireSuperAdmin outer guard) — a tenant
 *     Admin can NEITHER manage the catalog NOR change a tenant's plan. Identity from session only.
 *   - Public read (GET /api/public/plans) returns ACTIVE plans with marketing-safe fields only
 *     (no disabled plans, no internal admin fields). Fail-safe: returns [] if the catalog tables are absent.
 *
 * Validation is server-side and fail-closed: prices >= 0, currency in an allowlist, limits null-or-non-negative,
 * modules_enabled restricted to a known-modules allowlist, plan_key immutable after creation, soft-disable only.
 *
 * Pure core (validate*/canAssignPlan/deriveCurrentPlan/*View) is unit-tested with no DB.
 */
'use strict';

const ALLOWED_CURRENCIES = ['SAR', 'USD', 'AED', 'EGP', 'KWD', 'BHD', 'QAR', 'OMR', 'JOD'];
const SUPPORT_LEVELS = ['basic', 'standard', 'priority', 'enterprise'];
const ASSIGNMENT_SOURCES = ['manual', 'trial', 'migration'];

// Allowlist of system modules a plan may enable. Mirrors the operational modules in ROLE_PERMISSIONS.
const KNOWN_MODULES = [
    'dashboard', 'patients', 'appointments', 'doctor', 'nursing', 'lab', 'radiology', 'pharmacy',
    'inventory', 'invoices', 'accounts', 'finance', 'insurance', 'reports', 'messaging', 'settings',
    'surgery', 'icu', 'emergency', 'inpatient', 'bloodbank', 'obgyn', 'antenatal', 'cssd', 'quality',
    'infection', 'him', 'medical-records', 'pathology', 'hr', 'maintenance', 'api'
];
const KNOWN_MODULE_SET = new Set(KNOWN_MODULES);

const PLAN_KEY_RE = /^[a-z0-9_]{2,40}$/;

// pg returns NUMERIC as a string -> parse defensively. Returns NaN on anything non-numeric.
function parseMoney(v) {
    if (v === null || v === undefined || v === '') return NaN;
    const n = typeof v === 'number' ? v : Number(String(v).trim());
    return Number.isFinite(n) ? n : NaN;
}

// null/''/undefined -> null (unlimited); else must be a non-negative integer.
function parseLimit(v, field, errors) {
    if (v === null || v === undefined || v === '') return null;
    const n = typeof v === 'number' ? v : Number(String(v).trim());
    if (!Number.isInteger(n) || n < 0) { errors.push(`${field} must be a non-negative integer or empty (unlimited)`); return undefined; }
    return n;
}

function nonEmptyStr(v) { return typeof v === 'string' && v.trim().length > 0; }

// Validate a plan create/update payload. opts.isCreate gates plan_key (immutable after creation).
function validatePlanInput(body = {}, opts = {}) {
    const errors = [];
    const value = {};

    if (opts.isCreate) {
        const key = typeof body.plan_key === 'string' ? body.plan_key.trim() : '';
        if (!PLAN_KEY_RE.test(key)) errors.push('plan_key must match ^[a-z0-9_]{2,40}$');
        value.plan_key = key;
    } // on update plan_key is ignored (immutable)

    if (!nonEmptyStr(body.name_ar)) errors.push('name_ar is required');
    if (!nonEmptyStr(body.name_en)) errors.push('name_en is required');
    value.name_ar = nonEmptyStr(body.name_ar) ? body.name_ar.trim().slice(0, 120) : '';
    value.name_en = nonEmptyStr(body.name_en) ? body.name_en.trim().slice(0, 120) : '';
    value.description_ar = typeof body.description_ar === 'string' ? body.description_ar : '';
    value.description_en = typeof body.description_en === 'string' ? body.description_en : '';

    const cur = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
    if (!ALLOWED_CURRENCIES.includes(cur)) errors.push('currency must be one of: ' + ALLOWED_CURRENCIES.join(', '));
    value.currency = cur;

    const m = body.monthly_price === undefined ? 0 : parseMoney(body.monthly_price);
    const y = body.yearly_price === undefined ? 0 : parseMoney(body.yearly_price);
    if (Number.isNaN(m) || m < 0) errors.push('monthly_price must be a number >= 0');
    if (Number.isNaN(y) || y < 0) errors.push('yearly_price must be a number >= 0');
    value.monthly_price = Number.isNaN(m) ? 0 : m;
    value.yearly_price = Number.isNaN(y) ? 0 : y;

    let trial = body.trial_days === undefined ? 0 : Number(body.trial_days);
    if (!Number.isInteger(trial) || trial < 0 || trial > 365) errors.push('trial_days must be an integer 0..365');
    value.trial_days = Number.isInteger(trial) ? trial : 0;

    let sort = body.sort_order === undefined ? 0 : Number(body.sort_order);
    if (!Number.isInteger(sort)) errors.push('sort_order must be an integer');
    value.sort_order = Number.isInteger(sort) ? sort : 0;

    return { ok: errors.length === 0, errors, value };
}

// Validate entitlements payload. Accepts modules_enabled as array OR comma string; rejects unknown modules.
function validateEntitlements(body = {}) {
    const errors = [];
    const value = {};

    value.max_users = parseLimit(body.max_users, 'max_users', errors);
    value.max_branches = parseLimit(body.max_branches, 'max_branches', errors);
    value.max_invoices_per_month = parseLimit(body.max_invoices_per_month, 'max_invoices_per_month', errors);

    let mods = body.modules_enabled;
    if (mods === undefined || mods === null) mods = [];
    if (typeof mods === 'string') mods = mods.split(',');
    if (!Array.isArray(mods)) { errors.push('modules_enabled must be an array or comma-separated string'); mods = []; }
    const clean = [];
    for (const raw of mods) {
        const mod = String(raw).trim().toLowerCase();
        if (!mod) continue;
        if (!KNOWN_MODULE_SET.has(mod)) { errors.push(`unknown module: ${mod}`); continue; }
        if (!clean.includes(mod)) clean.push(mod);
    }
    clean.sort();
    value.modules_enabled = clean.join(',');

    const sl = typeof body.support_level === 'string' ? body.support_level.trim().toLowerCase() : 'standard';
    if (!SUPPORT_LEVELS.includes(sl)) errors.push('support_level must be one of: ' + SUPPORT_LEVELS.join(', '));
    value.support_level = SUPPORT_LEVELS.includes(sl) ? sl : 'standard';

    value.api_access = body.api_access === true || body.api_access === 1 || body.api_access === '1' || body.api_access === 'true';
    value.custom_domain = body.custom_domain === true || body.custom_domain === 1 || body.custom_domain === '1' || body.custom_domain === 'true';

    return { ok: errors.length === 0, errors, value };
}

// A disabled plan cannot be assigned (active may arrive as boolean or 't'/'f' from pg).
function isActive(plan) { return !!plan && (plan.active === true || plan.active === 't' || plan.active === 1); }
function canAssignPlan(plan) { return isActive(plan); }

// Current plan = latest assignment with effective_to null, else most-recently assigned. Null if none.
function deriveCurrentPlan(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const open = rows.filter(r => r.effective_to == null);
    const pool = open.length ? open : rows;
    return pool.slice().sort((a, b) => new Date(b.assigned_at || 0) - new Date(a.assigned_at || 0))[0];
}

// Marketing-safe public projection (NO admin/internal fields, NO active flag exposure beyond filtering).
function publicPlanView(plan, ent) {
    if (!plan) return null;
    return {
        plan_key: plan.plan_key,
        name_ar: plan.name_ar, name_en: plan.name_en,
        description_ar: plan.description_ar || '', description_en: plan.description_en || '',
        currency: plan.currency,
        monthly_price: parseMoney(plan.monthly_price) || 0,
        yearly_price: parseMoney(plan.yearly_price) || 0,
        trial_days: Number(plan.trial_days) || 0,
        sort_order: Number(plan.sort_order) || 0,
        entitlements: ent ? {
            max_users: ent.max_users == null ? null : Number(ent.max_users),
            max_branches: ent.max_branches == null ? null : Number(ent.max_branches),
            support_level: ent.support_level || 'standard',
            api_access: !!ent.api_access, custom_domain: !!ent.custom_domain,
            modules_enabled: (ent.modules_enabled || '').split(',').filter(Boolean)
        } : null
    };
}

// Full admin projection (includes active + raw entitlement limits).
function planAdminView(plan, ent) {
    if (!plan) return null;
    const v = publicPlanView(plan, ent) || {};
    v.id = plan.id;
    v.active = isActive(plan);
    v.created_at = plan.created_at || null;
    v.updated_at = plan.updated_at || null;
    if (ent) v.entitlements = Object.assign(v.entitlements || {}, {
        max_invoices_per_month: ent.max_invoices_per_month == null ? null : Number(ent.max_invoices_per_month)
    });
    return v;
}

// ---- Express router factories ----
function posInt(v) { const n = Number(v); return Number.isInteger(n) && n >= 1 ? n : null; }

// Admin router — mounted under /api/super-admin (inherits the Batch-2 requireSuperAdmin outer guard).
// deps: { pool, getActor(req)->user, logAudit(...) }
function makePlansRouter(deps = {}) {
    const express = require('express');
    const router = express.Router();
    const { pool, getActor, logAudit } = deps;
    const actorOf = (req) => (getActor ? getActor(req) : (req.session && req.session.user)) || null;
    const audit = (req, action, details) => { try { const a = actorOf(req); logAudit && logAudit(a && a.id, a && a.display_name, action, 'Plans', details, req.ip); } catch (_) {} };

    async function loadEnt(planId) {
        return (await pool.query('SELECT * FROM plan_entitlements WHERE plan_id=$1', [planId])).rows[0] || null;
    }

    // LIST all plans (admin view, incl. disabled).
    router.get('/plans', async (req, res) => {
        try {
            const plans = (await pool.query('SELECT * FROM plans ORDER BY sort_order ASC, id ASC')).rows;
            const ents = (await pool.query('SELECT * FROM plan_entitlements')).rows;
            const byId = {}; ents.forEach(e => { byId[e.plan_id] = e; });
            res.json({ plans: plans.map(p => planAdminView(p, byId[p.id])) });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });

    // CREATE plan (+ entitlements row).
    router.post('/plans', async (req, res) => {
        const p = validatePlanInput(req.body, { isCreate: true });
        const ent = validateEntitlements(req.body);
        if (!p.ok || !ent.ok) return res.status(400).json({ error: 'Validation failed', details: [...p.errors, ...ent.errors] });
        try {
            const exists = (await pool.query('SELECT 1 FROM plans WHERE plan_key=$1', [p.value.plan_key])).rows[0];
            if (exists) return res.status(409).json({ error: 'plan_key already exists', code: 'PLAN_EXISTS' });
            const v = p.value;
            const row = (await pool.query(
                `INSERT INTO plans (plan_key,name_ar,name_en,description_ar,description_en,currency,monthly_price,yearly_price,trial_days,sort_order)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
                [v.plan_key, v.name_ar, v.name_en, v.description_ar, v.description_en, v.currency, v.monthly_price, v.yearly_price, v.trial_days, v.sort_order]
            )).rows[0];
            const e = ent.value;
            await pool.query(
                `INSERT INTO plan_entitlements (plan_id,max_users,max_branches,max_invoices_per_month,modules_enabled,support_level,api_access,custom_domain)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [row.id, e.max_users, e.max_branches, e.max_invoices_per_month, e.modules_enabled, e.support_level, e.api_access, e.custom_domain]
            );
            audit(req, 'PLAN_CREATE', `plan ${v.plan_key} created`);
            res.json({ plan: planAdminView(row, await loadEnt(row.id)) });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });

    // UPDATE plan (plan_key immutable; identified by :key).
    router.put('/plans/:key', async (req, res) => {
        const p = validatePlanInput(req.body, { isCreate: false });
        const ent = validateEntitlements(req.body);
        if (!p.ok || !ent.ok) return res.status(400).json({ error: 'Validation failed', details: [...p.errors, ...ent.errors] });
        try {
            const cur = (await pool.query('SELECT * FROM plans WHERE plan_key=$1', [req.params.key])).rows[0];
            if (!cur) return res.status(404).json({ error: 'Plan not found' });
            const v = p.value;
            const row = (await pool.query(
                `UPDATE plans SET name_ar=$1,name_en=$2,description_ar=$3,description_en=$4,currency=$5,monthly_price=$6,yearly_price=$7,trial_days=$8,sort_order=$9,updated_at=now()
                 WHERE plan_key=$10 RETURNING *`,
                [v.name_ar, v.name_en, v.description_ar, v.description_en, v.currency, v.monthly_price, v.yearly_price, v.trial_days, v.sort_order, req.params.key]
            )).rows[0];
            const e = ent.value;
            await pool.query(
                `INSERT INTO plan_entitlements (plan_id,max_users,max_branches,max_invoices_per_month,modules_enabled,support_level,api_access,custom_domain)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 ON CONFLICT (plan_id) DO UPDATE SET max_users=$2,max_branches=$3,max_invoices_per_month=$4,modules_enabled=$5,support_level=$6,api_access=$7,custom_domain=$8`,
                [cur.id, e.max_users, e.max_branches, e.max_invoices_per_month, e.modules_enabled, e.support_level, e.api_access, e.custom_domain]
            );
            audit(req, 'PLAN_UPDATE', `plan ${req.params.key} updated`);
            res.json({ plan: planAdminView(row, await loadEnt(cur.id)) });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });

    // SOFT disable / enable (never hard-delete).
    async function setActive(req, res, active, action) {
        try {
            const row = (await pool.query('UPDATE plans SET active=$1, updated_at=now() WHERE plan_key=$2 RETURNING *', [active, req.params.key])).rows[0];
            if (!row) return res.status(404).json({ error: 'Plan not found' });
            audit(req, action, `plan ${req.params.key} ${active ? 'enabled' : 'disabled'}`);
            res.json({ plan: planAdminView(row, await loadEnt(row.id)) });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    }
    router.post('/plans/:key/disable', (req, res) => setActive(req, res, false, 'PLAN_DISABLE'));
    router.post('/plans/:key/enable', (req, res) => setActive(req, res, true, 'PLAN_ENABLE'));

    // GET tenant current plan.
    router.get('/tenants/:id/plan', async (req, res) => {
        const id = posInt(req.params.id);
        if (!id) return res.status(400).json({ error: 'Invalid tenant id' });
        try {
            const rows = (await pool.query('SELECT * FROM tenant_plan_assignments WHERE tenant_id=$1', [id])).rows;
            const current = deriveCurrentPlan(rows);
            res.json({ tenant_id: id, current: current ? { plan_key: current.plan_key, assignment_source: current.assignment_source, assigned_at: current.assigned_at, effective_from: current.effective_from } : null });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });

    // ASSIGN a plan to a tenant (records a new assignment row; closes the previous open one).
    router.post('/tenants/:id/plan', async (req, res) => {
        const id = posInt(req.params.id);
        if (!id) return res.status(400).json({ error: 'Invalid tenant id' });
        const planKey = typeof req.body.plan_key === 'string' ? req.body.plan_key.trim() : '';
        const source = typeof req.body.assignment_source === 'string' ? req.body.assignment_source.trim() : 'manual';
        if (!PLAN_KEY_RE.test(planKey)) return res.status(400).json({ error: 'invalid plan_key' });
        if (!ASSIGNMENT_SOURCES.includes(source) || source === 'migration') return res.status(400).json({ error: 'invalid assignment_source' });
        try {
            const tenant = (await pool.query('SELECT id FROM tenants WHERE id=$1', [id])).rows[0];
            if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
            const plan = (await pool.query('SELECT * FROM plans WHERE plan_key=$1', [planKey])).rows[0];
            if (!plan) return res.status(404).json({ error: 'Plan not found' });
            if (!canAssignPlan(plan)) return res.status(409).json({ error: 'Cannot assign a disabled plan', code: 'PLAN_DISABLED' });
            const actor = actorOf(req);
            await pool.query('UPDATE tenant_plan_assignments SET effective_to=now() WHERE tenant_id=$1 AND effective_to IS NULL', [id]);
            const row = (await pool.query(
                `INSERT INTO tenant_plan_assignments (tenant_id,plan_key,assignment_source,assigned_by)
                 VALUES ($1,$2,$3,$4) RETURNING *`,
                [id, planKey, source, actor && actor.id]
            )).rows[0];
            audit(req, 'TENANT_PLAN_ASSIGN', `tenant#${id} -> ${planKey} (${source})`);
            res.json({ assignment: { tenant_id: id, plan_key: row.plan_key, assignment_source: row.assignment_source, assigned_at: row.assigned_at } });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });

    return router;
}

// Public router — NO guard. Active plans, marketing-safe fields. Fail-safe: [] if tables absent.
// deps: { pool }
function makePublicPlansRouter(deps = {}) {
    const express = require('express');
    const router = express.Router();
    const { pool } = deps;
    router.get('/plans', async (req, res) => {
        try {
            const plans = (await pool.query('SELECT * FROM plans WHERE active=true ORDER BY sort_order ASC, id ASC')).rows;
            const ents = (await pool.query('SELECT * FROM plan_entitlements')).rows;
            const byId = {}; ents.forEach(e => { byId[e.plan_id] = e; });
            res.json({ plans: plans.map(p => publicPlanView(p, byId[p.id])) });
        } catch (e) {
            // Catalog not provisioned yet (or any read error) -> empty, never 500 on the public surface.
            res.json({ plans: [] });
        }
    });
    return router;
}

module.exports = {
    ALLOWED_CURRENCIES, SUPPORT_LEVELS, ASSIGNMENT_SOURCES, KNOWN_MODULES, PLAN_KEY_RE,
    parseMoney, validatePlanInput, validateEntitlements, canAssignPlan, isActive,
    deriveCurrentPlan, publicPlanView, planAdminView,
    makePlansRouter, makePublicPlansRouter
};
