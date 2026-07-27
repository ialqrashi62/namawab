// pcc_neuro_ext22 unit test v3.121.0
const { NeuropathyExt2, DiabeticPeripheralNeuropathy, AlcoholicPolyneuropathy, CharcotMarieToothExt, GuillainBarreExt2, CIDPExt, VasculiticNeuropathy, ToxicNeuropathy, DrugInducedNeuropathy, HereditaryNeuropathy } = require('./pcc_neuro_ext22_engine');
const assert = require('assert');

let passed = 0;
assert.ok(NeuropathyExt2()); passed++;
assert.ok(NeuropathyExt2({a:1})); passed++;
assert.ok(DiabeticPeripheralNeuropathy()); passed++;
assert.ok(DiabeticPeripheralNeuropathy({a:1})); passed++;
assert.ok(AlcoholicPolyneuropathy()); passed++;
assert.ok(AlcoholicPolyneuropathy({a:1})); passed++;
assert.ok(CharcotMarieToothExt()); passed++;
assert.ok(CharcotMarieToothExt({a:1})); passed++;
assert.ok(GuillainBarreExt2()); passed++;
assert.ok(GuillainBarreExt2({a:1})); passed++;
assert.ok(CIDPExt()); passed++;
assert.ok(CIDPExt({a:1})); passed++;
assert.ok(VasculiticNeuropathy()); passed++;
assert.ok(VasculiticNeuropathy({a:1})); passed++;
assert.ok(ToxicNeuropathy()); passed++;
assert.ok(ToxicNeuropathy({a:1})); passed++;
assert.ok(DrugInducedNeuropathy()); passed++;
assert.ok(DrugInducedNeuropathy({a:1})); passed++;
assert.ok(HereditaryNeuropathy()); passed++;
assert.ok(HereditaryNeuropathy({a:1})); passed++;

console.log('pcc_neuro_ext22 unit:', passed, 'passed');
