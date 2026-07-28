// pcc_neuro_ext61 unit test v3.160.0
const { SpinocerebellarAtaxiaAutosomalDominantExt, SpinocerebellarAtaxiaAutosomalRecessiveExt, ChildhoodAtaxiaWithCentralNervousSystemExt, AtaxiaOculomotorApraxiaExt, FriedreichAtaxiaExtendedExt, MarinescoSjogrenSyndromeExt, CoenzymeQ10DeficiencyAtaxiaExt, AbetalipoproteinemiaAtaxiaExt, AtaxiaTelangiectasiaVariantExt, SpinocerebellarAtaxiaType7Ext } = require('./pcc_neuro_ext61_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SpinocerebellarAtaxiaAutosomalDominantExt()); passed++;
assert.ok(SpinocerebellarAtaxiaAutosomalDominantExt({a:1})); passed++;
assert.ok(SpinocerebellarAtaxiaAutosomalRecessiveExt()); passed++;
assert.ok(SpinocerebellarAtaxiaAutosomalRecessiveExt({a:1})); passed++;
assert.ok(ChildhoodAtaxiaWithCentralNervousSystemExt()); passed++;
assert.ok(ChildhoodAtaxiaWithCentralNervousSystemExt({a:1})); passed++;
assert.ok(AtaxiaOculomotorApraxiaExt()); passed++;
assert.ok(AtaxiaOculomotorApraxiaExt({a:1})); passed++;
assert.ok(FriedreichAtaxiaExtendedExt()); passed++;
assert.ok(FriedreichAtaxiaExtendedExt({a:1})); passed++;
assert.ok(MarinescoSjogrenSyndromeExt()); passed++;
assert.ok(MarinescoSjogrenSyndromeExt({a:1})); passed++;
assert.ok(CoenzymeQ10DeficiencyAtaxiaExt()); passed++;
assert.ok(CoenzymeQ10DeficiencyAtaxiaExt({a:1})); passed++;
assert.ok(AbetalipoproteinemiaAtaxiaExt()); passed++;
assert.ok(AbetalipoproteinemiaAtaxiaExt({a:1})); passed++;
assert.ok(AtaxiaTelangiectasiaVariantExt()); passed++;
assert.ok(AtaxiaTelangiectasiaVariantExt({a:1})); passed++;
assert.ok(SpinocerebellarAtaxiaType7Ext()); passed++;
assert.ok(SpinocerebellarAtaxiaType7Ext({a:1})); passed++;

console.log('pcc_neuro_ext61 unit:', passed, 'passed');
