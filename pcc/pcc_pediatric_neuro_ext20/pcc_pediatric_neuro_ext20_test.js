// pcc_pediatric_neuro_ext20 unit test v3.130.0
const { PediatricDemyelinatingDisorder, PediatricMultipleSclerosis, PediatricNMOSpectrum, PediatricMOGDisease, PediatricAcuteDemyelinating, PediatricOpticNeuritis, PediatricTransverseMyelitisExt, PediatricADEMExt, PediatricAutoimmuneEncephalitis, PediatricHashimoto } = require('./pcc_pediatric_neuro_ext20_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricDemyelinatingDisorder()); passed++;
assert.ok(PediatricDemyelinatingDisorder({a:1})); passed++;
assert.ok(PediatricMultipleSclerosis()); passed++;
assert.ok(PediatricMultipleSclerosis({a:1})); passed++;
assert.ok(PediatricNMOSpectrum()); passed++;
assert.ok(PediatricNMOSpectrum({a:1})); passed++;
assert.ok(PediatricMOGDisease()); passed++;
assert.ok(PediatricMOGDisease({a:1})); passed++;
assert.ok(PediatricAcuteDemyelinating()); passed++;
assert.ok(PediatricAcuteDemyelinating({a:1})); passed++;
assert.ok(PediatricOpticNeuritis()); passed++;
assert.ok(PediatricOpticNeuritis({a:1})); passed++;
assert.ok(PediatricTransverseMyelitisExt()); passed++;
assert.ok(PediatricTransverseMyelitisExt({a:1})); passed++;
assert.ok(PediatricADEMExt()); passed++;
assert.ok(PediatricADEMExt({a:1})); passed++;
assert.ok(PediatricAutoimmuneEncephalitis()); passed++;
assert.ok(PediatricAutoimmuneEncephalitis({a:1})); passed++;
assert.ok(PediatricHashimoto()); passed++;
assert.ok(PediatricHashimoto({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext20 unit:', passed, 'passed');
