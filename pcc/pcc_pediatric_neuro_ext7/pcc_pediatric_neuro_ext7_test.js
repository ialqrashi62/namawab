// pcc_pediatric_neuro_ext7 unit test v3.117.0
const { PediatricHeadacheEvaluation, PediatricMigraineAcute, PediatricMigraineProphylaxis, PediatricTensionType, PediatricChronicDailyHeadache, PediatricPostTraumatic, PediatricSinusitisHeadache, PediatricIntracranialHypertension, PediatricChiariHeadache, PediatricMedicationOveruse } = require('./pcc_pediatric_neuro_ext7_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricHeadacheEvaluation()); passed++;
assert.ok(PediatricHeadacheEvaluation({a:1})); passed++;
assert.ok(PediatricMigraineAcute()); passed++;
assert.ok(PediatricMigraineAcute({a:1})); passed++;
assert.ok(PediatricMigraineProphylaxis()); passed++;
assert.ok(PediatricMigraineProphylaxis({a:1})); passed++;
assert.ok(PediatricTensionType()); passed++;
assert.ok(PediatricTensionType({a:1})); passed++;
assert.ok(PediatricChronicDailyHeadache()); passed++;
assert.ok(PediatricChronicDailyHeadache({a:1})); passed++;
assert.ok(PediatricPostTraumatic()); passed++;
assert.ok(PediatricPostTraumatic({a:1})); passed++;
assert.ok(PediatricSinusitisHeadache()); passed++;
assert.ok(PediatricSinusitisHeadache({a:1})); passed++;
assert.ok(PediatricIntracranialHypertension()); passed++;
assert.ok(PediatricIntracranialHypertension({a:1})); passed++;
assert.ok(PediatricChiariHeadache()); passed++;
assert.ok(PediatricChiariHeadache({a:1})); passed++;
assert.ok(PediatricMedicationOveruse()); passed++;
assert.ok(PediatricMedicationOveruse({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext7 unit:', passed, 'passed');
