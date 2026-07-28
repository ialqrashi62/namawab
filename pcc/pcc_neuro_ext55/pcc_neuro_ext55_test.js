// pcc_neuro_ext55 unit test v3.154.0
const { CreutzfeldtJakobDiseaseExt, VariantCJDExt, GerstmannStrausslerScheinkerExt, KuruExt, BovineSpongiformEncephalopathyExt, FatalFamilialInsomniaExt, SporadicFatalInsomniaExt, VariablyProteaseSensitivePrionopathyExt, PrionProteinCerebralAmyloidAngiopathyExt, PrionDiseaseDiagnosisExt } = require('./pcc_neuro_ext55_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CreutzfeldtJakobDiseaseExt()); passed++;
assert.ok(CreutzfeldtJakobDiseaseExt({a:1})); passed++;
assert.ok(VariantCJDExt()); passed++;
assert.ok(VariantCJDExt({a:1})); passed++;
assert.ok(GerstmannStrausslerScheinkerExt()); passed++;
assert.ok(GerstmannStrausslerScheinkerExt({a:1})); passed++;
assert.ok(KuruExt()); passed++;
assert.ok(KuruExt({a:1})); passed++;
assert.ok(BovineSpongiformEncephalopathyExt()); passed++;
assert.ok(BovineSpongiformEncephalopathyExt({a:1})); passed++;
assert.ok(FatalFamilialInsomniaExt()); passed++;
assert.ok(FatalFamilialInsomniaExt({a:1})); passed++;
assert.ok(SporadicFatalInsomniaExt()); passed++;
assert.ok(SporadicFatalInsomniaExt({a:1})); passed++;
assert.ok(VariablyProteaseSensitivePrionopathyExt()); passed++;
assert.ok(VariablyProteaseSensitivePrionopathyExt({a:1})); passed++;
assert.ok(PrionProteinCerebralAmyloidAngiopathyExt()); passed++;
assert.ok(PrionProteinCerebralAmyloidAngiopathyExt({a:1})); passed++;
assert.ok(PrionDiseaseDiagnosisExt()); passed++;
assert.ok(PrionDiseaseDiagnosisExt({a:1})); passed++;

console.log('pcc_neuro_ext55 unit:', passed, 'passed');
