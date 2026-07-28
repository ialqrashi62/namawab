// pcc_neuro_ext53 unit test v3.152.0
const { CerebralCavernousMalformationExt, ArteriovenousMalformationExt, CapillaryTelangiectasiaExt, DevelopmentalVenousAnomalyExt, DuralArteriovenousFistulaExt, CavernousMalformationExt, MoyamoyaDiseaseExt, SickleCellDiseaseStrokeExt, CerebralAmyloidAngiopathyExt, CADASILExt } = require('./pcc_neuro_ext53_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CerebralCavernousMalformationExt()); passed++;
assert.ok(CerebralCavernousMalformationExt({a:1})); passed++;
assert.ok(ArteriovenousMalformationExt()); passed++;
assert.ok(ArteriovenousMalformationExt({a:1})); passed++;
assert.ok(CapillaryTelangiectasiaExt()); passed++;
assert.ok(CapillaryTelangiectasiaExt({a:1})); passed++;
assert.ok(DevelopmentalVenousAnomalyExt()); passed++;
assert.ok(DevelopmentalVenousAnomalyExt({a:1})); passed++;
assert.ok(DuralArteriovenousFistulaExt()); passed++;
assert.ok(DuralArteriovenousFistulaExt({a:1})); passed++;
assert.ok(CavernousMalformationExt()); passed++;
assert.ok(CavernousMalformationExt({a:1})); passed++;
assert.ok(MoyamoyaDiseaseExt()); passed++;
assert.ok(MoyamoyaDiseaseExt({a:1})); passed++;
assert.ok(SickleCellDiseaseStrokeExt()); passed++;
assert.ok(SickleCellDiseaseStrokeExt({a:1})); passed++;
assert.ok(CerebralAmyloidAngiopathyExt()); passed++;
assert.ok(CerebralAmyloidAngiopathyExt({a:1})); passed++;
assert.ok(CADASILExt()); passed++;
assert.ok(CADASILExt({a:1})); passed++;

console.log('pcc_neuro_ext53 unit:', passed, 'passed');
