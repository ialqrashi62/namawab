// pcc_pediatric_surg_ext36 unit test v3.146.0
const { PediatricThoracicSurgeryExt, PediatricPectusRepairExt, PediatricNussProcedureExt, PediatricRavitchProcedureExt, PediatricEsophagealAtresiaExt, PediatricTEFistulaExt, PediatricDiaphragmaticHerniaExt, PediatricCDHRepairExt, PediatricEventrationExt, PediatricPhrenicNervePalsyExt } = require('./pcc_pediatric_surg_ext36_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricThoracicSurgeryExt()); passed++;
assert.ok(PediatricThoracicSurgeryExt({a:1})); passed++;
assert.ok(PediatricPectusRepairExt()); passed++;
assert.ok(PediatricPectusRepairExt({a:1})); passed++;
assert.ok(PediatricNussProcedureExt()); passed++;
assert.ok(PediatricNussProcedureExt({a:1})); passed++;
assert.ok(PediatricRavitchProcedureExt()); passed++;
assert.ok(PediatricRavitchProcedureExt({a:1})); passed++;
assert.ok(PediatricEsophagealAtresiaExt()); passed++;
assert.ok(PediatricEsophagealAtresiaExt({a:1})); passed++;
assert.ok(PediatricTEFistulaExt()); passed++;
assert.ok(PediatricTEFistulaExt({a:1})); passed++;
assert.ok(PediatricDiaphragmaticHerniaExt()); passed++;
assert.ok(PediatricDiaphragmaticHerniaExt({a:1})); passed++;
assert.ok(PediatricCDHRepairExt()); passed++;
assert.ok(PediatricCDHRepairExt({a:1})); passed++;
assert.ok(PediatricEventrationExt()); passed++;
assert.ok(PediatricEventrationExt({a:1})); passed++;
assert.ok(PediatricPhrenicNervePalsyExt()); passed++;
assert.ok(PediatricPhrenicNervePalsyExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext36 unit:', passed, 'passed');
