// pcc_neuro_ext58 unit test v3.157.0
const { CentralNervousSystemLupusExt, NeuroBehcetExt, NeuroSarcoidosisExt, NeurosyphilisExt, NeuroLymeDiseaseExt, NeuroBrucellosisExt, NeuroWhippleDiseaseExt, NeuroCysticercosisExt, NeuroToxoplasmosisExt, NeuroCysticercosisSurgeryExt } = require('./pcc_neuro_ext58_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CentralNervousSystemLupusExt()); passed++;
assert.ok(CentralNervousSystemLupusExt({a:1})); passed++;
assert.ok(NeuroBehcetExt()); passed++;
assert.ok(NeuroBehcetExt({a:1})); passed++;
assert.ok(NeuroSarcoidosisExt()); passed++;
assert.ok(NeuroSarcoidosisExt({a:1})); passed++;
assert.ok(NeurosyphilisExt()); passed++;
assert.ok(NeurosyphilisExt({a:1})); passed++;
assert.ok(NeuroLymeDiseaseExt()); passed++;
assert.ok(NeuroLymeDiseaseExt({a:1})); passed++;
assert.ok(NeuroBrucellosisExt()); passed++;
assert.ok(NeuroBrucellosisExt({a:1})); passed++;
assert.ok(NeuroWhippleDiseaseExt()); passed++;
assert.ok(NeuroWhippleDiseaseExt({a:1})); passed++;
assert.ok(NeuroCysticercosisExt()); passed++;
assert.ok(NeuroCysticercosisExt({a:1})); passed++;
assert.ok(NeuroToxoplasmosisExt()); passed++;
assert.ok(NeuroToxoplasmosisExt({a:1})); passed++;
assert.ok(NeuroCysticercosisSurgeryExt()); passed++;
assert.ok(NeuroCysticercosisSurgeryExt({a:1})); passed++;

console.log('pcc_neuro_ext58 unit:', passed, 'passed');
