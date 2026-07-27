// pcc_neuro_ext30 unit test v3.129.0
const { HeadacheDisorderExt2, MigraineWithoutAura, MigraineWithAura, ChronicMigraine, TensionTypeHeadache, ClusterHeadacheExt2, HemicraniaContinua, SUNCTHeadache, HypnicHeadache, ThunderclapHeadache } = require('./pcc_neuro_ext30_engine');
const assert = require('assert');

let passed = 0;
assert.ok(HeadacheDisorderExt2()); passed++;
assert.ok(HeadacheDisorderExt2({a:1})); passed++;
assert.ok(MigraineWithoutAura()); passed++;
assert.ok(MigraineWithoutAura({a:1})); passed++;
assert.ok(MigraineWithAura()); passed++;
assert.ok(MigraineWithAura({a:1})); passed++;
assert.ok(ChronicMigraine()); passed++;
assert.ok(ChronicMigraine({a:1})); passed++;
assert.ok(TensionTypeHeadache()); passed++;
assert.ok(TensionTypeHeadache({a:1})); passed++;
assert.ok(ClusterHeadacheExt2()); passed++;
assert.ok(ClusterHeadacheExt2({a:1})); passed++;
assert.ok(HemicraniaContinua()); passed++;
assert.ok(HemicraniaContinua({a:1})); passed++;
assert.ok(SUNCTHeadache()); passed++;
assert.ok(SUNCTHeadache({a:1})); passed++;
assert.ok(HypnicHeadache()); passed++;
assert.ok(HypnicHeadache({a:1})); passed++;
assert.ok(ThunderclapHeadache()); passed++;
assert.ok(ThunderclapHeadache({a:1})); passed++;

console.log('pcc_neuro_ext30 unit:', passed, 'passed');
