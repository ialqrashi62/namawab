// pcc_neuro_ext23 unit test v3.122.0
const { CranialNerveDisorderExt, OlfactoryNerveDisorder, OpticNeuritisExt2, OculomotorNervePalsy, TrochlearNervePalsy, AbducensNervePalsy, TrigeminalNeuropathy, FacialNervePalsy, VestibulocochlearNerveDisorder, GlossopharyngealNeuralgiaExt } = require('./pcc_neuro_ext23_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CranialNerveDisorderExt()); passed++;
assert.ok(CranialNerveDisorderExt({a:1})); passed++;
assert.ok(OlfactoryNerveDisorder()); passed++;
assert.ok(OlfactoryNerveDisorder({a:1})); passed++;
assert.ok(OpticNeuritisExt2()); passed++;
assert.ok(OpticNeuritisExt2({a:1})); passed++;
assert.ok(OculomotorNervePalsy()); passed++;
assert.ok(OculomotorNervePalsy({a:1})); passed++;
assert.ok(TrochlearNervePalsy()); passed++;
assert.ok(TrochlearNervePalsy({a:1})); passed++;
assert.ok(AbducensNervePalsy()); passed++;
assert.ok(AbducensNervePalsy({a:1})); passed++;
assert.ok(TrigeminalNeuropathy()); passed++;
assert.ok(TrigeminalNeuropathy({a:1})); passed++;
assert.ok(FacialNervePalsy()); passed++;
assert.ok(FacialNervePalsy({a:1})); passed++;
assert.ok(VestibulocochlearNerveDisorder()); passed++;
assert.ok(VestibulocochlearNerveDisorder({a:1})); passed++;
assert.ok(GlossopharyngealNeuralgiaExt()); passed++;
assert.ok(GlossopharyngealNeuralgiaExt({a:1})); passed++;

console.log('pcc_neuro_ext23 unit:', passed, 'passed');
