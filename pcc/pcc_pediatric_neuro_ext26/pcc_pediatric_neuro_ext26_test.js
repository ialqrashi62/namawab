// pcc_pediatric_neuro_ext26 unit test v3.136.0
const { PediatricMigraineExt3, PediatricTensionHeadacheExt, PediatricClusterHeadacheExt, PediatricChronicDailyHeadache, PediatricMedicationOveruseHeadache, PediatricNewDailyPersistentHeadache, PediatricCervicogenicHeadache, PediatricPostTraumaticHeadache, PediatricThunderclapHeadache, PediatricPrimaryCoughHeadache } = require('./pcc_pediatric_neuro_ext26_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricMigraineExt3()); passed++;
assert.ok(PediatricMigraineExt3({a:1})); passed++;
assert.ok(PediatricTensionHeadacheExt()); passed++;
assert.ok(PediatricTensionHeadacheExt({a:1})); passed++;
assert.ok(PediatricClusterHeadacheExt()); passed++;
assert.ok(PediatricClusterHeadacheExt({a:1})); passed++;
assert.ok(PediatricChronicDailyHeadache()); passed++;
assert.ok(PediatricChronicDailyHeadache({a:1})); passed++;
assert.ok(PediatricMedicationOveruseHeadache()); passed++;
assert.ok(PediatricMedicationOveruseHeadache({a:1})); passed++;
assert.ok(PediatricNewDailyPersistentHeadache()); passed++;
assert.ok(PediatricNewDailyPersistentHeadache({a:1})); passed++;
assert.ok(PediatricCervicogenicHeadache()); passed++;
assert.ok(PediatricCervicogenicHeadache({a:1})); passed++;
assert.ok(PediatricPostTraumaticHeadache()); passed++;
assert.ok(PediatricPostTraumaticHeadache({a:1})); passed++;
assert.ok(PediatricThunderclapHeadache()); passed++;
assert.ok(PediatricThunderclapHeadache({a:1})); passed++;
assert.ok(PediatricPrimaryCoughHeadache()); passed++;
assert.ok(PediatricPrimaryCoughHeadache({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext26 unit:', passed, 'passed');
