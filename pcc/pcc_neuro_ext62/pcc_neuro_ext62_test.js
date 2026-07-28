// pcc_neuro_ext62 unit test v3.161.0
const { IdiopathicIntracranialHypertensionExt2, PseudotumorCerebriSyndromeExt, EmptySellaSyndromeExt, CSFPressureDisorderExt, CSFLeakPositionalExt, CSFVenousFistulaTreatmentExt, CSFShuntObstructionExt, CSFShuntInfectionExt, CerebralVenousThrombosisTreatmentExt, ReversibleCerebralVasoconstrictionExt } = require('./pcc_neuro_ext62_engine');
const assert = require('assert');

let passed = 0;
assert.ok(IdiopathicIntracranialHypertensionExt2()); passed++;
assert.ok(IdiopathicIntracranialHypertensionExt2({a:1})); passed++;
assert.ok(PseudotumorCerebriSyndromeExt()); passed++;
assert.ok(PseudotumorCerebriSyndromeExt({a:1})); passed++;
assert.ok(EmptySellaSyndromeExt()); passed++;
assert.ok(EmptySellaSyndromeExt({a:1})); passed++;
assert.ok(CSFPressureDisorderExt()); passed++;
assert.ok(CSFPressureDisorderExt({a:1})); passed++;
assert.ok(CSFLeakPositionalExt()); passed++;
assert.ok(CSFLeakPositionalExt({a:1})); passed++;
assert.ok(CSFVenousFistulaTreatmentExt()); passed++;
assert.ok(CSFVenousFistulaTreatmentExt({a:1})); passed++;
assert.ok(CSFShuntObstructionExt()); passed++;
assert.ok(CSFShuntObstructionExt({a:1})); passed++;
assert.ok(CSFShuntInfectionExt()); passed++;
assert.ok(CSFShuntInfectionExt({a:1})); passed++;
assert.ok(CerebralVenousThrombosisTreatmentExt()); passed++;
assert.ok(CerebralVenousThrombosisTreatmentExt({a:1})); passed++;
assert.ok(ReversibleCerebralVasoconstrictionExt()); passed++;
assert.ok(ReversibleCerebralVasoconstrictionExt({a:1})); passed++;

console.log('pcc_neuro_ext62 unit:', passed, 'passed');
