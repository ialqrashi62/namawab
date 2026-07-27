// pcc_neuro_ext32 unit test v3.131.0
const { NeuroInflammatoryExt, Neurosarcoidosis, NeuroLupus, NeuroBehcet, NeuroSarcoidosis, NeuroWhipple, NeuroLymeDisease, Neurosyphilis, NeuroHIV, NeuroBrucellosis } = require('./pcc_neuro_ext32_engine');
const assert = require('assert');

let passed = 0;
assert.ok(NeuroInflammatoryExt()); passed++;
assert.ok(NeuroInflammatoryExt({a:1})); passed++;
assert.ok(Neurosarcoidosis()); passed++;
assert.ok(Neurosarcoidosis({a:1})); passed++;
assert.ok(NeuroLupus()); passed++;
assert.ok(NeuroLupus({a:1})); passed++;
assert.ok(NeuroBehcet()); passed++;
assert.ok(NeuroBehcet({a:1})); passed++;
assert.ok(NeuroSarcoidosis()); passed++;
assert.ok(NeuroSarcoidosis({a:1})); passed++;
assert.ok(NeuroWhipple()); passed++;
assert.ok(NeuroWhipple({a:1})); passed++;
assert.ok(NeuroLymeDisease()); passed++;
assert.ok(NeuroLymeDisease({a:1})); passed++;
assert.ok(Neurosyphilis()); passed++;
assert.ok(Neurosyphilis({a:1})); passed++;
assert.ok(NeuroHIV()); passed++;
assert.ok(NeuroHIV({a:1})); passed++;
assert.ok(NeuroBrucellosis()); passed++;
assert.ok(NeuroBrucellosis({a:1})); passed++;

console.log('pcc_neuro_ext32 unit:', passed, 'passed');
