// pcc_pediatric_surg_ext4 unit test v3.114.0
const { PediatricNissenFundoplication, PediatricGastrostomyTube, PediatricCholecystectomy, PediatricSplenectomy, PediatricNephrectomy, PediatricPyeloplasty, PediatricUreteralReimplant, PediatricBladderAugmentation, PediatricMitrofanoff, PediatricBladderExstrophy } = require('./pcc_pediatric_surg_ext4_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNissenFundoplication()); passed++;
assert.ok(PediatricNissenFundoplication({a:1})); passed++;
assert.ok(PediatricGastrostomyTube()); passed++;
assert.ok(PediatricGastrostomyTube({a:1})); passed++;
assert.ok(PediatricCholecystectomy()); passed++;
assert.ok(PediatricCholecystectomy({a:1})); passed++;
assert.ok(PediatricSplenectomy()); passed++;
assert.ok(PediatricSplenectomy({a:1})); passed++;
assert.ok(PediatricNephrectomy()); passed++;
assert.ok(PediatricNephrectomy({a:1})); passed++;
assert.ok(PediatricPyeloplasty()); passed++;
assert.ok(PediatricPyeloplasty({a:1})); passed++;
assert.ok(PediatricUreteralReimplant()); passed++;
assert.ok(PediatricUreteralReimplant({a:1})); passed++;
assert.ok(PediatricBladderAugmentation()); passed++;
assert.ok(PediatricBladderAugmentation({a:1})); passed++;
assert.ok(PediatricMitrofanoff()); passed++;
assert.ok(PediatricMitrofanoff({a:1})); passed++;
assert.ok(PediatricBladderExstrophy()); passed++;
assert.ok(PediatricBladderExstrophy({a:1})); passed++;

console.log('pcc_pediatric_surg_ext4 unit:', passed, 'passed');
