/**
 * rbac_guards_test.js — Batch 2 Auth/RBAC guard tests (no DB, no network).
 * Drives the middleware directly with mock req/res/next and asserts status + audit.
 * Run: node rbac_guards_test.js   (exit 0 = all pass)
 */
'use strict';
const G = require('./rbac_guards');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// mock res capturing status()/json()
function mockRes() {
    return {
        _status: null, _json: null,
        status(c) { this._status = c; return this; },
        json(o) { this._json = o; return this; }
    };
}
function mockReq(user, extra) {
    return Object.assign({ session: user ? { user } : {}, method: 'POST', originalUrl: '/x', ip: '1.2.3.4', headers: {}, connection: {} }, extra || {});
}
// run a middleware once: returns { nexted, res, audit }
function run(mw, req) {
    const audit = [];
    // rebuild guards with an audit sink bound per-call
    const res = mockRes();
    let nexted = false;
    mw(req, res, () => { nexted = true; });
    return { nexted, res, audit };
}

// ---------- pure: isTenantAdmin ----------
ok('isTenantAdmin true for Admin', G.isTenantAdmin({ role: 'Admin' }) === true);
ok('isTenantAdmin false for Doctor', G.isTenantAdmin({ role: 'Doctor' }) === false);
ok('isTenantAdmin false for null', G.isTenantAdmin(null) === false);
ok('isTenantAdmin false for missing role', G.isTenantAdmin({ id: 1 }) === false);

// build guards with a shared audit array
const audit = [];
const guards = G.makeGuards({ logAudit: (...a) => audit.push(a) });

// ---------- requireAuthenticated ----------
(() => {
    const r1 = run(guards.requireAuthenticated, mockReq(null));
    ok('requireAuthenticated denies anonymous 401', !r1.nexted && r1.res._status === 401);
    const r2 = run(guards.requireAuthenticated, mockReq({ id: 1, role: 'Doctor' }));
    ok('requireAuthenticated allows any session', r2.nexted === true);
})();

// ---------- requireTenantAdmin ----------
(() => {
    audit.length = 0;
    const gAdmin = guards.requireTenantAdmin({ action: 'BLOCKED_USER_CREATE', module: 'Settings' });
    const r1 = run(gAdmin, mockReq(null));
    ok('tenantAdmin denies anonymous 401', !r1.nexted && r1.res._status === 401);
    ok('tenantAdmin audits anon as BLOCKED_AUTHENTICATION', audit.some(a => a[2] === 'BLOCKED_AUTHENTICATION'));

    audit.length = 0;
    const r2 = run(gAdmin, mockReq({ id: 7, role: 'Doctor', display_name: 'Doc' }));
    ok('tenantAdmin denies normal user 403', !r2.nexted && r2.res._status === 403);
    ok('tenantAdmin audits deny with custom action', audit.some(a => a[2] === 'BLOCKED_USER_CREATE' && a[3] === 'Settings'));

    audit.length = 0;
    const r3 = run(gAdmin, mockReq({ id: 1, role: 'Admin', display_name: 'Boss' }));
    ok('tenantAdmin allows Admin', r3.nexted === true);
    ok('tenantAdmin no audit on allow', audit.length === 0);

    // a tenant 'settings'-holder that is NOT Admin (e.g. IT) is still blocked -> no escalation to user-create
    const r4 = run(gAdmin, mockReq({ id: 9, role: 'IT', display_name: 'ITGuy' }));
    ok('tenantAdmin blocks non-Admin settings-holder (IT)', !r4.nexted && r4.res._status === 403);
})();

// ---------- requireSuperAdmin ----------
(() => {
    audit.length = 0;
    const gSuper = guards.requireSuperAdmin('op, boss');
    // super admin allowed: listed username + active (active implied: not 0/false)
    const r1 = run(gSuper, mockReq({ id: 1, username: 'op', display_name: 'Op', is_active: 1 }));
    ok('superAdmin allows listed user', r1.nexted === true);

    // tenant Admin NOT in allowlist -> denied (no escalation from role)
    audit.length = 0;
    const r2 = run(gSuper, mockReq({ id: 2, username: 'tadmin', role: 'Admin', is_active: 1 }));
    ok('superAdmin denies tenant Admin not in allowlist 403', !r2.nexted && r2.res._status === 403 && r2.res._json.code === 'SUPER_ADMIN_REQUIRED');
    ok('superAdmin audits SUPER_ADMIN_DENY', audit.some(a => a[2] === 'SUPER_ADMIN_DENY'));

    // anonymous denied
    const r3 = run(gSuper, mockReq(null));
    ok('superAdmin denies anonymous 403', !r3.nexted && r3.res._status === 403);

    // session WITHOUT username (the Batch-1 latent bug) -> denied (fail-closed)
    const r4 = run(gSuper, mockReq({ id: 3, role: 'Admin', is_active: 1 }));
    ok('superAdmin denies session missing username', !r4.nexted && r4.res._status === 403);

    // inactive listed user denied
    const r5 = run(gSuper, mockReq({ id: 4, username: 'op', is_active: 0 }));
    ok('superAdmin denies inactive listed user', !r5.nexted && r5.res._status === 403);
})();

// ---------- malformed / empty allowlist must NOT open access ----------
(() => {
    const variants = ['', '   ', ',', ' , , ', undefined, null];
    let allDeny = true;
    for (const v of variants) {
        const g = guards.requireSuperAdmin(v);
        const r = run(g, mockReq({ id: 1, username: 'op', is_active: 1 }));
        if (r.nexted) allDeny = false;
    }
    ok('malformed/empty SUPER_ADMIN_USERS denies everyone', allDeny === true);

    // wildcard-looking value is treated as a literal username, not a match-all
    const gStar = guards.requireSuperAdmin('*');
    const rStar = run(gStar, mockReq({ id: 1, username: 'anybody', is_active: 1 }));
    ok('no wildcard match: "*" does not open access', !rStar.nexted && rStar.res._status === 403);
    const rStarLit = run(gStar, mockReq({ id: 1, username: '*', is_active: 1 }));
    ok('"*" only matches literal "*" username (no broad open)', rStarLit.nexted === true);
})();

// ---------- audit never throws even if logAudit throws ----------
(() => {
    const g = G.makeGuards({ logAudit: () => { throw new Error('audit down'); } });
    let threw = false;
    try {
        const mw = g.requireTenantAdmin({});
        run(mw, mockReq({ id: 1, role: 'Doctor' }));
    } catch (e) { threw = true; }
    ok('guard survives a throwing logAudit (audit isolated)', threw === false);
})();

console.log(`rbac_guards_test: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
