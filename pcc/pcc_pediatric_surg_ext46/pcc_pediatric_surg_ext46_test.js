// pcc_pediatric_surg_ext46 unit test v3.156.0
const { PediatricNeurosurgeryOncologyExt, PediatricSpinalTumorExt, PediatricPosteriorFossaTumorExt, PediatricBrainstemTumorExt, PediatricSuprasellarTumorExt, PediatricPituitaryTumorExt, PediatricPinealRegionTumorExt, PediatricSpinalCordTumorExt, PediatricPeripheralNerveTumorExt, PediatricSkullBaseTumorExt } = require('./pcc_pediatric_surg_ext46_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgeryOncologyExt()); passed++;
assert.ok(PediatricNeurosurgeryOncologyExt({a:1})); passed++;
assert.ok(PediatricSpinalTumorExt()); passed++;
assert.ok(PediatricSpinalTumorExt({a:1})); passed++;
assert.ok(PediatricPosteriorFossaTumorExt()); passed++;
assert.ok(PediatricPosteriorFossaTumorExt({a:1})); passed++;
assert.ok(PediatricBrainstemTumorExt()); passed++;
assert.ok(PediatricBrainstemTumorExt({a:1})); passed++;
assert.ok(PediatricSuprasellarTumorExt()); passed++;
assert.ok(PediatricSuprasellarTumorExt({a:1})); passed++;
assert.ok(PediatricPituitaryTumorExt()); passed++;
assert.ok(PediatricPituitaryTumorExt({a:1})); passed++;
assert.ok(PediatricPinealRegionTumorExt()); passed++;
assert.ok(PediatricPinealRegionTumorExt({a:1})); passed++;
assert.ok(PediatricSpinalCordTumorExt()); passed++;
assert.ok(PediatricSpinalCordTumorExt({a:1})); passed++;
assert.ok(PediatricPeripheralNerveTumorExt()); passed++;
assert.ok(PediatricPeripheralNerveTumorExt({a:1})); passed++;
assert.ok(PediatricSkullBaseTumorExt()); passed++;
assert.ok(PediatricSkullBaseTumorExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext46 unit:', passed, 'passed');
