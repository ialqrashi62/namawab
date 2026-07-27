// pcc_neuro_ext24 unit test v3.123.0
const { NeuromuscularDisorderExt, MyastheniaGravisExt2, LambertEatonSyndrome, CongenitalMyasthenicSyndrome, PolymyositisExt, Dermatomyositis, InclusionBodyMyositis, MyotonicDisorder, PeriodicParalysis, MitochondrialMyopathy } = require('./pcc_neuro_ext24_engine');
const assert = require('assert');

let passed = 0;
assert.ok(NeuromuscularDisorderExt()); passed++;
assert.ok(NeuromuscularDisorderExt({a:1})); passed++;
assert.ok(MyastheniaGravisExt2()); passed++;
assert.ok(MyastheniaGravisExt2({a:1})); passed++;
assert.ok(LambertEatonSyndrome()); passed++;
assert.ok(LambertEatonSyndrome({a:1})); passed++;
assert.ok(CongenitalMyasthenicSyndrome()); passed++;
assert.ok(CongenitalMyasthenicSyndrome({a:1})); passed++;
assert.ok(PolymyositisExt()); passed++;
assert.ok(PolymyositisExt({a:1})); passed++;
assert.ok(Dermatomyositis()); passed++;
assert.ok(Dermatomyositis({a:1})); passed++;
assert.ok(InclusionBodyMyositis()); passed++;
assert.ok(InclusionBodyMyositis({a:1})); passed++;
assert.ok(MyotonicDisorder()); passed++;
assert.ok(MyotonicDisorder({a:1})); passed++;
assert.ok(PeriodicParalysis()); passed++;
assert.ok(PeriodicParalysis({a:1})); passed++;
assert.ok(MitochondrialMyopathy()); passed++;
assert.ok(MitochondrialMyopathy({a:1})); passed++;

console.log('pcc_neuro_ext24 unit:', passed, 'passed');
