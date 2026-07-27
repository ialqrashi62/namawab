// pcc_pediatric_surg_ext10 unit test v3.120.0
const { PediatricCardiothoracicSurgery, PediatricVSDClosure, PediatricASDClosure, PediatricTOFCorrection, PediatricAVCanalRepair, PediatricTruncusArteriosus, PediatricNorwoodProcedure, PediatricFontanProcedure, PediatricGlennShunt, PediatricPulmonaryAtresia } = require('./pcc_pediatric_surg_ext10_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricCardiothoracicSurgery()); passed++;
assert.ok(PediatricCardiothoracicSurgery({a:1})); passed++;
assert.ok(PediatricVSDClosure()); passed++;
assert.ok(PediatricVSDClosure({a:1})); passed++;
assert.ok(PediatricASDClosure()); passed++;
assert.ok(PediatricASDClosure({a:1})); passed++;
assert.ok(PediatricTOFCorrection()); passed++;
assert.ok(PediatricTOFCorrection({a:1})); passed++;
assert.ok(PediatricAVCanalRepair()); passed++;
assert.ok(PediatricAVCanalRepair({a:1})); passed++;
assert.ok(PediatricTruncusArteriosus()); passed++;
assert.ok(PediatricTruncusArteriosus({a:1})); passed++;
assert.ok(PediatricNorwoodProcedure()); passed++;
assert.ok(PediatricNorwoodProcedure({a:1})); passed++;
assert.ok(PediatricFontanProcedure()); passed++;
assert.ok(PediatricFontanProcedure({a:1})); passed++;
assert.ok(PediatricGlennShunt()); passed++;
assert.ok(PediatricGlennShunt({a:1})); passed++;
assert.ok(PediatricPulmonaryAtresia()); passed++;
assert.ok(PediatricPulmonaryAtresia({a:1})); passed++;

console.log('pcc_pediatric_surg_ext10 unit:', passed, 'passed');
