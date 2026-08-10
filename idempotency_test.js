/**
 * idempotency_test.js — pure unit tests for ./idempotency (no real DB, no server).
 * Run: node idempotency_test.js   (exit 0 = all pass)
 */
'use strict';
const I = require('./idempotency');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// ---- deriveKey ----
ok('deriveKey reads Idempotency-Key', I.deriveKey({ headers: { 'idempotency-key': 'abcd1234efgh' } }) === 'abcd1234efgh');
ok('deriveKey reads x- variant', I.deriveKey({ headers: { 'x-idempotency-key': 'abcd1234efgh' } }) === 'abcd1234efgh');
ok('deriveKey trims', I.deriveKey({ headers: { 'idempotency-key': '  abcd1234efgh  ' } }) === 'abcd1234efgh');
ok('deriveKey null when missing', I.deriveKey({ headers: {} }) === null);
ok('deriveKey rejects too short', I.deriveKey({ headers: { 'idempotency-key': 'short' } }) === null);
ok('deriveKey rejects too long', I.deriveKey({ headers: { 'idempotency-key': 'a'.repeat(201) } }) === null);
ok('deriveKey rejects bad charset', I.deriveKey({ headers: { 'idempotency-key': 'has spaces!!' } }) === null);
ok('deriveKey null on no headers', I.deriveKey({}) === null);

// ---- decideAction ----
ok('decide proceed when none', I.decideAction(null).action === 'proceed');
ok('decide conflict when in_progress', I.decideAction({ status: 'in_progress' }).action === 'conflict');
(() => {
    const d = I.decideAction({ status: 'completed', response_status: 201, response_body: { id: 9 } });
    ok('decide replay when completed', d.action === 'replay');
    ok('decide replay carries status', d.statusCode === 201);
    ok('decide replay carries body', d.body && d.body.id === 9);
})();
ok('decide replay defaults status 200', I.decideAction({ status: 'completed', response_body: {} }).statusCode === 200);

// ---- routeKey ----
ok('routeKey from route.path', I.routeKey({ route: { path: '/api/invoices' } }) === '/api/invoices');
ok('routeKey falls back to path', I.routeKey({ path: '/api/x' }) === '/api/x');

// ---- middleware: construction guard ----
ok('throws without pool', (() => { try { I.makeIdempotencyGuard({}); return false; } catch { return true; } })());

// fake res
function makeRes() {
    return {
        statusCode: 200, headers: {}, body: undefined, jsonCalls: 0,
        set(k, v) { this.headers[k] = v; return this; },
        status(c) { this.statusCode = c; return this; },
        json(b) { this.jsonCalls++; this.body = b; return this; }
    };
}
// fake pool with scripted query results + recorded calls
function makePool(script) {
    const calls = [];
    return {
        calls,
        query(sql, params) {
            calls.push({ sql: sql.replace(/\s+/g, ' ').trim(), params });
            const fn = script.shift();
            return Promise.resolve(fn ? fn(sql, params) : { rows: [] });
        }
    };
}
const run = (mw, req, res) => new Promise((resolve) => { mw(req, res, () => resolve('next')).then ? mw(req, res, () => resolve('next')) : resolve('sync'); });
// helper that awaits the middleware and returns whether next() was called
async function invoke(mw, req, res) {
    let nexted = false;
    await mw(req, res, () => { nexted = true; });
    return nexted;
}

(async () => {
    // disabled => passes through
    {
        const pool = makePool([]);
        const mw = I.makeIdempotencyGuard({ pool, enabled: false });
        const res = makeRes();
        const nexted = await invoke(mw, { headers: { 'idempotency-key': 'abcd1234efgh' } }, res);
        ok('disabled => next, no query', nexted === true && pool.calls.length === 0);
    }

    // no key => passes through, no query
    {
        const pool = makePool([]);
        const mw = I.makeIdempotencyGuard({ pool });
        const res = makeRes();
        const nexted = await invoke(mw, { headers: {} }, res);
        ok('no key => next, no query', nexted === true && pool.calls.length === 0);
    }

    // first request: SELECT none -> INSERT claim -> next; then res.json persists UPDATE
    {
        const pool = makePool([
            () => ({ rows: [] }),          // SELECT existing => none
            () => ({ rows: [] }),          // INSERT claim => ok
            () => ({ rows: [] })           // UPDATE persist (after res.json)
        ]);
        const mw = I.makeIdempotencyGuard({ pool, getTenantId: () => 7 });
        const res = makeRes();
        const req = { headers: { 'idempotency-key': 'key-first-0001' }, route: { path: '/api/invoices' } };
        const nexted = await invoke(mw, req, res);
        ok('first => next called', nexted === true);
        ok('first => SELECT then INSERT claim', pool.calls.length === 2 && /INSERT INTO idempotency_keys/.test(pool.calls[1].sql));
        // handler responds
        res.status(201).json({ id: 42 });
        await new Promise(r => setTimeout(r, 0)); // allow async persist
        ok('first => persists completed UPDATE', pool.calls.length === 3 && /UPDATE idempotency_keys SET status='completed'/.test(pool.calls[2].sql));
        ok('first => UPDATE stores status 201', pool.calls[2].params[0] === 201);
        ok('first => body still sent', res.body && res.body.id === 42 && res.jsonCalls === 1);
    }

    // replay: SELECT returns completed => returns stored response, no INSERT, no next
    {
        const pool = makePool([
            () => ({ rows: [{ status: 'completed', response_status: 201, response_body: { id: 42 } }] })
        ]);
        const mw = I.makeIdempotencyGuard({ pool });
        const res = makeRes();
        const req = { headers: { 'idempotency-key': 'key-replay-001' }, route: { path: '/api/invoices' } };
        const nexted = await invoke(mw, req, res);
        ok('replay => next NOT called', nexted === false);
        ok('replay => returns stored status', res.statusCode === 201);
        ok('replay => returns stored body', res.body && res.body.id === 42);
        ok('replay => sets Idempotent-Replay header', res.headers['Idempotent-Replay'] === 'true');
        ok('replay => only the SELECT ran', pool.calls.length === 1);
    }

    // conflict: SELECT returns in_progress => 409, no next
    {
        const pool = makePool([
            () => ({ rows: [{ status: 'in_progress' }] })
        ]);
        const mw = I.makeIdempotencyGuard({ pool });
        const res = makeRes();
        const nexted = await invoke(mw, { headers: { 'idempotency-key': 'key-inflight-1' }, route: { path: '/api/invoices' } }, res);
        ok('conflict => next NOT called', nexted === false);
        ok('conflict => 409', res.statusCode === 409);
        ok('conflict => code', res.body && res.body.code === 'IDEMPOTENCY_CONFLICT');
    }

    // INSERT race => unique violation => 409
    {
        const pool = makePool([
            () => ({ rows: [] }),                                  // SELECT none
            () => { throw Object.assign(new Error('dup'), { code: '23505' }); }  // INSERT race
        ]);
        const mw = I.makeIdempotencyGuard({ pool });
        const res = makeRes();
        const nexted = await invoke(mw, { headers: { 'idempotency-key': 'key-race-0001' }, route: { path: '/api/invoices' } }, res);
        ok('race => next NOT called', nexted === false);
        ok('race => 409', res.statusCode === 409);
    }

    // store error on SELECT => fail-open (next called)
    {
        const pool = makePool([
            () => { throw new Error('connection refused'); }
        ]);
        const mw = I.makeIdempotencyGuard({ pool, logger: { warn() {} } });
        const res = makeRes();
        const nexted = await invoke(mw, { headers: { 'idempotency-key': 'key-failopen-1' }, route: { path: '/api/invoices' } }, res);
        ok('store error => fail-open next', nexted === true);
    }

    // 5xx response => DELETE claim (so client can retry)
    {
        const pool = makePool([
            () => ({ rows: [] }),  // SELECT
            () => ({ rows: [] }),  // INSERT
            () => ({ rows: [] })   // DELETE
        ]);
        const mw = I.makeIdempotencyGuard({ pool });
        const res = makeRes();
        const req = { headers: { 'idempotency-key': 'key-5xx-00001' }, route: { path: '/api/invoices' } };
        await invoke(mw, req, res);
        res.status(500).json({ error: 'boom' });
        await new Promise(r => setTimeout(r, 0));
        ok('5xx => DELETE claim for retry', pool.calls.length === 3 && /DELETE FROM idempotency_keys/.test(pool.calls[2].sql));
    }

    console.log(`idempotency_test: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
})();
