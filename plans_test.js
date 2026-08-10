/**
 * plans_test.js — Batch 3 Plans & Pricing tests.
 *   Part A: pure unit tests (validation/entitlements/assignability/views) — no DB.
 *   Part B: in-process HTTP integration (express + mocked pool + real requireSuperAdmin guard) for
 *           permissions, validation, soft-disable, assignment, audit, and the public surface.
 * Run: node plans_test.js   (exit 0 = all pass)
 */
'use strict';
const http = require('http');
const express = require('express');
const P = require('./plans');
const { makeGuards } = require('./rbac_guards');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// ---------- Part A: pure ----------
(() => {
  const good = P.validatePlanInput({ plan_key: 'pro_2026', name_ar: 'احترافية', name_en: 'Pro', currency: 'sar', monthly_price: '99.00', yearly_price: 990, trial_days: 14, sort_order: 1 }, { isCreate: true });
  ok('valid plan passes', good.ok && good.value.currency === 'SAR' && good.value.monthly_price === 99);
  ok('negative price rejected', P.validatePlanInput({ name_ar: 'x', name_en: 'x', currency: 'SAR', monthly_price: -5 }, { isCreate: true }).ok === false);
  ok('invalid currency rejected', P.validatePlanInput({ name_ar: 'x', name_en: 'x', currency: 'XYZ' }, { isCreate: true }).ok === false);
  ok('bad plan_key rejected', P.validatePlanInput({ plan_key: 'Bad Key!', name_ar: 'x', name_en: 'x', currency: 'SAR' }, { isCreate: true }).ok === false);
  ok('missing currency rejected', P.validatePlanInput({ name_ar: 'x', name_en: 'x' }, { isCreate: true }).ok === false);
  ok('missing name rejected', P.validatePlanInput({ name_ar: '', name_en: '', currency: 'SAR' }, { isCreate: true }).ok === false);
  ok('trial out of range rejected', P.validatePlanInput({ name_ar: 'x', name_en: 'x', currency: 'SAR', trial_days: 500 }, { isCreate: true }).ok === false);
  ok('plan_key ignored on update', P.validatePlanInput({ name_ar: 'x', name_en: 'x', currency: 'SAR' }, { isCreate: false }).value.plan_key === undefined);
})();

(() => {
  const e = P.validateEntitlements({ max_users: 10, max_branches: '', max_invoices_per_month: null, modules_enabled: ['lab', 'patients', 'lab'], support_level: 'priority', api_access: '1' });
  ok('entitlements valid + dedup + null unlimited', e.ok && e.value.max_users === 10 && e.value.max_branches === null && e.value.max_invoices_per_month === null && e.value.modules_enabled === 'lab,patients' && e.value.support_level === 'priority' && e.value.api_access === true);
  ok('unknown module rejected', P.validateEntitlements({ modules_enabled: ['lab', 'hackmodule'] }).ok === false);
  ok('negative limit rejected', P.validateEntitlements({ max_users: -1 }).ok === false);
  ok('bad support_level rejected', P.validateEntitlements({ support_level: 'godmode' }).ok === false);
  ok('modules as comma string accepted', P.validateEntitlements({ modules_enabled: 'lab, patients' }).value.modules_enabled === 'lab,patients');
})();

ok('canAssignPlan true for active', P.canAssignPlan({ active: true }) === true);
ok('canAssignPlan true for pg "t"', P.canAssignPlan({ active: 't' }) === true);
ok('canAssignPlan false for disabled', P.canAssignPlan({ active: false }) === false);
ok('canAssignPlan false for null', P.canAssignPlan(null) === false);

(() => {
  const rows = [
    { plan_key: 'old', effective_to: '2026-01-01', assigned_at: '2026-01-01' },
    { plan_key: 'cur', effective_to: null, assigned_at: '2026-05-01' }
  ];
  ok('deriveCurrentPlan picks open assignment', P.deriveCurrentPlan(rows).plan_key === 'cur');
  ok('deriveCurrentPlan null when empty', P.deriveCurrentPlan([]) === null);
})();

(() => {
  const pub = P.publicPlanView({ plan_key: 'pro', name_ar: 'ب', name_en: 'Pro', currency: 'SAR', monthly_price: '99.00', yearly_price: '990.00', trial_days: 7, active: true, id: 3 }, { max_users: 5, modules_enabled: 'lab,patients', support_level: 'priority', api_access: true });
  ok('publicPlanView hides admin fields (id/active)', pub.id === undefined && pub.active === undefined);
  ok('publicPlanView parses money', pub.monthly_price === 99 && pub.yearly_price === 990);
  ok('publicPlanView exposes safe entitlements', pub.entitlements.max_users === 5 && pub.entitlements.modules_enabled.length === 2 && pub.entitlements.max_invoices_per_month === undefined);
  const adm = P.planAdminView({ plan_key: 'pro', name_ar: 'ب', name_en: 'Pro', currency: 'SAR', monthly_price: '99', yearly_price: '0', active: 't', id: 3 }, { max_invoices_per_month: 100 });
  ok('planAdminView exposes id/active + internal limit', adm.id === 3 && adm.active === true && adm.entitlements.max_invoices_per_month === 100);
})();

// ---------- Part B: HTTP integration ----------
function makeStore() {
  return {
    plans: [{ id: 1, plan_key: 'standard', name_ar: 'قياسية', name_en: 'Standard', description_ar: '', description_en: '', currency: 'SAR', monthly_price: '0.00', yearly_price: '0.00', trial_days: 0, active: true, sort_order: 0, created_at: 'd', updated_at: 'd' },
            { id: 2, plan_key: 'legacy', name_ar: 'قديمة', name_en: 'Legacy', description_ar: '', description_en: '', currency: 'SAR', monthly_price: '50.00', yearly_price: '0.00', trial_days: 0, active: false, sort_order: 9, created_at: 'd', updated_at: 'd' }],
    ents: { 1: { plan_id: 1, max_users: null, max_branches: null, max_invoices_per_month: null, modules_enabled: 'dashboard', support_level: 'standard', api_access: false, custom_domain: false } },
    assignments: [],
    seq: 100
  };
}
function fakePool(store) {
  return {
    query(sql, params) {
      const s = sql.replace(/\s+/g, ' ').trim();
      if (/SELECT \* FROM plans WHERE active=true/.test(s)) return Promise.resolve({ rows: store.plans.filter(p => p.active) });
      if (/SELECT \* FROM plans ORDER BY/.test(s)) return Promise.resolve({ rows: store.plans.slice() });
      if (/SELECT \* FROM plan_entitlements WHERE plan_id=\$1/.test(s)) return Promise.resolve({ rows: store.ents[params[0]] ? [store.ents[params[0]]] : [] });
      if (/SELECT \* FROM plan_entitlements/.test(s)) return Promise.resolve({ rows: Object.values(store.ents) });
      if (/SELECT 1 FROM plans WHERE plan_key=\$1/.test(s)) return Promise.resolve({ rows: store.plans.filter(p => p.plan_key === params[0]).map(() => ({ x: 1 })) });
      if (/INSERT INTO plans/.test(s)) {
        const row = { id: ++store.seq, plan_key: params[0], name_ar: params[1], name_en: params[2], description_ar: params[3], description_en: params[4], currency: params[5], monthly_price: String(params[6]), yearly_price: String(params[7]), trial_days: params[8], active: true, sort_order: params[9], created_at: 'd', updated_at: 'd' };
        store.plans.push(row); return Promise.resolve({ rows: [row] });
      }
      if (/INSERT INTO plan_entitlements/.test(s)) {
        const pid = params[0];
        store.ents[pid] = { plan_id: pid, max_users: params[1], max_branches: params[2], max_invoices_per_month: params[3], modules_enabled: params[4], support_level: params[5], api_access: params[6], custom_domain: params[7] };
        return Promise.resolve({ rows: [store.ents[pid]] });
      }
      if (/UPDATE plans SET name_ar/.test(s)) {
        const key = params[9]; const p = store.plans.find(x => x.plan_key === key); if (!p) return Promise.resolve({ rows: [] });
        Object.assign(p, { name_ar: params[0], name_en: params[1], currency: params[4], monthly_price: String(params[5]), yearly_price: String(params[6]) });
        return Promise.resolve({ rows: [p] });
      }
      if (/UPDATE plans SET active=\$1/.test(s)) {
        const p = store.plans.find(x => x.plan_key === params[1]); if (!p) return Promise.resolve({ rows: [] });
        p.active = params[0]; return Promise.resolve({ rows: [p] });
      }
      if (/SELECT \* FROM plans WHERE plan_key=\$1/.test(s)) return Promise.resolve({ rows: store.plans.filter(p => p.plan_key === params[0]) });
      if (/SELECT \* FROM tenant_plan_assignments WHERE tenant_id=\$1/.test(s)) return Promise.resolve({ rows: store.assignments.filter(a => a.tenant_id === params[0]) });
      if (/SELECT id FROM tenants WHERE id=\$1/.test(s)) return Promise.resolve({ rows: params[0] === 5 ? [{ id: 5 }] : [] });
      if (/UPDATE tenant_plan_assignments SET effective_to=now\(\)/.test(s)) { store.assignments.forEach(a => { if (a.tenant_id === params[0] && a.effective_to == null) a.effective_to = 'closed'; }); return Promise.resolve({ rows: [] }); }
      if (/INSERT INTO tenant_plan_assignments/.test(s)) {
        const row = { id: ++store.seq, tenant_id: params[0], plan_key: params[1], assignment_source: params[2], assigned_by: params[3], assigned_at: 'now', effective_to: null };
        store.assignments.push(row); return Promise.resolve({ rows: [row] });
      }
      return Promise.resolve({ rows: [] });
    }
  };
}

function req(port, method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({ host: '127.0.0.1', port, method, path, headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {} }, (res) => {
      let b = ''; res.on('data', d => b += d); res.on('end', () => { let j; try { j = JSON.parse(b); } catch { j = {}; } resolve({ status: res.statusCode, json: j }); });
    });
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const store = makeStore();
  const pool = fakePool(store);
  const audit = [];
  const guards = makeGuards({ logAudit: (...a) => audit.push(a) });
  const userRef = { user: { id: 1, username: 'op', display_name: 'Op', is_active: 1 } };

  const app = express();
  app.use(express.json());
  app.use((req2, res, next) => { req2.session = { user: userRef.user }; next(); });
  const requireAuth = (req2, res, next) => (req2.session && req2.session.user) ? next() : res.status(401).json({ error: 'Unauthorized' });
  // admin plans mounted behind the SAME guard chain as server.js
  app.use('/api/super-admin', requireAuth, guards.requireSuperAdmin('op'), P.makePlansRouter({ pool, getActor: (r) => r.session.user, logAudit: (...a) => audit.push(a) }));
  // public plans (no guard)
  app.use('/api/public', P.makePublicPlansRouter({ pool }));
  const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
  const port = srv.address().port;

  // ----- permissions -----
  let r1 = await req(port, 'GET', '/api/super-admin/plans');
  ok('super admin lists plans 200', r1.status === 200 && Array.isArray(r1.json.plans));

  userRef.user = { id: 2, username: 'tadmin', role: 'Admin', is_active: 1 };
  let r2 = await req(port, 'GET', '/api/super-admin/plans');
  ok('tenant Admin denied plans 403', r2.status === 403 && r2.json.code === 'SUPER_ADMIN_REQUIRED');

  userRef.user = null;
  let r3 = await req(port, 'GET', '/api/super-admin/plans');
  ok('anonymous denied plans (401 at requireAuth)', r3.status === 401);

  userRef.user = { id: 1, username: 'op', display_name: 'Op', is_active: 1 };

  // ----- create validation -----
  let rneg = await req(port, 'POST', '/api/super-admin/plans', { plan_key: 'bad', name_ar: 'x', name_en: 'x', currency: 'SAR', monthly_price: -1 });
  ok('create rejects negative price 400', rneg.status === 400);
  let rcur = await req(port, 'POST', '/api/super-admin/plans', { plan_key: 'bad2', name_ar: 'x', name_en: 'x', currency: 'ZZZ' });
  ok('create rejects invalid currency 400', rcur.status === 400);
  let rmod = await req(port, 'POST', '/api/super-admin/plans', { plan_key: 'bad3', name_ar: 'x', name_en: 'x', currency: 'SAR', modules_enabled: ['lab', 'evil'] });
  ok('create rejects unknown module 400', rmod.status === 400);

  // ----- create success + audit -----
  audit.length = 0;
  let rok = await req(port, 'POST', '/api/super-admin/plans', { plan_key: 'pro', name_ar: 'احترافية', name_en: 'Pro', currency: 'SAR', monthly_price: 99, yearly_price: 990, modules_enabled: ['lab', 'patients'], max_users: 20 });
  ok('create plan 200', rok.status === 200 && rok.json.plan.plan_key === 'pro' && rok.json.plan.active === true);
  ok('create wrote PLAN_CREATE audit', audit.some(a => a[2] === 'PLAN_CREATE'));

  // duplicate key
  let rdup = await req(port, 'POST', '/api/super-admin/plans', { plan_key: 'pro', name_ar: 'x', name_en: 'x', currency: 'SAR' });
  ok('duplicate plan_key 409', rdup.status === 409 && rdup.json.code === 'PLAN_EXISTS');

  // ----- soft disable does NOT delete -----
  audit.length = 0;
  let rdis = await req(port, 'POST', '/api/super-admin/plans/pro/disable');
  ok('disable plan 200 + active=false', rdis.status === 200 && rdis.json.plan.active === false);
  ok('disabled plan still present (no hard delete)', store.plans.some(p => p.plan_key === 'pro'));
  ok('disable wrote PLAN_DISABLE audit', audit.some(a => a[2] === 'PLAN_DISABLE'));

  // ----- assign tenant plan -----
  let rbadt = await req(port, 'POST', '/api/super-admin/tenants/99/plan', { plan_key: 'standard' });
  ok('assign to missing tenant 404', rbadt.status === 404);
  let rbadp = await req(port, 'POST', '/api/super-admin/tenants/5/plan', { plan_key: 'nope' });
  ok('assign missing plan 404', rbadp.status === 404);
  let rdisP = await req(port, 'POST', '/api/super-admin/tenants/5/plan', { plan_key: 'pro' }); // pro is now disabled
  ok('assign disabled plan 409', rdisP.status === 409 && rdisP.json.code === 'PLAN_DISABLED');

  audit.length = 0;
  let rasg = await req(port, 'POST', '/api/super-admin/tenants/5/plan', { plan_key: 'standard' });
  ok('assign active plan 200', rasg.status === 200 && rasg.json.assignment.plan_key === 'standard');
  ok('assign wrote TENANT_PLAN_ASSIGN audit', audit.some(a => a[2] === 'TENANT_PLAN_ASSIGN'));

  // assign again closes the previous open assignment
  let rasg2 = await req(port, 'POST', '/api/super-admin/tenants/5/plan', { plan_key: 'standard' });
  ok('re-assign 200', rasg2.status === 200);
  ok('previous assignment closed (only one open)', store.assignments.filter(a => a.tenant_id === 5 && a.effective_to == null).length === 1);

  // migration source rejected via API (manual/trial only here)
  let rmig = await req(port, 'POST', '/api/super-admin/tenants/5/plan', { plan_key: 'standard', assignment_source: 'migration' });
  ok('assignment_source=migration rejected 400', rmig.status === 400);

  // ----- get tenant plan -----
  let rget = await req(port, 'GET', '/api/super-admin/tenants/5/plan');
  ok('get tenant plan returns current', rget.status === 200 && rget.json.current && rget.json.current.plan_key === 'standard');

  // ----- public surface: active only, no admin fields -----
  let rpub = await req(port, 'GET', '/api/public/plans');
  ok('public lists only active plans', rpub.status === 200 && rpub.json.plans.every(p => p.active === undefined) && rpub.json.plans.some(p => p.plan_key === 'standard') && !rpub.json.plans.some(p => p.plan_key === 'legacy'));

  srv.close();

  // ----- public fail-safe when catalog absent (pool throws) -----
  const app2 = express();
  app2.use('/api/public', P.makePublicPlansRouter({ pool: { query: () => Promise.reject(new Error('relation "plans" does not exist')) } }));
  const srv2 = app2.listen(0); await new Promise(r => srv2.once('listening', r));
  let rpf = await req(srv2.address().port, 'GET', '/api/public/plans');
  ok('public fail-safe returns [] (never 500) when tables absent', rpf.status === 200 && Array.isArray(rpf.json.plans) && rpf.json.plans.length === 0);
  srv2.close();

  // ----- "SUPER_ADMIN_ENABLED=false" simulation: admin routes not mounted -> 404 -----
  const app3 = express();
  app3.use((req3, res) => res.status(404).json({ fell_through: true }));
  const srv3 = app3.listen(0); await new Promise(r => srv3.once('listening', r));
  let rdisabled = await req(srv3.address().port, 'GET', '/api/super-admin/plans');
  ok('disabled (unmounted) admin plans -> 404', rdisabled.status === 404 && rdisabled.json.fell_through === true);
  srv3.close();

  console.log(`plans_test: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
