// pcc_pediatric_surg_ext32 unit test v3.142.0
const { PediatricUrologyExt3, PediatricPyeloplastyExt, PediatricUreteralReimplantExt, PediatricHypospadiasRepairExt, PediatricEpispadiasRepairExt, PediatricBladderExstrophyExt, PediatricCloacalExstrophyExt, PediatricPosteriorUrethralValvesExt, PediatricNephrectomyExt, PediatricPartialNephrectomyExt } = require('./pcc_pediatric_surg_ext32_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricUrologyExt3()); passed++;
assert.ok(PediatricUrologyExt3({a:1})); passed++;
assert.ok(PediatricPyeloplastyExt()); passed++;
assert.ok(PediatricPyeloplastyExt({a:1})); passed++;
assert.ok(PediatricUreteralReimplantExt()); passed++;
assert.ok(PediatricUreteralReimplantExt({a:1})); passed++;
assert.ok(PediatricHypospadiasRepairExt()); passed++;
assert.ok(PediatricHypospadiasRepairExt({a:1})); passed++;
assert.ok(PediatricEpispadiasRepairExt()); passed++;
assert.ok(PediatricEpispadiasRepairExt({a:1})); passed++;
assert.ok(PediatricBladderExstrophyExt()); passed++;
assert.ok(PediatricBladderExstrophyExt({a:1})); passed++;
assert.ok(PediatricCloacalExstrophyExt()); passed++;
assert.ok(PediatricCloacalExstrophyExt({a:1})); passed++;
assert.ok(PediatricPosteriorUrethralValvesExt()); passed++;
assert.ok(PediatricPosteriorUrethralValvesExt({a:1})); passed++;
assert.ok(PediatricNephrectomyExt()); passed++;
assert.ok(PediatricNephrectomyExt({a:1})); passed++;
assert.ok(PediatricPartialNephrectomyExt()); passed++;
assert.ok(PediatricPartialNephrectomyExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext32 unit:', passed, 'passed');
