// pcc_pediatric_surg_ext39 unit test v3.149.0
const { PediatricOrthopedicTraumaExt, PediatricSupracondylarFractureExt, PediatricLateralCondyleFractureExt, PediatricMedialEpicondyleExt, PediatricForearmFractureExt, PediatricFemurFractureExt, PediatricTibiaFractureExt, PediatricAnkleFractureExt, PediatricSpineFractureExt, PediatricPelvicFractureExt } = require('./pcc_pediatric_surg_ext39_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricOrthopedicTraumaExt()); passed++;
assert.ok(PediatricOrthopedicTraumaExt({a:1})); passed++;
assert.ok(PediatricSupracondylarFractureExt()); passed++;
assert.ok(PediatricSupracondylarFractureExt({a:1})); passed++;
assert.ok(PediatricLateralCondyleFractureExt()); passed++;
assert.ok(PediatricLateralCondyleFractureExt({a:1})); passed++;
assert.ok(PediatricMedialEpicondyleExt()); passed++;
assert.ok(PediatricMedialEpicondyleExt({a:1})); passed++;
assert.ok(PediatricForearmFractureExt()); passed++;
assert.ok(PediatricForearmFractureExt({a:1})); passed++;
assert.ok(PediatricFemurFractureExt()); passed++;
assert.ok(PediatricFemurFractureExt({a:1})); passed++;
assert.ok(PediatricTibiaFractureExt()); passed++;
assert.ok(PediatricTibiaFractureExt({a:1})); passed++;
assert.ok(PediatricAnkleFractureExt()); passed++;
assert.ok(PediatricAnkleFractureExt({a:1})); passed++;
assert.ok(PediatricSpineFractureExt()); passed++;
assert.ok(PediatricSpineFractureExt({a:1})); passed++;
assert.ok(PediatricPelvicFractureExt()); passed++;
assert.ok(PediatricPelvicFractureExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext39 unit:', passed, 'passed');
