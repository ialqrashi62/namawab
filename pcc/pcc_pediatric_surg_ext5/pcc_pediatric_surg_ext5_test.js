// pcc_pediatric_surg_ext5 unit test v3.115.0
const { PediatricCraniosynostosis, PediatricPlagiocephaly, PediatricHydrocephalusExt, PediatricVPShunt, PediatricETVChoroidPlexusCauterization, PediatricChiariDecompression, PediatricTetheredCordRelease, PediatricSyringomyelia, PediatricSpinaBifidaRepair, PediatricEncephalocele } = require('./pcc_pediatric_surg_ext5_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricCraniosynostosis()); passed++;
assert.ok(PediatricCraniosynostosis({a:1})); passed++;
assert.ok(PediatricPlagiocephaly()); passed++;
assert.ok(PediatricPlagiocephaly({a:1})); passed++;
assert.ok(PediatricHydrocephalusExt()); passed++;
assert.ok(PediatricHydrocephalusExt({a:1})); passed++;
assert.ok(PediatricVPShunt()); passed++;
assert.ok(PediatricVPShunt({a:1})); passed++;
assert.ok(PediatricETVChoroidPlexusCauterization()); passed++;
assert.ok(PediatricETVChoroidPlexusCauterization({a:1})); passed++;
assert.ok(PediatricChiariDecompression()); passed++;
assert.ok(PediatricChiariDecompression({a:1})); passed++;
assert.ok(PediatricTetheredCordRelease()); passed++;
assert.ok(PediatricTetheredCordRelease({a:1})); passed++;
assert.ok(PediatricSyringomyelia()); passed++;
assert.ok(PediatricSyringomyelia({a:1})); passed++;
assert.ok(PediatricSpinaBifidaRepair()); passed++;
assert.ok(PediatricSpinaBifidaRepair({a:1})); passed++;
assert.ok(PediatricEncephalocele()); passed++;
assert.ok(PediatricEncephalocele({a:1})); passed++;

console.log('pcc_pediatric_surg_ext5 unit:', passed, 'passed');
