// pcc_pediatric_surg_ext37 unit test v3.147.0
const { PediatricAbdominalWallExt, PediatricGastroschisisExt, PediatricOmphaloceleExt, PediatricHerniaRepairExt, PediatricInguinalHerniaExt, PediatricUmbilicalHerniaExt, PediatricFemoralHerniaExt, PediatricDiaphragmaticHerniaRecurrExt, PediatricEventrationRepairExt, PediatricAbdominalReconstructionExt } = require('./pcc_pediatric_surg_ext37_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricAbdominalWallExt()); passed++;
assert.ok(PediatricAbdominalWallExt({a:1})); passed++;
assert.ok(PediatricGastroschisisExt()); passed++;
assert.ok(PediatricGastroschisisExt({a:1})); passed++;
assert.ok(PediatricOmphaloceleExt()); passed++;
assert.ok(PediatricOmphaloceleExt({a:1})); passed++;
assert.ok(PediatricHerniaRepairExt()); passed++;
assert.ok(PediatricHerniaRepairExt({a:1})); passed++;
assert.ok(PediatricInguinalHerniaExt()); passed++;
assert.ok(PediatricInguinalHerniaExt({a:1})); passed++;
assert.ok(PediatricUmbilicalHerniaExt()); passed++;
assert.ok(PediatricUmbilicalHerniaExt({a:1})); passed++;
assert.ok(PediatricFemoralHerniaExt()); passed++;
assert.ok(PediatricFemoralHerniaExt({a:1})); passed++;
assert.ok(PediatricDiaphragmaticHerniaRecurrExt()); passed++;
assert.ok(PediatricDiaphragmaticHerniaRecurrExt({a:1})); passed++;
assert.ok(PediatricEventrationRepairExt()); passed++;
assert.ok(PediatricEventrationRepairExt({a:1})); passed++;
assert.ok(PediatricAbdominalReconstructionExt()); passed++;
assert.ok(PediatricAbdominalReconstructionExt({a:1})); passed++;

console.log('pcc_pediatric_surg_ext37 unit:', passed, 'passed');
