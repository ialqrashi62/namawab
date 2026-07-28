// pcc_pediatric_surg_ext45 unit test v3.155.0
const { PediatricVascularSurgeryExt, PediatricArteriovenousMalformationExt, PediatricVascularAnomalyExt, PediatricLymphaticMalformationExt, PediatricVenousMalformationExt, PediatricCapillaryMalformationExt, PediatricKlippelTrenaunayExt, PediatricParkesWeberExt, PediatricSturgeWeberSurgExt, PediatricKasabachMerrittExt } = require('./pcc_pediatric_surg_ext45_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricVascularSurgeryExt()); passed++;
assert.ok(PediatricVascularSurgeryExt({a:1})); passed++;
assert.ok(PediatricArteriovenousMalformationExt()); passed++;
assert.ok(PediatricArteriovenousMalformationExt({a:1})); passed++;
assert.ok(PediatricVascularAnomalyExt()); passed++;
assert.ok(PediatricVascularAnomalyExt({a:1})); passed++;
assert.ok(PediatricLymphaticMalformationExt()); passed++;
assert.ok(PediatricLymphaticMalformationExt({a:1})); passed++;
assert.ok(PediatricVenousMalformationExt()); passed++;
assert.ok(PediatricVenousMalformationExt({a:1})); passed++;
assert.ok(PediatricCapillaryMalformationExt()); passed++;
assert.ok(PediatricCapillaryMalformationExt({a:1})); passed++;
assert.ok(PediatricKlippelTrenaunayExt()); passed++;
assert.ok(PediatricKlippelTrenaunayExt({a:1})); passed++;
assert.ok(PediatricParkesWeberExt()); passed++;
assert.ok(PediatricParkesWeberExt({a:1})); passed++;
assert.ok(PediatricSturgeWeberSurgExt()); passed++;
assert.ok(PediatricSturgeWeberSurgExt({a:1})); passed++;
assert.ok(PediatricKasabachMerrittExt()); passed++;
assert.ok(PediatricKasabachMerrittExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext45 unit:', passed, 'passed');
