// pcc_pediatric_surg_ext50 unit test v3.160.0
const { PediatricNeurosurgerySpineExt, PediatricSpinalDeformityExt, PediatricScoliosisSurgeryExt2, PediatricKyphosisSurgeryExt2, PediatricSpinalFractureExt, PediatricSpinalCordDecompressionExt, PediatricSpinalTumorResectionExt, PediatricSyringomyeliaExt, PediatricTetheredCordReleaseExt2, PediatricSpinalStenosisExt } = require('./pcc_pediatric_surg_ext50_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgerySpineExt()); passed++;
assert.ok(PediatricNeurosurgerySpineExt({a:1})); passed++;
assert.ok(PediatricSpinalDeformityExt()); passed++;
assert.ok(PediatricSpinalDeformityExt({a:1})); passed++;
assert.ok(PediatricScoliosisSurgeryExt2()); passed++;
assert.ok(PediatricScoliosisSurgeryExt2({a:1})); passed++;
assert.ok(PediatricKyphosisSurgeryExt2()); passed++;
assert.ok(PediatricKyphosisSurgeryExt2({a:1})); passed++;
assert.ok(PediatricSpinalFractureExt()); passed++;
assert.ok(PediatricSpinalFractureExt({a:1})); passed++;
assert.ok(PediatricSpinalCordDecompressionExt()); passed++;
assert.ok(PediatricSpinalCordDecompressionExt({a:1})); passed++;
assert.ok(PediatricSpinalTumorResectionExt()); passed++;
assert.ok(PediatricSpinalTumorResectionExt({a:1})); passed++;
assert.ok(PediatricSyringomyeliaExt()); passed++;
assert.ok(PediatricSyringomyeliaExt({a:1})); passed++;
assert.ok(PediatricTetheredCordReleaseExt2()); passed++;
assert.ok(PediatricTetheredCordReleaseExt2({a:1})); passed++;
assert.ok(PediatricSpinalStenosisExt()); passed++;
assert.ok(PediatricSpinalStenosisExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext50 unit:', passed, 'passed');
