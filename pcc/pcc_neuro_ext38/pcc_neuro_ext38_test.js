// pcc_neuro_ext38 unit test v3.137.0
const { TrigeminalNeuralgiaExt, GlossopharyngealNeuralgia, OccipitalNeuralgiaExt, PostherpeticNeuralgiaExt, TrigeminalNeuropathyExt, TrigeminalTrophicSyndrome, BurningMouthSyndromeExt, AtypicalOdontalgiaExt, ClusterTicSyndromeExt, SUNCTDisorderExt } = require('./pcc_neuro_ext38_engine');
const assert = require('assert');

let passed = 0;
assert.ok(TrigeminalNeuralgiaExt()); passed++;
assert.ok(TrigeminalNeuralgiaExt({a:1})); passed++;
assert.ok(GlossopharyngealNeuralgia()); passed++;
assert.ok(GlossopharyngealNeuralgia({a:1})); passed++;
assert.ok(OccipitalNeuralgiaExt()); passed++;
assert.ok(OccipitalNeuralgiaExt({a:1})); passed++;
assert.ok(PostherpeticNeuralgiaExt()); passed++;
assert.ok(PostherpeticNeuralgiaExt({a:1})); passed++;
assert.ok(TrigeminalNeuropathyExt()); passed++;
assert.ok(TrigeminalNeuropathyExt({a:1})); passed++;
assert.ok(TrigeminalTrophicSyndrome()); passed++;
assert.ok(TrigeminalTrophicSyndrome({a:1})); passed++;
assert.ok(BurningMouthSyndromeExt()); passed++;
assert.ok(BurningMouthSyndromeExt({a:1})); passed++;
assert.ok(AtypicalOdontalgiaExt()); passed++;
assert.ok(AtypicalOdontalgiaExt({a:1})); passed++;
assert.ok(ClusterTicSyndromeExt()); passed++;
assert.ok(ClusterTicSyndromeExt({a:1})); passed++;
assert.ok(SUNCTDisorderExt()); passed++;
assert.ok(SUNCTDisorderExt({a:1})); passed++;

console.log('pcc_neuro_ext38 unit:', passed, 'passed');
