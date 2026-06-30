/**
 * audit_middleware_test.js — pure unit tests for ./audit_middleware (no DB, no server).
 * Run: node audit_middleware_test.js   (exit 0 = all pass)
 */
'use strict';
const A = require('./audit_middleware');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// actionForMethod
ok('POST->CREATE', A.actionForMethod('POST') === 'CREATE');
ok('PUT->UPDATE', A.actionForMethod('PUT') === 'UPDATE');
ok('PATCH->UPDATE', A.actionForMethod('PATCH') === 'UPDATE');
ok('DELETE->DELETE', A.actionForMethod('DELETE') === 'DELETE');
ok('GET->ACCESS', A.actionForMethod('GET') === 'ACCESS');

// moduleForPath
ok('module patients', A.moduleForPath('/api/patients/123') === 'patients');
ok('module finance nested', A.moduleForPath('/api/finance/journal/5/post') === 'finance');
ok('module strips query', A.moduleForPath('/api/invoices?x=1') === 'invoices');
ok('module non-api', A.moduleForPath('/health') === 'health');

// deriveAuditEntry (pure)
(() => {
    const e = A.deriveAuditEntry('POST', '/api/patients?x=1');
    ok('derive action', e.action === 'CREATE');
    ok('derive module', e.module === 'patients');
    ok('derive detail strips query + no body', e.detail === 'POST /api/patients');
})();

// makeAuditMiddleware: requires logAudit
ok('throws without logAudit', (() => { try { A.makeAuditMiddleware({}); return false; } catch { return true; } })());

// middleware: disabled by default -> just calls next, never logs
(() => {
    let logged = 0, nexted = 0;
    const mw = A.makeAuditMiddleware({ logAudit: () => logged++, enabled: false });
    mw({ method: 'POST', originalUrl: '/api/patients', session: { user: { id: 1, display_name: 'A' } }, headers: {}, connection: {} },
       { on: () => { throw new Error('should not register finish when disabled'); } },
       () => nexted++);
    ok('disabled -> next called', nexted === 1);
    ok('disabled -> nothing logged', logged === 0);
})();

// middleware: enabled + mutating /api -> logs on finish with correct fields
(() => {
    const calls = [];
    const mw = A.makeAuditMiddleware({ logAudit: (...a) => calls.push(a), enabled: true });
    let finishCb = null;
    const req = { method: 'PUT', originalUrl: '/api/invoices/9', session: { user: { id: 7, display_name: 'Dr. Sara' } }, headers: { 'x-forwarded-for': '10.0.0.5' }, connection: {} };
    const res = { statusCode: 200, on: (ev, cb) => { if (ev === 'finish') finishCb = cb; } };
    let nexted = 0;
    mw(req, res, () => nexted++);
    ok('enabled mutating -> next called', nexted === 1);
    ok('enabled -> finish registered', typeof finishCb === 'function');
    finishCb(); // simulate response finish
    ok('logged exactly once', calls.length === 1);
    const [uid, uname, action, module, detail, ip] = calls[0];
    ok('log user id', uid === 7);
    ok('log user name', uname === 'Dr. Sara');
    ok('log action UPDATE', action === 'UPDATE');
    ok('log module invoices', module === 'invoices');
    ok('log detail has status, no body', detail === 'PUT /api/invoices/9 -> 200');
    ok('log ip from xff', ip === '10.0.0.5');
})();

// middleware: enabled but GET (non-mutating) -> no log
(() => {
    let logged = 0;
    const mw = A.makeAuditMiddleware({ logAudit: () => logged++, enabled: true });
    let nexted = 0;
    mw({ method: 'GET', originalUrl: '/api/patients', session: {}, headers: {}, connection: {} },
       { on: () => { throw new Error('should not register finish for GET'); } }, () => nexted++);
    ok('GET -> next, no audit', nexted === 1 && logged === 0);
})();

// middleware: enabled but non-/api mutation -> no log
(() => {
    let logged = 0, nexted = 0;
    const mw = A.makeAuditMiddleware({ logAudit: () => logged++, enabled: true });
    mw({ method: 'POST', originalUrl: '/upload', session: {}, headers: {}, connection: {} },
       { on: () => { throw new Error('should not register finish for non-/api'); } }, () => nexted++);
    ok('non-/api POST -> next, no audit', nexted === 1 && logged === 0);
})();

// audit failure must never break the request
(() => {
    const mw = A.makeAuditMiddleware({ logAudit: () => { throw new Error('boom'); }, enabled: true });
    let finishCb = null, threw = false;
    mw({ method: 'POST', originalUrl: '/api/x', session: {}, headers: {}, connection: {} },
       { statusCode: 500, on: (ev, cb) => { if (ev === 'finish') finishCb = cb; } }, () => {});
    try { finishCb(); } catch { threw = true; }
    ok('logAudit throw is swallowed', threw === false);
})();

// tenant binding: logAudit must run INSIDE runWithTenant(capturedTenantId) so audit_trail.tenant_id resolves
(() => {
    const order = [];
    const mw = A.makeAuditMiddleware({
        logAudit: () => order.push('log'),
        enabled: true,
        getTenantId: () => 42,
        runWithTenant: (tid, fn) => { order.push('enter:' + tid); fn(); order.push('exit'); }
    });
    let finishCb = null;
    mw({ method: 'POST', originalUrl: '/api/patients', session: { user: { id: 1, display_name: 'A', tenantId: 42 } }, headers: {}, connection: {} },
       { statusCode: 201, on: (ev, cb) => { if (ev === 'finish') finishCb = cb; } }, () => {});
    finishCb();
    ok('logAudit runs inside tenant binding', JSON.stringify(order) === JSON.stringify(['enter:42', 'log', 'exit']));
})();

// no tenant -> logs without binding (does not crash)
(() => {
    let logged = 0, bound = 0;
    const mw = A.makeAuditMiddleware({ logAudit: () => logged++, enabled: true, getTenantId: () => null, runWithTenant: () => bound++ });
    let finishCb = null;
    mw({ method: 'DELETE', originalUrl: '/api/x/1', session: {}, headers: {}, connection: {} },
       { statusCode: 200, on: (ev, cb) => { if (ev === 'finish') finishCb = cb; } }, () => {});
    finishCb();
    ok('no tenant -> logs without runWithTenant', logged === 1 && bound === 0);
})();

console.log(`audit_middleware_test: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
