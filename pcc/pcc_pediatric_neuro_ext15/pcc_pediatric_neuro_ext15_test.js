// pcc_pediatric_neuro_ext15 unit test v3.125.0
const { PediatricNMOSpectrum, PediatricMOGAntibody, PediatricAcuteDisseminated, PediatricTransverseMyelitis, PediatricOpticNeuritisExt, PediatricADEM, PediatricAutoimmuneEncephalitis, PediatricAntiNMDA, PediatricAntiLGI1, PediatricAntiGAD } = require('./pcc_pediatric_neuro_ext15_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNMOSpectrum()); passed++;
assert.ok(PediatricNMOSpectrum({a:1})); passed++;
assert.ok(PediatricMOGAntibody()); passed++;
assert.ok(PediatricMOGAntibody({a:1})); passed++;
assert.ok(PediatricAcuteDisseminated()); passed++;
assert.ok(PediatricAcuteDisseminated({a:1})); passed++;
assert.ok(PediatricTransverseMyelitis()); passed++;
assert.ok(PediatricTransverseMyelitis({a:1})); passed++;
assert.ok(PediatricOpticNeuritisExt()); passed++;
assert.ok(PediatricOpticNeuritisExt({a:1})); passed++;
assert.ok(PediatricADEM()); passed++;
assert.ok(PediatricADEM({a:1})); passed++;
assert.ok(PediatricAutoimmuneEncephalitis()); passed++;
assert.ok(PediatricAutoimmuneEncephalitis({a:1})); passed++;
assert.ok(PediatricAntiNMDA()); passed++;
assert.ok(PediatricAntiNMDA({a:1})); passed++;
assert.ok(PediatricAntiLGI1()); passed++;
assert.ok(PediatricAntiLGI1({a:1})); passed++;
assert.ok(PediatricAntiGAD()); passed++;
assert.ok(PediatricAntiGAD({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext15 unit:', passed, 'passed');
