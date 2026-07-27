// pcc_pediatric_neuro_ext13 unit test v3.123.0
const { PediatricBrainMalformation, PediatricHoloprosencephaly, PediatricLissencephaly, PediatricPolymicrogyria, PediatricSchizencephaly, PediatricPorencephaly, PediatricHydrocephalusExt2, PediatricDandyWalker, PediatricArnoldChiari, PediatricSyringomyelia } = require('./pcc_pediatric_neuro_ext13_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricBrainMalformation()); passed++;
assert.ok(PediatricBrainMalformation({a:1})); passed++;
assert.ok(PediatricHoloprosencephaly()); passed++;
assert.ok(PediatricHoloprosencephaly({a:1})); passed++;
assert.ok(PediatricLissencephaly()); passed++;
assert.ok(PediatricLissencephaly({a:1})); passed++;
assert.ok(PediatricPolymicrogyria()); passed++;
assert.ok(PediatricPolymicrogyria({a:1})); passed++;
assert.ok(PediatricSchizencephaly()); passed++;
assert.ok(PediatricSchizencephaly({a:1})); passed++;
assert.ok(PediatricPorencephaly()); passed++;
assert.ok(PediatricPorencephaly({a:1})); passed++;
assert.ok(PediatricHydrocephalusExt2()); passed++;
assert.ok(PediatricHydrocephalusExt2({a:1})); passed++;
assert.ok(PediatricDandyWalker()); passed++;
assert.ok(PediatricDandyWalker({a:1})); passed++;
assert.ok(PediatricArnoldChiari()); passed++;
assert.ok(PediatricArnoldChiari({a:1})); passed++;
assert.ok(PediatricSyringomyelia()); passed++;
assert.ok(PediatricSyringomyelia({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext13 unit:', passed, 'passed');
