// pcc_pediatric_surg_ext38 unit test v3.148.0
const { PediatricNeurosurgeryExt2, PediatricCraniopharyngiomaExt, PediatricMedulloblastomaExt, PediatricEpendymomaExt, PediatricAstrocytomaExt, PediatricGlioblastomaExt, PediatricDNETExt, PediatricGangliogliomaExt, PediatricPLEXExt, PediatricChoroidPlexusTumorExt } = require('./pcc_pediatric_surg_ext38_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgeryExt2()); passed++;
assert.ok(PediatricNeurosurgeryExt2({a:1})); passed++;
assert.ok(PediatricCraniopharyngiomaExt()); passed++;
assert.ok(PediatricCraniopharyngiomaExt({a:1})); passed++;
assert.ok(PediatricMedulloblastomaExt()); passed++;
assert.ok(PediatricMedulloblastomaExt({a:1})); passed++;
assert.ok(PediatricEpendymomaExt()); passed++;
assert.ok(PediatricEpendymomaExt({a:1})); passed++;
assert.ok(PediatricAstrocytomaExt()); passed++;
assert.ok(PediatricAstrocytomaExt({a:1})); passed++;
assert.ok(PediatricGlioblastomaExt()); passed++;
assert.ok(PediatricGlioblastomaExt({a:1})); passed++;
assert.ok(PediatricDNETExt()); passed++;
assert.ok(PediatricDNETExt({a:1})); passed++;
assert.ok(PediatricGangliogliomaExt()); passed++;
assert.ok(PediatricGangliogliomaExt({a:1})); passed++;
assert.ok(PediatricPLEXExt()); passed++;
assert.ok(PediatricPLEXExt({a:1})); passed++;
assert.ok(PediatricChoroidPlexusTumorExt()); passed++;
assert.ok(PediatricChoroidPlexusTumorExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext38 unit:', passed, 'passed');
