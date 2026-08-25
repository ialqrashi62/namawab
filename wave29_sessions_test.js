/**
 * wave29_sessions_test.js — Unit tests for Redis Sessions Hardening.
 */

'use strict';

const assert = require('assert');
const {
    wrapRedisStore,
    probeRedis,
    getMetrics,
    resetMetrics,
    toPrometheusMetrics,
} = require('./wave29_sessions');

// ---- Test 1: getMetrics / resetMetrics ----
{
    resetMetrics();
    const m1 = getMetrics();
    assert.deepStrictEqual(m1, {
        sets: 0, gets: 0, deletes: 0, touches: 0,
        fallback_uses: 0, redis_errors: 0,
        reap_runs: 0, reap_session_deletions: 0,
    });
    console.log('[PASS] getMetrics returns fresh zeros');
}
{
    resetMetrics();
    const m = getMetrics();
    m.sets++;
    assert.strictEqual(m.sets, 1);
    resetMetrics();
    assert.strictEqual(getMetrics().sets, 0);
    console.log('[PASS] resetMetrics clears all counters');
}

// ---- Test 2: wrapRedisStore delegates with metrics ----
{
    resetMetrics();
    const store = {
        client: null,
        getCalls: 0,
        setCalls: 0,
        delCalls: 0,
        touchCalls: 0,
        get(sid, cb) { this.getCalls++; cb(null, { foo: 'bar' }); },
        set(sid, val, cb) { this.setCalls++; cb(null); },
        destroy(sid, cb) { this.delCalls++; cb(null); },
        touch(sid, val, cb) { this.touchCalls++; cb(null); },
    };
    const wrapped = wrapRedisStore(store);
    wrapped.get('s1', () => {});
    wrapped.set('s1', { x: 1 }, () => {});
    wrapped.destroy('s1', () => {});
    wrapped.touch('s1', { x: 1 }, () => {});
    assert.strictEqual(store.getCalls, 1);
    assert.strictEqual(store.setCalls, 1);
    assert.strictEqual(store.delCalls, 1);
    assert.strictEqual(store.touchCalls, 1);
    assert.strictEqual(getMetrics().gets, 1);
    assert.strictEqual(getMetrics().sets, 1);
    assert.strictEqual(getMetrics().deletes, 1);
    assert.strictEqual(getMetrics().touches, 1);
    console.log('[PASS] wrapRedisStore delegates + counts');
}
{
    // Error path increments redis_errors
    resetMetrics();
    const store = {
        client: null,
        get(sid, cb) { cb(new Error('redis down')); },
        set(sid, val, cb) { cb(new Error('x')); },
        destroy(sid, cb) { cb(new Error('x')); },
        touch(sid, val, cb) { cb(new Error('x')); },
    };
    const wrapped = wrapRedisStore(store);
    wrapped.get('s1', () => {});
    wrapped.set('s1', { x: 1 }, () => {});
    wrapped.destroy('s1', () => {});
    wrapped.touch('s1', { x: 1 }, () => {});
    assert.strictEqual(getMetrics().redis_errors, 4);
    console.log('[PASS] Redis errors counted');
}

// ---- Test 3: probeRedis with no client ----
(async () => {
    const r = await probeRedis(null);
    assert.strictEqual(r.ok, false);
    assert.strictEqual(r.reason, 'no_client');
    console.log('[PASS] probeRedis(null) returns no_client');

    // ---- Test 4: probeRedis with fake client ----
    const fakeClient = {
        async ping() { return 'PONG'; },
    };
    const r2 = await probeRedis(fakeClient);
    assert.strictEqual(r2.ok, true);
    assert.strictEqual(typeof r2.latencyMs, 'number');
    console.log('[PASS] probeRedis(fakeClient) returns ok + latencyMs');

    // ---- Test 5: probeRedis with failing client ----
    const failClient = {
        async ping() { throw new Error('timeout'); },
    };
    const r3 = await probeRedis(failClient);
    assert.strictEqual(r3.ok, false);
    assert.strictEqual(r3.reason, 'error');
    console.log('[PASS] probeRedis(failing) returns error');

    // ---- Test 6: probeRedis with INFO ----
    const infoClient = {
        async ping() { return 'PONG'; },
        async info() {
            return 'redis_version:7.2.0\nuptime_in_seconds:3600\nconnected_clients:5\nused_memory_human:1.5M\n';
        },
    };
    const r4 = await probeRedis(infoClient);
    assert.strictEqual(r4.version, '7.2.0');
    assert.strictEqual(r4.uptimeSeconds, 3600);
    assert.strictEqual(r4.connectedClients, 5);
    assert.strictEqual(r4.usedMemoryHuman, '1.5M');
    console.log('[PASS] probeRedis parses INFO fields');

    // ---- Test 7: Prometheus output ----
    resetMetrics();
    toPrometheusMetrics();
    const out = toPrometheusMetrics();
    assert.ok(out.includes('nama_session_sets_total 0'));
    assert.ok(out.includes('# HELP nama_session_redis_errors_total'));
    assert.ok(out.includes('# TYPE nama_session_redis_errors_total counter'));
    console.log('[PASS] Prometheus output well-formed');

    // ---- Test 8: wrapRedisStore returns same instance ----
    const s = { get: () => {}, set: () => {}, destroy: () => {} };
    const w = wrapRedisStore(s);
    assert.strictEqual(w, s, 'wrap should return same reference');
    console.log('[PASS] wrapRedisStore returns same reference');

    console.log('\n=== ALL wave29_sessions tests PASS ===');
    process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
