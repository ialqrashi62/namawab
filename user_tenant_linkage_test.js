/**
 * user_tenant_linkage_test.js — Batch 4D tests.
 *   Part A: behavioral — createSystemUserWithTenantLink against a fake pg client + in-memory store,
 *           proving atomic create+link, count growth (via entitlements.countTenantUsers), rollback, etc.
 *   Part B: static — server.js route wires the helper, uses a transaction, reads tenantId from session
 *           (not body), keeps the 4C guard chain.
 * Run: node user_tenant_linkage_test.js   (exit 0 = all pass)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const UP = require('./user_provisioning');
const E = require('./entitlements');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// In-memory store shared by the fake client (writes) and fake pool (countTenantUsers reads).
function makeStore() { return { users: [], links: [], seq: 100, log: [], appTenant: null, committed: false, rolledback: false }; }
function fakeClient(store, opts = {}) {
  return {
    query(sql, params) {
      const s = sql.replace(/\s+/g, ' ').trim();
      if (/^BEGIN/.test(s)) { store.log.push('BEGIN'); return Promise.resolve({ rows: [] }); }
      if (/^COMMIT/.test(s)) { store.committed = true; store.log.push('COMMIT'); return Promise.resolve({ rows: [] }); }
      if (/^ROLLBACK/.test(s)) { store.rolledback = true; store.log.push('ROLLBACK'); return Promise.resolve({ rows: [] }); }
      if (/set_config\('app\.tenant_id'/.test(s)) { store.appTenant = params[0]; store.log.push('SET_TENANT:' + params[0]); return Promise.resolve({ rows: [] }); }
      if (/INSERT INTO system_users/.test(s)) {
        store.log.push('INS_USER');
        const id = ++store.seq;
        store.users.push({ id, username: params[0], display_name: params[2], role: params[3], speciality: params[4], permissions: params[5], commission_type: params[6], commission_value: params[7], is_active: 1, created_at: 'd' });
        return Promise.resolve({ rows: [{ id }] });
      }
      if (/INSERT INTO user_tenants/.test(s)) {
        store.log.push('INS_LINK');
        if (opts.failLink) throw new Error('RLS denied / link failure');
        const [uid, tid] = params;
        if (!store.links.some(l => l.user_id === uid && l.tenant_id === tid)) store.links.push({ user_id: uid, tenant_id: tid, is_active: true });
        return Promise.resolve({ rows: [] });
      }
      if (/SELECT .* FROM system_users WHERE id=\$1/.test(s)) {
        const u = store.users.find(x => x.id === params[0]);
        return Promise.resolve({ rows: u ? [u] : [] });
      }
      return Promise.resolve({ rows: [] });
    }
  };
}
function fakePool(store) {
  return {
    query(sql, params) {
      const s = sql.replace(/\s+/g, ' ');
      if (/COUNT\(\*\)::int AS c FROM user_tenants WHERE tenant_id=\$1 AND is_active=true/.test(s)) {
        const c = store.links.filter(l => l.tenant_id === params[0] && l.is_active).length;
        return Promise.resolve({ rows: [{ c }] });
      }
      return Promise.resolve({ rows: [] });
    }
  };
}
const baseUser = { username: 'newdoc', password_hash: '$2bxxx', display_name: 'New Doc', role: 'Doctor' };

(async () => {
  // 1) create + link atomically (tenant from caller/session)
  let store = makeStore();
  let row = await UP.createSystemUserWithTenantLink(fakeClient(store), { user: baseUser, tenantId: 7 });
  ok('returns created user row', row && row.username === 'newdoc');
  ok('system_users row created', store.users.length === 1);
  ok('user_tenants link created to tenant 7', store.links.length === 1 && store.links[0].tenant_id === 7 && store.links[0].user_id === row.id);
  ok('app.tenant_id bound to 7', store.appTenant === '7');
  ok('committed, not rolled back', store.committed === true && store.rolledback === false);
  ok('transaction order BEGIN<set<insUser<insLink<COMMIT',
    store.log.indexOf('BEGIN') === 0 &&
    store.log.indexOf('SET_TENANT:7') < store.log.indexOf('INS_USER') &&
    store.log.indexOf('INS_USER') < store.log.indexOf('INS_LINK') &&
    store.log.indexOf('INS_LINK') < store.log.indexOf('COMMIT'));

  // 2) countTenantUsers grows after creation (same store, real countTenantUsers)
  store = makeStore();
  const pool = fakePool(store);
  const before = await E.countTenantUsers(pool, 7);
  await UP.createSystemUserWithTenantLink(fakeClient(store), { user: baseUser, tenantId: 7 });
  const after = await E.countTenantUsers(pool, 7);
  ok('countTenantUsers grows by 1 after create', before === 0 && after === 1);

  // 3) no tenantId -> user created, NO link, NO set_config, no throw (edge: non-tenant context)
  store = makeStore();
  row = await UP.createSystemUserWithTenantLink(fakeClient(store), { user: baseUser, tenantId: null });
  ok('no tenant: user created', store.users.length === 1);
  ok('no tenant: no link', store.links.length === 0);
  ok('no tenant: app.tenant_id not bound', store.appTenant === null);
  ok('no tenant: committed', store.committed === true);

  // 4) link failure -> ROLLBACK, no commit, throws (no orphan persisted in a real DB)
  store = makeStore();
  let threw = false;
  try { await UP.createSystemUserWithTenantLink(fakeClient(store, { failLink: true }), { user: baseUser, tenantId: 7 }); }
  catch (e) { threw = true; }
  ok('link failure throws', threw);
  ok('link failure rolled back (not committed)', store.rolledback === true && store.committed === false);

  // 5) duplicate link -> ON CONFLICT DO NOTHING (no dup, no throw) — simulate same pair pre-seeded
  store = makeStore();
  store.links.push({ user_id: 101, tenant_id: 7, is_active: true }); // seq starts at 100 -> next id 101
  row = await UP.createSystemUserWithTenantLink(fakeClient(store), { user: baseUser, tenantId: 7 });
  ok('duplicate link: no throw + no duplicate row', store.links.filter(l => l.user_id === 101 && l.tenant_id === 7).length === 1 && store.committed === true);

  // 6) global user (no link) is NOT counted in a tenant
  store = makeStore();
  store.links.push({ user_id: 500, tenant_id: 9, is_active: true }); // member of tenant 9 only
  ok('global/non-member not counted for tenant 7', (await E.countTenantUsers(fakePool(store), 7)) === 0);

  // ---------- Part B: static wiring checks on server.js ----------
  const src = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  const start = src.indexOf("app.post('/api/settings/users'");
  const body = src.slice(start, src.indexOf("app.put('/api/settings/users/:id'"));
  ok('route uses createSystemUserWithTenantLink', /createSystemUserWithTenantLink\(/.test(body));
  ok('route uses a dedicated transaction client', /pool\.connect\(\)/.test(body) && /client\.release\(\)/.test(body));
  ok('tenantId from session, not body', /req\.session\.user && req\.session\.user\.tenantId/.test(body) && !/req\.body\.tenant_id/.test(body));
  ok('4C guard chain preserved', /requireTenantAdmin\([^)]*\), userLimitGuard,/.test(body));
  ok('helper module binds app.tenant_id + ON CONFLICT', /set_config\('app\.tenant_id'/.test(fs.readFileSync(path.join(__dirname, 'user_provisioning.js'), 'utf8')) && /ON CONFLICT \(user_id, tenant_id\) DO NOTHING/.test(fs.readFileSync(path.join(__dirname, 'user_provisioning.js'), 'utf8')));

  console.log(`user_tenant_linkage_test: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
