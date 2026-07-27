// pcc_pediatric_surg_ext11 unit test v3.121.0
const { PediatricNeurosurgeryExt, PediatricBrainTumorResection, PediatricSkullBaseSurgery, PediatricEndoscopicNeurosurgery, PediatricCraniofacialSurgery, PediatricCleftCraniofacial, PediatricCraniosynostosisSurgery, PediatricEncephaloceleRepair, PediatricMeningoceleRepair, PediatricMyelomeningocele } = require('./pcc_pediatric_surg_ext11_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgeryExt()); passed++;
assert.ok(PediatricNeurosurgeryExt({a:1})); passed++;
assert.ok(PediatricBrainTumorResection()); passed++;
assert.ok(PediatricBrainTumorResection({a:1})); passed++;
assert.ok(PediatricSkullBaseSurgery()); passed++;
assert.ok(PediatricSkullBaseSurgery({a:1})); passed++;
assert.ok(PediatricEndoscopicNeurosurgery()); passed++;
assert.ok(PediatricEndoscopicNeurosurgery({a:1})); passed++;
assert.ok(PediatricCraniofacialSurgery()); passed++;
assert.ok(PediatricCraniofacialSurgery({a:1})); passed++;
assert.ok(PediatricCleftCraniofacial()); passed++;
assert.ok(PediatricCleftCraniofacial({a:1})); passed++;
assert.ok(PediatricCraniosynostosisSurgery()); passed++;
assert.ok(PediatricCraniosynostosisSurgery({a:1})); passed++;
assert.ok(PediatricEncephaloceleRepair()); passed++;
assert.ok(PediatricEncephaloceleRepair({a:1})); passed++;
assert.ok(PediatricMeningoceleRepair()); passed++;
assert.ok(PediatricMeningoceleRepair({a:1})); passed++;
assert.ok(PediatricMyelomeningocele()); passed++;
assert.ok(PediatricMyelomeningocele({a:1})); passed++;

console.log('pcc_pediatric_surg_ext11 unit:', passed, 'passed');
