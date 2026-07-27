// pcc_neuro_ext26 unit test v3.125.0
const { DemyelinatingDiseaseExt, MultipleSclerosisVariants, MarburgMS, BaloConcentricSclerosis, SchilderDisease, TumefactiveMS, OpticSpinalMS, ProgressiveRelapsingMS, ClinicallyIsolatedSyndrome, RadiologicallyIsolatedSyndrome } = require('./pcc_neuro_ext26_engine');
const assert = require('assert');

let passed = 0;
assert.ok(DemyelinatingDiseaseExt()); passed++;
assert.ok(DemyelinatingDiseaseExt({a:1})); passed++;
assert.ok(MultipleSclerosisVariants()); passed++;
assert.ok(MultipleSclerosisVariants({a:1})); passed++;
assert.ok(MarburgMS()); passed++;
assert.ok(MarburgMS({a:1})); passed++;
assert.ok(BaloConcentricSclerosis()); passed++;
assert.ok(BaloConcentricSclerosis({a:1})); passed++;
assert.ok(SchilderDisease()); passed++;
assert.ok(SchilderDisease({a:1})); passed++;
assert.ok(TumefactiveMS()); passed++;
assert.ok(TumefactiveMS({a:1})); passed++;
assert.ok(OpticSpinalMS()); passed++;
assert.ok(OpticSpinalMS({a:1})); passed++;
assert.ok(ProgressiveRelapsingMS()); passed++;
assert.ok(ProgressiveRelapsingMS({a:1})); passed++;
assert.ok(ClinicallyIsolatedSyndrome()); passed++;
assert.ok(ClinicallyIsolatedSyndrome({a:1})); passed++;
assert.ok(RadiologicallyIsolatedSyndrome()); passed++;
assert.ok(RadiologicallyIsolatedSyndrome({a:1})); passed++;

console.log('pcc_neuro_ext26 unit:', passed, 'passed');
