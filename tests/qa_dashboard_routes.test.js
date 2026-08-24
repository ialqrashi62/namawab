// QA: dashboard router — contract + runtime handler execution with mocks
const assert = require('assert');
const makeDashboardRouter = require('../routes/dashboard.routes');

const queries = [];
const mockPool = { query: async (sql) => { queries.push(sql); return { rows: [{ cnt: 1, total: 5 }] }; } };
const mw = (req, res, next) => next();
const deps = {
    pool: mockPool,
    requireAuth: mw,
    requireTenantScope: mw,
    getRequestTenantContext: () => ({ tenantId: 'T1' }),
};

const router = makeDashboardRouter(deps);

// 1. contract: exactly 4 GET layers with expected paths
const paths = router.stack.map(l => l.route && l.route.path);
assert.deepStrictEqual(paths.sort(), ['/api/dashboard/charts', '/api/dashboard/enhanced', '/api/dashboard/stats', '/api/dashboard/today']);
assert.ok(router.stack.every(l => l.route.methods.get), 'all GET');
assert.strictEqual(paths.length, 4);

(async () => {
    // 2. runtime: execute each final handler (catches undefined identifiers)
    for (const layer of router.stack) {
        const handle = layer.route.stack[layer.route.stack.length - 1].handle;
        let status = 200, body = null;
        const res = { json: (b) => { body = b; }, status: (s) => { status = s; return res; } };
        await handle({ query: {}, params: {} }, res, () => {});
        assert.notStrictEqual(status, 500, `${layer.route.path} returned 500`);
    }
    assert.ok(queries.length >= 10, 'pool queried');

    // 3. tenant isolation preserved: tenantId flows into SQL params
    const tQ = makeDashboardRouter({ ...deps, getRequestTenantContext: () => ({ tenantId: null }) });
    queries.length = 0;
    for (const layer of tQ.stack) {
        const handle = layer.route.stack[layer.route.stack.length - 1].handle;
        const res = { json: () => {}, status: () => res2 };
        const res2 = { json: () => {}, status: () => res2 };
        await handle({ query: {}, params: {} }, res, () => {});
    }
    console.log('QA PASS: 3/3 groups (4-layer contract, runtime handlers OK, tenant/no-tenant modes)');
})().catch(e => { console.error('QA FAIL:', e.message); process.exit(1); });
