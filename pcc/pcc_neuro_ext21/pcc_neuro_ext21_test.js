// pcc_neuro_ext21 unit test v3.120.0
const { MovementDisorderExt2, AtaxiaTelangiectasia, FriedreichAtaxiaExt, SpinocerebellarDegeneration, HereditarySpasticParaplegia, ProgressiveSupranuclearPalsyExt, CorticobasalSyndrome, MultipleSystemAtrophyExt, LewyBodyDementia, FrontotemporalDementia } = require('./pcc_neuro_ext21_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MovementDisorderExt2()); passed++;
assert.ok(MovementDisorderExt2({a:1})); passed++;
assert.ok(AtaxiaTelangiectasia()); passed++;
assert.ok(AtaxiaTelangiectasia({a:1})); passed++;
assert.ok(FriedreichAtaxiaExt()); passed++;
assert.ok(FriedreichAtaxiaExt({a:1})); passed++;
assert.ok(SpinocerebellarDegeneration()); passed++;
assert.ok(SpinocerebellarDegeneration({a:1})); passed++;
assert.ok(HereditarySpasticParaplegia()); passed++;
assert.ok(HereditarySpasticParaplegia({a:1})); passed++;
assert.ok(ProgressiveSupranuclearPalsyExt()); passed++;
assert.ok(ProgressiveSupranuclearPalsyExt({a:1})); passed++;
assert.ok(CorticobasalSyndrome()); passed++;
assert.ok(CorticobasalSyndrome({a:1})); passed++;
assert.ok(MultipleSystemAtrophyExt()); passed++;
assert.ok(MultipleSystemAtrophyExt({a:1})); passed++;
assert.ok(LewyBodyDementia()); passed++;
assert.ok(LewyBodyDementia({a:1})); passed++;
assert.ok(FrontotemporalDementia()); passed++;
assert.ok(FrontotemporalDementia({a:1})); passed++;

console.log('pcc_neuro_ext21 unit:', passed, 'passed');
