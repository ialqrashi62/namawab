// pcc_pediatric_surg_ext13 unit test v3.123.0
const { PediatricTraumaSurgery, PediatricSplenectomyTrauma, PediatricLiverLaceration, PediatricKidneyLaceration, PediatricBowelInjury, PediatricPancreaticInjury, PediatricVascularInjury, PediatricThoracicTrauma, PediatricHeadTrauma, PediatricSpinalTrauma } = require('./pcc_pediatric_surg_ext13_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricTraumaSurgery()); passed++;
assert.ok(PediatricTraumaSurgery({a:1})); passed++;
assert.ok(PediatricSplenectomyTrauma()); passed++;
assert.ok(PediatricSplenectomyTrauma({a:1})); passed++;
assert.ok(PediatricLiverLaceration()); passed++;
assert.ok(PediatricLiverLaceration({a:1})); passed++;
assert.ok(PediatricKidneyLaceration()); passed++;
assert.ok(PediatricKidneyLaceration({a:1})); passed++;
assert.ok(PediatricBowelInjury()); passed++;
assert.ok(PediatricBowelInjury({a:1})); passed++;
assert.ok(PediatricPancreaticInjury()); passed++;
assert.ok(PediatricPancreaticInjury({a:1})); passed++;
assert.ok(PediatricVascularInjury()); passed++;
assert.ok(PediatricVascularInjury({a:1})); passed++;
assert.ok(PediatricThoracicTrauma()); passed++;
assert.ok(PediatricThoracicTrauma({a:1})); passed++;
assert.ok(PediatricHeadTrauma()); passed++;
assert.ok(PediatricHeadTrauma({a:1})); passed++;
assert.ok(PediatricSpinalTrauma()); passed++;
assert.ok(PediatricSpinalTrauma({a:1})); passed++;

console.log('pcc_pediatric_surg_ext13 unit:', passed, 'passed');
