/**
 * max_users_enforcement_test.js — Batch 4C candidate tests (HTTP, no real DB).
 * Mounts userLimitGuard in front of a fake create-user handler and drives the flag matrix:
 * disabled=no-op, observe=never blocks, enforce=blocks at limit, unlimited, fail-open, RBAC ordering.
 * Run: node max_users_enforcement_test.js   (exit 0 = all pass)
 */
'use strict';
const http = require('http');
const express = require('express');
const E = require('./entitlements');
const { makeGuards } = require('./rbac_guards');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// fake pool: resolver reads tenant_plan_assignments (one open plan 'pro') + plan_entitlements (max_users=N or null).
function poolWithMax(maxUsers) {
  return {
    query(sql) {
      const s = sql.replace(/\s+/g, ' ');
      if (/FROM tenant_plan_assignments/.test(s)) return Promise.resolve({ rows: [{ plan_key: 'pro', assignment_source: 'manual', effective_to: null, assigned_at: '2026-05-01' }] });
      if (/FROM plan_entitlements pe JOIN plans/.test(s)) return Promise.resolve({ rows: [{ max_users: maxUsers }] });
      return Promise.resolve({ rows: [] });
    }
  };
}
function poolThatThrows() { return { query() { return Promise.reject(new Error('relation does not exist')); } }; }

// Build an app: guard (with env+counts) -> fake create handler. Optionally include requireTenantAdmin for RBAC test.
function buildApp(opts) {
  const audit = [];
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.session = { user: opts.user }; next(); });
  const guard = E.makeUserLimitGuard({
    pool: opts.pool, logAudit: (...a) => audit.push(a),
    getActor: (req) => req.session.user, env: opts.env,
    countUsers: opts.countUsers
  });
  const chain = [];
  if (opts.withRbac) {
    const guards = makeGuards({ logAudit: (...a) => audit.push(a) });
    chain.push(guards.requireTenantAdmin({ action: 'BLOCKED_USER_CREATE', module: 'Settings' }));
  }
  chain.push(guard);
  app.post('/create', ...chain, (req, res) => res.json({ created: true }));
  const srv = app.listen(0);
  return { app, srv, audit };
}
function post(port) {
  return new Promise((resolve) => {
    const r = http.request({ host: '127.0.0.1', port, method: 'POST', path: '/create', headers: { 'Content-Type': 'application/json', 'Content-Length': 2 } }, (res) => {
      let b = ''; res.on('data', d => b += d); res.on('end', () => { let j; try { j = JSON.parse(b); } catch { j = {}; } resolve({ status: res.statusCode, json: j }); });
    });
    r.write('{}'); r.end();
  });
}
async function run(opts) {
  const ctx = buildApp(opts);
  await new Promise(r => ctx.srv.once('listening', r));
  const res = await post(ctx.srv.address().port);
  ctx.srv.close();
  return { res, audit: ctx.audit };
}

const ADMIN = { id: 1, username: 'boss', role: 'Admin', display_name: 'Boss', is_active: 1, tenantId: 7 };

(async () => {
  // 1) disabled -> no-op (creation proceeds), regardless of usage/limit
  let r = await run({ env: {}, user: ADMIN, pool: poolWithMax(1), countUsers: () => 99 });
  ok('disabled: creation proceeds (no-op)', r.res.status === 200 && r.res.json.created === true);
  ok('disabled: no entitlement audit', !r.audit.some(a => /USER_CREATE_LIMIT/.test(a[2])));

  // 2) observe + over limit -> NOT blocked + observed audit
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'observe' }, user: ADMIN, pool: poolWithMax(2), countUsers: () => 5 });
  ok('observe over-limit: not blocked', r.res.status === 200 && r.res.json.created === true);
  ok('observe over-limit: USER_CREATE_LIMIT_OBSERVED audit', r.audit.some(a => a[2] === 'USER_CREATE_LIMIT_OBSERVED'));

  // 3) enforce + under limit -> allowed
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: ADMIN, pool: poolWithMax(5), countUsers: () => 4 });
  ok('enforce under-limit: allowed', r.res.status === 200 && r.res.json.created === true);

  // 4) enforce + at/over limit -> blocked 409
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: ADMIN, pool: poolWithMax(5), countUsers: () => 5 });
  ok('enforce at-limit: blocked 409', r.res.status === 409 && r.res.json.code === 'USER_LIMIT_REACHED');
  ok('enforce at-limit: bilingual message', !!r.res.json.error && !!r.res.json.error_ar);
  ok('enforce at-limit: USER_CREATE_LIMIT_BLOCKED audit', r.audit.some(a => a[2] === 'USER_CREATE_LIMIT_BLOCKED'));
  ok('enforce at-limit: no internal details leaked', !/user_tenants|SELECT|plan_entitlements/i.test(JSON.stringify(r.res.json)));

  // 5) unlimited (max_users null) -> allowed even with high usage in enforce
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: ADMIN, pool: poolWithMax(null), countUsers: () => 9999 });
  ok('unlimited: allowed regardless of usage', r.res.status === 200 && r.res.json.created === true);

  // 6) tenant without plan / e25 absent -> fail-open defaults (unlimited) -> allowed
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: ADMIN, pool: poolThatThrows(), countUsers: () => 50 });
  ok('e25 absent: fail-open allowed (not blocked)', r.res.status === 200 && r.res.json.created === true);

  // 7) count error -> fail-open allowed + FAILOPEN audit
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: ADMIN, pool: poolWithMax(1), countUsers: () => { throw new Error('count boom'); } });
  ok('count error: fail-open allowed', r.res.status === 200 && r.res.json.created === true);
  ok('count error: USER_CREATE_LIMIT_FAILOPEN audit', r.audit.some(a => a[2] === 'USER_CREATE_LIMIT_FAILOPEN'));

  // 8) no tenant context -> allowed (fail-open)
  r = await run({ env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: { id: 9, role: 'Admin', display_name: 'NoTenant', is_active: 1 }, pool: poolWithMax(1), countUsers: () => 5 });
  ok('no tenant context: allowed (fail-open)', r.res.status === 200);

  // 9) RBAC ordering: non-admin blocked BEFORE limit logic (403, never reaches guard)
  r = await run({ withRbac: true, env: { ENTITLEMENTS_ENABLED: 'true', ENTITLEMENTS_ENFORCEMENT_MODE: 'enforce' }, user: { id: 3, role: 'Doctor', display_name: 'Doc', is_active: 1, tenantId: 7 }, pool: poolWithMax(1), countUsers: () => 5 });
  ok('RBAC: non-admin blocked 403 before limit guard', r.res.status === 403);
  ok('RBAC: no limit audit when RBAC blocks first', !r.audit.some(a => /USER_CREATE_LIMIT/.test(a[2])));

  console.log(`max_users_enforcement_test: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
