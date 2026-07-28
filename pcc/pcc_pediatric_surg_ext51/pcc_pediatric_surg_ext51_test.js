// pcc_pediatric_surg_ext51 unit test v3.161.0
const { PediatricNeurosurgeryCSFExt, PediatricVPShuntInsertionExt, PediatricVPShuntRevisionExt, PediatricVAShuntInsertionExt, PediatricLumboperitonealShuntExt, PediatricVentriculoatrialShuntExt, PediatricSubgalealShuntExt, PediatricExternalDrainageExt, PediatricICPmonitorExt, PediatricLumbarDrainExt } = require('./pcc_pediatric_surg_ext51_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgeryCSFExt()); passed++;
assert.ok(PediatricNeurosurgeryCSFExt({a:1})); passed++;
assert.ok(PediatricVPShuntInsertionExt()); passed++;
assert.ok(PediatricVPShuntInsertionExt({a:1})); passed++;
assert.ok(PediatricVPShuntRevisionExt()); passed++;
assert.ok(PediatricVPShuntRevisionExt({a:1})); passed++;
assert.ok(PediatricVAShuntInsertionExt()); passed++;
assert.ok(PediatricVAShuntInsertionExt({a:1})); passed++;
assert.ok(PediatricLumboperitonealShuntExt()); passed++;
assert.ok(PediatricLumboperitonealShuntExt({a:1})); passed++;
assert.ok(PediatricVentriculoatrialShuntExt()); passed++;
assert.ok(PediatricVentriculoatrialShuntExt({a:1})); passed++;
assert.ok(PediatricSubgalealShuntExt()); passed++;
assert.ok(PediatricSubgalealShuntExt({a:1})); passed++;
assert.ok(PediatricExternalDrainageExt()); passed++;
assert.ok(PediatricExternalDrainageExt({a:1})); passed++;
assert.ok(PediatricICPmonitorExt()); passed++;
assert.ok(PediatricICPmonitorExt({a:1})); passed++;
assert.ok(PediatricLumbarDrainExt()); passed++;
assert.ok(PediatricLumbarDrainExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext51 unit:', passed, 'passed');
