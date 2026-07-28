// pcc_pediatric_surg_ext40 unit test v3.150.0
const { PediatricColorectalSurgeryExt, PediatricHirschsprungExt, PediatricPullThroughExt, PediatricSwensonProcedureExt, PediatricSoaveProcedureExt, PediatricDuhamelProcedureExt, PediatricAnorectalMalformationExt, PediatricImperforateAnusExt, PediatricRectalProlapseExt, PediatricFecalIncontinenceExt } = require('./pcc_pediatric_surg_ext40_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricColorectalSurgeryExt()); passed++;
assert.ok(PediatricColorectalSurgeryExt({a:1})); passed++;
assert.ok(PediatricHirschsprungExt()); passed++;
assert.ok(PediatricHirschsprungExt({a:1})); passed++;
assert.ok(PediatricPullThroughExt()); passed++;
assert.ok(PediatricPullThroughExt({a:1})); passed++;
assert.ok(PediatricSwensonProcedureExt()); passed++;
assert.ok(PediatricSwensonProcedureExt({a:1})); passed++;
assert.ok(PediatricSoaveProcedureExt()); passed++;
assert.ok(PediatricSoaveProcedureExt({a:1})); passed++;
assert.ok(PediatricDuhamelProcedureExt()); passed++;
assert.ok(PediatricDuhamelProcedureExt({a:1})); passed++;
assert.ok(PediatricAnorectalMalformationExt()); passed++;
assert.ok(PediatricAnorectalMalformationExt({a:1})); passed++;
assert.ok(PediatricImperforateAnusExt()); passed++;
assert.ok(PediatricImperforateAnusExt({a:1})); passed++;
assert.ok(PediatricRectalProlapseExt()); passed++;
assert.ok(PediatricRectalProlapseExt({a:1})); passed++;
assert.ok(PediatricFecalIncontinenceExt()); passed++;
assert.ok(PediatricFecalIncontinenceExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext40 unit:', passed, 'passed');
