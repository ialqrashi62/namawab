/**
 * entitlements_test.js — Batch 4A Entitlements Runtime Resolver tests.
 *   Part A: pure (mergeDefaults / hasFeature / checkLimit / pickEnforcement).
 *   Part B: resolver with a fake pool (fail-open on absent tables, no-plan, plan present, cache, observe).
 *   Part C: HTTP — observe read endpoint behind requireSuperAdmin (super 200, tenant admin 403, anon 401).
 * Run: node entitlements_test.js   (exit 0 = all pass)
 */
'use strict';
const http = require('http');
const express = require('express');
const E = require('./entitlements');
const { makeGuards } = require('./rbac_guards');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// ---------- Part A: pure ----------
(() => {
  const d = E.mergeDefaults(null);
  ok('mergeDefaults(null) = safe defaults (unlimited/no modules)', d.max_users === null && d.max_branches === null && Array.isArray(d.modules_enabled) && d.modules_enabled.length === 0 && d.api_access === false && d.support_level === 'standard');
  const r = E.mergeDefaults({ max_users: '20', max_branches: null, max_invoices_per_month: 1000, modules_enabled: 'lab,patients', support_level: 'priority', api_access: 't', custom_domain: false });
  ok('mergeDefaults normalizes row', r.max_users === 20 && r.max_branches === null && r.max_invoices_per_month === 1000 && r.modules_enabled.length === 2 && r.api_access === true && r.support_level === 'priority');
})();

ok('hasFeature api_access true', E.hasFeature({ api_access: true }, 'api_access') === true);
ok('hasFeature custom_domain false', E.hasFeature({ custom_domain: false }, 'custom_domain') === false);
ok('hasFeature known module membership', E.hasFeature({ modules_enabled: ['lab', 'patients'] }, 'lab') === true);
ok('hasFeature module not granted', E.hasFeature({ modules_enabled: ['lab'] }, 'radiology') === false);
(() => { let threw = false; try { E.hasFeature({}, 'teleport'); } catch (e) { threw = true; } ok('hasFeature unknown rejected (throws)', threw); })();

(() => {
  let threw = false; try { E.checkLimit({}, 'bogus_limit', 0); } catch (e) { threw = true; }
  ok('checkLimit unknown rejected (throws)', threw);
  const un = E.checkLimit({ max_users: null }, 'max_users', 999, 'enforce');
  ok('checkLimit null = unlimited allowed', un.allowed === true && un.unlimited === true);
  const obs = E.checkLimit({ max_users: 5 }, 'max_users', 5, 'observe');
  ok('observe never blocks (allowed true, would_block true)', obs.allowed === true && obs.would_block === true && obs.mode === 'observe');
  const enfBlock = E.checkLimit({ max_users: 5 }, 'max_users', 5, 'enforce');
  ok('enforce blocks at/over limit', enfBlock.allowed === false && enfBlock.would_block === true);
  const enfOk = E.checkLimit({ max_users: 5 }, 'max_users', 4, 'enforce');
  ok('enforce allows under limit', enfOk.allowed === true && enfOk.would_block === false);
  const badMode = E.checkLimit({ max_users: 5 }, 'max_users', 99, 'chaos');
  ok('invalid mode falls back to observe (no block)', badMode.allowed === true && badMode.mode === 'observe');
})();

(() => {
  const def = E.pickEnforcement({});
  ok('pickEnforcement defaults: disabled/observe/allow_existing', def.enabled === false && def.mode === 'observe' && def.failMode === 'allow_existing');
  const on = E.pickEnforcement({ ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce', ENTITLEMENTS_FAIL_MODE: 'deny_new' });
  ok('pickEnforcement reads valid env', on.enabled === true && on.mode === 'enforce' && on.failMode === 'deny_new');
  const bad = E.pickEnforcement({ ENTITLEMENTS_ENFORCEMENT_MODE: 'hack', ENTITLEMENTS_FAIL_MODE: 'hack' });
  ok('pickEnforcement rejects invalid env values', bad.mode === 'observe' && bad.failMode === 'allow_existing');
})();

// ---------- Part B: resolver (fake pool) ----------
function poolThatThrows() { return { calls: 0, query() { this.calls++; return Promise.reject(new Error('relation "tenant_plan_assignments" does not exist')); } }; }
function poolWithPlan(planRows, entRow) {
  return {
    calls: 0,
    query(sql) {
      this.calls++;
      const s = sql.replace(/\s+/g, ' ');
      if (/FROM tenant_plan_assignments/.test(s)) return Promise.resolve({ rows: planRows });
      if (/FROM plan_entitlements pe JOIN plans/.test(s)) return Promise.resolve({ rows: entRow ? [entRow] : [] });
      return Promise.resolve({ rows: [] });
    }
  };
}

(async () => {
  // fail-open when tables absent
  const audit = [];
  const r1 = E.makeEntitlementsResolver({ pool: poolThatThrows(), logAudit: (...a) => audit.push(a) });
  const res1 = await r1.resolveTenantEntitlements(5);
  ok('absent tables -> fail-open defaults (no throw)', (res1.source === 'default' || res1.source === 'no_plan') && res1.entitlements.max_users === null && Array.isArray(res1.entitlements.modules_enabled));
  ok('absent tables logs resolve fail', audit.some(a => a[2] === 'ENTITLEMENT_RESOLVE_FAIL'));

  // no plan assignment
  const r2 = E.makeEntitlementsResolver({ pool: poolWithPlan([], null) });
  const res2 = await r2.resolveTenantEntitlements(5);
  ok('no plan -> source no_plan + defaults', res2.source === 'no_plan' && res2.plan_key === null);

  // plan present
  const r3 = E.makeEntitlementsResolver({ pool: poolWithPlan([{ plan_key: 'pro', assignment_source: 'manual', effective_to: null, assigned_at: '2026-05-01' }], { max_users: 20, max_branches: null, max_invoices_per_month: 1000, modules_enabled: 'lab,patients', support_level: 'priority', api_access: 't', custom_domain: false }) });
  const res3 = await r3.resolveTenantEntitlements(5);
  ok('plan present -> source plan + resolved entitlements', res3.source === 'plan' && res3.plan_key === 'pro' && res3.entitlements.max_users === 20 && res3.entitlements.api_access === true);

  // cache: within ttl uses cache (one query set), after ttl re-reads
  let t = 1000;
  const cp = poolWithPlan([{ plan_key: 'pro', assignment_source: 'manual', effective_to: null, assigned_at: '2026-05-01' }], { max_users: 1 });
  const r4 = E.makeEntitlementsResolver({ pool: cp, now: () => t, cacheTtlMs: 30000 });
  await r4.resolveTenantEntitlements(7); const afterFirst = cp.calls;
  await r4.resolveTenantEntitlements(7);
  ok('cache hit within ttl (no extra queries)', cp.calls === afterFirst);
  t += 40000;
  await r4.resolveTenantEntitlements(7);
  ok('cache expires after ttl (re-queries)', cp.calls > afterFirst);

  // observeLimit never blocks but flags would_block + audits
  const audit2 = [];
  const r5 = E.makeEntitlementsResolver({ pool: poolWithPlan([{ plan_key: 'pro', assignment_source: 'manual', effective_to: null, assigned_at: '2026-05-01' }], { max_users: 2 }), logAudit: (...a) => audit2.push(a) });
  const obs = await r5.observeLimit(5, 'max_users', 5, 'observe');
  ok('observeLimit does not block over-limit', obs.allowed === true && obs.would_block === true);
  ok('observeLimit audits ENTITLEMENT_OBSERVE', audit2.some(a => a[2] === 'ENTITLEMENT_OBSERVE'));

  // ---------- Part C: HTTP observe endpoint behind requireSuperAdmin ----------
  const guards = makeGuards({ logAudit: () => {} });
  const resolver = E.makeEntitlementsResolver({ pool: poolWithPlan([{ plan_key: 'pro', assignment_source: 'manual', effective_to: null, assigned_at: '2026-05-01' }], { max_users: 20 }) });
  const userRef = { user: { id: 1, username: 'op', display_name: 'Op', is_active: 1 } };
  const app = express();
  app.use((req, res, next) => { req.session = { user: userRef.user }; next(); });
  const requireAuth = (req, res, next) => (req.session && req.session.user) ? next() : res.status(401).json({ error: 'Unauthorized' });
  app.get('/api/super-admin/tenants/:id/entitlements', requireAuth, guards.requireSuperAdmin('op'), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid tenant id' });
    const r = await resolver.resolveTenantEntitlements(id);
    res.json({ tenant_id: id, source: r.source, entitlements: r.entitlements });
  });
  const srv = app.listen(0); await new Promise(r => srv.once('listening', r));
  const port = srv.address().port;
  function req(method, path) {
    return new Promise((resolve) => {
      const rq = http.request({ host: '127.0.0.1', port, method, path }, (res) => { let b = ''; res.on('data', d => b += d); res.on('end', () => { let j; try { j = JSON.parse(b); } catch { j = {}; } resolve({ status: res.statusCode, json: j }); }); });
      rq.end();
    });
  }
  let s = await req('GET', '/api/super-admin/tenants/5/entitlements');
  ok('super admin sees resolved entitlements 200', s.status === 200 && s.json.entitlements && s.json.entitlements.max_users === 20);
  userRef.user = { id: 2, username: 'tadmin', role: 'Admin', is_active: 1 };
  let ta = await req('GET', '/api/super-admin/tenants/5/entitlements');
  ok('tenant admin cannot view entitlements 403', ta.status === 403 && ta.json.code === 'SUPER_ADMIN_REQUIRED');
  userRef.user = null;
  let an = await req('GET', '/api/super-admin/tenants/5/entitlements');
  ok('anonymous denied 401', an.status === 401);
  srv.close();

  console.log(`entitlements_test: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
