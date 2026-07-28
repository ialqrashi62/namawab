// pcc_neuro_ext56 unit test v3.155.0
const { WernickeEncephalopathyExt, KorsakoffSyndromeExt, WernickeKorsakoffExt, AlcoholicCerebellarDegenerationExt, MarchiafavaBignamiExt, AlcoholRelatedDementiaExt, CentralPontineMyelinolysisExt, OsmoticDemyelinationExt, CobalaminDeficiencyExt, FolateDeficiencyExt } = require('./pcc_neuro_ext56_engine');
const assert = require('assert');

let passed = 0;
assert.ok(WernickeEncephalopathyExt()); passed++;
assert.ok(WernickeEncephalopathyExt({a:1})); passed++;
assert.ok(KorsakoffSyndromeExt()); passed++;
assert.ok(KorsakoffSyndromeExt({a:1})); passed++;
assert.ok(WernickeKorsakoffExt()); passed++;
assert.ok(WernickeKorsakoffExt({a:1})); passed++;
assert.ok(AlcoholicCerebellarDegenerationExt()); passed++;
assert.ok(AlcoholicCerebellarDegenerationExt({a:1})); passed++;
assert.ok(MarchiafavaBignamiExt()); passed++;
assert.ok(MarchiafavaBignamiExt({a:1})); passed++;
assert.ok(AlcoholRelatedDementiaExt()); passed++;
assert.ok(AlcoholRelatedDementiaExt({a:1})); passed++;
assert.ok(CentralPontineMyelinolysisExt()); passed++;
assert.ok(CentralPontineMyelinolysisExt({a:1})); passed++;
assert.ok(OsmoticDemyelinationExt()); passed++;
assert.ok(OsmoticDemyelinationExt({a:1})); passed++;
assert.ok(CobalaminDeficiencyExt()); passed++;
assert.ok(CobalaminDeficiencyExt({a:1})); passed++;
assert.ok(FolateDeficiencyExt()); passed++;
assert.ok(FolateDeficiencyExt({a:1})); passed++;

console.log('pcc_neuro_ext56 unit:', passed, 'passed');
