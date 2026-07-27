// pcc_pediatric_neuro_ext12 unit test v3.122.0
const { PediatricCerebralPalsy, PediatricSpasticity, PediatricDyskinesia, PediatricAtaxia, PediatricHypotonia, PediatricHypertonia, PediatricDystonia, PediatricChorea, PediatricTremor, PediatricMyoclonus } = require('./pcc_pediatric_neuro_ext12_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricCerebralPalsy()); passed++;
assert.ok(PediatricCerebralPalsy({a:1})); passed++;
assert.ok(PediatricSpasticity()); passed++;
assert.ok(PediatricSpasticity({a:1})); passed++;
assert.ok(PediatricDyskinesia()); passed++;
assert.ok(PediatricDyskinesia({a:1})); passed++;
assert.ok(PediatricAtaxia()); passed++;
assert.ok(PediatricAtaxia({a:1})); passed++;
assert.ok(PediatricHypotonia()); passed++;
assert.ok(PediatricHypotonia({a:1})); passed++;
assert.ok(PediatricHypertonia()); passed++;
assert.ok(PediatricHypertonia({a:1})); passed++;
assert.ok(PediatricDystonia()); passed++;
assert.ok(PediatricDystonia({a:1})); passed++;
assert.ok(PediatricChorea()); passed++;
assert.ok(PediatricChorea({a:1})); passed++;
assert.ok(PediatricTremor()); passed++;
assert.ok(PediatricTremor({a:1})); passed++;
assert.ok(PediatricMyoclonus()); passed++;
assert.ok(PediatricMyoclonus({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext12 unit:', passed, 'passed');
