// pcc_neuro_ext39 unit test v3.138.0
const { MyastheniaGravisExt, LambertEatonMyasthenicExt, CongenitalMyasthenicExt, BotulismExt2, TetanusExt2, NeurolepticMalignantExt, MalignantHyperthermiaExt, SerotoninSyndromeExt, AnticholinergicToxicityExt, CholinergicCrisisExt } = require('./pcc_neuro_ext39_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MyastheniaGravisExt()); passed++;
assert.ok(MyastheniaGravisExt({a:1})); passed++;
assert.ok(LambertEatonMyasthenicExt()); passed++;
assert.ok(LambertEatonMyasthenicExt({a:1})); passed++;
assert.ok(CongenitalMyasthenicExt()); passed++;
assert.ok(CongenitalMyasthenicExt({a:1})); passed++;
assert.ok(BotulismExt2()); passed++;
assert.ok(BotulismExt2({a:1})); passed++;
assert.ok(TetanusExt2()); passed++;
assert.ok(TetanusExt2({a:1})); passed++;
assert.ok(NeurolepticMalignantExt()); passed++;
assert.ok(NeurolepticMalignantExt({a:1})); passed++;
assert.ok(MalignantHyperthermiaExt()); passed++;
assert.ok(MalignantHyperthermiaExt({a:1})); passed++;
assert.ok(SerotoninSyndromeExt()); passed++;
assert.ok(SerotoninSyndromeExt({a:1})); passed++;
assert.ok(AnticholinergicToxicityExt()); passed++;
assert.ok(AnticholinergicToxicityExt({a:1})); passed++;
assert.ok(CholinergicCrisisExt()); passed++;
assert.ok(CholinergicCrisisExt({a:1})); passed++;

console.log('pcc_neuro_ext39 unit:', passed, 'passed');
