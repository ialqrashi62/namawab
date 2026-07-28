// pcc_pediatric_neuro_ext36 unit test v3.146.0
const { PediatricNeurocutaneousExt, PediatricNeurofibromatosisType1Ext, PediatricNeurofibromatosisType2Ext, PediatricTuberousSclerosisExt, PediatricSturgeWeberExt, PediatricVonHippelLindauExt, PediatricAtaxiaTelangiectasiaExt, PediatricGorlinSyndromeExt, PediatricHypomelanosisOfItoExt, PediatricIncontinentiaPigmentiExt } = require('./pcc_pediatric_neuro_ext36_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurocutaneousExt()); passed++;
assert.ok(PediatricNeurocutaneousExt({a:1})); passed++;
assert.ok(PediatricNeurofibromatosisType1Ext()); passed++;
assert.ok(PediatricNeurofibromatosisType1Ext({a:1})); passed++;
assert.ok(PediatricNeurofibromatosisType2Ext()); passed++;
assert.ok(PediatricNeurofibromatosisType2Ext({a:1})); passed++;
assert.ok(PediatricTuberousSclerosisExt()); passed++;
assert.ok(PediatricTuberousSclerosisExt({a:1})); passed++;
assert.ok(PediatricSturgeWeberExt()); passed++;
assert.ok(PediatricSturgeWeberExt({a:1})); passed++;
assert.ok(PediatricVonHippelLindauExt()); passed++;
assert.ok(PediatricVonHippelLindauExt({a:1})); passed++;
assert.ok(PediatricAtaxiaTelangiectasiaExt()); passed++;
assert.ok(PediatricAtaxiaTelangiectasiaExt({a:1})); passed++;
assert.ok(PediatricGorlinSyndromeExt()); passed++;
assert.ok(PediatricGorlinSyndromeExt({a:1})); passed++;
assert.ok(PediatricHypomelanosisOfItoExt()); passed++;
assert.ok(PediatricHypomelanosisOfItoExt({a:1})); passed++;
assert.ok(PediatricIncontinentiaPigmentiExt()); passed++;
assert.ok(PediatricIncontinentiaPigmentiExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext36 unit:', passed, 'passed');
