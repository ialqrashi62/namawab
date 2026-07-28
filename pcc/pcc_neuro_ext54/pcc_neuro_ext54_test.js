// pcc_neuro_ext54 unit test v3.153.0
const { NeuroacanthocytosisExt, ChoreaAcanthocytosisExt, McLeodSyndromeExt, HuntingtonDiseaseLike2Ext, HDL3Ext, HDL4Ext, SenileChoreaExt, BenignHereditaryChoreaExt, InheritedCreutzfeldtJakobExt, FatalFamilialInsomniaExt } = require('./pcc_neuro_ext54_engine');
const assert = require('assert');

let passed = 0;
assert.ok(NeuroacanthocytosisExt()); passed++;
assert.ok(NeuroacanthocytosisExt({a:1})); passed++;
assert.ok(ChoreaAcanthocytosisExt()); passed++;
assert.ok(ChoreaAcanthocytosisExt({a:1})); passed++;
assert.ok(McLeodSyndromeExt()); passed++;
assert.ok(McLeodSyndromeExt({a:1})); passed++;
assert.ok(HuntingtonDiseaseLike2Ext()); passed++;
assert.ok(HuntingtonDiseaseLike2Ext({a:1})); passed++;
assert.ok(HDL3Ext()); passed++;
assert.ok(HDL3Ext({a:1})); passed++;
assert.ok(HDL4Ext()); passed++;
assert.ok(HDL4Ext({a:1})); passed++;
assert.ok(SenileChoreaExt()); passed++;
assert.ok(SenileChoreaExt({a:1})); passed++;
assert.ok(BenignHereditaryChoreaExt()); passed++;
assert.ok(BenignHereditaryChoreaExt({a:1})); passed++;
assert.ok(InheritedCreutzfeldtJakobExt()); passed++;
assert.ok(InheritedCreutzfeldtJakobExt({a:1})); passed++;
assert.ok(FatalFamilialInsomniaExt()); passed++;
assert.ok(FatalFamilialInsomniaExt({a:1})); passed++;

console.log('pcc_neuro_ext54 unit:', passed, 'passed');
