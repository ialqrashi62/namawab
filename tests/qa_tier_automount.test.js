// QA: auto-mount loop for generated tier routers (290-310) — contract + runtime + resilience
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const express = require('express');

const ROOT = __dirname + '/..';
const RX = /^tier(?:17[1-9]|1[89]\d|2\d\d|3[01]\d)_\w+_\d+_router\.js$/;
const EXPECTED = 715;

function runLoop(dir) {
    const app = express();
    for (const f of fs.readdirSync(dir).sort()) {
        if (!RX.test(f)) continue;
        try { app.use('/' + f.replace(/_router\.js$/, ''), require(path.join(dir, f))); }
        catch (e) { console.error('mount ' + f + ' fail', e.message); }
    }
    return app;
}

// 1) Contract: exactly 715 files, unique mount paths (no prefix collision)
const files = fs.readdirSync(ROOT).filter(f => RX.test(f));
assert.strictEqual(files.length, EXPECTED, `expected ${EXPECTED} tier routers, got ${files.length}`);
const paths = files.map(f => '/' + f.replace(/_router\.js$/, ''));
assert.strictEqual(new Set(paths).size, EXPECTED, 'duplicate mount prefix detected');
console.log(`PASS contract: ${EXPECTED} files, 0 duplicate prefixes`);

// 2) Runtime: every expected path is registered on the app
const app = runLoop(ROOT);
function layersOf(a) { const r = a._router || a.router; return ((r && r.stack) || []).filter(l => l.name === 'router'); }
const layers = layersOf(app);
for (const p of paths) assert.ok(layers.some(l => { try { return l.regexp.test(p); } catch { return false; } }), `not mounted: ${p}`);
assert.strictEqual(layers.length, EXPECTED, `mounted layers = ${layers.length}, expected ${EXPECTED}`);
console.log(`PASS runtime: all ${EXPECTED} paths registered`);

// 3) Behavior snapshot: tier271 real (has routes), tier291+ stubs empty
for (const t of ['tier271_a1_1296', 'tier284_d4_1364']) {
    const r = require(path.join(ROOT, t + '_router.js'));
    assert.ok(r.stack && r.stack.length > 0, `${t} unexpectedly empty`);
}
const stub = require(path.join(ROOT, 'tier291_k1_1396_router.js'));
assert.deepStrictEqual(stub.stack && stub.stack.length, 0, 'stub no longer empty — update this snapshot');
console.log('PASS behavior snapshot: tier271/284 real, 291+ stubs');

// 4) Resilience: broken router must not break siblings or crash the loop
const tmp = fs.mkdtempSync(path.join(ROOT, 'qa_tmp_'));
try {
    fs.writeFileSync(path.join(tmp, 'tier300_x1_9999_router.js'), 'module.exports = { notARouter: true };');
    fs.writeFileSync(path.join(tmp, 'tier300_x2_10000_router.js'), 'throw new Error("boom");');
    fs.writeFileSync(path.join(tmp, 'tier300_x3_10001_router.js'), 'module.exports = require("express").Router();');
    fs.writeFileSync(path.join(tmp, 'unrelated.txt'), 'x');
    const app2 = runLoop(tmp);
    const ls = layersOf(app2);
    assert.strictEqual(ls.length, 1, `expected only the healthy router mounted, got ${ls.length}`);
    assert.ok(ls[0].regexp.test('/tier300_x3_10001'), 'healthy sibling not mounted correctly');
} finally {
    fs.rmSync(tmp, { recursive: true, force: true });
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log('PASS resilience: bad module skipped, sibling mounted');

console.log('\nALL QA PASS (4/4)');
