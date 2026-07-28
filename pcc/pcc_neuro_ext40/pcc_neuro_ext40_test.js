// pcc_neuro_ext40 unit test v3.139.0
const { MultipleSclerosisExt2, NeuromyelitisOpticaExt, MOGAntibodyDisorderExt, AcuteDisseminatedEncephalomyelitis, ClinicallyIsolatedSyndromeExt, RadiologicallyIsolatedSyndrome, ProgressiveMultifocalLeukoencephalopathy, ADEMExt2, CerebralVasculitisExt, CNSLupusExt } = require('./pcc_neuro_ext40_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MultipleSclerosisExt2()); passed++;
assert.ok(MultipleSclerosisExt2({a:1})); passed++;
assert.ok(NeuromyelitisOpticaExt()); passed++;
assert.ok(NeuromyelitisOpticaExt({a:1})); passed++;
assert.ok(MOGAntibodyDisorderExt()); passed++;
assert.ok(MOGAntibodyDisorderExt({a:1})); passed++;
assert.ok(AcuteDisseminatedEncephalomyelitis()); passed++;
assert.ok(AcuteDisseminatedEncephalomyelitis({a:1})); passed++;
assert.ok(ClinicallyIsolatedSyndromeExt()); passed++;
assert.ok(ClinicallyIsolatedSyndromeExt({a:1})); passed++;
assert.ok(RadiologicallyIsolatedSyndrome()); passed++;
assert.ok(RadiologicallyIsolatedSyndrome({a:1})); passed++;
assert.ok(ProgressiveMultifocalLeukoencephalopathy()); passed++;
assert.ok(ProgressiveMultifocalLeukoencephalopathy({a:1})); passed++;
assert.ok(ADEMExt2()); passed++;
assert.ok(ADEMExt2({a:1})); passed++;
assert.ok(CerebralVasculitisExt()); passed++;
assert.ok(CerebralVasculitisExt({a:1})); passed++;
assert.ok(CNSLupusExt()); passed++;
assert.ok(CNSLupusExt({a:1})); passed++;

console.log('pcc_neuro_ext40 unit:', passed, 'passed');
