// pcc_pediatric_neuro_ext38 unit test v3.148.0
const { PediatricBrainTumorSyndromeExt, PediatricNeurofibromatosisBrainTumorExt, PediatricTuberousSclerosisBrainTumorExt, PediatricVonHippelLindauBrainTumorExt, PediatricLiFraumeniBrainTumorExt, PediatricGorlinBrainTumorExt, PediatricRetinoblastomaBrainTumorExt, PediatricAtypicalTeratoidExt, PediatricEmbryonalTumorExt, PediatricPineoblastomaExt } = require('./pcc_pediatric_neuro_ext38_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricBrainTumorSyndromeExt()); passed++;
assert.ok(PediatricBrainTumorSyndromeExt({a:1})); passed++;
assert.ok(PediatricNeurofibromatosisBrainTumorExt()); passed++;
assert.ok(PediatricNeurofibromatosisBrainTumorExt({a:1})); passed++;
assert.ok(PediatricTuberousSclerosisBrainTumorExt()); passed++;
assert.ok(PediatricTuberousSclerosisBrainTumorExt({a:1})); passed++;
assert.ok(PediatricVonHippelLindauBrainTumorExt()); passed++;
assert.ok(PediatricVonHippelLindauBrainTumorExt({a:1})); passed++;
assert.ok(PediatricLiFraumeniBrainTumorExt()); passed++;
assert.ok(PediatricLiFraumeniBrainTumorExt({a:1})); passed++;
assert.ok(PediatricGorlinBrainTumorExt()); passed++;
assert.ok(PediatricGorlinBrainTumorExt({a:1})); passed++;
assert.ok(PediatricRetinoblastomaBrainTumorExt()); passed++;
assert.ok(PediatricRetinoblastomaBrainTumorExt({a:1})); passed++;
assert.ok(PediatricAtypicalTeratoidExt()); passed++;
assert.ok(PediatricAtypicalTeratoidExt({a:1})); passed++;
assert.ok(PediatricEmbryonalTumorExt()); passed++;
assert.ok(PediatricEmbryonalTumorExt({a:1})); passed++;
assert.ok(PediatricPineoblastomaExt()); passed++;
assert.ok(PediatricPineoblastomaExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext38 unit:', passed, 'passed');
