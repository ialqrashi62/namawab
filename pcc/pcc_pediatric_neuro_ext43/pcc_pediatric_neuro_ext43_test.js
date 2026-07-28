// pcc_pediatric_neuro_ext43 unit test v3.153.0
const { PediatricTicDisorderExt3, PediatricTransientTicExt, PediatricChronicMotorTicExt, PediatricChronicVocalTicExt, PediatricTouretteSyndromeExt, PediatricTouretteComorbidityExt, PediatricTicRelatedOCDExt, PediatricTicRelatedADHDExt, PediatricTicRelatedAnxietyExt, PediatricTicPharmacologyExt } = require('./pcc_pediatric_neuro_ext43_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricTicDisorderExt3()); passed++;
assert.ok(PediatricTicDisorderExt3({a:1})); passed++;
assert.ok(PediatricTransientTicExt()); passed++;
assert.ok(PediatricTransientTicExt({a:1})); passed++;
assert.ok(PediatricChronicMotorTicExt()); passed++;
assert.ok(PediatricChronicMotorTicExt({a:1})); passed++;
assert.ok(PediatricChronicVocalTicExt()); passed++;
assert.ok(PediatricChronicVocalTicExt({a:1})); passed++;
assert.ok(PediatricTouretteSyndromeExt()); passed++;
assert.ok(PediatricTouretteSyndromeExt({a:1})); passed++;
assert.ok(PediatricTouretteComorbidityExt()); passed++;
assert.ok(PediatricTouretteComorbidityExt({a:1})); passed++;
assert.ok(PediatricTicRelatedOCDExt()); passed++;
assert.ok(PediatricTicRelatedOCDExt({a:1})); passed++;
assert.ok(PediatricTicRelatedADHDExt()); passed++;
assert.ok(PediatricTicRelatedADHDExt({a:1})); passed++;
assert.ok(PediatricTicRelatedAnxietyExt()); passed++;
assert.ok(PediatricTicRelatedAnxietyExt({a:1})); passed++;
assert.ok(PediatricTicPharmacologyExt()); passed++;
assert.ok(PediatricTicPharmacologyExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext43 unit:', passed, 'passed');
