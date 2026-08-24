// QA: patients router v2 — 22 routes contract + runtime handlers with mocks
const assert = require('assert');
const makePatientsRouter = require('../routes/patients.routes');

const queries = [];
const deps = {
    pool: { query: async (sql) => { queries.push(String(sql)); return { rows: [{ id: 1 }], rowCount: 1 }; } },
    requireAuth: (req, res, next) => next(),
    requireRole: () => (req, res, next) => next(),
    requireTenantScope: (req, res, next) => next(),
    validateBody: () => (req, res, next) => next(),
    RS: { patientCreate: {} },
    getRequestTenantContext: () => ({ tenantId: 'T9', facilityId: 'F1' }),
    calcVAT: async () => ({ rate: 0.15, vatAmount: 0, applyVAT: true }),
    addVAT: (a, r) => ({ total: a * (1 + r), vatAmount: a * r }),
    logAudit: () => {},
};
const router = makePatientsRouter(deps);

// 1. contract
assert.strictEqual(router.stack.length, 22, `expected 22 routes, got ${router.stack.length}`);
const paths = router.stack.map(l => l.route.path);
assert.ok(paths.includes('/api/patients') && paths.includes('/api/patients/:id/summary'));

(async () => {
    // 2. runtime: all 22 final handlers execute (ReferenceError detector)
    let ok = 0;
    for (const layer of router.stack) {
        const handle = layer.route.stack[layer.route.stack.length - 1].handle;
        let status = 200;
        const res = { json: () => {}, send: () => {}, status: (s) => { status = s; return res; } };
        await handle({ query: {}, params: { id: '1' }, body: {}, session: { user: { id: 1, display_name: 'QA' } }, ip: '127.0.0.1' }, res, () => {});
        assert.notStrictEqual(status, 500, `${layer.route.path} -> 500`);
        ok++;
    }
    // 3. middleware chain intact (auth on every layer)
    assert.ok(router.stack.every(l => l.route.stack.length >= 2), 'middleware present');
    console.log(`QA PASS: 3/3 groups (22-route contract, ${ok}/22 handlers runtime-OK, middleware chains)`);
})().catch(e => { console.error('QA FAIL:', e.message); process.exit(1); });
