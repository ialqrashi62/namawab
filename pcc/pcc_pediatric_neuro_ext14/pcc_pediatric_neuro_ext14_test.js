// pcc_pediatric_neuro_ext14 unit test v3.124.0
const { PediatricSpinalCordDisorder, PediatricSpinalCordTumorExt, PediatricSpinalCordInjury, PediatricMyelitis, PediatricTransverseMyelitis, PediatricSpinalMuscularAtrophy, PediatricPolyradiculopathy, PediatricCaudaEquina, PediatricSyringomyeliaExt, PediatricTetheredCordExt } = require('./pcc_pediatric_neuro_ext14_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricSpinalCordDisorder()); passed++;
assert.ok(PediatricSpinalCordDisorder({a:1})); passed++;
assert.ok(PediatricSpinalCordTumorExt()); passed++;
assert.ok(PediatricSpinalCordTumorExt({a:1})); passed++;
assert.ok(PediatricSpinalCordInjury()); passed++;
assert.ok(PediatricSpinalCordInjury({a:1})); passed++;
assert.ok(PediatricMyelitis()); passed++;
assert.ok(PediatricMyelitis({a:1})); passed++;
assert.ok(PediatricTransverseMyelitis()); passed++;
assert.ok(PediatricTransverseMyelitis({a:1})); passed++;
assert.ok(PediatricSpinalMuscularAtrophy()); passed++;
assert.ok(PediatricSpinalMuscularAtrophy({a:1})); passed++;
assert.ok(PediatricPolyradiculopathy()); passed++;
assert.ok(PediatricPolyradiculopathy({a:1})); passed++;
assert.ok(PediatricCaudaEquina()); passed++;
assert.ok(PediatricCaudaEquina({a:1})); passed++;
assert.ok(PediatricSyringomyeliaExt()); passed++;
assert.ok(PediatricSyringomyeliaExt({a:1})); passed++;
assert.ok(PediatricTetheredCordExt()); passed++;
assert.ok(PediatricTetheredCordExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext14 unit:', passed, 'passed');
