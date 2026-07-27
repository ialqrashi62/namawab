// pcc_neuro_ext27 unit test v3.126.0
const { ParkinsonPlusExt2, CorticobasalDegenerationExt, ProgressiveSupranuclearPalsyExt2, MultipleSystemAtrophyExt2, DementiaWithLewyBodies, ParkinsonDiseaseDementia, VascularParkinsonism, DrugInducedParkinsonism, EssentialTremorExt, CerebellarTremor } = require('./pcc_neuro_ext27_engine');
const assert = require('assert');

let passed = 0;
assert.ok(ParkinsonPlusExt2()); passed++;
assert.ok(ParkinsonPlusExt2({a:1})); passed++;
assert.ok(CorticobasalDegenerationExt()); passed++;
assert.ok(CorticobasalDegenerationExt({a:1})); passed++;
assert.ok(ProgressiveSupranuclearPalsyExt2()); passed++;
assert.ok(ProgressiveSupranuclearPalsyExt2({a:1})); passed++;
assert.ok(MultipleSystemAtrophyExt2()); passed++;
assert.ok(MultipleSystemAtrophyExt2({a:1})); passed++;
assert.ok(DementiaWithLewyBodies()); passed++;
assert.ok(DementiaWithLewyBodies({a:1})); passed++;
assert.ok(ParkinsonDiseaseDementia()); passed++;
assert.ok(ParkinsonDiseaseDementia({a:1})); passed++;
assert.ok(VascularParkinsonism()); passed++;
assert.ok(VascularParkinsonism({a:1})); passed++;
assert.ok(DrugInducedParkinsonism()); passed++;
assert.ok(DrugInducedParkinsonism({a:1})); passed++;
assert.ok(EssentialTremorExt()); passed++;
assert.ok(EssentialTremorExt({a:1})); passed++;
assert.ok(CerebellarTremor()); passed++;
assert.ok(CerebellarTremor({a:1})); passed++;

console.log('pcc_neuro_ext27 unit:', passed, 'passed');
