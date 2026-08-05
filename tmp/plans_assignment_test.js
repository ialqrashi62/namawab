/**
 * plans_assignment_test.js — Batch 3 Plans & Pricing: assignment + entitlements + tenants + idempotency.
 *
 * Complements plans_test.js (which covers create/update/soft-disable + permissions). This file
 * focuses on the flow surface the Super Admin UI calls for tenant-to-plan assignment and on
 * Idempotency-Key handling for the new PUT/DELETE routes.
 *
 * Pure tests: no DB. Express + mocked pool (same fakePool idiom as plans_test.js).
 *   Part A: pure helpers (idempotency decision / parseMoney / validation wrappers).
 *   Part B: in-process HTTP integration for the new endpoints (entitlements CRUD, tenants list,
 *           assignment PUT, DELETE soft-disable, Idempotency-Key replay on PUT / DELETE).
 *
 * Run: node plans_assignment_test.js   (exit 0 = all pass)
 */
'use strict';
const http = require('http');
const express = require('express');
const P = require('./plans');
const { makeGuards } = require('./rbac_guards');
const { makeIdempotencyGuard } = require('./idempotency');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }
function eq(name, a, b) { ok(name, JSON.stringify(a) === JSON.stringify(b)); }

// ---------- Part A: pure ----------
(() => {
  // parseMoney is the canonical money parser exported from plans.js — must be NaN-on-junk and
  // accept numbers, numeric strings, and decimals. No silent zero coercion.
  ok('parseMoney parses number', P.parseMoney(99) === 99);
  ok('parseMoney parses numeric string', P.parseMoney('99.50') === 99.5);
  ok('parseMoney NaN on junk', Number.isNaN(P.parseMoney('free')));
  ok('parseMoney NaN on null', Number.isNaN(P.parseMoney(null)));

  // publicPlanView is the only public surface — must NEVER leak admin fields. The marketing UI
  // depends on this guard to avoid exposing tenant lists, plan ids, or internal notes.
  const pub = P.publicPlanView(
    { plan_key: 'pro', name_ar: 'ب', name_en: 'Pro', currency: 'SAR', monthly_price: '99.00', active: true, id: 7 },
    { max_users: 5, modules_enabled: 'lab,patients', support_level: 'priority', api_access: true }
  );
  ok('public view: no plan id leaked', pub.id === undefined);
  ok('public view: no active flag leaked', pub.active === undefined);
  ok('public view: no internal raw row', pub.plan_key === 'pro' && pub.entitlements.modules_enabled.length === 2);
  ok('public view: parses money to number', pub.monthly_price === 99);

  // canAssignPlan gates the assignment flow — disabled plans must 409 (PLAN_DISABLED). The UI
  // uses this signal to grey out plan rows before submission.
  ok('canAssignPlan true for active=true', P.canAssignPlan({ active: true }) === true);
  ok('canAssignPlan true for pg t', P.canAssignPlan({ active: 't' }) === true);
  ok('canAssignPlan false for active=false', P.canAssignPlan({ active: false }) === false);
  ok('canAssignPlan false for null', P.canAssignPlan(null) === false);

  // deriveCurrentPlan: an open assignment (effective_to NULL) wins; otherwise most-recent.
  const cur = P.deriveCurrentPlan([
    { plan_key: 'old', effective_to: '2026-01-01', assigned_at: '2026-01-01' },
    { plan_key: 'cur', effective_to: null, assigned_at: '2026-05-01' }
  ]);
  ok('deriveCurrentPlan picks open', cur && cur.plan_key === 'cur');
  ok('deriveCurrentPlan null on empty', P.deriveCurrentPlan([]) === null);
})();

// ---------- Part B: HTTP integration ----------
// Reuse the same fake-pool + make-store idiom from plans_test.js. The store tracks every table
// plans.js touches so we can assert both the response and the side-effects (audit + soft-disable).
function makeStore() {
  return {
    plans: [
      { id: 1, plan_key: 'standard', name_ar: 'قياسية', name_en: 'Standard', description_ar: '', description_en: '', currency: 'SAR', monthly_price: '0.00', yearly_price: '0.00', trial_days: 0, active: true, sort_order: 0, created_at: 'd', updated_at: 'd' },
      { id: 2, plan_key: 'pro', name_ar: 'احترافية', name_en: 'Pro', description_ar: '', description_en: '', currency: 'SAR', monthly_price: '99.00', yearly_price: '990.00', trial_days: 14, active: true, sort_order: 1, created_at: 'd', updated_at: 'd' },
      { id: 3, plan_key: 'legacy', name_ar: 'قديمة', name_en: 'Legacy', description_ar: '', description_en: '', currency: 'SAR', monthly_price: '50.00', yearly_price: '0.00', trial_days: 0, active: false, sort_order: 9, created_at: 'd', updated_at: 'd' }
    ],
    ents: {
      1: { plan_id: 1, max_users: null, max_branches: null, max_invoices_per_month: null, modules_enabled: 'dashboard', support_level: 'standard', api_access: false, custom_domain: false },
      2: { plan_id: 2, max_users: 20, max_branches: 3, max_invoices_per_month: 500, modules_enabled: 'lab,patients,doctor', support_level: 'priority', api_access: true, custom_domain: false },
      3: { plan_id: 3, max_users: 5, max_branches: 1, max_invoices_per_month: 50, modules_enabled: 'dashboard', support_level: 'basic', api_access: false, custom_domain: false }
    },
    tenants: [
      { id: 5, name: 'KFSH Riyadh', name_ar: 'مدينة الملك فهد الطبية' },
      { id: 6, name: 'Al Noor Clinic', name_ar: 'عيادة النور' },
      { id: 7, name: 'Disabled Hosp', name_ar: 'مستشفى معطل' }
    ],
    assignments: [],
    // idempotency_keys mirror: tenantId, idem_key, route -> { status, response_status, response_body }
    idem: {},
    seq: 100
  };
}

// tiny in-memory idem store wired to the same fake pool surface
function makeIdemStore(store) {
  return {
    async get(tenantId, key, route) {
      const k = `${tenantId}|${key}|${route}`;
      return store.idem[k] || null;
    },
    async claim(tenantId, key, route) {
      const k = `${tenantId}|${key}|${route}`;
      if (store.idem[k] && store.idem[k].status === 'in_progress') return false;
      if (store.idem[k] && store.idem[k].status === 'completed') return true;
      store.idem[k] = { status: 'in_progress' };
      return true;
    },
    async complete(tenantId, key, route, status, body) {
      const k = `${tenantId}|${key}|${route}`;
      store.idem[k] = { status: 'completed', response_status: status, response_body: body };
    },
    async abort(tenantId, key, route) {
      const k = `${tenantId}|${key}|${route}`;
      delete store.idem[k];
    }
  };
}

function fakePool(store) {
  return {
    query(sql, params) {
      const s = sql.replace(/\s+/g, ' ').trim();
      // entitlements
      if (/SELECT \* FROM plan_entitlements WHERE plan_id=\$1/.test(s)) {
        return Promise.resolve({ rows: store.ents[params[0]] ? [store.ents[params[0]]] : [] });
      }
      if (/SELECT \* FROM plan_entitlements/.test(s)) return Promise.resolve({ rows: Object.values(store.ents) });
      // Bare-id select (used by the new PUT entitlements route to look up plan_id by plan_key)
      if (/SELECT id FROM plans WHERE plan_key=\$1/.test(s)) {
        return Promise.resolve({ rows: store.plans.filter(p => p.plan_key === params[0]).map(p => ({ id: p.id })) });
      }
      if (/SELECT \* FROM plans WHERE plan_key=\$1/.test(s)) {
        return Promise.resolve({ rows: store.plans.filter(p => p.plan_key === params[0]) });
      }
      if (/SELECT \* FROM plans ORDER BY/.test(s)) return Promise.resolve({ rows: store.plans.slice() });
      // soft-delete (DELETE alias) — same SQL as disable
      if (/UPDATE plans SET active=\$1/.test(s)) {
        const p = store.plans.find(x => x.plan_key === params[1]); if (!p) return Promise.resolve({ rows: [] });
        p.active = params[0]; return Promise.resolve({ rows: [p] });
      }
      // bulk entitlements replace
      if (/INSERT INTO plan_entitlements.*ON CONFLICT \(plan_id\) DO UPDATE/.test(s)) {
        const pid = params[0];
        store.ents[pid] = { plan_id: pid, max_users: params[1], max_branches: params[2], max_invoices_per_month: params[3], modules_enabled: params[4], support_level: params[5], api_access: params[6], custom_domain: params[7] };
        return Promise.resolve({ rows: [store.ents[pid]] });
      }
      // tenants list — join with current assignment to surface current_plan_key
      if (/SELECT t\.id, t\.name.*FROM tenants t/.test(s)) {
        const rows = store.tenants.map(t => {
          const open = store.assignments.filter(a => a.tenant_id === t.id && a.effective_to == null);
          const cur = open[0];
          return { id: t.id, name: t.name, name_ar: t.name_ar, current_plan_key: cur ? cur.plan_key : null };
        });
        return Promise.resolve({ rows });
      }
      if (/SELECT id FROM tenants WHERE id=\$1/.test(s)) return Promise.resolve({ rows: params[0] === 5 || params[0] === 6 ? [{ id: params[0] }] : [] });
      if (/SELECT \* FROM tenant_plan_assignments WHERE tenant_id=\$1/.test(s)) return Promise.resolve({ rows: store.assignments.filter(a => a.tenant_id === params[0]) });
      if (/UPDATE tenant_plan_assignments SET effective_to=now\(\)/.test(s)) {
        store.assignments.forEach(a => { if (a.tenant_id === params[0] && a.effective_to == null) a.effective_to = 'closed'; });
        return Promise.resolve({ rows: [] });
      }
      if (/INSERT INTO tenant_plan_assignments/.test(s)) {
        const row = { id: ++store.seq, tenant_id: params[0], plan_key: params[1], assignment_source: params[2], assigned_by: params[3], assigned_at: 'now', effective_to: null };
        store.assignments.push(row);
        return Promise.resolve({ rows: [row] });
      }
      return Promise.resolve({ rows: [] });
    }
  };
}

function req(port, method, path, body, headers) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const hdrs = Object.assign({}, data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}, headers || {});
    const r = http.request({ host: '127.0.0.1', port, method, path, headers: hdrs }, (res) => {
      let b = ''; res.on('data', d => b += d); res.on('end', () => { let j; try { j = JSON.parse(b); } catch { j = {}; } resolve({ status: res.statusCode, json: j, headers: res.headers }); });
    });
    if (data) r.write(data);
    r.end();
  });
}

// Build a minimal server: super-admin mount uses the SAME requireSuperAdmin guard chain server.js
// uses (so we test the real permission story, not a relaxed one). The PUT/DELETE routes that the
// task brief requires to respect Idempotency-Key get the idempotency guard in front of them.
function buildServer(store, auditArr, idemBypass) {
  const pool = fakePool(store);
  const idem = makeIdemStore(store);
  const guards = makeGuards({ logAudit: (...a) => auditArr.push(a) });
  const userRef = { user: { id: 1, username: 'op', display_name: 'Op', is_active: 1 } };

  const app = express();
  app.use(express.json());
  app.use((req2, res, next) => { req2.session = { user: userRef.user }; next(); });
  const requireAuth = (req2, res, next) => (req2.session && req2.session.user) ? next() : res.status(401).json({ error: 'Unauthorized' });

  // The idempotency guard from ./idempotency is the canonical one. For testability we
  // re-implement its opt-in semantics on top of the in-memory idem store so we don't need
  // a real `idempotency_keys` table. The middleware contract is identical (header in, replay out).
  const idemGuard = async (req2, res, next) => {
    if (idemBypass) return next();
    const key = req2.headers['idempotency-key'];
    if (!key || typeof key !== 'string') return next();
    if (key.length < 8 || key.length > 200) return next();
    if (!/^[A-Za-z0-9._:-]+$/.test(key)) return next();
    const tenantId = 1; // admin routes are global; idem key is scoped by (tenant, key, route)
    const route = req2.baseUrl + (req2.route ? req2.route.path : req2.path);
    const existing = await idem.get(tenantId, key, route);
    if (existing && existing.status === 'completed') {
      res.set('Idempotent-Replay', 'true');
      return res.status(existing.response_status).json(existing.response_body);
    }
    if (existing && existing.status === 'in_progress') {
      return res.status(409).json({ error: 'Duplicate request in progress', code: 'IDEMPOTENCY_CONFLICT' });
    }
    const claimed = await idem.claim(tenantId, key, route);
    if (!claimed) return res.status(409).json({ error: 'Duplicate request', code: 'IDEMPOTENCY_CONFLICT' });
    const orig = res.json.bind(res);
    res.json = (body) => {
      const status = res.statusCode || 200;
      const keepable = status >= 200 && status < 500;
      if (keepable) {
        // fire-and-forget; tests are sync enough to read after the response
        idem.complete(tenantId, key, route, status, body == null ? null : body);
      } else {
        idem.abort(tenantId, key, route);
      }
      return orig(body);
    };
    return next();
  };

  app.use('/api/super-admin', requireAuth, guards.requireSuperAdmin('op'), P.makePlansRouter({ pool, getActor: (r) => r.session.user, logAudit: (...a) => auditArr.push(a), idempotencyGuard: idemGuard }));
  app.use('/api/public', P.makePublicPlansRouter({ pool }));
  return { app, userRef };
}

(async () => {
  // ----- 1) GET /plans/:key/entitlements -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'GET', '/api/super-admin/plans/standard/entitlements');
    ok('entitlements 200 + correct plan', r1.status === 200 && r1.json.plan_id === 1 && r1.json.modules_enabled === 'dashboard');
    ok('entitlements exposes internal max_invoices_per_month (admin view)', r1.json.max_invoices_per_month === null);

    const r2 = await req(port, 'GET', '/api/super-admin/plans/pro/entitlements');
    ok('entitlements 200 for pro', r2.status === 200 && r2.json.max_users === 20 && r2.json.support_level === 'priority');

    const r3 = await req(port, 'GET', '/api/super-admin/plans/nonexistent/entitlements');
    ok('entitlements 404 for unknown plan', r3.status === 404 && r3.json.error === 'Plan not found');

    srv.close();
  }

  // ----- 2) PUT /plans/:key/entitlements (bulk replace) -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'PUT', '/api/super-admin/plans/pro/entitlements', { max_users: 50, max_branches: 10, modules_enabled: ['lab', 'pharmacy', 'inventory'], support_level: 'enterprise', api_access: true, custom_domain: true });
    ok('entitlements PUT 200', r1.status === 200 && r1.json.plan_id === 2);
    eq('entitlements PUT replaced max_users', store.ents[2].max_users, 50);
    eq('entitlements PUT replaced modules (deduped + sorted)', store.ents[2].modules_enabled, 'inventory,lab,pharmacy');
    eq('entitlements PUT replaced support_level', store.ents[2].support_level, 'enterprise');
    ok('entitlements PUT wrote audit', audit.some(a => a[2] === 'PLAN_ENTITLEMENTS_UPDATE'));

    const r2 = await req(port, 'PUT', '/api/super-admin/plans/pro/entitlements', { modules_enabled: ['evil'] });
    ok('entitlements PUT rejects unknown module 400', r2.status === 400);

    const r3 = await req(port, 'PUT', '/api/super-admin/plans/pro/entitlements', { max_users: -1 });
    ok('entitlements PUT rejects negative limit 400', r3.status === 400);

    const r4 = await req(port, 'PUT', '/api/super-admin/plans/nonexistent/entitlements', { modules_enabled: ['lab'] });
    ok('entitlements PUT 404 for unknown plan', r4.status === 404);

    srv.close();
  }

  // ----- 3) GET /tenants (dropdown data) -----
  {
    const store = makeStore();
    // pre-assign standard to tenant 5
    store.assignments.push({ id: 1, tenant_id: 5, plan_key: 'standard', assignment_source: 'manual', assigned_by: 1, assigned_at: 'now', effective_to: null });
    const audit = [];
    const { app } = buildServer(store, audit);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'GET', '/api/super-admin/tenants');
    ok('tenants list 200', r1.status === 200 && Array.isArray(r1.json.tenants) && r1.json.tenants.length === 3);
    ok('tenants list includes current_plan_key for assigned', r1.json.tenants.find(t => t.id === 5).current_plan_key === 'standard');
    ok('tenants list null current_plan_key for unassigned', r1.json.tenants.find(t => t.id === 6).current_plan_key === null);
    ok('tenants list includes disabled tenant (admin view)', r1.json.tenants.find(t => t.id === 7));

    srv.close();
  }

  // ----- 4) PUT /tenants/:id/plan (assignment) -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' });
    ok('PUT assign 200', r1.status === 200 && r1.json.assignment && r1.json.assignment.plan_key === 'pro');
    ok('PUT assign wrote audit', audit.some(a => a[2] === 'TENANT_PLAN_ASSIGN'));
    ok('PUT assign closed previous (one open)', store.assignments.filter(a => a.tenant_id === 5 && a.effective_to == null).length === 1);

    // Re-assign closes the previous
    const r2 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'standard' });
    ok('PUT re-assign 200', r2.status === 200 && r2.json.assignment.plan_key === 'standard');
    ok('PUT re-assign left exactly one open', store.assignments.filter(a => a.tenant_id === 5 && a.effective_to == null).length === 1);
    ok('PUT re-assign closed the prior one', store.assignments.filter(a => a.tenant_id === 5 && a.plan_key === 'pro' && a.effective_to != null).length === 1);

    // disabled plan -> 409
    const r3 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'legacy' });
    ok('PUT assign disabled plan 409', r3.status === 409 && r3.json.code === 'PLAN_DISABLED');

    // missing tenant -> 404
    const r4 = await req(port, 'PUT', '/api/super-admin/tenants/99/plan', { plan_key: 'pro' });
    ok('PUT assign missing tenant 404', r4.status === 404);

    // missing plan -> 404
    const r5 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'nope' });
    ok('PUT assign missing plan 404', r5.status === 404);

    // bad plan_key
    const r6 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'BAD KEY' });
    ok('PUT assign bad plan_key 400', r6.status === 400);

    srv.close();
  }

  // ----- 5) DELETE /plans/:key — soft-disable, never hard-delete -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'DELETE', '/api/super-admin/plans/pro');
    ok('DELETE 200', r1.status === 200);
    ok('DELETE set active=false (soft-disable)', store.plans.find(p => p.plan_key === 'pro').active === false);
    ok('DELETE preserved the row (rail 4: no hard delete)', store.plans.some(p => p.plan_key === 'pro'));
    ok('DELETE wrote audit', audit.some(a => a[2] === 'PLAN_DISABLE'));

    const r2 = await req(port, 'DELETE', '/api/super-admin/plans/nonexistent');
    ok('DELETE unknown plan 404', r2.status === 404);

    srv.close();
  }

  // ----- 6) Idempotency-Key: PUT /tenants/:id/plan replays the stored response -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit, false); // honor Idempotency-Key
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const headers = { 'Idempotency-Key': 'k1' + 'a'.repeat(8) };
    const r1 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' }, headers);
    ok('idem first call 200', r1.status === 200 && r1.headers['idempotent-replay'] === undefined);

    const r2 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' }, headers);
    ok('idem replay 200', r2.status === 200);
    ok('idem replay set Idempotent-Replay header', r2.headers['idempotent-replay'] === 'true');
    ok('idem replay returned same body', r2.json.assignment && r2.json.assignment.plan_key === 'pro');
    ok('idem replay did NOT create a second assignment row', store.assignments.filter(a => a.tenant_id === 5).length === 1);

    // Different key = new write
    const r3 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'standard' }, { 'Idempotency-Key': 'k2' + 'b'.repeat(8) });
    ok('idem different key creates new assignment', r3.status === 200 && store.assignments.filter(a => a.tenant_id === 5).length === 2);

    srv.close();
  }

  // ----- 7) Idempotency-Key: DELETE /plans/:key replays (replay-safe) -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit, false);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const headers = { 'Idempotency-Key': 'del' + 'c'.repeat(8) };
    const r1 = await req(port, 'DELETE', '/api/super-admin/plans/pro', null, headers);
    ok('idem DELETE first 200', r1.status === 200);
    const r2 = await req(port, 'DELETE', '/api/super-admin/plans/pro', null, headers);
    ok('idem DELETE replay 200', r2.status === 200);
    ok('idem DELETE replay header', r2.headers['idempotent-replay'] === 'true');
    ok('idem DELETE did NOT write a second audit row', audit.filter(a => a[2] === 'PLAN_DISABLE').length === 1);

    srv.close();
  }

  // ----- 8) Idempotency-Key: opt-in — no key passes through, no store, no replay header -----
  {
    const store = makeStore();
    const audit = [];
    const { app } = buildServer(store, audit, false);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' });
    const r2 = await req(port, 'PUT', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' });
    ok('no idem key: both calls write (no replay)', r1.status === 200 && r2.status === 200 && r1.headers['idempotent-replay'] === undefined && r2.headers['idempotent-replay'] === undefined);
    ok('no idem key: TWO distinct assignments', store.assignments.filter(a => a.tenant_id === 5).length === 2);

    srv.close();
  }

  // ----- 9) GET /api/public/plans: only active, no admin fields, no tenant list -----
  {
    const store = makeStore();
    const { app } = buildServer(store, []);
    const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
    const port = srv.address().port;

    const r1 = await req(port, 'GET', '/api/public/plans');
    ok('public 200', r1.status === 200);
    ok('public hides inactive', r1.json.plans.every(p => !('active' in p)));
    ok('public excludes legacy (disabled)', !r1.json.plans.some(p => p.plan_key === 'legacy'));
    ok('public has no id/tenant fields', r1.json.plans.every(p => p.id === undefined && !('tenants' in p)));

    srv.close();
  }

  console.log(`plans_assignment_test: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
