// pcc_pediatric_neuro_ext50 unit test v3.160.0
const { PediatricAcuteDisseminatedEncephalomyelitisExt, PediatricMultipleSclerosisExt, PediatricNMOSDExt, PediatricMOGAntibodyDiseaseExt, PediatricClinicallyIsolatedSyndromeExt, PediatricRadiologicallyIsolatedSyndromeExt, PediatricBilateralOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricAcuteFlaccidMyelitisExt, PediatricAutoimmuneEncephalitisExt2 } = require('./pcc_pediatric_neuro_ext50_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricAcuteDisseminatedEncephalomyelitisExt()); passed++;
assert.ok(PediatricAcuteDisseminatedEncephalomyelitisExt({a:1})); passed++;
assert.ok(PediatricMultipleSclerosisExt()); passed++;
assert.ok(PediatricMultipleSclerosisExt({a:1})); passed++;
assert.ok(PediatricNMOSDExt()); passed++;
assert.ok(PediatricNMOSDExt({a:1})); passed++;
assert.ok(PediatricMOGAntibodyDiseaseExt()); passed++;
assert.ok(PediatricMOGAntibodyDiseaseExt({a:1})); passed++;
assert.ok(PediatricClinicallyIsolatedSyndromeExt()); passed++;
assert.ok(PediatricClinicallyIsolatedSyndromeExt({a:1})); passed++;
assert.ok(PediatricRadiologicallyIsolatedSyndromeExt()); passed++;
assert.ok(PediatricRadiologicallyIsolatedSyndromeExt({a:1})); passed++;
assert.ok(PediatricBilateralOpticNeuritisExt()); passed++;
assert.ok(PediatricBilateralOpticNeuritisExt({a:1})); passed++;
assert.ok(PediatricTransverseMyelitisExt()); passed++;
assert.ok(PediatricTransverseMyelitisExt({a:1})); passed++;
assert.ok(PediatricAcuteFlaccidMyelitisExt()); passed++;
assert.ok(PediatricAcuteFlaccidMyelitisExt({a:1})); passed++;
assert.ok(PediatricAutoimmuneEncephalitisExt2()); passed++;
assert.ok(PediatricAutoimmuneEncephalitisExt2({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext50 unit:', passed, 'passed');
