// pcc_neuro_ext15 unit test v3.114.0
const { GuillainBarreSyndromeExt, ChronicInflammatoryDemyelinatingPolyneuropathy, MyastheniaGravisExt, LambertEatonMyasthenicSyndrome, AmyotrophicLateralSclerosisExt, PrimaryLateralSclerosis, SpinalMuscularAtrophy, MuscularDystrophyExt, MyotonicDystrophy, CharcotMarieToothDisease } = require('./pcc_neuro_ext15_engine');
const assert = require('assert');

let passed = 0;
assert.ok(GuillainBarreSyndromeExt()); passed++;
assert.ok(GuillainBarreSyndromeExt({a:1})); passed++;
assert.ok(ChronicInflammatoryDemyelinatingPolyneuropathy()); passed++;
assert.ok(ChronicInflammatoryDemyelinatingPolyneuropathy({a:1})); passed++;
assert.ok(MyastheniaGravisExt()); passed++;
assert.ok(MyastheniaGravisExt({a:1})); passed++;
assert.ok(LambertEatonMyasthenicSyndrome()); passed++;
assert.ok(LambertEatonMyasthenicSyndrome({a:1})); passed++;
assert.ok(AmyotrophicLateralSclerosisExt()); passed++;
assert.ok(AmyotrophicLateralSclerosisExt({a:1})); passed++;
assert.ok(PrimaryLateralSclerosis()); passed++;
assert.ok(PrimaryLateralSclerosis({a:1})); passed++;
assert.ok(SpinalMuscularAtrophy()); passed++;
assert.ok(SpinalMuscularAtrophy({a:1})); passed++;
assert.ok(MuscularDystrophyExt()); passed++;
assert.ok(MuscularDystrophyExt({a:1})); passed++;
assert.ok(MyotonicDystrophy()); passed++;
assert.ok(MyotonicDystrophy({a:1})); passed++;
assert.ok(CharcotMarieToothDisease()); passed++;
assert.ok(CharcotMarieToothDisease({a:1})); passed++;

console.log('pcc_neuro_ext15 unit:', passed, 'passed');
