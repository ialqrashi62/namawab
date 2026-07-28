// pcc_neuro_ext41 unit test v3.140.0
const { ParkinsonDiseaseExt3, MultipleSystemAtrophyExt, ProgressiveSupranuclearPalsy, CorticobasalDegeneration, LewyBodyDementiaExt, ParkinsonismDementiaComplex, VascularParkinsonismExt, DrugInducedParkinsonism, EssentialTremorExt2, DystonicTremorExt } = require('./pcc_neuro_ext41_engine');
const assert = require('assert');

let passed = 0;
assert.ok(ParkinsonDiseaseExt3()); passed++;
assert.ok(ParkinsonDiseaseExt3({a:1})); passed++;
assert.ok(MultipleSystemAtrophyExt()); passed++;
assert.ok(MultipleSystemAtrophyExt({a:1})); passed++;
assert.ok(ProgressiveSupranuclearPalsy()); passed++;
assert.ok(ProgressiveSupranuclearPalsy({a:1})); passed++;
assert.ok(CorticobasalDegeneration()); passed++;
assert.ok(CorticobasalDegeneration({a:1})); passed++;
assert.ok(LewyBodyDementiaExt()); passed++;
assert.ok(LewyBodyDementiaExt({a:1})); passed++;
assert.ok(ParkinsonismDementiaComplex()); passed++;
assert.ok(ParkinsonismDementiaComplex({a:1})); passed++;
assert.ok(VascularParkinsonismExt()); passed++;
assert.ok(VascularParkinsonismExt({a:1})); passed++;
assert.ok(DrugInducedParkinsonism()); passed++;
assert.ok(DrugInducedParkinsonism({a:1})); passed++;
assert.ok(EssentialTremorExt2()); passed++;
assert.ok(EssentialTremorExt2({a:1})); passed++;
assert.ok(DystonicTremorExt()); passed++;
assert.ok(DystonicTremorExt({a:1})); passed++;

console.log('pcc_neuro_ext41 unit:', passed, 'passed');
