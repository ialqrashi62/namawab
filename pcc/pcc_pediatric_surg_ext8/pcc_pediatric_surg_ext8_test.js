// pcc_pediatric_surg_ext8 unit test v3.118.0
const { PediatricCleftPalateRepair, PediatricCleftLipRepair, PediatricAlveolarBoneGraft, PediatricPharyngoplasty, PediatricTympanoplasty, PediatricMastoidectomy, PediatricCochlearImplant, PediatricBAHAImplant, PediatricBoneAnchoredHearing, PediatricMiddleEarSurgery } = require('./pcc_pediatric_surg_ext8_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricCleftPalateRepair()); passed++;
assert.ok(PediatricCleftPalateRepair({a:1})); passed++;
assert.ok(PediatricCleftLipRepair()); passed++;
assert.ok(PediatricCleftLipRepair({a:1})); passed++;
assert.ok(PediatricAlveolarBoneGraft()); passed++;
assert.ok(PediatricAlveolarBoneGraft({a:1})); passed++;
assert.ok(PediatricPharyngoplasty()); passed++;
assert.ok(PediatricPharyngoplasty({a:1})); passed++;
assert.ok(PediatricTympanoplasty()); passed++;
assert.ok(PediatricTympanoplasty({a:1})); passed++;
assert.ok(PediatricMastoidectomy()); passed++;
assert.ok(PediatricMastoidectomy({a:1})); passed++;
assert.ok(PediatricCochlearImplant()); passed++;
assert.ok(PediatricCochlearImplant({a:1})); passed++;
assert.ok(PediatricBAHAImplant()); passed++;
assert.ok(PediatricBAHAImplant({a:1})); passed++;
assert.ok(PediatricBoneAnchoredHearing()); passed++;
assert.ok(PediatricBoneAnchoredHearing({a:1})); passed++;
assert.ok(PediatricMiddleEarSurgery()); passed++;
assert.ok(PediatricMiddleEarSurgery({a:1})); passed++;

console.log('pcc_pediatric_surg_ext8 unit:', passed, 'passed');
