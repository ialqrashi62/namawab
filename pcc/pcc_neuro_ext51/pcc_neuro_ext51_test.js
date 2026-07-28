// pcc_neuro_ext51 unit test v3.150.0
const { SyringomyeliaExt, SyringobulbiaExt, ChiariMalformationType1Ext, ChiariMalformationType2Ext, ChiariMalformationType3Ext, TetheredCordSyndromeExt, OccultSpinalDysraphismExt, SpinalLipomaExt, DermalSinusTractExt, DiastematomyeliaExt } = require('./pcc_neuro_ext51_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SyringomyeliaExt()); passed++;
assert.ok(SyringomyeliaExt({a:1})); passed++;
assert.ok(SyringobulbiaExt()); passed++;
assert.ok(SyringobulbiaExt({a:1})); passed++;
assert.ok(ChiariMalformationType1Ext()); passed++;
assert.ok(ChiariMalformationType1Ext({a:1})); passed++;
assert.ok(ChiariMalformationType2Ext()); passed++;
assert.ok(ChiariMalformationType2Ext({a:1})); passed++;
assert.ok(ChiariMalformationType3Ext()); passed++;
assert.ok(ChiariMalformationType3Ext({a:1})); passed++;
assert.ok(TetheredCordSyndromeExt()); passed++;
assert.ok(TetheredCordSyndromeExt({a:1})); passed++;
assert.ok(OccultSpinalDysraphismExt()); passed++;
assert.ok(OccultSpinalDysraphismExt({a:1})); passed++;
assert.ok(SpinalLipomaExt()); passed++;
assert.ok(SpinalLipomaExt({a:1})); passed++;
assert.ok(DermalSinusTractExt()); passed++;
assert.ok(DermalSinusTractExt({a:1})); passed++;
assert.ok(DiastematomyeliaExt()); passed++;
assert.ok(DiastematomyeliaExt({a:1})); passed++;

console.log('pcc_neuro_ext51 unit:', passed, 'passed');
