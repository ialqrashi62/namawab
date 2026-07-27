// pcc_pediatric_surg_ext19 unit test v3.129.0
const { PediatricNeurosurgeryTumor, PediatricPilocyticAstrocytoma, PediatricMedulloblastomaExt, PediatricEpendymomaSurgery, PediatricCraniopharyngiomaExt, PediatricBrainstemGlioma, PediatricOpticPathwayGlioma, PediatricChoroidPlexusTumor, PediatricATRTCase, PediatricDIPGTumor } = require('./pcc_pediatric_surg_ext19_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeurosurgeryTumor()); passed++;
assert.ok(PediatricNeurosurgeryTumor({a:1})); passed++;
assert.ok(PediatricPilocyticAstrocytoma()); passed++;
assert.ok(PediatricPilocyticAstrocytoma({a:1})); passed++;
assert.ok(PediatricMedulloblastomaExt()); passed++;
assert.ok(PediatricMedulloblastomaExt({a:1})); passed++;
assert.ok(PediatricEpendymomaSurgery()); passed++;
assert.ok(PediatricEpendymomaSurgery({a:1})); passed++;
assert.ok(PediatricCraniopharyngiomaExt()); passed++;
assert.ok(PediatricCraniopharyngiomaExt({a:1})); passed++;
assert.ok(PediatricBrainstemGlioma()); passed++;
assert.ok(PediatricBrainstemGlioma({a:1})); passed++;
assert.ok(PediatricOpticPathwayGlioma()); passed++;
assert.ok(PediatricOpticPathwayGlioma({a:1})); passed++;
assert.ok(PediatricChoroidPlexusTumor()); passed++;
assert.ok(PediatricChoroidPlexusTumor({a:1})); passed++;
assert.ok(PediatricATRTCase()); passed++;
assert.ok(PediatricATRTCase({a:1})); passed++;
assert.ok(PediatricDIPGTumor()); passed++;
assert.ok(PediatricDIPGTumor({a:1})); passed++;

console.log('pcc_pediatric_surg_ext19 unit:', passed, 'passed');
